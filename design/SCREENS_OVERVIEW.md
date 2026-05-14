# Slideline design screens — what each surface is for

This document summarizes the six **1440×900** artboards in `screens/App.jsx` and how they fit the flow **prompt → plan → slides → export**. Use it when rebuilding the UX in Next.js: match behaviors and hierarchy, not line-for-line JSX from the prototypes.

Supporting files worth knowing:

- **`screens/shell.jsx`** — Shared chrome only: top nav (`AppNav`), sidebar (`Sidebar`, `SidebarItem`), and icon primitives. Dashboard / New deck / Preprocess / Brand kit use this nav + sidebar; the editor shells use dedicated toolbars.
- **`screens/IronDenSlide.jsx`** — A **scaled slide renderer** (1280×720 logical canvas) reused for thumbnails, brand-kit preview, and the editor canvas. In the app this becomes **data-driven slides**, not Iron Den–specific markup.
- **`design-canvas.jsx`** — Figma-style tooling for arranging artboards inside the prototype host. **Not part of the shipped product.**

---

## 01 — Recent decks (`Dashboard.jsx`)

**Purpose.** Home surface: orient the user and open recent work quickly.

**User goals.**

- Scan decks with thumbnails, subtitles, linked **brand kit**, last-edited time, and **lifecycle status** (e.g. draft with AI plan, generated, edited, PDF exported).
- Filter or sort decks (tabs and sort affordances).
- Start something new prominently: **hero “New deck”** (AI-first) and secondary **template** path.

**Key regions.** Workspace nav + breadcrumb (“Decks”), sidebar for collections and kits, grid of deck cards beside the hero CTA.

**Next-step affordances.** Open a deck, create a deck, or implicitly jump toward brand setup via sidebar kits.

---

## 02 — Brand kit editor (`BrandKit.jsx`)

**Purpose.** Configure **reusable branding** applied when planning and rendering slides.

**User goals.**

- Manage **logo** (upload, placement rules like “show on every slide”).
- Define **color palette**, **display/body typography**, **tone of voice**, and **AI image style** (guides generated imagery prompts).
- See a **live slide preview** (cover vs content layouts) update as controls change.

**Supporting ideas shown in UI.** Compliance hint (contrast / logo usage), scope (“applies to N decks”), duplicate/discard/save.

**Relationship to flow.** Kits are referenced when creating decks and show up as chips across other screens.

---

## 03 — New deck · prompt (`NewDeck.jsx`)

**Purpose.** Step **1 of 3** — capture intent before any slides exist.

**User goals.**

- Write a natural-language **deck brief** (title, audience, bullets, asks).
- Set **constraints on one row**: brand kit, slide count, audience, tone.
- Optionally use **sample starters** or **plan settings**: slide-count range, which **layout archetypes** to allow, imagery/speaker-notes policy, toggle to **review plan before generating**.

**Primary actions.** **Plan the deck** (runs planning), **Save as draft**, **Cancel**.

**Relationship to flow.** Outputs an AI **plan** to be reviewed next; stepper shows Describe → Review → Generate.

---

## 04 — AI plan · review (`Preprocess.jsx`)

**Purpose.** Step **2 of 3** — human validation of **slide-by-slide structure** before pixel generation.

**User goals.**

- Scan summary **stats** (slide count, layout mix, imagery prompt count, notes coverage, kit, template, est. runtime).
- For each slide: inspect **layout type**, editable **title** and body/bullets, **image brief** (text prompt idea), optional **speaker notes**.
- **Reorder** slides, **rewrite** sections with AI, **add slides**, regenerate or save plan, then **generate slides**.

**Relationship to flow.** This is the **contract** between “what we intend” and what the slide editor renders. Approving triggers generation (step 3).

---

## 05 — Slide editor (`Editor.jsx`)

**Purpose.** Step **after generation** — “Keynote-lite” **hands-on editing**.

**User goals.**

- Navigate **thumbnail rail**, edit on a **central canvas** (zoom, layout change, optional selection handles).
- Use top bar for **deck identity**, undo/redo, **insert slide** / **elements** (text, image, shape), **Ask Slideline**, **share**, **export PDF**.
- Use right **inspector tabs**: **Slide** / **Element** / **Template** / **Notes** — design shows **Element** active with typography, colors, geometry, alignment, mini layout picker, and inline **comment**.

**Relationship to flow.** Canonical place to refine visuals and narrative after the plan became slides.

---

## 06 — Template controls (`TemplateControls.jsx`)

**Purpose.** Same **editor shell as 05**, but inspector focuses on **`Template`** — **deck-wide chrome** layered on slides.

**User goals.**

- Configure **page numbers** (style, placement, size, behaviors like skipping title/closing slides).
- Configure **top-right running title** (token like section name, typography, casing, letter-spacing).
- Configure **footer brand logo** (asset, placement, size, opacity, wordmark toggle).
- Manage **per-slide overrides** (“hide chrome on slide N”) and optional **save as reusable deck template**.

**Relationship to flow.** Bridges **brand kit defaults** with **presentation-specific overrides** visible on every exported slide.

---

## Suggested Next.js routing mental model

Map artboards to **routes or nested layouts** loosely as:

| Concept        | Sketch route idea        |
|----------------|---------------------------|
| Deck home      | `/` or `/decks`           |
| New brief      | `/decks/new`              |
| Plan review    | `/decks/[id]/plan`       |
| Editor         | `/decks/[id]/edit`        |
| Brand kits     | `/brand-kits` / `[kitId]` |
| Template mode  | editor sub-view or `/decks/[id]/template` |

Exact paths are up to your app IA; behaviors above are what the prototypes are illustrating.
