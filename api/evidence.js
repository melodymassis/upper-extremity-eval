const PUBLIC_SOURCE_HINTS = [
  "site:pubmed.ncbi.nlm.nih.gov",
  "site:apta.org",
  "site:aaos.org",
  "site:assh.org",
  "site:ncbi.nlm.nih.gov/books",
];

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
      results: demoResults(condition),
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
    const results = normalizeResults(parsed).slice(0, 6);

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
      title: "PubMed literature search",
      url: `https://pubmed.ncbi.nlm.nih.gov/?term=${query}`,
      description: "Fallback public literature search. Configure Bright Data credentials for live SERP retrieval.",
      source: "pubmed.ncbi.nlm.nih.gov",
    },
    {
      title: "AAOS patient and clinical education search",
      url: `https://www.aaos.org/search/?SearchTerm=${query}`,
      description: "Public orthopedic education source for clinician review and patient education context.",
      source: "aaos.org",
    },
    {
      title: "ASSH hand and upper extremity education",
      url: "https://www.assh.org/handcare/",
      description: "Public hand and upper-extremity education library for clinician review.",
      source: "assh.org",
    },
  ];
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
