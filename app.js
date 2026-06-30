const steps = [
  {
    id: "persona",
    title: "Patient Persona",
    summary: "Capture demographic and occupational context that may change functional priorities and exercise tolerance.",
    fields: [
      { id: "age", label: "Age", type: "number", min: 1, max: 120, placeholder: "52" },
      { id: "weight", label: "Weight (lb)", type: "number", min: 1, max: 900, placeholder: "165" },
      {
        id: "gender",
        label: "Gender",
        type: "select",
        options: ["", "Female", "Male", "Nonbinary", "Prefer not to say"],
      },
      { id: "occupation", label: "Occupation", type: "text", placeholder: "Dental hygienist" },
      {
        id: "workDemand",
        label: "Work demand",
        type: "radio",
        options: ["Sedentary", "Light", "Medium", "Heavy", "Very heavy"],
      },
      {
        id: "dominance",
        label: "Hand dominance",
        type: "radio",
        options: ["Right", "Left", "Ambidextrous"],
      },
    ],
  },
  {
    id: "presentation",
    title: "Presentation",
    summary: "Document region, symptom behavior, mechanism, and red flags before narrowing the differential.",
    fields: [
      {
        id: "region",
        label: "Primary region",
        type: "select",
        options: ["", "Shoulder", "Elbow", "Wrist", "Hand", "Thumb", "Diffuse upper extremity"],
      },
      {
        id: "onset",
        label: "Onset",
        type: "select",
        options: ["", "Gradual", "Acute traumatic", "Post-operative", "Recurrent", "Unknown"],
      },
      { id: "pain", label: "Pain intensity (0-10)", type: "number", min: 0, max: 10, placeholder: "5" },
      {
        id: "aggravators",
        label: "Aggravating activities",
        type: "checks",
        options: [
          "Overhead reach",
          "Repetitive gripping",
          "Keyboard or mouse",
          "Lifting or carrying",
          "Pinch or jar opening",
          "Night pain",
          "Vibration tools",
          "Throwing or sport",
        ],
      },
      {
        id: "redFlags",
        label: "Referral considerations",
        type: "checks",
        options: [
          "Progressive neurologic loss",
          "Unexplained swelling or discoloration",
          "Fever or systemic symptoms",
          "Suspected fracture/dislocation",
          "Severe unrelenting night pain",
        ],
      },
    ],
  },
  {
    id: "measurements",
    title: "ROM and Strength",
    summary: "Enter key measurements. Normal ranges vary; compare with contralateral limb when appropriate.",
    fields: [
      { id: "shoulderFlexion", label: "Shoulder flexion AROM (deg)", type: "number", min: 0, max: 220, placeholder: "160" },
      { id: "shoulderExternalRotation", label: "Shoulder external rotation (deg)", type: "number", min: 0, max: 120, placeholder: "70" },
      { id: "elbowExtension", label: "Elbow extension deficit (deg)", type: "number", min: 0, max: 90, placeholder: "0" },
      { id: "wristExtension", label: "Wrist extension AROM (deg)", type: "number", min: 0, max: 100, placeholder: "60" },
      { id: "gripStrength", label: "Grip strength affected side (lb)", type: "number", min: 0, max: 250, placeholder: "42" },
      { id: "oppositeGripStrength", label: "Grip strength opposite side (lb)", type: "number", min: 0, max: 250, placeholder: "65" },
      {
        id: "strengthPattern",
        label: "Strength pattern",
        type: "select",
        options: ["", "Pain-limited", "True weakness", "Endurance deficit", "No meaningful deficit"],
      },
    ],
  },
  {
    id: "specialTests",
    title: "Special Tests",
    summary: "Select positive findings that should shape evaluation focus and initial education.",
    fields: [
      {
        id: "specialTests",
        label: "Positive findings",
        type: "checks",
        options: [
          "Painful arc",
          "External rotation weakness",
          "Hawkins-Kennedy",
          "Cozen test",
          "Mill test",
          "Phalen test",
          "Tinel at carpal tunnel",
          "Finkelstein test",
          "CMC grind",
          "Upper limb tension",
        ],
      },
      {
        id: "sensation",
        label: "Sensation",
        type: "select",
        options: ["", "Intact", "Median distribution symptoms", "Ulnar distribution symptoms", "Radial distribution symptoms", "Diffuse paresthesia"],
      },
      {
        id: "edema",
        label: "Edema",
        type: "radio",
        options: ["None", "Mild", "Moderate", "Marked"],
      },
    ],
  },
  {
    id: "function",
    title: "Function and Goals",
    summary: "Connect impairments to work, self-care, and participation goals.",
    fields: [
      {
        id: "limitations",
        label: "Current limitations",
        type: "checks",
        options: [
          "Dressing or grooming",
          "Meal preparation",
          "Driving",
          "Computer work",
          "Patient transfers",
          "Tool use",
          "Sports or recreation",
          "Sleep disruption",
        ],
      },
      { id: "goalOne", label: "Primary goal", type: "text", placeholder: "Return to charting without paresthesia" },
      { id: "goalTwo", label: "Secondary goal", type: "text", placeholder: "Lift 10 lb overhead for home tasks" },
      {
        id: "irritability",
        label: "Tissue irritability",
        type: "radio",
        options: ["Low", "Moderate", "High"],
      },
    ],
  },
];

