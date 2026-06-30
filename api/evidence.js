const PUBLIC_SOURCE_HINTS = [
  "site:pubmed.ncbi.nlm.nih.gov",
  "site:apta.org",
  "site:aaos.org",
  "site:assh.org",
  "site:ncbi.nlm.nih.gov/books",
];

const TRUSTED_SOURCES = [
  { match: "pubmed.ncbi.nlm.nih.gov", type: "Biomedical literature", score: 35 },
  { match: "ncbi.nlm.nih.gov", type: "NIH / NCBI", score: 32 },
  { match: "cochrane.org", type: "Evidence review", score: 32 },
  { match: "apta.org", type: "Professional society", score: 28 },
  { match: "aaos.org", type: "Professional society", score: 26 },
  { match: "assh.org", type: "Professional society", score: 26 },
  { match: "nih.gov", type: "Government health source", score: 24 },
  { match: "mayoclinic.org", type: "Academic medical source", score: 16 },
  { match: "clevelandclinic.org", type: "Academic medical source", score: 16 },
];

const EVIDENCE_TERMS = [
  "guideline",
  "systematic review",
  "randomized",
  "trial",
  "rehabilitation",
  "occupational therapy",
  "physical therapy",
  "exercise",
  "splint",
  "orthosis",
  "conservative",
  "treatment",
  "therapy",
];

