# Custom Mind Site Cookbook
## Visual patterns, interactions and composition recipes — draft v1

This cookbook is a source of ingredients, not a page generator.

## Core rule
A normal marketing/site project should usually have:
- 1 signature pattern;
- 0–3 supporting motion patterns;
- microinteractions as needed.

If the design can be described mainly by the list of effects it uses, the composition is probably under-directed.

---

# Pattern metadata
Each pattern records:
- purpose;
- intensity;
- best contexts;
- avoid when;
- mobile fallback;
- accessibility/performance notes.

---

## CM-S01 — Hero Shrink Frame
**Purpose:** cinematic handoff from hero to document flow.
**Intensity:** medium.
**Best for:** portfolios, premium services, hospitality, editorial brands.
**Avoid when:** hero contains critical controls/forms or page must feel ultra-fast/transactional.

### Behavior
During the first ~60% of viewport scroll:
- hero/card scale decreases subtly (~0–5%);
- border radius grows from 0 to ~24–32px;
- overlay UI can fade down;
- the next section becomes visually dominant.

### Principle
It should feel like the opening frame is being placed back into the page, not like a random zoom effect.

### Mobile
Use smaller scale delta or radius-only transition. Avoid sticky viewport traps.

### Reduced motion
Render final framed state or keep hero static.

---

## CM-S02 — Floating Segmented / Pill Navigation
**Purpose:** persistent orientation with low visual weight.
**Intensity:** low.
**Best for:** compact one-page sites, portfolio/service navigation.
**Avoid when:** many IA levels, long labels, accessibility would suffer from tiny touch targets.

### Rules
- Pill shape is not the identity by itself.
- Use one hierarchy: brand / section nav / CTA.
- Backdrop blur is optional and must preserve contrast.
- Active state should communicate current section when implemented.

---

## CM-S03 — Split Letter Blur Reveal
**Purpose:** one typographic brand moment.
**Intensity:** medium-high.
**Best for:** short display headlines, fashion/editorial, launch moments.
**Avoid when:** long text, repeated headings, content-heavy pages.

### Recipe
Characters start around:
- opacity: 0;
- y: 12–18px;
- blur: 6–8px;
- stagger: ~20–30ms per glyph.

### Constraint
Do not apply to every heading. If used as the hero signature, later headings should use quieter line/word reveals or no reveal.

### Accessibility
DOM text must remain semantically readable. Respect reduced motion.

---

## CM-S04 — Continuous Marquee / Ticker
**Purpose:** communicate abundance, categories, collaborators or a continuous brand rhythm.
**Intensity:** medium.
**Best for:** categories, client logos, materials, product families, event participants.
**Avoid when:** content is essential to read; text is merely filler; two opposing marquees compete with nearby motion.

### Rules
- Content must be meaningful even if the user never reads every item.
- Duplicate track for seamless looping.
- Pause/stop strategy should be considered for accessibility.
- Avoid simultaneous marquee + heavy parallax + 3D in the same viewport.

---

## CM-S05 — Scroll Cylinder Gallery
**Purpose:** memorable discovery of a small curated set of projects/products.
**Intensity:** high — signature candidate.
**Best for:** portfolio, fashion collections, architecture, art, selected cases.
**Avoid when:** items require comparison, dense metadata, e-commerce filtering, or low-end mobile is core traffic.

### Geometry
Cards are positioned on an imaginary vertical cylinder:
- relative index controls an angle;
- `y = radius * sin(angle)`;
- `z = radius * cos(angle) - radius`;
- card rotates on X by the same relative angle.

A reference implementation used approximately:
- step: 27deg;
- radius: 1350px.

These values are not canonical; tune from viewport/card geometry.

### Composition rule
Only one strong 3D scroll interaction per page.

### Mobile fallback
Use native horizontal snap carousel or vertical cards. Do not force the cylinder into a narrow viewport.

### Reduced motion
Static selected card grid/carousel.

---

## CM-S06 — Context Backdrop Crossfade
**Purpose:** connect a foreground item to atmosphere without replacing content hierarchy.
**Intensity:** medium.
**Best for:** gallery paired with CM-S05, case study selectors, product storytelling.
**Avoid when:** image contrast makes text unstable or bandwidth is constrained.

### Behavior
As active item changes:
- background image crossfades;
- layer remains blurred and dimmed;
- foreground card stays sharp.

### Performance
Keep only the necessary neighboring layers active/preloaded.

