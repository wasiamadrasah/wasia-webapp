# DigiCampus UI Design System

**Version:** 1.0
**Project:** DigiCampus
**Stack:** Next.js + React + TypeScript + shadcn/ui
**Purpose:** Global UI consistency and visual governance

---

## 1. Purpose

This document is the **single source of truth for the DigiCampus UI system**.

DigiCampus is a production education management system. The application contains many modules and pages, and visual inconsistency must be avoided.

All new UI and all modifications to existing UI **MUST follow this document**.

The primary objective is:

> **Every page in DigiCampus should look like it was designed by the same design team using the same component library.**

The UI system prioritizes:

* Consistency
* Accessibility
* Clarity
* Predictability
* Professional appearance
* Low visual noise
* Reusability
* Semantic colors
* Consistent spacing
* Consistent component dimensions

---

# 2. Critical Rules for AI Agents

When modifying or creating UI, follow these rules before writing code.

### MUST

* Reuse existing shadcn/ui components.
* Reuse existing DigiCampus components when available.
* Follow the global button variants.
* Follow the global badge/status colors.
* Follow the global spacing system.
* Follow the global border-radius system.
* Follow the global typography hierarchy.
* Use semantic colors.
* Use Lucide icons consistently.
* Preserve existing application functionality.
* Keep visual behavior consistent with other pages.
* Prefer modifying the shared component over adding page-specific styling.
* Check whether a component already exists before creating a new one.
* Keep components composable and reusable.

### MUST NOT

* Create arbitrary button colors.
* Create arbitrary button heights.
* Create arbitrary border-radius values.
* Add page-specific versions of existing components.
* Use gradients unless explicitly approved.
* Use excessive shadows.
* Mix multiple icon libraries.
* Use emoji as UI icons.
* Create a new badge design for a single page.
* Create custom button styles when an existing variant can be used.
* Add unnecessary animations.
* Introduce a new color without updating the design system.
* Use `!important` to force visual consistency.
* Override shadcn components locally when the change should be global.
* Make one page visually different just because the page has a different module.

---

# 3. Design Philosophy

DigiCampus is an **education management/admin platform**, not a marketing website.

The interface should feel:

* Clean
* Structured
* Calm
* Professional
* Reliable
* Modern
* Efficient
* Slightly dense, but never cramped

Avoid:

* Excessively rounded interfaces
* Excessive colors
* Large decorative gradients
* Heavy shadows
* Giant typography
* Excessive animation
* Excessive whitespace
* Visually noisy dashboards

The interface should prioritize **information hierarchy over decoration**.

---

# 4. Technology Rules

DigiCampus uses:

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide icons

Existing shadcn components are the foundation of the UI.

When possible:

```tsx
<Button />
<Card />
<Input />
<Select />
<Badge />
<Dialog />
<DropdownMenu />
<Tabs />
<Alert />
<Table />
```

should be used instead of custom implementations.

If the existing shared component needs a visual correction, **modify the shared component rather than adding a local workaround**.

---

# 5. Design Tokens

## 5.1 Brand Colors

### Primary

```text
Primary:
#4F46E5

Primary Hover:
#4338CA

Primary Soft:
#EEF2FF
```

Primary is the main DigiCampus brand/action color.

Use it for:

* Primary actions
* Active navigation
* Links
* Focus states
* Selected states
* Important interactive elements

Do not use primary simply to decorate a component.

---

# 6. Semantic Colors

Semantic colors communicate meaning.

## 6.1 Success

```text
Default: #16A34A
Hover:   #15803D
Soft:    #DCFCE7
Text:    #166534
```

Use for:

* Approved
* Active
* Completed
* Verified
* Paid
* Successful
* Activated

Examples:

```text
Approve
Activate
Mark Paid
Verify
Complete
```

---

## 6.2 Warning

```text
Default: #D97706
Hover:   #B45309
Soft:    #FEF3C7
Text:    #92400E
```

Use for:

* Pending review
* Caution
* Suspension
* Temporary state
* Actions requiring attention

Examples:

```text
Suspend
Reopen
Review
Mark for Review
```

Do not use warning for ordinary secondary actions.

---

## 6.3 Destructive / Danger

```text
Default: #DC2626
Hover:   #B91C1C
Soft:    #FEE2E2
Text:    #991B1B
```

Use only for destructive or potentially irreversible actions.

