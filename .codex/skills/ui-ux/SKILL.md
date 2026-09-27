---
name: ui-ux
description: Design, implement, or review Snapora's public photography experience, mobile booking interface, and practical admin UI. Focus on human-crafted editorial design, photography-first presentation, natural interactions, accessibility, and production-ready usability.
---

# UI/UX Design Skill — Snapora

## Core Design Philosophy

Create a professional photography platform that feels **human-designed, emotional, and editorial**.

The interface should communicate:

- Photography quality
- Trust
- Creativity
- Premium service
- Simple booking experience

The design must NOT look like an AI-generated website or a generic SaaS product.

Avoid common AI design patterns:

- Excessive gradients
- Glassmorphism everywhere
- Neon colors
- Floating abstract shapes
- Overuse of rounded cards
- Excessive shadows
- Template-like layouts
- Generic startup landing pages
- Unnecessary animations
- Decorative UI elements that compete with photography

Photography is the hero.
The UI exists to support the images and booking experience.

---

# Before Implementation

Before creating or modifying UI:

- Read the relevant PRD requirements.
- Read responsive requirements.
- Read visual requirements.
- Read `AGENTS.md`.
- Inspect existing:
  - Design tokens
  - Components
  - Typography
  - Spacing rules
  - Existing patterns

Reuse existing components and styles whenever possible.

Create new components only when:

- A pattern is repeated.
- A component represents a stable reusable behavior.
- A shared visual primitive is needed.

Do not build a complete design system before the product requires it.

---

# Brand Visual Direction

## Color Palette

Snapora uses a warm sunset-inspired photography palette.

| Color | Hex | Usage |
|---|---|---|
| Dark Brown | #493129 | Primary text, navigation, strong contrast |
| Dusty Purple | #8B597B | Secondary accent, selected states |
| Soft Coral Pink | #EFA3A0 | Primary CTA, important actions |
| Peach Beige | #F8DEC7 | Soft sections, backgrounds |
| Light Cream | #FFF0E4 | Main background |

---

## Color Usage Rules

Hierarchy:

1. Dark Brown
   - Main text
   - Headings
   - Navigation
   - Important information

2. Soft Coral Pink
   - Booking buttons
   - Primary actions
   - Important highlights

3. Dusty Purple
   - Secondary actions
   - Active states
   - Supporting emphasis

4. Peach Beige / Light Cream
   - Background
   - Section separation
   - Atmosphere

Rules:

- Do not use all colors equally.
- Maintain visual balance.
- Avoid strong gradients.
- If gradients are used, they must be subtle and natural.
- Never use colorful backgrounds that distract from photography.

---

# Typography

Typography should feel like a photography magazine, not a software dashboard.

Avoid typical AI-generated font combinations.

## Recommended Style

### Headings

Use elegant editorial fonts:

Examples:

- Playfair Display
- Cormorant Garamond
- Libre Baskerville
- DM Serif Display

### Body Text

Use clean readable fonts:

Examples:

- Inter
- Source Sans 3
- IBM Plex Sans
- Noto Sans

---

## Typography Rules

- Avoid excessive bold text.
- Use generous line spacing.
- Maintain clear hierarchy.
- Do not use futuristic or trendy AI-style fonts.
- Prioritize readability and elegance.

---

# Layout Philosophy

Photography websites require breathing space.

Prioritize:

- Large images
- Clean sections
- Strong alignment
- Editorial layouts
- Generous whitespace

Avoid:

- Crowded interfaces
- Too many cards
- Dense dashboards
- Excessive UI decoration

Empty space is part of the design.

---

# Public Website Experience

## Priority Order

The website hierarchy:

1. Booking
2. Portfolio
3. Brand story
4. Additional information

The first impression should answer:

- What photography service is offered?
- Why should customers trust this brand?
- How can they book?

---

# Photography Presentation

Rules:

- Use large, high-quality images.
- Maintain original image ratio.
- Prevent layout shifts.
- Optimize responsive images.
- Use meaningful alt text.
- Avoid unnecessary overlays.

Text over images:

Only use when:

- Contrast is sufficient.
- The message is important.
- The image remains the focus.

Do not place excessive text on photography.

---

# Motion Design

Motion should improve usability, not decorate the website.

Allowed:

- Smooth page transitions
- Image loading transitions
- Booking step transitions
- Small interaction feedback

Avoid:

