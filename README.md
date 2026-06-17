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

## Video Script

### 1. The Problem

Hi, I am Melody, and I built an upper-extremity evaluation assistant for occupational and physical therapists.

The problem I am solving is that clinical evaluations are complex, especially for upper-extremity conditions like carpal tunnel syndrome, rotator cuff-related shoulder pain, lateral elbow tendinopathy, De Quervain's, and thumb CMC osteoarthritis.

A therapist has to collect patient context, symptoms, range of motion, strength, special tests, red flags, functional limitations, and goals. Then they need to synthesize all of that into a clinical impression and treatment direction.

That cognitive load is high, especially when clinicians are moving quickly between patients. The goal here is not to replace clinical judgment or diagnose the patient. The goal is to support licensed clinicians with a structured evaluation workflow, help them avoid missing key information, and connect findings to likely clinical patterns and evidence-informed treatment considerations.

This matters because better structure can mean more consistent evaluations, clearer documentation, and faster access to relevant evidence while the clinician stays in control.

### 2. The Tech Stack

The app is deployed publicly on Vercel, connected to GitHub. The frontend is built with plain HTML, CSS, and JavaScript, which made it fast to prototype and easy to deploy.

The core app captures a patient persona, presentation details, range of motion and strength, special tests, and functional goals. JavaScript powers the step-by-step workflow, live completion tracking, clinical pattern scoring, treatment direction, and generated documentation note.

Vercel gives us instant deployment and a public URL, so this is not just running locally on my laptop. Every time I push to GitHub, Vercel can redeploy the app.

The Bright Data piece is the Evidence Scout. I added a Vercel serverless API route that can call Bright Data's SERP API to retrieve current public web evidence for the top-ranked clinical pattern. That means the app can move from static clinical rules to live evidence discovery.

Without Bright Data, the app can still run, but it would only have static source placeholders or manual links. Bright Data enables the app to search public sources in real time, such as PubMed or professional clinical education resources, and bring those results back into the clinician workflow.

Importantly, Bright Data is isolated as an optional evidence provider. The app does not send patient identifiers. It only sends the top clinical pattern, region, and selected findings. If we remove Bright Data later, the core evaluation workflow still works.

### 3. Live Demo And Code

Now I will show the product.

This is the live Vercel deployment: https://upper-extremity-eval-demo.vercel.app/

On the left, we have the evaluation steps: Patient Persona, Presentation, ROM and Strength, Special Tests, and Function and Goals.

I will start with a sample patient. I will enter age 52, weight 165, occupation dental hygienist. I will select work demand as light or medium and hand dominance as right.

Now I will go to Presentation. Let's choose wrist as the primary region, gradual onset, and pain around 6 out of 10. For aggravating activities, I will choose keyboard or mouse and night pain.

On the right, you can see the Clinical Fit panel updating. This ranks likely clinical patterns based on the entered findings. Again, this is not a diagnosis. It is clinical decision support for a licensed therapist.

Now I will go to Special Tests and select Phalen test and Tinel at carpal tunnel, and sensation as median distribution symptoms. The carpal tunnel syndrome pattern rises as the most relevant consideration.

The app also suggests evaluation focus areas, treatment direction, and generates a note. This could help the clinician document faster and more consistently.

Now here is the Bright Data-powered part: Evidence Scout. I click Find Current Evidence. This retrieves public evidence results for the top-ranked condition. Right now, if Bright Data credentials are configured in Vercel, the serverless function calls Bright Data's SERP API. If credentials are not configured, it gracefully falls back to demo links, so the product still works.

### Code Walkthrough

Now I will briefly show the code.

In `app.js`, the evaluation steps are defined as structured data. Each step has fields, labels, input types, and options. This lets the app render the workflow dynamically instead of hardcoding every form section.

The `conditionRules` array defines the clinical patterns. Each pattern has a region, key findings, suggested evaluation focus, and treatment plan direction.

The `rankConditions()` function compares the clinician's selected findings against those rules and assigns a score. That score drives the Clinical Fit panel.

The `generateNote()` function turns the structured evaluation into a documentation-style note.

The Bright Data integration lives in `api/evidence.js`. This is a Vercel serverless function. The browser calls `/api/evidence`, and the serverless function reads `BRIGHT_DATA_API_KEY` and `BRIGHT_DATA_SERP_ZONE` from environment variables. That keeps the API key out of the public frontend code.

The API route builds a public evidence query from the top condition, region, and findings, then calls Bright Data's request endpoint. It normalizes the returned SERP results into title, URL, description, and source, and sends that back to the app.

That architecture is important because it keeps the core clinical workflow separate from the evidence provider. Bright Data is powerful, but optional. The app remains modular.

### Closing

So in summary, this project is a clinician-facing upper-extremity evaluation assistant. It structures the evaluation, ranks likely clinical patterns, suggests treatment direction, generates documentation, and uses Bright Data as an evidence acquisition layer for current public sources.

The next steps would be adding authentication, PDF export, clinician-reviewed content, proper compliance controls, and deeper evidence integrations.

For tonight's prototype, the key idea is simple: help clinicians move from patient findings to structured reasoning and current evidence faster, without replacing their judgment.

## Important Caveats

- Demo and fake/de-identified data only.
- No protected health information should be entered.
- This prototype is not HIPAA-ready.
- It does not diagnose patients.
- Clinical content requires licensed clinician review before real-world use.
- Textbook content should not be copied without permission or licensing.