Examples:

```text
Delete
Remove
Revoke
Permanently Delete
Cancel Enrollment
```

Do not use red simply because an action is important.

---

## 6.4 Information

```text
Default: #0284C7
Hover:   #0369A1
Soft:    #E0F2FE
Text:    #075985
```

Use for:

* Informational actions
* Information messages
* Reports
* Helpful contextual actions

Examples:

```text
View Report
View Notice
Learn More
Details
```

Do not overuse blue informational buttons.

---

# 7. Neutral Colors

```text
Background:
#F8FAFC

Surface:
#FFFFFF

Border:
#E2E8F0

Border Strong:
#CBD5E1

Text:
#0F172A

Secondary Text:
#475569

Muted Text:
#64748B

Subtle Text:
#94A3B8

Secondary Background:
#F1F5F9

Secondary Hover:
#E2E8F0
```

---

# 8. Border Radius

Only use the following radius values.

```text
6px
8px
10px
14px
```

Semantic usage:

| Component       | Radius |
| --------------- | -----: |
| Badge           |    6px |
| Small controls  |    8px |
| Button          |    8px |
| Input           |    8px |
| Select          |    8px |
| Dropdown        |   10px |
| Card            |   10px |
| Dialog          |   14px |
| Large container |   14px |

Do not introduce:

```text
rounded-3xl
rounded-[17px]
rounded-[13px]
rounded-[22px]
```

unless explicitly required by the design system.

---

# 9. Spacing System

Use this spacing scale:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Prefer these values over arbitrary spacing.

### Common usage

```text
4px   → tiny internal gaps
8px   → icon/text gap
12px  → compact spacing
16px  → form fields
20px  → card padding
24px  → section spacing
32px  → page-level spacing
40px  → large separation
48px  → major sections
64px  → exceptional page spacing
```

Avoid arbitrary values such as:

```text
13px
17px
19px
27px
31px
37px
```

unless technically necessary.

---

# 10. Typography

DigiCampus uses a restrained typography hierarchy.

## Page title

```text
24px
font-weight: 600
line-height: 32px
```

Example:

```text
Students
```

---

## Page description

```text
14px
font-weight: 400
color: #64748B
```

Example:

```text
Manage students and enrollment information.
```

---

## Section title

```text
16px
font-weight: 600
```

---

## Body

```text
14px
font-weight: 400
line-height: 20px
```

---

## Table text

```text
13px–14px
```

---

## Metadata

```text
12px
color: #64748B
```

Do not randomly change font sizes between pages.

---

# 11. Button System

Buttons are one of the most important parts of DigiCampus UI consistency.

Every button must use a defined semantic variant.

## Available button variants

```text
primary
secondary
outline
ghost
success
warning
destructive
info
link
```

Soft semantic variants may also be used where appropriate:

```text
soft-primary
soft-success
soft-warning
soft-danger
soft-info
```

---

# 12. Button Variant Rules

## 12.1 Primary

Use for the **main action**.

Examples:

```text
Add Student
Create Course
Save Changes
Publish
Submit
Continue
Create Notice
```

Style:

```text
Background: #4F46E5
Hover: #4338CA
Text: #FFFFFF
```

A page should generally have **one visually dominant primary action**.

Do not make every button primary.

---

# 13. Secondary

Use for important alternative actions.

Examples:

```text
View Details
Manage
Duplicate
Preview
```

Style:

```text
Background: #F1F5F9
Hover: #E2E8F0
Text: #334155
```

---

# 14. Outline

Use for lower-emphasis actions that still need a visible boundary.

Examples:

```text
Filter
Export
Cancel
Reset
Back
```

Style:

```text
Background: #FFFFFF
Border: #CBD5E1
Text: #334155
Hover Background: #F8FAFC
```

---

# 15. Ghost

Use for minimal actions.

Examples:

```text
Edit
View
More
Table actions
Secondary navigation actions
```

Style:

```text
Background: transparent
Text: #475569
Hover Background: #F1F5F9
```

Ghost buttons should not look like primary actions.

---

# 16. Success

Use for positive state-changing actions.

Examples:

```text
Approve
Activate
Verify
Mark Paid
Complete
```

Style:

```text
Background: #16A34A
Hover: #15803D
Text: #FFFFFF
```

Do not use success for ordinary actions such as:

```text
View
Edit
Export
Filter
```