---

## CM-S07 — Ambient WebGL Gradient
**Purpose:** slow atmospheric signature for a brand that genuinely benefits from digital/technical energy.
**Intensity:** high visually, low informationally.
**Best for:** creative technology, experimental portfolio, digital launches.
**Avoid when:** local service, retail product imagery, trust/clarity is more important, mobile performance matters.

### Governance
WebGL is never the default “premium tech” answer.
Declare why GPU animation belongs to the brand.

### Fallback
Static gradient/image. Respect reduced motion and device capability.

---

## CM-S08 — Editorial Metrics Strip
**Purpose:** prove scale, trust or performance with factual numbers.
**Intensity:** low-medium.
**Best for:** businesses with real metrics.
**Avoid when:** numbers are generic template filler.

### Rule
Every metric must pass:
“Would the owner defend this number publicly?”

Never transplant SaaS metrics such as projects/countries/teams into an unrelated local business.

---

## CM-S09 — Responsive Card Spotlight
**Purpose:** subtle pointer feedback and material depth.
**Intensity:** low.
**Best for:** dark interfaces, premium portfolios, feature cards where hover detail is useful.
**Avoid when:** every card uses it, touch is the dominant platform, or contrast suffers.

### Rule
Pointer lighting is a microinteraction, not a site-wide signature unless the brand concept explicitly depends on it.

---

## CM-S10 — Sticky Story Stage
**Purpose:** hold one visual anchor while text/product states progress.
**Intensity:** medium-high.
**Best for:** product explanation, service process, before/after narrative.
**Avoid when:** content is short or sticky scrolling creates unnecessary friction.

### Mobile
Usually collapse to ordinary vertical flow or compact snap sections.

---

# Composition recipes

## Local service — Trust first
Suggested:
- CM-S01 OR a static strong hero;
- CM-S08 only with real proof;
- quiet microinteractions.
Avoid by default:
- CM-S05;
- CM-S07;
- aggressive split-letter animation.

## Fashion / boutique — Editorial product first
Suggested:
- CM-S03 once;
- CM-S05 as signature OR sticky collection storytelling;
- CM-S06 supporting.
Avoid:
- unrelated SaaS dashboards/metrics;
- tech glow unless brand-owned.

## Creative / technology studio
Suggested:
- CM-S01;
- CM-S05 or CM-S07 as the signature, not both by default;
- CM-S09 for supporting cards.

## Auto / technical local business
Suggested:
- cinematic but factual hero;
- service proof, diagnostics/process visuals;
- restrained motion and before/after interaction.
Avoid:
- decorative fashion/editorial effects that weaken technical trust.

---

# Anti-pattern: Effects Buffet
Symptoms:
- hero shrink;
- marquee;
- split letters;
- 3D gallery;
- WebGL;
- parallax;
- glow cards;
all competing on one page without a visual thesis.

Fix:
1. Identify the single interaction that best expresses the brand.
2. Keep it as signature.
3. Remove or quiet patterns that compete with it.
4. Rebuild section sequence around conversion and story rather than effect variety.

---

# Adding a new pattern
A new cookbook entry must answer:
1. What does it communicate?
2. Which brand/site contexts justify it?
3. When should it not be used?
4. How does it degrade on mobile?
5. What happens under reduced motion?
6. What is its performance risk?
7. Can it remain a reusable pattern without becoming a visual preset?

---

# Regra de preservação de assets reais

Assets reais já existentes no projeto — screenshots de produto, fotografias de clientes, logos, fachadas, imagens editoriais, QR codes e materiais de marca — são **fonte de verdade visual**.

Um redesign não pode removê-los da experiência apenas porque um mockup em CSS, gradiente ou composição abstrata parece mais coerente com a nova direção de arte.

## Ordem de preferência

1. asset real existente e relevante;
2. asset real reenquadrado dentro da nova composição;
3. representação abstrata complementar;
4. mockup sintético somente quando não existe asset real adequado.

## Gate de controle

Antes de concluir um redesign, comparar a lista de assets relevantes antes/depois e responder:

- algum screenshot real de produto deixou de aparecer?
- alguma foto real de cliente/case foi substituída por bloco genérico?
- algum logo ou material original foi redesenhado sem necessidade?
- o novo visual ainda prova que o produto/case existe, ou apenas sugere isso?

Se um asset real importante sumiu sem justificativa explícita, o redesign está bloqueado.