const conditionRules = [
  {
    name: "Rotator cuff related shoulder pain",
    region: "Shoulder",
    findings: ["Painful arc", "External rotation weakness", "Hawkins-Kennedy", "Overhead reach", "Night pain"],
    focus: ["Screen cervical contribution and neurologic status.", "Assess scapular control, active/passive ROM, and resisted external rotation.", "Compare pain response during elevation and functional reach."],
    plan: ["Activity modification for painful overhead loading.", "Begin pain-limited isometrics and scapular setting.", "Progress to rotator cuff and periscapular strengthening as symptoms settle."],
  },
  {
    name: "Lateral elbow tendinopathy",
    region: "Elbow",
    findings: ["Cozen test", "Mill test", "Repetitive gripping", "Lifting or carrying", "Vibration tools"],
    focus: ["Assess wrist extensor loading tolerance and grip position sensitivity.", "Measure pain-free grip and resisted wrist extension.", "Review work tool handles, lift technique, and repetition volume."],
    plan: ["Educate on load management and neutral wrist gripping.", "Use graded wrist extensor isometrics or slow resistance based on irritability.", "Progress functional grip and lift tasks before unrestricted repetitive work."],
  },
  {
    name: "Carpal tunnel syndrome pattern",
    region: "Wrist",
    findings: ["Phalen test", "Tinel at carpal tunnel", "Keyboard or mouse", "Median distribution symptoms", "Night pain"],
    focus: ["Clarify median nerve distribution, nocturnal symptoms, and provocative wrist positions.", "Screen cervical radicular contribution and thenar weakness.", "Assess ergonomics and sustained wrist flexion/extension exposure."],
    plan: ["Neutral wrist education and night splint consideration per clinician judgment.", "Tendon and nerve gliding when symptoms are not highly irritable.", "Escalate referral if progressive sensory or motor deficit is present."],
  },
  {
    name: "De Quervain tenosynovitis pattern",
    region: "Thumb",
    findings: ["Finkelstein test", "Pinch or jar opening", "Repetitive gripping", "Tool use"],
    focus: ["Assess first dorsal compartment tenderness and thumb/wrist loading.", "Review infant care, phone use, tool use, or repetitive radial deviation demands.", "Measure pinch tolerance and functional thumb motion."],
    plan: ["Reduce provocative thumb abduction and ulnar deviation loading.", "Consider thumb spica support strategy based on irritability.", "Progress tendon loading and pinch tasks gradually."],
  },
  {
    name: "Thumb CMC osteoarthritis pattern",
    region: "Thumb",
    findings: ["CMC grind", "Pinch or jar opening", "Tool use", "Repetitive gripping"],
    focus: ["Assess CMC alignment, pinch mechanics, and pain with compression.", "Measure lateral and three-jaw chuck pinch if appropriate.", "Identify adaptive equipment opportunities for daily tasks."],
    plan: ["Joint protection education and adaptive grip strategies.", "Consider CMC support orthosis based on task demands.", "Train thenar and first dorsal interosseous stabilization within tolerance."],
  },
  {
    name: "Post-traumatic or post-operative stiffness",
    region: "Diffuse upper extremity",
    findings: ["Acute traumatic", "Post-operative", "Marked", "Moderate"],
    focus: ["Confirm precautions, healing phase, imaging/surgical details, and contraindications.", "Measure edema, scar mobility, tendon glide, and end-feel.", "Track motion changes with consistent landmarks and dosage response."],
    plan: ["Edema control, protected motion, and scar/tissue mobility as allowed.", "Dose ROM frequently within precautions and irritability limits.", "Coordinate with surgeon protocol for splinting and strengthening progression."],
  },
];