---

# 17. Warning

Use for cautionary actions.

Examples:

```text
Suspend
Reopen
Review
Mark for Review
```

Style:

```text
Background: #D97706
Hover: #B45309
Text: #FFFFFF
```

---

# 18. Destructive

Use for destructive actions.

Examples:

```text
Delete
Remove
Revoke
Permanently Delete
Cancel Enrollment
```

Style:

```text
Background: #DC2626
Hover: #B91C1C
Text: #FFFFFF
```

Never use destructive styling for ordinary cancellation.

For example:

```text
Cancel
```

should usually be:

```text
outline
```

while:

```text
Cancel Enrollment Permanently
```

may be:

```text
destructive
```

---

# 19. Info

Use for informational actions.

Examples:

```text
View Report
View Notice
Learn More
View Details
```

Style:

```text
Background: #0284C7
Hover: #0369A1
Text: #FFFFFF
```

Use sparingly.

In many cases, `outline` or `ghost` is preferable.

---

# 20. Link Button

Use when an action behaves like inline navigation.

Examples:

```text
View Details →
See all students
Learn more
```

Style:

```text
Background: transparent
Color: #4F46E5
```

Avoid turning normal buttons into link buttons simply to save space.

---

# 21. Button Sizes

All button variants must support consistent sizes.

```text
xs
sm
default
lg
icon
```

Recommended dimensions:

| Size    |    Height |
| ------- | --------: |
| XS      |      28px |
| SM      |      32px |
| Default |      36px |
| LG      |      40px |
| Icon    | 32 × 32px |

Default button size:

```text
height: 36px
```

This is the standard DigiCampus button height.

Do not create page-specific button heights.

---

# 22. Button Radius

All normal buttons:

```text
border-radius: 8px
```

Do not use:

```text
rounded-full
rounded-xl
rounded-2xl
```

for normal DigiCampus buttons.

Pill buttons should only be used for badges or explicitly approved special UI.

---

# 23. Button Typography

Default:

```text
font-size: 14px
font-weight: 500
```

Small:

```text
font-size: 13px
```

Do not use bold `700` buttons by default.

---

# 24. Button Icons

Use Lucide icons.

Default icon size:

```text
16px
```

Icon/text gap:

```text
8px
```

Examples:

```tsx
<Button>
  <Plus className="size-4" />
  Add Student
</Button>
```

Use icons consistently.

Do not mix:

* Lucide
* Font Awesome
* Heroicons
* emoji
* random SVG icon sets

within the same interface.

---

# 25. Icon-only Buttons

Default:

```text
32 × 32px
```

Use for:

```text
Edit
Delete
More
Close
Search
Settings
```

Always provide an accessible label.

Example:

```tsx
<Button size="icon" aria-label="Edit student">
  <Pencil />
</Button>
```

Never create an icon-only button with no accessible meaning.

---

# 26. Button Loading State

Loading buttons must preserve their dimensions.

Bad:

```text
Save
```

changing into a tiny spinner and shrinking.

Good:

```text
[ spinner ] Saving...
```

The button should maintain approximately the same width and height.

Example:

```tsx
<Button disabled>
  <Loader2 className="size-4 animate-spin" />
  Saving...
</Button>
```

Do not create a different loading design on individual pages.

---

# 27. Disabled Buttons

Disabled buttons should:

```text
opacity: approximately 0.45–0.5
cursor: not-allowed
```

Do not change disabled buttons into a completely different color scheme.

The underlying variant should remain recognizable.

---

# 28. Button Hierarchy

A typical DigiCampus page should follow:

```text
Primary       → main action
Secondary     → important alternative
Outline       → utility action
Ghost         → low-emphasis action
Success       → positive state change
Warning       → cautionary state change
Destructive   → destructive state change
```

Example:

```text
+ Add Student     [Primary]

Export            [Outline]
Filter            [Outline]

Edit              [Ghost]

Approve           [Success]

Suspend           [Warning]

Delete            [Destructive]
```

---

# 29. Never Use Arbitrary Button Colors

Do not create:

```tsx
<Button className="bg-blue-500">
```

if the action is already represented by a standard variant.

Do not create:

```tsx
<Button className="bg-purple-600">
```

for a particular page.

Do not create:

```tsx
<Button className="bg-emerald-500">
```

because the developer personally prefers green.

