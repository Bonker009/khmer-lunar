# Design style

Visual language only: colors, typography and UI character you can copy elsewhere. No implementation or tooling details. Role names such as **brand**, **holy-soft** or **elevation-floating** are shared vocabulary between design and product. Every value below is a starting point; keep the roles when a value changes.

## Principles

1. **Bilingual first.** Khmer and English share the screen. Neither script should look like a fallback for the other.
2. **Blue acts, red speaks.** Brand blue carries actions and structure. Accent red is rare: emphasis, holidays and errors only.
3. **Meaning is never color alone.** Every calendar meaning (holy day, holiday, observance, today) also has a label, shape or icon.
4. **Calm density.** Soft surfaces, low shadows and short motion. Save immersive brand color for a single focal moment per screen.

## Typography

| Family | Script | Use |
| --- | --- | --- |
| **Plus Jakarta Sans** | Latin | Interface text: headings, labels, buttons, English body. Regular 400, semibold 600. |
| **Dangrek** | Khmer | Display only: page titles, hero lines, big numbers. Single weight, never faux-bolded. |
| **Kantumruy Pro** | Khmer | Everything else in Khmer: body, labels, card titles, long passages. |

**Hierarchy:** A Khmer title may carry a short English subtitle underneath, in a smaller size, semibold, in the **emphasis** color. In English, the title stands alone.

### Khmer specifics

- Khmer needs **more line height** than Latin: about **1.7** for Khmer against 1.5 for Latin body text.
- Never letter-space, uppercase or italicize Khmer. Micro-label styling applies to Latin only.
- In the Khmer interface, show numbers with **Khmer numerals** (១២៣). In English, use Latin digits.
- Don't mix more than two families in one block. Dangrek + Kantumruy Pro, or Jakarta + Kantumruy Pro.

### Type scale

| Name | Size / line height | Typical use |
| --- | --- | --- |
| **2xs** | 11 / 16px | Lunar day under a date, micro-labels, dense meta |
| **xs** | 12 / 16px | Captions, badges, tooltips |
| **sm** | 14 / 20px | Secondary body, helper text, form labels |
| **base** | 16 / 24px | Default body and form fields |
| **lg** | 18 / 28px | Section intros, emphasized inline |
| **xl / 2xl** | 20–24px | Card and section headlines |
| **3xl–5xl** | 30–48px | Page titles and hero lines (display family) |

Use at most **three** distinct text sizes in one viewport region.

## Color

### Brand

| Role | Hex | Notes |
| --- | --- | --- |
| Brand primary | `#00518D` | Primary actions, key links, active navigation, today's ring, immersive surfaces. 8.2:1 on white. |
| Accent | `#EA1D24` | Strong emphasis. **4.47:1 on white, so only for text ≥ 18px or bold ≥ 14px, fills and decoration.** Small red text uses `#C92324` (5.6:1). |

### Scales

Brand blue (600 = brand)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `#EEF6FF` | `#D8ECFF` | `#B4D8FE` | `#88BCF2` | `#5497D8` | `#2472B6` | `#00518D` | `#013F6F` | `#012D51` | `#021E38` | `#021020` |

Accent red (500 = accent)

| 50 | 100 | 300 | 400 | 500 | 600 | 700 |
| --- | --- | --- | --- | --- | --- | --- |
| `#FFF2F0` | `#FFE0DB` | `#FF988D` | `#FF655A` | `#EA1D24` | `#C92324` | `#A21A1B` |

Cool blue-gray neutrals

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `#F8FAFD` | `#F0F4F8` | `#E1E7EE` | `#CDD5DF` | `#99A2AF` | `#6A7684` | `#4E5968` | `#36414F` | `#212A35` | `#10171F` | `#070B12` |

Supporting hues for data, tags and calendar meanings. They are deliberately not variations of blue.

| Hue | Soft | Mid | Strong |
| --- | --- | --- | --- |
| Teal | `#CFF4EF` | `#49C4B7` | `#006A61` |
| Amber | `#FFF4E5` | `#F09C17` | `#814D00` |
| Violet | `#ECE7FF` | `#A58DE6` | `#7250BA` |
| Rose | `#FFE2E6` | `#EE7C90` | `#C6375C` |

### Semantic roles

| Role | Light | Dark | Use |
| --- | --- | --- | --- |
| background | neutral 50 | neutral 950 | Page |
| foreground | neutral 900 | neutral 100 | Body text, cool dark blue-gray rather than black |
| card | white | neutral 900 | Raised panels |
| popover | white | neutral 850 | Menus, popovers, toasts |
| muted-foreground | neutral 600 | neutral 400 | Secondary text |
| primary | blue 600 | blue 300 | Primary fills (light-on-dark in dark mode) |
| accent | blue 50 | blue 500 at 18% | Selected rows, active nav, highlight panels |
| border / input | neutral 200 / 300 | white at 9% / 15% | Dividers and field outlines |
| ring | blue 500 | blue 400 | Keyboard focus |
| emphasis | red 600 | red 400 | English subtitles, attention text |
| destructive | red 600 | red 400 | Errors, invalid fields |
| success / warning / info | teal 700 / amber 800 / blue 600 | teal 400 / amber 400 / blue 300 | Status, distinct from brand and accent |