- Floating animations
- Constant movement
- Excessive parallax
- Attention-seeking effects

Support reduced motion preferences.

---

# Booking Experience

## Mobile First

The booking flow must be designed for mobile users first.

Requirements:

- Short steps
- Large touch targets
- Clear progress
- Easy navigation
- Visible selected states
- Simple review screen

---

## Booking Flow

Recommended steps:

1. Select photography package
2. Select date
3. Select available time
4. Enter customer details
5. Review booking
6. Confirm

---

## Selection States

Users must clearly understand:

- What they selected
- What is available
- What is unavailable

Selected states should use:

- Border
- Background change
- Check indicator
- Clear visual feedback

---

# Availability and Booking Errors

Unavailable options:

- Disable visually.
- Explain clearly.

Bad:

"Error: Slot unavailable"

Good:

"This time slot is no longer available. Please select another available time."

Users should understand that availability may change because of server-side updates.

---

# Authentication UX

## Real-Time Validation

Do not wait until form submission.

Show validation while users type.

Example:

Password:

Before:

○ Minimum 8 characters  
○ Contains capital letter  
○ Contains number  

After:

✓ Minimum 8 characters  
✓ Contains capital letter  
○ Contains number  

---

## Validation Principles

Validation should be:

- Visual
- Immediate
- Helpful

Use:

- Check icons
- Progress indicators
- Requirement lists

Avoid:

- Technical explanations
- Developer language

---

## Error Message Rules

Errors must be:

- Human-friendly
- Clear
- Actionable

Bad:

"Invalid credentials"

Better:

"The email or password is incorrect. Please check and try again."

Bad:

"500 Server Error"

Better:

"Something went wrong while completing your request. Please try again."

---

# Confirmation Before Important Actions

Never immediately perform destructive actions.

Ask confirmation before:

- Delete booking
- Delete customer
- Remove portfolio image
- Cancel payment
- Reset important settings

---

## Confirmation Dialog Rules

Do not use browser default alerts.

Use custom confirmation UI.

A confirmation should include:

Title:

"Delete this photo?"

Message:

"This photo will be permanently removed from your portfolio. This action cannot be undone."

Actions:

- Cancel
- Delete Photo

The destructive action should be visually clear.

---

# Admin Dashboard

Admin UI should be practical and efficient.

Priority information:

- Booking status
- Date and time
- Customer
- Package
- Payment status
- Total amount
- Next action

---

Rules:

- Optimize for desktop.
- Maintain mobile usability.
- Make information scannable.
- Avoid unnecessary charts.
- Avoid decorative dashboard elements.

---

# Component Design Rules

Avoid excessive cards.

Prefer:

- Sections
- Lists
- Tables
- Editorial layouts
- Dividers
- Natural grouping

Use cards only when they improve:

- Separation
- Interaction
- Understanding

Do not create card layouts because they are common in AI-generated designs.

---

# Accessibility Requirements

Always include:

- Semantic HTML
- Proper labels
- Keyboard navigation
- Visible focus states
- Sufficient contrast
- Meaningful alt text
- Reduced motion support

Interactive elements must work without a mouse.

---

# Required UI States

Every feature must handle:

## Loading

Show meaningful loading feedback.

## Empty

Explain what is missing and what users can do.

## Success

Confirm completed actions.

## Validation

Explain how users can fix problems.

## Conflict

Explain when server data changed.

## Failure

Provide recovery actions.

Never create:

- Blank screens
- Broken buttons
- Silent failures

---

# Responsive Requirements

Test:

- Mobile phone
- Tablet
- Desktop

Verify:

- Layout
- Images
- Navigation
- Forms
- Booking flow
- Admin actions

---

# Quality Checklist Before Completion

Confirm:

✓ Photography remains the main visual focus  
✓ No generic AI-looking UI patterns  
✓ No unnecessary gradients  
✓ Typography feels editorial  
✓ Colors follow Snapora palette  
✓ Booking is simple and mobile-friendly  
✓ Validation is visual  
✓ Errors are human-friendly  
✓ Important actions require confirmation  
✓ Accessibility requirements are met  
✓ Loading and error states exist  
✓ Layout works on all screen sizes  

---

# Stop Conditions

Stop implementation and request clarification when:

- Required brand assets are missing.
- Placeholder content may be mistaken as approved production content.
- Important business rules are unclear.

Report:

1. Missing asset
2. Missing information
3. Decision required