Instead:

```tsx
<Button variant="primary">
```

or:

```tsx
<Button variant="success">
```

---

# 30. Badge System

Badges must also be semantic.

Standard badge colors:

```text
success
warning
destructive
info
neutral
primary
```

## Success

```text
Background: #DCFCE7
Text: #166534
```

Examples:

```text
Active
Approved
Published
Completed
Paid
```

---

## Warning

```text
Background: #FEF3C7
Text: #92400E
```

Examples:

```text
Pending
Review
Expiring
```

---

## Destructive

```text
Background: #FEE2E2
Text: #991B1B
```

Examples:

```text
Rejected
Failed
Cancelled
Suspended
```

---

## Info

```text
Background: #E0F2FE
Text: #075985
```

---

## Neutral

```text
Background: #F1F5F9
Text: #475569
```

Examples:

```text
Draft
Archived
Inactive
```

---

## Primary

```text
Background: #EEF2FF
Text: #3730A3
```

Examples:

```text
Featured
Current
Selected
```

---

# 31. Badge Dimensions

Default:

```text
height: 24px
padding: 0 8px
border-radius: 6px
font-size: 12px
font-weight: 500
```

Do not create a different badge size for every module.

---

# 32. Status Mapping

Use consistent status-to-color mapping.

| Status       | Variant           |
| ------------ | ----------------- |
| Active       | Success           |
| Approved     | Success           |
| Published    | Success / Primary |
| Completed    | Success           |
| Paid         | Success           |
| Pending      | Warning           |
| Under Review | Warning           |
| Draft        | Neutral           |
| Inactive     | Neutral           |
| Archived     | Neutral           |
| Rejected     | Destructive       |
| Failed       | Destructive       |
| Cancelled    | Destructive       |
| Suspended    | Destructive       |
| Information  | Info              |

If a status has a semantic meaning, use its established color.

Do not choose a new color because it looks better on one page.

---

# 33. Cards

Default card:

```text
Background: #FFFFFF
Border: 1px solid #E2E8F0
Radius: 10px
Shadow: minimal
```

Avoid heavy shadows.

Do not make every section a card.

Cards should be used for:

* Statistics
* Forms
* Data groups
* Dashboard widgets
* Important summaries
* Related information

---

# 34. Card Padding

Default:

```text
20px
```

Compact cards:

```text
16px
```

Large cards:

```text
24px
```

Prefer the spacing scale.

---

# 35. Dashboard Statistic Cards

All statistic cards should share the same visual structure.

Example:

```text
┌──────────────────────────────┐
│ Total Students           ◉   │
│                              │
│ 12,450                       │
│ ↑ 8.2% this month            │
└──────────────────────────────┘
```

Do not create:

* one gradient card
* one dark card
* one colorful card
* one huge shadow card

for the same dashboard.

The cards should feel like one family.

---

# 36. Inputs

Standard input:

```text
Height: 36px
Radius: 8px
Border: #CBD5E1
Background: #FFFFFF
Font size: 14px
```

Focus:

```text
Border: #4F46E5
Focus ring: low-opacity primary
```

Do not create different input heights across modules.

---

# 37. Selects

Select triggers must visually match inputs.

```text
Height: 36px
Radius: 8px
Border: #CBD5E1
Font: 14px
```

A Select should not look like a different component family from Input.

---

# 38. Search Inputs

Search fields should use the same input system.

Recommended:

```text
36px height
8px radius
14px text
16px icon
```

Do not create a custom search input for every page.

---

# 39. Forms

Standard structure:

```text
Label
Input
Helper text / error
```

Example:

```text
Student Name

[ Enter student name              ]

Enter the student's official name.
```

Spacing:

```text
Label → input: 6px
Field → field: 16px
```

---

# 40. Tables

Tables are a core DigiCampus component.

Header:

```text
Background: #F8FAFC
Text: #475569
Font size: 12px
Font weight: 600
```

Rows:

```text
Minimum height: approximately 52px
Border bottom: #E2E8F0
```

Hover:

```text
#F8FAFC
```

Avoid vertical borders between every cell.

---

# 41. Table Actions

Use a consistent action pattern.

Preferred:

```text
[ ⋮ ]
```

or:

```text
[ Edit ] [ Delete ]
```

For compact tables, prefer an overflow menu.

Example:

```text
⋮
├── View
├── Edit
├── Duplicate
└── Delete
```