### Calendar meanings

| Meaning | Text | Soft fill | Mark | Always paired with |
| --- | --- | --- | --- | --- |
| **Holy day** (ថ្ងៃសីល) | amber 800 | amber 50 | amber dot, or a moon glyph on full/new moon | Bold lunar day and the label "ថ្ងៃសីល" |
| **Public holiday** | red 600 | red 50 | red date number | Holiday name |
| **Observance** | violet 600 | violet 100 | violet dot | Observance name |
| **Today** | — | — | 2px brand ring | Position in grid |
| **Sunday** | red 600 date number | — | — | Column header |
| **Outside month** | 40% opacity | — | — | Grid position |

### Contrast

Normal text needs **4.5:1**. Large text (≥ 18px, or bold ≥ 14px) and UI marks need **3:1**. Every text role in this palette passes AA in both themes. The tightest pairs are the hero accent (amber on brand, 4.55:1) and observance on its soft fill (4.9:1), so keep those at their specified sizes or larger.

### Data and charts

Series order: **blue 500 → teal → amber → violet → rose**. Keep legends labelled and never rely on hue alone.

## Shape

- **Corners:** Avoid sharp 90° everywhere, and avoid fully pill-shaped except a single primary call to action or a status dot. Use the radius steps below.
- **Shadows:** Soft and low, tinted with the neutral hue rather than pure black. Cards lift slightly.

### Corner radius scale

Base reference is **10px**. Step down for nested or dense pieces, step up for outer shells:

| Step | Size | Use |
| --- | --- | --- |
| **sm** | 6px | Chips, badges, day-number bubbles |
| **md** | 8px | Fields, compact controls, calendar cells |
| **lg** | 10px | Standard controls, inner panels |
| **xl** | 14px | Cards, hero surfaces, inset shells |

## Elevation and surfaces

| Tier | Surface | Shadow | Examples |
| --- | --- | --- | --- |
| 0 · base | background | none | Page, calendar cells |
| 1 · raised | card | 1–3px very soft (~5% alpha) plus hairline ring | Cards, stat tiles |
| 2 · floating | popover | ~28px blur, −8px spread, ~18% alpha | Popovers, select menus, toasts |
| 3 · immersive | brand gradient | ~40px blur, brand-tinted | Today hero, New Year card |

- In dark mode, shadows get darker and floating layers add a faint 1px light edge so they separate from the surface.
- **Inputs** sit on the base or card surface with a light border. **Focus** adds emphasis with a ring, not a thick outline.

## Sizing

### Control scale (buttons, inputs, similar controls)

| Name | Approx. height | Intent |
| --- | --- | --- |
| **xs** | ~24px | Dense toolbars, table row actions |
| **sm** | ~28–32px | Compact forms, calendar toolbars, toggles |
| **default** | ~32–36px | Standard primary actions |
| **lg** | ~40px | Hero calls to action |

**Icon-only controls:** match the touch target to the same scale: **small** (~24px), **medium** (~32–36px), **large** (~40px). The glyph should be slightly smaller than the hit area. On touch screens, keep interactive calendar cells at **≥ 44px** tall.

### Spacing rhythm

Use a **4px grid**:

| Rhythm | Value | Use |
| --- | --- | --- |
| tight | 4–8px | Label ↔ field, icon ↔ text, date ↔ lunar day |
| comfortable | 12–16px | Between form groups, inside cards |
| section | 24px | Between cards and major blocks |
| page | 32–48px | Page title ↔ content, page padding on desktop |

## Icons

- **Stroke** icons: single weight, simple geometry, matching the weight of body text at the size used.
- Prefer outline style over filled for chrome. Use filled only for small status marks or toggles.
- The **moon glyph** is the one illustrative exception. It is drawn from the lunar day (crescent → full → new) and takes the moon/holy color.

## Motion

- Short transitions: **150ms** (color, opacity), **200ms** (default), **250ms** (open/close, larger movement).
- Easing is a soft ease-out with no bounce or overshoot.
- Respect **reduced motion**: drop transitions and pulses to near-instant.

## States

| State | Treatment |
| --- | --- |
| hover | Surface shifts one step toward accent. Text color unchanged. |
| active / pressed / selected | Accent fill with accent-foreground text, or brand ring for "today". |
| focus-visible | 3px ring in ring color at ~50% alpha. Always visible, on every control. |
| disabled | 50% opacity, no pointer. Keep labels readable. |
| loading | Skeleton for structure. Inline spinner inside the button only. Content dims to ~60% while refreshing. |
| invalid | Destructive border and ring plus a message under the field. Never color alone. |

Priority when states overlap: disabled → loading → active → focus → hover → default.