const state = loadState();
let activeStep = 0;

const stepsNode = document.querySelector("#steps");
const sectionTitleNode = document.querySelector("#sectionTitle");
const stepContentNode = document.querySelector("#stepContent");
const completionStatusNode = document.querySelector("#completionStatus");
const conditionListNode = document.querySelector("#conditionList");
const evaluationFocusNode = document.querySelector("#evaluationFocus");
const treatmentPlanNode = document.querySelector("#treatmentPlan");
const noteOutputNode = document.querySelector("#noteOutput");
const findEvidenceButton = document.querySelector("#findEvidenceButton");
const evidenceResultsNode = document.querySelector("#evidenceResults");
let currentRanked = [];

document.querySelector("#backButton").addEventListener("click", () => {
  activeStep = Math.max(0, activeStep - 1);
  render();
});

document.querySelector("#nextButton").addEventListener("click", () => {
  activeStep = Math.min(steps.length - 1, activeStep + 1);
  render();
});

document.querySelector("#saveButton").addEventListener("click", () => {
  localStorage.setItem("ue-evaluation-demo", JSON.stringify(state));
  toastButton("#saveButton", "Saved");
});

document.querySelector("#resetButton").addEventListener("click", () => {
  Object.keys(state).forEach((key) => delete state[key]);
  localStorage.removeItem("ue-evaluation-demo");
  activeStep = 0;
  render();
});

document.querySelector("#copyNoteButton").addEventListener("click", async () => {
  await navigator.clipboard.writeText(noteOutputNode.value);
  toastButton("#copyNoteButton", "Copied");
});

findEvidenceButton.addEventListener("click", findCurrentEvidence);

function loadState() {
  try {
    return JSON.parse(localStorage.getItem("ue-evaluation-demo")) || {};
  } catch {
    return {};
  }
}

function render() {
  renderSteps();
  renderStepContent();
  renderInsights();
}

function renderSteps() {
  stepsNode.innerHTML = steps
    .map((step, index) => {
      const complete = getStepCompletion(step) === 1;
      return `
        <button class="step-button ${index === activeStep ? "active" : ""} ${complete ? "complete" : ""}" type="button" data-step="${index}">
          <span class="step-index">${complete ? "✓" : index + 1}</span>
          <span class="step-label">${step.title}</span>
        </button>
      `;
    })
    .join("");

  stepsNode.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeStep = Number(button.dataset.step);
      render();
    });
  });
}

function renderStepContent() {
  const step = steps[activeStep];
  sectionTitleNode.textContent = step.title;
  stepContentNode.innerHTML = `
    <div class="step-intro">
      <div>
        <h3>${step.title}</h3>
        <p>${step.summary}</p>
      </div>
      <span class="status-pill">${Math.round(getStepCompletion(step) * 100)}% complete</span>
    </div>
    <div class="field-grid ${step.id === "measurements" ? "three" : ""}">
      ${step.fields.map(renderField).join("")}
    </div>
  `;

  stepContentNode.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", syncField);
    input.addEventListener("change", syncField);
  });
}