Delete should use destructive styling.

---

# 42. Page Header

Every major page should use a consistent header.

Recommended:

```text
Students
Manage students and enrollment information.

                         + Add Student
```

Structure:

```text
Page title
Page description
Primary action
```

Do not create completely different page-header layouts for each module.

---

# 43. Page Padding

Desktop:

```text
24px–32px
```

Preferred:

```text
28px
```

Mobile:

```text
16px–20px
```

---

# 44. Sidebar

The sidebar should be quiet and structured.

Active item:

```text
Background: #EEF2FF
Text: #4F46E5
Font weight: 600
```

Inactive item:

```text
Text: #475569
```

Section labels:

```text
Font size: 10–11px
Font weight: 600–700
Color: #94A3B8
Uppercase
```

Do not use a different active color for each module.

---

# 45. Navigation Icons

Use Lucide icons.

Standard:

```text
Navigation: 18px
```

Do not use different icon sizes randomly.

---

# 46. Dialogs

Dialog radius:

```text
14px
```

Recommended widths:

```text
Small: 400px
Normal: 500–600px
Large: 700–800px
```

Structure:

```text
Title
Description

Content

Footer
Cancel     Primary/Destructive
```

---

# 47. Dialog Buttons

Normal dialog:

```text
Cancel      [Outline]
Save        [Primary]
```

Destructive dialog:

```text
Cancel      [Outline]
Delete      [Destructive]
```

Do not make Cancel destructive unless cancellation itself is destructive.

---

# 48. Alerts

Only use four semantic alert types:

```text
Info
Success
Warning
Error
```

Do not create custom alert colors.

---

# 49. Empty States

Standard structure:

```text
Icon

No students found

There are no students matching your
current filters.

[ + Add Student ]
```

Keep empty states consistent.

---

# 50. Loading States

Use consistent loading patterns.

Supported patterns:

```text
Button spinner
Skeleton
Table skeleton
Card skeleton
Page skeleton
```

Avoid full-screen spinners unless the entire application must wait.

---

# 51. Icons

Use **Lucide** as the standard icon library.

Recommended sizes:

```text
16px → buttons
18px → navigation
20px → important controls
24px → dashboard icons
```

Do not use emoji as functional UI icons.

Bad:

```text
🗑 Delete
📚 Courses
👨‍🎓 Students
```

Prefer:

```text
Trash2
BookOpen
GraduationCap
```

---

# 52. Shadows

DigiCampus should use minimal shadows.

Primary visual separation should come from:

```text
Borders
Background contrast
Spacing
```

Avoid:

```text
shadow-2xl
shadow-[...]
large glowing shadows
```

unless explicitly approved.

---

# 53. Gradients

Gradients are **not part of the default DigiCampus admin UI system**.

Do not add:

```text
bg-gradient-to-r
bg-gradient-to-br
```

to normal cards, buttons, forms, tables, or navigation.

Gradients may only be introduced for an explicitly approved special marketing/hero section.

---

# 54. Animation

Animations should be subtle.

Use animation for:

* Dialog transitions
* Dropdown transitions
* Loading
* Small hover transitions
* Expand/collapse

Avoid:

* bouncing buttons
* excessive page animations
* decorative motion
* constant movement
* large scale animations

The admin interface should feel stable and professional.

---

# 55. Responsive Design

All components must remain usable on:

* Desktop
* Laptop
* Tablet
* Mobile

Do not introduce horizontal overflow unnecessarily.

Tables may use horizontal scrolling when required.

Sidebar may collapse on smaller screens.

---

# 56. Accessibility

Every interactive component must remain accessible.

Requirements:

* Buttons must have accessible names.
* Icon-only buttons must have `aria-label`.
* Inputs must have labels.
* Focus states must remain visible.
* Disabled state must be understandable.
* Do not rely only on color to communicate meaning.
* Destructive actions should have clear labels.
* Dialogs must have accessible titles.

Do not remove focus outlines without replacing them with an accessible focus state.

---

# 57. Component Reuse Rule

Before creating a component, ask:

> Does this component already exist?

Search:

```text
components/ui
components/digicampus
```

and the project component structure.

If an existing component can be reused, reuse it.

If an existing shared component is almost correct, modify it at the shared level.

Do not create:

```text
StudentButton
TeacherButton
NoticeButton
CourseButton
AdmissionButton
```

