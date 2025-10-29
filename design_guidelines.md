# Design Guidelines: Red Web Proxy

## Design Approach

**Selected Approach**: Hybrid - Google's clean search interface structure with cyberpunk-inspired glowing aesthetic

**Key References**: 
- Google Search (clean, focused search experience)
- GitHub Dark Theme (dark UI patterns and contrast)
- Cyberpunk UI patterns (glowing accents and neon effects)

**Design Principles**:
- Clarity and speed: Primary focus on search functionality
- Visual drama through lighting effects (respecting user's red/black glowing theme request)
- Immediate access to core features
- Clean information hierarchy

---

## Core Design Elements

### A. Typography

**Primary Font**: Inter or Outfit (Google Fonts)
- Display/Headers: 700 weight, tracking tight
- Body: 400-500 weight
- UI Elements: 500-600 weight
- Code/URLs: JetBrains Mono 400 weight

**Type Scale**:
- Hero Search: text-5xl to text-6xl
- Section Headers: text-2xl to text-3xl  
- Body Text: text-base
- Small UI: text-sm
- Micro Labels: text-xs

### B. Layout System

**Spacing Primitives**: Tailwind units 2, 4, 8, 12, 16, 24
- Component padding: p-4, p-8
- Section spacing: py-12, py-16, py-24
- Element gaps: gap-2, gap-4, gap-8
- Margins: m-2, m-4, m-8

**Grid Structure**:
- Container: max-w-7xl with px-4 padding
- Search area: max-w-3xl centered
- Settings panels: max-w-5xl
- Quick links grid: grid-cols-2 md:grid-cols-4 lg:grid-cols-6

---

## Component Library

### 1. Homepage Layout

**Hero Search Section** (80vh):
- Centered vertically and horizontally
- Logo/wordmark at top (text-6xl font-bold with subtle glow effect)
- Large search bar (h-16) with rounded-2xl corners
- Search bar contains: icon (w-6 h-6), input field, engine selector dropdown
- Subtle shadow and border treatment for depth
- Quick access buttons below search (gap-3)

**Quick Links Grid** (Below hero):
- 2-4-6 column responsive grid
- Card-based layout with rounded-xl borders
- Each card: icon + label, h-24, interactive states
- Popular sites and recent visits sections
- Subtle backdrop blur on hover

### 2. Proxy View (Active Session)

**Top Navigation Bar** (h-16, sticky):
- Logo/home button (left, w-32)
- URL bar (center, flex-1, max-w-4xl): rounded-full, px-6, displays proxied URL
- Controls cluster (right): refresh, back, forward, settings (each w-10 h-10)
- All nav elements have rounded-lg interactive states

**Content Area**:
- Full-width iframe container
- Seamless integration, no visible borders
- Loading state with spinner

### 3. Settings Panel

**Overlay Modal** (max-w-4xl):
- Slide-in from right or modal overlay
- Header: title (text-3xl) + close button (top-right)
- Tabbed navigation or sectioned scrolling layout
- Sections with py-8 spacing between them

**Settings Sections**:

*Proxy Engine Selection*:
- Radio group with 4 options (Scramjet, Ultraviolet, Eclipse, Sandstone)
- Each option: rounded-lg border, p-4, with icon + name + description
- Selected state with emphasized border and glow
- Default indicator for Scramjet

*Transport Method*:
- Radio group (LibCurl, Eproxy)
- Similar treatment to proxy engines
- Smaller cards (p-3)

*Search Engine*:
- Dropdown or card selection
- Options: Google, Bing, DuckDuckGo, Brave
- Engine logos with text labels
- Grid layout: grid-cols-2 gap-4

*Theme Selector*:
- Theme preview cards in grid-cols-2 md:grid-cols-3
- Each preview: rounded-xl, p-4, shows representative colors/patterns
- Themes: Red (default with glowing effects), Blue, Purple, Green, Monochrome
- Active theme has emphasized border

*Additional Settings*:
- Toggle switches for preferences (rounded-full)
- Each setting row: label (flex-1) + control (w-12 h-6)
- Grouped logically with dividers (border-t, my-6)

### 4. Core UI Elements

**Buttons**:
- Primary: px-6 py-3, rounded-lg, font-medium
- Secondary: px-4 py-2, rounded-lg, border variant
- Icon buttons: w-10 h-10, rounded-lg, centered icon
- Blurred backgrounds when over images/complex backgrounds

**Search Bar**:
- Height: h-14 to h-16
- Padding: pl-6 pr-4
- Border: rounded-2xl or rounded-full
- Left icon, center input, right dropdown
- Focus states with enhanced glow

**Cards**:
- Border: rounded-xl to rounded-2xl
- Padding: p-4 to p-6
- Backdrop blur for layered effects
- Subtle borders and shadows

**Dropdowns/Selects**:
- Rounded-lg borders
- Padding: px-4 py-2
- Chevron icon right-aligned
- Dropdown menus: rounded-xl, p-2, backdrop blur

**Toggle Switches**:
- Width: w-11 to w-12
- Height: h-6
- Rounded-full
- Sliding indicator with smooth transition

### 5. Special Effects

**Glow Effects**:
- Applied to: active search bar, selected settings, primary buttons, logo
- Implementation: box-shadow with blur and spread
- Intensity: subtle on inactive, prominent on active/hover
- Pulsing animation on key interactive elements (use sparingly)

**Backdrop Effects**:
- Modals/panels: backdrop-blur-xl
- Overlays: semi-transparent with blur
- Cards on complex backgrounds: backdrop-blur-sm

**Transitions**:
- Duration: 150ms to 300ms
- Ease: ease-in-out
- Properties: transform, opacity, box-shadow
- Page transitions: slide/fade (300ms)

---

## Layout Specifications

### Homepage Structure:
1. Full-height hero with centered search (80vh)
2. Quick links grid section (py-16)
3. Recently visited section (py-12)
4. Footer with minimal info (py-8)

### Responsive Breakpoints:
- Mobile: Single column, h-12 search bar, stacked navigation
- Tablet (md:): 2-column grids, h-14 search bar
- Desktop (lg:): Full multi-column grids, h-16 search bar

### Z-Index Hierarchy:
- Modals/Settings: z-50
- Top navigation: z-40  
- Dropdowns: z-30
- Content: z-10
- Background effects: z-0

---

## Images

**Logo/Branding**: 
- Wordmark logo with subtle glow effect in hero section
- Favicon-sized icon in navigation bar

**Quick Link Icons**:
- Use Heroicons via CDN for all UI icons
- Service logos from public CDN (SimpleIcons or similar)
- Icon size: w-8 h-8 to w-12 h-12 depending on context

No large hero image - the design centers on the functional search interface with visual drama coming from the glowing theme treatment and clean layout.

---

## Accessibility & Polish

- Maintain 4.5:1 contrast ratios for text
- Focus states: visible outline with offset
- Keyboard navigation: tab order follows visual hierarchy
- ARIA labels for all interactive elements
- Smooth scrolling behavior
- Loading states for all async operations
- Error states with clear messaging