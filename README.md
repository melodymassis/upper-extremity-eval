# Upper Extremity Evaluation Assistant

A web-based clinical decision-support prototype for occupational and physical therapists performing upper-extremity evaluations.

Live demo: https://upper-extremity-eval-demo.vercel.app/

## What It Does

This prototype guides a clinician through a structured upper-extremity evaluation workflow:

- Patient persona: age, weight, gender, occupation, work demand, hand dominance
- Presentation: primary region, onset, pain, aggravating activities, referral considerations
- ROM and strength measurements
- Special tests and sensation findings
- Functional limitations and goals
- Live clinical-fit ranking
- Suggested evaluation focus
- Treatment direction
- Generated documentation note
- Evidence Scout powered by Bright Data

This app is for demonstration and clinician decision support only. It does not diagnose patients or replace professional judgment, local policy, referral criteria, or medical supervision.

## Tech Stack

- HTML, CSS, and JavaScript for the frontend
- GitHub for source control
- Vercel for public deployment
- Vercel serverless function for `/api/evidence`
- Bright Data SERP API as an optional evidence-acquisition layer

## Bright Data Integration

Evidence Scout calls the serverless endpoint at `/api/evidence`. The endpoint is designed to use Bright Data when these Vercel environment variables are configured:

```text
BRIGHT_DATA_API_KEY
BRIGHT_DATA_SERP_ZONE
```

If those variables are not configured, the app falls back to demo public evidence links. The core evaluation workflow does not depend on Bright Data and continues to work without it.

The app does not send patient identifiers to Bright Data. The evidence request only uses the top-ranked clinical pattern, region, and selected findings.

## Problem

Upper-extremity evaluations can be complex and cognitively demanding. Clinicians often need to collect patient context, symptom behavior, range of motion, strength, special tests, referral considerations, functional limitations, and goals before synthesizing a clinical impression and treatment direction.

This prototype supports licensed occupational and physical therapists by structuring the evaluation workflow, surfacing likely clinical patterns, and connecting findings to evidence-informed treatment considerations.

The goal is not to diagnose patients or replace clinical judgment. The goal is to reduce cognitive load, improve consistency, and help clinicians move from findings to structured reasoning more efficiently.

## Why It Matters

More structured evaluations can support:

- More complete clinical data collection
- Clearer documentation
- Faster access to relevant public evidence
- More consistent reasoning across common upper-extremity presentations
- Better separation between clinician-entered findings, decision support, and final clinical judgment

## Implementation

The app is deployed publicly on Vercel and connected to GitHub for source control and automatic redeployment.

The frontend uses plain HTML, CSS, and JavaScript. JavaScript powers the step-by-step workflow, live completion tracking, clinical pattern scoring, treatment direction, generated documentation note, and Evidence Scout interactions.

Vercel provides the public deployment and hosts the serverless function used for Evidence Scout.

Bright Data is integrated as an optional evidence-acquisition provider. The app can call Bright Data's SERP API through a Vercel serverless route to retrieve public web evidence for the top-ranked clinical pattern.

Without Bright Data credentials, the app still works and falls back to demo public evidence links.

## Demo Flow

1. Open the live app at https://upper-extremity-eval-demo.vercel.app/
2. Enter a sample patient persona, such as age, weight, occupation, work demand, and hand dominance.
3. Move through the Presentation step and select a primary region, onset, pain level, and aggravating activities.
4. Add ROM, strength, special test, sensation, and functional limitation findings.
5. Review the live Clinical Fit panel as it ranks relevant clinical patterns.
6. Review suggested evaluation focus areas and treatment direction.
7. Use the generated note as a structured documentation draft.
8. Click Evidence Scout to retrieve public evidence links for the top-ranked condition.

## Code Structure

### `index.html`

Defines the application shell, evaluation workspace, clinical support panel, Evidence Scout section, and generated note area.

### `styles.css`

Defines the responsive layout, sidebar navigation, evaluation panel, clinical-fit cards, form controls, Evidence Scout cards, and mobile behavior.

### `app.js`

Contains the frontend application logic:

- `steps`: structured configuration for the evaluation workflow
- `conditionRules`: clinical-pattern rules used for demo scoring
- `rankConditions()`: scores likely clinical patterns from selected findings
- `renderInsights()`: updates clinical fit, evaluation focus, treatment direction, and notes
- `generateNote()`: creates a structured documentation draft
- `findCurrentEvidence()`: calls the serverless Evidence Scout endpoint

### `api/evidence.js`

Contains the Vercel serverless function for Evidence Scout.

The browser calls `/api/evidence`. The serverless function reads `BRIGHT_DATA_API_KEY` and `BRIGHT_DATA_SERP_ZONE` from environment variables, builds a public evidence query, calls Bright Data when configured, normalizes the result shape, and returns evidence cards to the frontend.

Keeping the Bright Data call in a serverless function prevents API keys from being exposed in public browser code.

## Architecture

```text
Frontend evaluation app
├── Structured evaluation workflow
├── Clinical pattern scoring
├── Treatment direction and note generation
└── Evidence Scout
    └── Vercel serverless API
        └── Optional Bright Data SERP request
```

The Evidence Scout layer is modular. If Bright Data is removed or replaced later, the core evaluation workflow remains intact.

## Roadmap

- Add clinician-reviewed content and source citations
- Add PDF export for generated notes
- Add authentication for private usage
- Add saved evaluations with compliant storage
- Add admin-editable clinical rules
- Add deeper evidence integrations
- Add HIPAA-ready architecture before any real patient data is used

## Important Caveats

- Demo and fake/de-identified data only.
- No protected health information should be entered.
- This prototype is not HIPAA-ready.
- It does not diagnose patients.
- Clinical content requires licensed clinician review before real-world use.
- Textbook content should not be copied without permission or licensing.