when a normal DigiCampus `Button` can solve the problem.

---

# 58. Shared Component First

Bad approach:

```tsx
<Button className="h-10 rounded-xl bg-green-600">
  Approve
</Button>
```

Better:

```tsx
<Button variant="success">
  Approve
</Button>
```

If `success` doesn't exist, add the variant to the shared Button component.

Do not solve a global design problem locally.

---

# 59. Tailwind Usage

Tailwind is allowed and encouraged, but it must respect the design system.

Good:

```tsx
className="gap-2"
```

Good:

```tsx
className="p-4"
```

Good:

```tsx
className="text-sm"
```

Good:

```tsx
className="rounded-lg"
```

Bad:

```tsx
className="rounded-[13px]"
```

Bad:

```tsx
className="h-[37px]"
```

Bad:

```tsx
className="bg-[#7234A8]"
```

Bad:

```tsx
className="shadow-[0_10px_50px_rgba(...)]"
```

unless explicitly required by the design system.

---

# 60. Avoid Page-Specific Styling

Do not do:

```tsx
// Student page
<Button className="bg-indigo-600">

// Teacher page
<Button className="bg-blue-600">

// Notice page
<Button className="bg-purple-600">
```

Instead:

```tsx
<Button variant="primary">
```

Everywhere.

---

# 61. Semantic Meaning Over Appearance

Always choose a component variant based on **what the action means**.

Example:

```text
Add Student       → Primary
Export             → Outline
Edit               → Ghost
Approve            → Success
Suspend            → Warning
Delete             → Destructive
View Report        → Info / Outline
Learn More         → Link
```

Do not choose a variant because a color "looks nice."

---

# 62. Primary Action Rule

Most interfaces should have one clear dominant action.

Example:

```text
Students

[Filter] [Export] [ + Add Student ]
```

Here:

```text
Filter        → Outline
Export        → Outline
Add Student   → Primary
```

Do not make all three primary.

---

# 63. Destructive Action Rule

Destructive actions should always be visually distinguishable.

Example:

```text
Edit          → Ghost
Duplicate     → Ghost
Delete        → Destructive
```

For destructive dialogs:

```text
Cancel        → Outline
Delete        → Destructive
```

---

# 64. Success Button Rule

Success buttons are for **state-changing positive actions**, not general positive-looking actions.

Correct:

```text
Approve
Activate
Verify
Mark Paid
```

Incorrect:

```text
View
Edit
Search
Export
```

Those should normally use:

```text
Ghost
Outline
Primary
```

depending on hierarchy.

---

# 65. Warning Button Rule

Warning means:

> "This action deserves caution."

Use:

```text
Suspend
Reopen
Review
```

Do not use warning for:

```text
Save
Add
Edit
Export
```

---

# 66. Information Button Rule

Info buttons should be used sparingly.

Prefer:

```text
View Report
View Notice
Details
```

For many ordinary navigation actions, use:

```text
Outline
Ghost
Link
```

instead.

---

# 67. Visual Density

DigiCampus is an admin application.

Do not make every component oversized.

Preferred:

```text
Button: 36px
Input: 36px
Badge: 24px
Icon button: 32px
Table row: ~52px
Body text: 14px
```

This provides a practical information density.

---

# 68. Do Not Over-Card the Interface

Avoid:

```text
Card
  Card
    Card
      Card
```

Use cards only when they provide meaningful grouping.

A page does not need a card simply because there is a section.

---

# 69. Do Not Overuse Colors

The recommended hierarchy is:

```text
Neutral → most UI
Primary → important interaction
Semantic colors → meaningful states
```

Not:

```text
Every component → different color
```

Color should communicate meaning.

---

# 70. Do Not Introduce New Design Patterns Casually

Before introducing a new:

* Button
* Badge
* Alert
* Card
* Modal
* Table
* Form layout
* Navigation style
* Status color

check this document and the existing component library.

If the new pattern is genuinely necessary, update the design system rather than silently introducing it.

---

# 71. AI Agent Decision Process

When an AI agent receives a UI task, it should follow this process.

### Step 1 — Identify the component

Example:

```text
"Add a delete button"
```

Component:

```text
Button
```

### Step 2 — Determine semantic meaning

Delete is destructive.

Therefore:

```text
variant="destructive"
```