const PENALTY_TERMS = ["sponsored", "advertisement", "coupon", "shop", "product", "billing"];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for evidence search." });
  }

  const body = typeof req.body === "string" ? safeJson(req.body) : req.body || {};
  const condition = sanitize(body.condition || "upper extremity rehabilitation");
  const region = sanitize(body.region || "upper extremity");
  const findings = Array.isArray(body.findings) ? body.findings.map(sanitize).filter(Boolean) : [];
  const checkedAt = new Date().toISOString();

  const apiKey = process.env.BRIGHT_DATA_API_KEY;
  const zone = process.env.BRIGHT_DATA_SERP_ZONE;
  const query = buildQuery(condition, region, findings);

  if (!apiKey || !zone) {
    return res.status(200).json({
      provider: "bright-data",
      mode: "demo",
      checkedAt,
      query,
      results: rerankResults(demoResults(condition), condition, region, findings),
      message: "Set BRIGHT_DATA_API_KEY and BRIGHT_DATA_SERP_ZONE in Vercel to enable live Bright Data SERP results.",
    });
  }

  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en&gl=us`;
    const brightResponse = await fetch("https://api.brightdata.com/request", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        zone,
        url: searchUrl,
        format: "raw",
        data_format: "parsed_light",
      }),
    });

    const text = await brightResponse.text();
    if (!brightResponse.ok) {
      return res.status(brightResponse.status).json({
        error: "Bright Data request failed.",
        detail: text.slice(0, 240),
      });
    }

    const parsed = safeJson(text);
    const results = rerankResults(normalizeResults(parsed), condition, region, findings).slice(0, 6);

    return res.status(200).json({
      provider: "bright-data",
      mode: "live",
      checkedAt,
      query,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Evidence search is unavailable.",
      detail: error.message,
    });
  }
};

function buildQuery(condition, region, findings) {
  const focusedFindings = findings.slice(0, 3).join(" ");
  return [
    condition,
    region,
    focusedFindings,
    "rehabilitation occupational therapy physical therapy guideline evidence",
    `(${PUBLIC_SOURCE_HINTS.join(" OR ")})`,
  ]
    .filter(Boolean)
    .join(" ");
}

function rerankResults(results, condition, region, findings) {
  const clinicalTerms = [
    condition,
    condition.replace(/\bpattern\b/gi, ""),
    region,
    ...findings,
    "rehabilitation",
    "occupational therapy",
    "physical therapy",
  ]
    .map(normalizeTerm)
    .filter(Boolean);

  return results
    .map((result) => {
      const sourceProfile = sourceProfileFor(result.source || result.url);
      const haystack = normalizeTerm([
        result.title,
        result.description,
        result.source,
      ].join(" "));

      const matchedClinical = clinicalTerms.filter((term) => term && haystack.includes(term));
      const matchedEvidence = EVIDENCE_TERMS.filter((term) => haystack.includes(term));
      const penalties = PENALTY_TERMS.filter((term) => haystack.includes(term));

      const score = clamp(
        sourceProfile.score +
          matchedClinical.length * 9 +
          matchedEvidence.length * 5 -
          penalties.length * 10,
        15,
        98,
      );

      const matchedTerms = [...new Set([...matchedClinical, ...matchedEvidence])]
        .map((term) => titleCase(term))
        .slice(0, 8);

      return {
        ...result,
        relevanceScore: score,
        matchedTerms,
        sourceType: sourceProfile.type,
        rankReason: buildRankReason(sourceProfile, matchedTerms, penalties),
        keySummary: buildKeySummary(result, condition, sourceProfile, matchedTerms),
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function sourceProfileFor(source) {
  const normalized = normalizeTerm(source);
  return TRUSTED_SOURCES.find((item) => normalized.includes(item.match)) || {
    type: "General public web",
    score: 8,
  };
}

function buildRankReason(sourceProfile, matchedTerms, penalties) {
  const parts = [`Ranked highly for ${sourceProfile.type.toLowerCase()} source quality`];
  if (matchedTerms.length) {
    parts.push(`matched ${matchedTerms.slice(0, 4).join(", ")}`);
  }
  if (penalties.length) {
    parts.push(`downranked for ${penalties.join(", ")}`);
  }
  return `${parts.join("; ")}.`;
}

function buildKeySummary(result, condition, sourceProfile, matchedTerms) {
  const conditionLabel = condition.replace(/\s+pattern$/i, "");
  const sourcePhrase = sourceProfile.type === "General public web"
    ? "a public web source"
    : `a ${sourceProfile.type.toLowerCase()} source`;
  const matchPhrase = matchedTerms.length
    ? ` It matches ${matchedTerms.slice(0, 4).join(", ")}.`
    : " It is included primarily because of source quality and should be reviewed for condition-specific relevance.";

  const relevancePhrase = matchedTerms.length
    ? `its title or snippet overlaps with the current evaluation focus`
    : `it is a trusted starting point for clinician review`;

  return `This result appears relevant to ${conditionLabel} because it comes from ${sourcePhrase} and ${relevancePhrase}.${matchPhrase} Open the source to confirm details before applying clinically.`;
}

function normalizeResults(payload) {
  const organic = Array.isArray(payload?.organic)
    ? payload.organic
    : Array.isArray(payload?.results)
      ? payload.results.filter((item) => !item.type || item.type === "organic")
      : [];

  return organic
    .map((item) => ({
      title: item.title || item.name || "Public evidence result",
      url: item.link || item.url,
      description: item.description || item.snippet || item.text || "",
      source: item.display_link || item.source || domainFromUrl(item.link || item.url),
    }))
    .filter((item) => item.url && /^https?:\/\//i.test(item.url));
}

function demoResults(condition) {
  const query = encodeURIComponent(`${condition} rehabilitation`);
  return [
    {
      title: `${condition} rehabilitation literature search`,
      url: `https://pubmed.ncbi.nlm.nih.gov/?term=${query}`,
      description: "PubMed fallback search for rehabilitation, therapy, splinting, conservative treatment, and clinical review literature.",
      source: "pubmed.ncbi.nlm.nih.gov",
    },
    {
      title: `${condition} orthopedic education search`,
      url: `https://www.aaos.org/search/?SearchTerm=${query}`,
      description: "AAOS public education search for orthopedic condition context, treatment options, and patient education review.",
      source: "aaos.org",
    },
    {
      title: "ASSH hand and upper extremity education",
      url: "https://www.assh.org/handcare/",
      description: "ASSH public hand and upper-extremity education library for clinician review and patient education context.",
      source: "assh.org",
    },
  ];
}

function normalizeTerm(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value) {
  return String(value || "")
    .split(" ")
    .map((part) => part ? part[0].toUpperCase() + part.slice(1) : "")
    .join(" ");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sanitize(value) {
  return String(value || "")
    .replace(/[^\w\s\-().,+/]/g, "")
    .trim()
    .slice(0, 120);
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function domainFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Public web";
  }
}
