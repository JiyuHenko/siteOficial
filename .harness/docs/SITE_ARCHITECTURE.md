# Site Architecture Gate

## Objective
Build websites where structure, copy, assets, SEO, responsive behavior and motion all derive from one brand/product thesis.

## Required layers

### 1. Content architecture
Before components, define:
- audience;
- page goal;
- primary conversion;
- information hierarchy;
- credibility/proof;
- objections;
- CTA path.

### 2. Visual architecture
Declare in `SITE_DESIGN.json`:
- visual thesis;
- brand attributes;
- visual world/material references;
- typography roles;
- color roles;
- signature interaction;
- supporting interactions;
- explicit exclusions.

### 3. Component architecture
Components may be reusable, but composition must remain contextual.
Avoid assembling every site from the same hero, three cards, bento, testimonials and CTA sequence.

### 4. Motion architecture
Motion has four roles only:
- orientation;
- feedback;
- continuity/state change;
- signature/brand moment.

One signature motion may be strong. Supporting motion should be quieter.

### 5. Responsive architecture
Mobile is a deliberate composition.
Every signature interaction must declare:
- desktop behavior;
- touch/mobile behavior;
- reduced-motion fallback;
- low-performance fallback when needed.

### 6. Evidence
A site is not visually approved from source code alone.
Review rendered output at wide desktop, intermediate width and ~390px mobile.