### Step 3 — Determine size

Normal page action:

```text
default
```

Table action:

```text
sm
```

Icon-only:

```text
icon
```

### Step 4 — Reuse shared component

Do not create a custom button.

### Step 5 — Check consistency

Verify:

* Height
* Radius
* Color
* Icon
* Typography
* Spacing

match the design system.

---

# 72. Examples

## Add Student

```tsx
<Button>
  <Plus className="size-4" />
  Add Student
</Button>
```

---

## Export

```tsx
<Button variant="outline">
  <Download className="size-4" />
  Export
</Button>
```

---

## Edit

```tsx
<Button variant="ghost">
  <Pencil className="size-4" />
  Edit
</Button>
```

---

## Approve

```tsx
<Button variant="success">
  <Check className="size-4" />
  Approve
</Button>
```

---

## Suspend

```tsx
<Button variant="warning">
  <Pause className="size-4" />
  Suspend
</Button>
```

---

## Delete

```tsx
<Button variant="destructive">
  <Trash2 className="size-4" />
  Delete
</Button>
```

---

## View Details

```tsx
<Button variant="outline">
  View Details
</Button>
```

or, for low emphasis:

```tsx
<Button variant="link">
  View Details →
</Button>
```

---

# 73. Recommended Component Architecture

Use the existing shadcn architecture as the foundation.

Recommended structure:

```text
components/
├── ui/
│   ├── button.tsx
│   ├── badge.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   ├── alert.tsx
│   ├── dropdown-menu.tsx
│   └── ...
│
└── digicampus/
    ├── page-header.tsx
    ├── status-badge.tsx
    ├── data-table.tsx
    ├── empty-state.tsx
    ├── confirm-dialog.tsx
    ├── stat-card.tsx
    └── form-section.tsx
```

Do not duplicate shadcn components unnecessarily.

---

# 74. Global Button Component

The global Button component should support:

```text
primary
secondary
outline
ghost
success
warning
destructive
info
link
```

and:

```text
xs
sm
default
lg
icon
```

The exact implementation may use shadcn's `cva` pattern.

The important requirement is that all pages consume the same variants.

---

# 75. Recommended Button API

Example:

```tsx
<Button variant="primary">
  Add Student
</Button>
```

```tsx
<Button variant="success">
  Approve
</Button>
```

```tsx
<Button variant="warning">
  Suspend
</Button>
```

```tsx
<Button variant="destructive">
  Delete
</Button>
```

```tsx
<Button variant="outline">
  Export
</Button>
```

```tsx
<Button variant="ghost">
  Edit
</Button>
```

```tsx
<Button size="sm">
  View
</Button>
```

```tsx
<Button size="icon" aria-label="Edit student">
  <Pencil />
</Button>
```

---

# 76. Do Not Break Existing Functionality

DigiCampus is already in production.

When standardizing UI:

**Do not change:**

* API behavior
* Database logic
* Authentication
* Authorization
* Form submission logic
* Validation
* Routing
* Server actions
* Data fetching
* Business logic

unless the task explicitly requests it.

UI standardization should primarily affect:

```text
visual appearance
component structure
styling
spacing
accessibility
```

---

# 77. Production Safety Rule

Before modifying a shared component:

1. Search for all usages.
2. Determine whether the change affects existing pages.
3. Preserve existing props.
4. Preserve existing variants unless intentionally replacing them.
5. Avoid breaking API changes.
6. Test representative pages.
7. Only then introduce the global change.

A shared component change can affect the entire production system.

---

# 78. When a New Variant Is Necessary

A new variant should only be introduced when an existing variant cannot semantically represent the action.

Before creating a new variant, ask:

```text
Can primary represent it?
Can secondary represent it?
Can outline represent it?
Can ghost represent it?
Can success represent it?
Can warning represent it?
Can destructive represent it?
Can info represent it?
Can link represent it?
```

If yes, **do not create a new variant**.

---

# 79. Design System Priority

When visual decisions conflict, follow this priority:

```text
1. Accessibility
2. Existing DigiCampus design system
3. Semantic meaning
4. Component consistency
5. Responsive behavior
6. Visual preference
```

Personal aesthetic preference should never override the established design system.

---

# 80. Final AI Agent Rule

Before completing any UI task, the AI agent must ask internally:

> **"Am I introducing a new visual pattern that already exists in DigiCampus?"**