function renderField(field) {
  const value = state[field.id] || (field.type === "checks" ? [] : "");

  if (field.type === "select") {
    return `
      <div class="field">
        <label for="${field.id}">${field.label}</label>
        <select id="${field.id}" name="${field.id}">
          ${field.options.map((option) => `<option ${value === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>
      </div>
    `;
  }

  if (field.type === "radio") {
    return `
      <fieldset class="field full check-group">
        <legend>${field.label}</legend>
        <div class="segmented">
          ${field.options
            .map(
              (option) => `
                <label class="segment">
                  <input type="radio" name="${field.id}" value="${option}" ${value === option ? "checked" : ""}>
                  <span>${option}</span>
                </label>
              `,
            )
            .join("")}
        </div>
      </fieldset>
    `;
  }

  if (field.type === "checks") {
    return `
      <fieldset class="field full check-group">
        <legend>${field.label}</legend>
        <div class="check-grid">
          ${field.options
            .map(
              (option) => `
                <label class="check-item">
                  <input type="checkbox" name="${field.id}" value="${option}" ${value.includes(option) ? "checked" : ""}>
                  <span>${option}</span>
                </label>
              `,
            )
            .join("")}
        </div>
      </fieldset>
    `;
  }

  return `
    <div class="field">
      <label for="${field.id}">${field.label}</label>
      <input id="${field.id}" name="${field.id}" type="${field.type}" min="${field.min || ""}" max="${field.max || ""}" value="${value}" placeholder="${field.placeholder || ""}">
    </div>
  `;
}

function syncField(event) {
  const input = event.target;
  if (input.type === "checkbox") {
    const selected = [...document.querySelectorAll(`input[name="${input.name}"]:checked`)].map((item) => item.value);
    state[input.name] = selected;
  } else if (input.type === "radio") {
    state[input.name] = input.value;
  } else {
    state[input.name] = input.value;
  }
  renderInsights();
  renderSteps();
}

function getStepCompletion(step) {
  const completed = step.fields.filter((field) => {
    const value = state[field.id];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }).length;
  return completed / step.fields.length;
}

function renderInsights() {
  const completion = Math.round((steps.reduce((sum, step) => sum + getStepCompletion(step), 0) / steps.length) * 100);
  const ranked = rankConditions();
  const primary = ranked[0];
  currentRanked = ranked;

  completionStatusNode.textContent = `${completion}% complete`;
  conditionListNode.innerHTML = ranked
    .slice(0, 3)
    .map(
      (condition) => `
        <article class="condition-card">
          <h4>${condition.name}<span class="score">${condition.score}%</span></h4>
          <p>${condition.reason || "Add presentation details and measurements to refine this fit."}</p>
        </article>
      `,
    )
    .join("");

  evaluationFocusNode.innerHTML = listItems(
    primary?.focus || ["Complete persona, presentation, ROM, strength, and special-test sections."],
  );
  treatmentPlanNode.innerHTML = listItems(
    buildTreatmentPlan(primary),
  );
  noteOutputNode.value = generateNote(primary, ranked);
}

async function findCurrentEvidence() {
  const primary = currentRanked[0];
  if (!primary) return;

  findEvidenceButton.disabled = true;
  findEvidenceButton.textContent = "Searching...";
  evidenceResultsNode.innerHTML = `<p class="evidence-meta">Searching public evidence for ${escapeHtml(primary.name)}.</p>`;

  try {
    const response = await fetch("/api/evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        condition: primary.name,
        region: state.region,
        findings: collectTokens().slice(0, 8),
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Evidence search failed.");
    }

    renderEvidenceResults(payload);
  } catch (error) {
    evidenceResultsNode.innerHTML = `
      <article class="evidence-card">
        <a href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(primary.name)}+rehabilitation" target="_blank" rel="noreferrer">PubMed search fallback</a>
        <p>${escapeHtml(error.message)} Use this fallback link while the Bright Data API key or zone is being configured.</p>
        <div class="evidence-meta">Evidence Scout is optional; clinical workflow remains available without it.</div>
      </article>
    `;
  } finally {
    findEvidenceButton.disabled = false;
    findEvidenceButton.textContent = "Find Current Evidence";
  }
}

function renderEvidenceResults(payload) {
  const modeLabel = payload.mode === "live" ? "Live Bright Data search" : "Demo fallback";
  const results = payload.results || [];

  if (!results.length) {
    evidenceResultsNode.innerHTML = `<p class="evidence-meta">${modeLabel}: no public results returned for this query.</p>`;
    return;
  }

  evidenceResultsNode.innerHTML = `
    <div class="evidence-meta">${modeLabel}. Reranked locally by source quality and clinical relevance. Last checked ${escapeHtml(payload.checkedAt || "now")}.</div>
    ${results
      .slice(0, 3)
      .map(
        (result) => `
          <article class="evidence-card">
            <div class="evidence-score-row">
              <a href="${escapeAttribute(result.url)}" target="_blank" rel="noreferrer">${escapeHtml(result.title)}</a>
              <span class="evidence-rank">${Math.round(result.relevanceScore || 0)}%</span>
            </div>
            <p>${escapeHtml(result.description || "Public evidence result returned for clinician review.")}</p>
            <p class="evidence-summary"><strong>Key summary:</strong> ${escapeHtml(result.keySummary || "This source appears relevant for clinician review based on its title, snippet, and source type.")}</p>
            <div class="evidence-meta">${escapeHtml(result.rankReason || "Ranked by source quality and clinical term overlap.")}</div>
            <div class="matched-terms">
              ${(result.matchedTerms || []).slice(0, 5).map((term) => `<span>${escapeHtml(term)}</span>`).join("")}
            </div>
            <div class="evidence-meta">${escapeHtml(result.source || "Public web")} · ${escapeHtml(result.sourceType || "Public source")}</div>
          </article>
        `,
      )
      .join("")}
  `;
}

function rankConditions() {
  const tokens = collectTokens();
  return conditionRules
    .map((condition) => {
      let score = 8;
      if (state.region && condition.region === state.region) score += 28;
      if (condition.region === "Diffuse upper extremity" && ["Acute traumatic", "Post-operative"].includes(state.onset)) score += 24;

      const matches = condition.findings.filter((finding) => tokens.includes(finding));
      score += matches.length * 12;

      if (condition.name.includes("Rotator") && Number(state.shoulderFlexion) > 0 && Number(state.shoulderFlexion) < 150) score += 8;
      if (condition.name.includes("Carpal") && state.sensation === "Median distribution symptoms") score += 18;
      if (condition.name.includes("Lateral") && gripDeficitPercent() > 20) score += 8;
      if (Number(state.pain) >= 7) score += 5;

      return {
        ...condition,
        score: Math.min(96, score),
        reason: matches.length ? `Supported by: ${matches.slice(0, 4).join(", ")}.` : "",
      };
    })
    .sort((a, b) => b.score - a.score);
}

function collectTokens() {
  return [
    state.region,
    state.onset,
    state.strengthPattern,
    state.sensation,
    state.edema,
    ...(state.aggravators || []),
    ...(state.specialTests || []),
    ...(state.limitations || []),
  ].filter(Boolean);
}

function gripDeficitPercent() {
  const affected = Number(state.gripStrength);
  const opposite = Number(state.oppositeGripStrength);
  if (!affected || !opposite) return 0;
  return Math.round(((opposite - affected) / opposite) * 100);
}

function buildTreatmentPlan(primary) {
  const plan = primary?.plan ? [...primary.plan] : ["Complete the evaluation sections to generate a focused treatment direction."];
  if ((state.redFlags || []).length > 0) {
    plan.unshift("Address selected referral considerations before initiating routine exercise progression.");
  }
  if (state.irritability === "High") {
    plan.push("Use lower dosage, symptom-contingent exercise, and reassess response within-session.");
  }
  if (state.workDemand === "Heavy" || state.workDemand === "Very heavy") {
    plan.push("Include work-simulation progression before discharge or unrestricted duty recommendation.");
  }
  return plan;
}

function generateNote(primary, ranked) {
  const topNames = ranked.slice(0, 3).map((item) => `${item.name} (${item.score}%)`).join("; ");
  const redFlags = (state.redFlags || []).join(", ") || "none selected";
  const gripDeficit = gripDeficitPercent();

  return [
    `Patient persona: ${state.age || "[age]"} y/o ${state.gender || "[gender]"} patient, ${state.weight || "[weight]"} lb, occupation: ${state.occupation || "[occupation]"}, work demand: ${state.workDemand || "[demand]"}.`,
    `Presentation: primary region ${state.region || "[region]"}, onset ${state.onset || "[onset]"}, pain ${state.pain || "[0-10]"}/10. Referral considerations: ${redFlags}.`,
    `Measures: shoulder flexion ${state.shoulderFlexion || "[ ]"} deg, shoulder ER ${state.shoulderExternalRotation || "[ ]"} deg, elbow extension deficit ${state.elbowExtension || "[ ]"} deg, wrist extension ${state.wristExtension || "[ ]"} deg, grip ${state.gripStrength || "[ ]"} lb vs ${state.oppositeGripStrength || "[ ]"} lb${gripDeficit ? ` (${gripDeficit}% deficit)` : ""}.`,
    `Clinical decision support: highest current fit is ${primary?.name || "[pending]"}; ranked considerations: ${topNames || "[pending]"}.`,
    `Initial plan direction: ${buildTreatmentPlan(primary).join(" ")}`,
    "Source placeholders: OpenEvidence query review; Rehabilitation of the Hand and Upper Extremity, 7th Edition. Final assessment and plan require clinician validation.",
  ].join("\n\n");
}

function listItems(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  const url = String(value || "");
  if (!/^https?:\/\//i.test(url)) return "#";
  return escapeHtml(url);
}

function toastButton(selector, text) {
  const button = document.querySelector(selector);
  const previous = button.textContent;
  button.textContent = text;
  setTimeout(() => {
    button.textContent = previous;
  }, 1100);
}

render();
