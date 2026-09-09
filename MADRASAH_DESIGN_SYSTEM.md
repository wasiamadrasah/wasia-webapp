# Madrasah Design System & Public Frontend Guidelines

## Design Philosophy

**Clean, mature, and academic.**
No gradients, no oversized typography, and no tiny text. The visual feel balances modern academic rigor with authentic Islamic character.

```text
                 MODERN
                    │
             ┌──────┴──────┐
             │             │
         ACADEMIC       ISLAMIC
             │             │
             └──────┬──────┘
                    │
                TRUSTED
```

---

## 1. Typography & Fonts

### Font Families

1. **English (Primary UI & Body):** `Inter`
   ```css
   font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
   ```
   *Usage:* Navigation, headings, buttons, body text, data numbers, forms, labels.

2. **Bangla (Bengali Content):** `Noto Sans Bengali`
   ```css
   font-family: "Noto Sans Bengali", sans-serif;
   ```
   *Usage:* Whenever Bengali content or localized notices/articles appear.

3. **Arabic (Islamic & Quranic Quotes):** `Amiri`
   ```css
   font-family: "Amiri", serif;
   ```
   *Usage:* Quranic verses, Hadith quotes, Arabic headings/names, and Islamic decorative accents.

### Font Scale & Hierarchy

| Element | Desktop | Mobile | Weight | Line Height |
| :--- | :---: | :---: | :---: | :---: |
| **Hero Heading** | `48px` | `36px` | `700` (Bold) | `1.15` |
| **Page Heading** | `36px` | `30px` | `700` (Bold) | `1.2` |
| **Section Heading** | `30px` | `26px` | `700` (Bold) | `1.25` |
| **Card Heading** | `18px` | `18px` | `600` (SemiBold) | `1.3` |
| **Navigation Link** | `14px` | `14px` | `600` (SemiBold) | `1.4` |
| **Body Text** | `16px` | `15px` | `400` (Regular) | `1.6` |
| **Small / Meta Text** | `13px` | `13px` | `400` (Regular) | `1.5` |
| **Button Label** | `14px` | `14px` | `600` (SemiBold) | `1` |
| **Arabic Verse** | `27px` | `23px` | `400` (Regular) | `1.8` |

> [!IMPORTANT]
> - Do **not** use oversized 60–70px headings. For an educational institution, 48px provides clear hierarchy without startup-style visual noise.
> - Do **not** use body text under 15px. 16px is the standard default for academic legibility.

---

## 2. Color Palette & Hierarchy

No gradients. Pure, solid, harmonious color tokens.

### Color Tokens

- **Primary Deep Green (`#075E54`):** Primary buttons, navbar accents, important headings, icons, active links.
- **Dark Green (`#064A42`):** Footer background, strong headings, primary button hover states.
- **Gold (`#B68A18`):** Small labels, active tab indicators, Arabic accents, decorative rules, key highlights. (*Used sparingly*).
- **Main Background (`#FFFFFF`):** Base canvas and clean card surfaces.
- **Soft Section Background (`#F7F8F5`):** Alternating background to segment sections cleanly.
- **Main Text (`#17211E`):** High-contrast, dark institutional charcoal for headings and body.
- **Secondary / Muted Text (`#5F6B67`):** Subheadings, metadata, captions, and placeholders.
- **Border (`#E2E7E4`):** Subtle dividers, card borders, and input outlines.

### Visual Weight Distribution

```text
┌────────────────────────────────────────────────────────┐
│ WHITE / BASE CANVAS              60%                  │
│ SOFT OFF-WHITE (#F7F8F5)         20%                  │
│ DARK GREEN (#064A42)             10%                  │
│ PRIMARY GREEN (#075E54)           7%                  │
│ GOLD ACCENT (#B68A18)             3%                  │
└────────────────────────────────────────────────────────┘
```

---

## 3. UI Component Specifications

### Buttons

- **Primary Button:**
  - Background: `#075E54`
  - Text: `#FFFFFF`
  - Radius: `8px`
  - Height: `44px`
  - Padding: `0 18px`
  - Typography: `14px / 600`
  - Hover: Background `#064A42`, subtle shadow `0 4px 12px rgba(7, 94, 84, 0.15)`, `transform: translateY(-1px)`, transition `200ms ease-out`.
  - Active: `transform: scale(0.98)`

- **Secondary / Outline Button:**
  - Background: `transparent`
  - Border: `1px solid #075E54`
  - Text: `#075E54`
  - Radius: `8px`
  - Height: `44px`
  - Padding: `0 18px`
  - Hover: Background `#F0F7F5`, text `#064A42`.

### Border Radii

```text
Buttons:       8px
Inputs:        8px
Cards:         12px
Large Cards:   16px
Images/Media:  16px
Modals:        16px
Pills/Badges:  Full (only for status tags & small avatars)
```

### Shadows

- **Card Default:** `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);`
- **Card Hover:** `box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);`

### Spacing & Layout Grid

- **Max Container:** `max-w-7xl` (`1280px`), `mx-auto`, `px-4 sm:px-6 lg:px-8`
- **Section Vertical Padding:**
  - Desktop: `py-20` (`80px`)
  - Mobile: `py-14` (`56px`)

---

## 4. Public Page Layout Structures

### Navbar (`72px` Height)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] Wasia Madrasah      Home  About  Academics  Notice  Contact   [Apply] │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Navigation Links: `14px / 600`, color `#17211E`.
- Active Link: Text `#075E54` with a `2px` bottom indicator in `#B68A18` (`width: 0 -> 100%`, `200ms`).

### Hero Section (`~560px` Desktop)

- Background: Solid `#F7F8F5` (no gradient overlays).
- Structure:
  - Top Arabic Bismillah / Ayah in Amiri (`27px / 400`, color `#B68A18`).
  - Main Title in Inter (`48px / 700`, color `#17211E`).
  - Short Mission Description (`16px / 400`, color `#5F6B67`, max-width `540px`).
  - Action Group: Primary `[Apply for Admission]` + Secondary `[Explore Academics]`.
  - Right: Clean institutional photography container (`16px` radius, subtle border).

### Section Header Rhythm

Avoid centering every section header:
- **Academic Programs:** Centered (Eyebrow in `#B68A18` + Heading + Centered lead text).
- **About Institution:** Left-aligned (Editorial layout with side image and stats).
- **Notices & Events:** Left-aligned split column layout.

---

## 5. Animation Philosophy

Animation must communicate user interaction and hierarchy—never decorative distraction.

- **Button Clicks & Hovers:** `200ms ease-out`
- **Card Transitions:** `250ms ease-out` (`translateY(-3px)`, subtle shadow expand)
- **Nav State Transitions:** `200ms`
- **Hero Entrance:** `500–700ms ease-out`
- **Scroll Reveal:** `600ms ease-out` (`opacity: 0 -> 1`, `translateY: 20px -> 0`)
- **Prohibited:** Bouncing, 3D rotating, excessive zoom, persistent floating, heavy parallax.

---

## 6. Tailwind CSS Theme Token Map

```javascript
// Color Token Definitions
colors: {
  madrasah: {
    50:  "#F0F7F5",
    100: "#DCEEE9",
    500: "#075E54", // Primary Deep Green
    600: "#064F48",
    700: "#064A42", // Dark Green
    900: "#17302B",
  },
  gold: {
    500: "#B68A18", // Institutional Gold Accent
    600: "#9D7614",
  },
  surface: {
    DEFAULT: "#FFFFFF",
    soft: "#F7F8F5",
  },
  text: {
    DEFAULT: "#17211E",
    muted: "#5F6B67",
  },
  border: "#E2E7E4",
}
```