## Focus and accessibility

- **Keyboard focus** is always visible: a soft ring in the theme's ring color, never just the browser default on some controls.
- **Invalid fields** pair border and ring in a destructive tint with support copy or an icon.
- Announce async results (`busy` on the refreshing region, `alert` on errors).

## Feedback

- **Toasts:** Short and non-blocking. Stack sparingly. Success, error and warning must look distinct.
- **Loading:** Prefer **skeleton** blocks (muted pulse) that mirror the final layout. Use spinners only for small inline actions or buttons.
- **Empty states:** One muted line of copy inside a dashed-border box. No illustration needed.

## Component patterns

### Page structure

Pages have **no page header**. They open straight into content, and the active item in the top navigation tells people where they are. Each card carries its own title, and page-level controls (month or year navigation) sit in the header of the card they control.

Display type (Dangrek for Khmer, Jakarta semibold for Latin) is reserved for immersive surfaces and big numbers. When a Khmer title needs an English subtitle (for example in marketing or print), set it smaller, semibold, in the **emphasis** color.

### Responsive panel

A page section that changes its container with screen size:

- **Mobile and tablet:** no container. Content sits directly on the page background, sections are separated by generous vertical space (~40px) and a semibold section title. Inner groups (option boxes, stat tiles, result highlights) keep their own light border or soft fill.
- **Desktop (≥ 1024px):** a raised card (card surface, xl radius, raised shadow, hairline ring, 24px padding). Side columns may stick below the header while the main column scrolls.
- Page controls that belong to a section (year navigation) sit in the section title row. On mobile, controls that drive the whole page move to the top.

### Immersive surface

Use this for the single focal moment on a screen: today's lunar date, or the New Year arrival.

- Brand gradient (blue 700 → 600; dark: 800 → 700) with white text and blue-100 secondary text.
- Accent details in **amber 400**: animal year, arrival time, holy-day chip.
- Chips are white at ~12% with white text. Holiday chips use a solid red 600 fill.
- One blurred amber glow at low opacity for depth. Never more than one per surface.

### Calendar day cell

```text
┌───────────────┐
│ ១៤        • ◐ │  Gregorian day (sm–base, semibold) · marks top-right
│ ៣កើត          │  lunar day + phase (2xs; amber 800 bold on holy days)
│               │
│ Holiday name  │  2xs, truncated, holiday/observance color (≥ sm screens)
└───────────────┘
```

- Base surface one step below the card so cells read as tiles.
- States: hover and selected use the accent fill, today has a brand ring, a public holiday has a red soft fill, outside-month days are at 40% opacity.
- Details open in a floating popover: full Gregorian date, full lunar sentence and meaning chips.

### Chips and badges

| Variant | Fill / text | Use |
| --- | --- | --- |
| neutral | secondary / secondary-foreground | Counts, "in N days" |
| meaning | soft fill / meaning text | Holy day, holiday, observance |
| solid | meaning color / white | On immersive surfaces |
| status | success / warning / destructive soft | HTTP status, validation |

### Stat tile

Micro-label (Latin: 11px, uppercase, 0.06em tracking; Khmer: same size, no tracking), then a large tabular number. Tiles sit in a 2-column grid on mobile and 4 columns on wide screens.

### Segmented options

Use a joined outline toggle group for mutually exclusive choices (week start, weekend definition, count mode). When the labels are long or the screen is narrow, separate the options with a small gap and let them wrap.

### Code blocks

Neutral 900 surface (dark: 950) with neutral 100 monospace text, md radius and 16px padding. Put the copy action outside the block.

## Scrollbars

- Custom scroll areas use a **thin** track with a **rounded**, muted thumb: neutral 300 in light mode, neutral 700 in dark mode. No high-contrast stripes.

## Layout and density

- Comfortable density: enough padding in cards and lists, no cramming.
- Main content max width about **1150px**. Two-column pages collapse to one column below ~1024px.
- Keep at least a 16px side gutter at every width.
- **Exception, full-bleed views:** the monthly calendar uses the full viewport width with an 8px gutter, so day cells get as much room as possible. Any other dense grid that needs every pixel may use the same treatment. Content pages don't.

## Micro-typography in data UI

- **Micro-labels** (filters, tabs, stat labels): small uppercase with slight letter-spacing for Latin only. Keep them readable on mobile.
- **Numbers** in tables, counters, times and calendars use **tabular** figures.

## Do and don't

| Do | Don't |
| --- | --- |
| Use brand blue for the one primary action per area | Use accent red for buttons or links |
| Pair every calendar color with a label or mark | Encode holy day or holiday by color only |
| Keep Dangrek for large display lines | Set Khmer body text or small labels in Dangrek |
| Give Khmer text line height ~1.7 | Letter-space or uppercase Khmer |
| Use one immersive brand surface per screen | Paint whole pages in brand blue |
| Use skeletons for page structure | Put full-page spinners on navigation |