If yes:

**Reuse the existing pattern.**

If no:

**Create the smallest reusable extension necessary and keep it consistent with the existing tokens.**

The goal is not to make every page individually beautiful.

The goal is to make **the entire DigiCampus product look like one coherent, professionally designed system.**

---

# DigiCampus UI Quick Reference

```text
PRIMARY
#4F46E5
#4338CA
#EEF2FF

SUCCESS
#16A34A
#15803D
#DCFCE7

WARNING
#D97706
#B45309
#FEF3C7

DESTRUCTIVE
#DC2626
#B91C1C
#FEE2E2

INFO
#0284C7
#0369A1
#E0F2FE

BACKGROUND
#F8FAFC

SURFACE
#FFFFFF

BORDER
#E2E8F0

BORDER STRONG
#CBD5E1

TEXT
#0F172A

MUTED
#64748B

SUBTLE
#94A3B8

BUTTON
36px height
8px radius
14px font
500 weight

INPUT
36px height
8px radius

BADGE
24px height
6px radius
12px font

ICON BUTTON
32 × 32px

DEFAULT ICON
16px

NAV ICON
18px

PAGE TITLE
24px / 600

SECTION TITLE
16px / 600

BODY
14px / 400

SPACING
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64

RADIUS
6 / 8 / 10 / 14

ICON LIBRARY
Lucide

SHADOW
Minimal

GRADIENT
Not allowed by default
```

---

# DigiCampus Application Shell Specification

## 1. Overall Layout
- **Sidebar Width**: 248px
- **Navbar Height**: 64px
- **Page Padding**: 28px (`p-7`)
- **Main Background**: `#F8FAFC` (Slate-50 for ALL pages)
- **Cards / Surfaces**: `#FFFFFF` (White) with 1px border `#E2E8F0` and `rounded-lg` (8px) radius

## 2. Quiet White Sidebar (`#FFFFFF`)
- **Background**: `#FFFFFF` (White)
- **Border**: `1px solid #E2E8F0` (Right border)
- **Shadow**: None
- **Header**: 64px height (`h-16`), brand icon `#4F46E5`, title `DigiCampus` `#0F172A`
- **Nav Item**: Height 36px (`h-9`), radius 8px (`rounded-lg`), text `#475569`, icon 18px, gap 10px
- **Hover Item**: Background `#F8FAFC`, text `#0F172A`
- **Active Item (Soft Active)**: Background `#EEF2FF`, text `#4338CA`, icon `#4F46E5`, font-weight 600
- **Section Labels**: 10px–11px font size, font-weight 600, color `#94A3B8`, uppercase

## 3. Quiet White Navbar (`#FFFFFF`)
- **Height**: 64px (`h-16`)
- **Background**: `#FFFFFF` (White)
- **Border**: `1px solid #E2E8F0` (Bottom border)
- **Shadow**: None
- **Breadcrumbs**: Inactive `#94A3B8`, Current `#0F172A` (font-weight 500, size 13px)
- **Icon Buttons**: 32px × 32px, text `#64748B`, hover background `#F1F5F9`
- **User Avatar**: 32px × 32px (`rounded-full`), background `#E2E8F0`

## 4. Main Content Container
- **Main Background**: `#F8FAFC`
- **Max Width**: 1440px (`max-w-[1440px] mx-auto`)
- **Padding**: 28px (`p-7`)
- **Page Header**: Title 24px font-weight 600 (`#0F172A`), Description 14px (`#64748B`), 24px gap to content

## 5. DigiCampus Input Colors Specification Matrix

| State | Border | Background | Focus / State Ring |
| :--- | :--- | :--- | :--- |
| **Default** | `#CBD5E1` | `#FFFFFF` | — |
| **Hover** | `#818CF8` | `#FFFFFF` | — |
| **Focus** | `#4F46E5` | `#FFFFFF` | `rgba(79, 70, 229, 0.12)` |
| **Disabled** | `#E2E8F0` | `#F1F5F9` | — |
| **Error** | `#DC2626` | `#FFFFFF` | `rgba(220, 38, 38, 0.10)` |
| **Success** | `#16A34A` | `#FFFFFF` | `rgba(22, 163, 74, 0.10)` |

**This document should be treated as the UI contract for DigiCampus.** Any future UI implementation should follow it unless a specific task explicitly requests a change to the design system.
