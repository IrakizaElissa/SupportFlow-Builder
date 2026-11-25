# Design System for SupportFlow Visual Builder

This document defines the comprehensive visual language and design specifications for the SupportFlow Visual Builder application. All UI components, interactions, and visual elements should adhere to these guidelines to ensure consistency and professional appearance.

---

## 1. Canvas Design

The canvas serves as the primary workspace where users visualize and edit their conversation flow.

### Background & Styling
- **Background Color:** `#1a1a2e` (deep navy-black)
- **Grid Pattern:** Subtle dot-grid overlay using CSS `background-image`
  - Grid dots: `#2a2a3e` (slightly lighter than background)
  - Dot size: 2px diameter
  - Grid spacing: 24px × 24px
  - Implementation: `radial-gradient(circle, #2a2a3e 1px, transparent 1px)`
  - Background size: `24px 24px`

### Canvas Dimensions & Behavior
- **Default Canvas Size:** 1200px × 800px (from flow_data.json meta)
- **Viewport:** Scrollable and pannable container
- **Overflow:** Auto-scroll with custom styled scrollbars
- **Scrollbar Styling:**
  - Track: `#16213e`
  - Thumb: `#0f3460`
  - Thumb hover: `#2196F3`
  - Width: 8px

### Canvas Interactions
- **Pan Mode:** Click and drag on empty canvas space to pan view
- **Zoom:** Mouse wheel or pinch gesture (optional enhancement)
- **Selection:** Click empty space to deselect all nodes

---

## 2. Node Cards

Nodes represent individual conversation states in the flow. Each node type has distinct visual characteristics to indicate its role.

### Common Properties (All Node Types)

#### Dimensions
- **Width:** 220px (fixed)
- **Height:** Variable based on content
  - Start node: ~80px
  - Question node: ~80px base + 32px per option
  - End node: ~60px

#### Typography
- **Font Family:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif
- **Header Text:** 
  - Font size: 14px
  - Font weight: 600
  - Line height: 1.4
  - Color: `#e0e0e0`
- **Body Text:**
  - Font size: 14px
  - Font weight: 400
  - Line height: 1.5
  - Color: `#e0e0e0`
- **Label Text (Node type indicator):**
  - Font size: 11px
  - Font weight: 500
  - Text transform: uppercase
  - Letter spacing: 0.5px
  - Color: `#999`

#### Visual Effects
- **Border Radius:** 12px
- **Box Shadow:** `0 4px 16px rgba(0, 0, 0, 0.4)`
- **Transition:** `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`

#### Interactive States
- **Default State:**
  - Background: `#16213e`
  - Border: 2px solid transparent
  - Opacity: 1
  
- **Hover State:**
  - Transform: `scale(1.02)`
  - Filter: `brightness(1.2)`
  - Cursor: pointer
  - Box shadow: `0 6px 20px rgba(0, 0, 0, 0.5)`

- **Selected State:**
  - Border: `2px solid #FFD700`
  - Box shadow: `0 6px 20px rgba(255, 215, 0, 0.3)`
  - Z-index: 10

- **Editing State:**
  - Border: `2px solid #2196F3`
  - Background: `#1a2332`

### Start Node Specification

#### Visual Identity
- **Accent Color:** `#4CAF50` (green - represents entry point)
- **Header Background:** `#4CAF50`
- **Header Text Color:** `#ffffff`
- **Icon:** Play circle or entry arrow icon
- **Label:** "START"

#### Structure
```
┌─────────────────────────┐
│ START                   │ ← Header (green background)
├─────────────────────────┤
│ Welcome message text... │ ← Body content
│                         │
│ [Option chip 1]         │ ← User options
│ [Option chip 2]         │
└─────────────────────────┘
```

#### Styling Details
- **Header Padding:** 8px 16px
- **Body Padding:** 12px 16px
- **Minimum Height:** 80px

### Question Node Specification

#### Visual Identity
- **Accent Color:** `#2196F3` (blue - represents interaction/decision point)
- **Header Background:** `#2196F3`
- **Header Text Color:** `#ffffff`
- **Icon:** Question mark or help circle icon
- **Label:** "QUESTION"

#### Structure
```
┌─────────────────────────┐
│ QUESTION                │ ← Header (blue background)
├─────────────────────────┤
│ Question text here?     │ ← Body content
│                         │
│ [Option chip 1] →       │ ← User options with arrows
│ [Option chip 2] →       │
└─────────────────────────┘
```

#### Option Chips
- **Background:** `#333`
- **Text Color:** `#e0e0e0`
- **Padding:** 6px 12px
- **Border Radius:** 16px
- **Margin:** 4px 0
- **Font Size:** 13px
- **Hover State:**
  - Background: `#444`
  - Transform: `translateX(4px)`

#### Styling Details
- **Header Padding:** 8px 16px
- **Body Padding:** 12px 16px
- **Option Container Padding:** 8px 16px 12px
- **Minimum Height:** 80px

### End Node Specification

#### Visual Identity
- **Accent Color:** `#FF5722` (deep orange - represents terminal state/resolution)
- **Header Background:** `#FF5722`
- **Header Text Color:** `#ffffff`
- **Icon:** Check circle or stop icon
- **Label:** "END"

#### Structure
```
┌─────────────────────────┐
│ END                     │ ← Header (orange-red background)
├─────────────────────────┤
│ Resolution message...   │ ← Body content (italic)
│ Thank you!              │
└─────────────────────────┘
```

#### Styling Details
- **Header Padding:** 8px 16px
- **Body Padding:** 12px 16px
- **Body Font Style:** italic
- **Minimum Height:** 60px
- **No Options:** End nodes never have option chips

---

## 3. Connectors

Connectors visualize the flow between nodes, showing the conversation path and decision tree structure.

### Technical Implementation
- **Technology:** SVG (Scalable Vector Graphics)
- **Element Type:** `<path>` with quadratic Bézier curves
- **Container:** Absolute positioned SVG layer behind nodes (z-index: 1)

### Visual Specifications

#### Default Connector
- **Stroke Color:** `#666` (medium gray)
- **Stroke Width:** 2px
- **Opacity:** 0.7
- **Line Cap:** round
- **Line Join:** round
- **Fill:** none

#### Active/Traversed Connector
Used in preview mode to show the current conversation path.
- **Stroke Color:** `#FFD700` (gold)
- **Stroke Width:** 3px
- **Opacity:** 1
- **Animation:** Dashed line animation

#### Hover State (Editor Mode)
- **Stroke Color:** `#888`
- **Stroke Width:** 3px
- **Cursor:** pointer

### Connection Points
- **Source Anchor:** Bottom-center of the source node
  - Calculate: `x = node.x + (node.width / 2)`
  - Calculate: `y = node.y + node.height`
  
- **Target Anchor:** Top-center of the target node
  - Calculate: `x = node.x + (node.width / 2)`
  - Calculate: `y = node.y`

### Curve Path Algorithm
Use quadratic Bézier curves for smooth, organic-looking connections.

```
Control Point (CP) calculation:
- CPx = (sourceX + targetX) / 2
- CPy = (sourceY + targetY) / 2 + verticalOffset

Where verticalOffset = Math.abs(targetY - sourceY) * 0.3
```

SVG Path format:
```svg
<path d="M sourceX,sourceY Q cpX,cpY targetX,targetY" />
```

### Arrow Markers
Define SVG markers for arrow heads at the target end.

#### Arrow Specification
- **Shape:** Triangle
- **Size:** 8px × 8px
- **Fill Color:** Inherits from stroke color
- **Position:** End of path

#### SVG Marker Definition
```svg
<defs>
  <marker id="arrowhead" markerWidth="10" markerHeight="10" 
          refX="9" refY="3" orient="auto">
    <polygon points="0 0, 10 3, 0 6" fill="#666" />
  </marker>
  <marker id="arrowhead-active" markerWidth="10" markerHeight="10" 
          refX="9" refY="3" orient="auto">
    <polygon points="0 0, 10 3, 0 6" fill="#FFD700" />
  </marker>
</defs>
```

### Animated Path (Active Traversal)
When showing the current path in preview mode, animate with a dashed line.

```css
.connector-active {
  stroke-dasharray: 8 4;
  animation: dash-flow 1s linear infinite;
}

@keyframes dash-flow {
  to {
    stroke-dashoffset: -12;
  }
}
```

---

## 4. Color Semantics

A carefully chosen color palette ensures visual hierarchy and intuitive understanding.

### Foundation Colors

#### Canvas & Structure
- **`#1a1a2e`** - Canvas background (primary surface)
- **`#16213e`** - Node card background (elevated surface)
- **`#0f3460`** - Panel/sidebar background (secondary surface)
- **`#2a2a3e`** - Grid dots, subtle dividers

#### Semantic Colors

##### Start Node - Entry Point
- **`#4CAF50`** - Green
- **Meaning:** Beginning, start, go, positive action
- **Usage:** Start node header, play button, success states

##### Question Node - Interaction Required
- **`#2196F3`** - Blue
- **Meaning:** Information, query, decision point, interaction
- **Usage:** Question node header, edit mode indicator, primary actions

##### End Node - Terminal/Resolution
- **`#FF5722`** - Deep Orange/Red-Orange
- **Meaning:** Stop, completion, resolution, alert
- **Usage:** End node header, stop button, warning states

##### Selection & Active State
- **`#FFD700`** - Gold
- **Meaning:** Selected, highlighted, current focus, active path
- **Usage:** Selected node border, active connector, current traversal

#### Text Colors
- **`#e0e0e0`** - Primary text (high contrast on dark background)
- **`#b0b0b0`** - Secondary text (medium emphasis)
- **`#999999`** - Tertiary text (low emphasis, labels)
- **`#666666`** - Disabled text, default connectors

#### Chip & Interactive Elements
- **`#333333`** - Option chip background
- **`#444444`** - Option chip hover background
- **`#555555`** - Input field background

#### Overlay & Modal
- **`rgba(0, 0, 0, 0.7)`** - Modal backdrop
- **`rgba(0, 0, 0, 0.4)`** - Shadow base color

---

## 5. Mode Indicators

The application operates in two distinct modes: Editor and Preview. Clear visual indicators help users understand the current context.

### Editor Mode

#### Visual Indicators
- **Top Bar Color:** `#2196F3` (blue)
- **Icon:** Pencil/edit icon
- **Label:** "EDITOR MODE"
- **Button Style:**
  - Background: `#2196F3`
  - Text: `#ffffff`
  - Icon: Edit/pencil
  - Border radius: 8px
  - Padding: 10px 20px

#### Active UI Elements
- Node editing panels
- Add node buttons
- Delete node buttons
- Connection manipulation tools
- Property panels

#### Cursor States
- **Default:** Arrow
- **Over node:** Pointer (indicating clickable)
- **Over canvas:** Grab (pan mode available)
- **Panning canvas:** Grabbing

### Preview Mode

#### Visual Indicators
- **Top Bar Color:** `#4CAF50` (green)
- **Icon:** Play/preview icon
- **Label:** "PREVIEW MODE"
- **Button Style:**
  - Background: `#4CAF50`
  - Text: `#ffffff`
  - Icon: Play triangle
  - Border radius: 8px
  - Padding: 10px 20px

#### Active UI Elements
- Chat interface
- Message bubbles
- Option selection buttons
- Restart button
- Path traversal animation

#### Mode Toggle Button
Located in the top-right corner of the application.

**Editor Mode Button (switches to preview):**
```
┌─────────────────────┐
│ ▶ Switch to Preview │
└─────────────────────┘
```

**Preview Mode Button (switches to editor):**
```
┌─────────────────────┐
│ ✎ Back to Editor    │
└─────────────────────┘
```

**Toggle Specifications:**
- Position: Fixed top-right
- Margin: 20px from top and right edges
- Padding: 12px 24px
- Border radius: 24px (pill shape)
- Font size: 14px
- Font weight: 600
- Transition: `all 0.3s ease`
- Box shadow: `0 2px 8px rgba(0, 0, 0, 0.3)`

**Hover State:**
- Transform: `translateY(-2px)`
- Box shadow: `0 4px 12px rgba(0, 0, 0, 0.4)`

---

## 6. Chat Interface (Preview Mode)

The chat interface simulates the end-user experience, showing how customers will interact with the support bot.

### Layout & Animation

#### Presentation Style
- **Display Method:** Full overlay or slide-in from right
- **Animation Duration:** 0.3s
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`

#### Slide-in Animation
```css
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Container Specifications

#### Chat Container
- **Width:** 400px (desktop) / 100% (mobile)
- **Height:** 100vh
- **Background:** `#0f3460`
- **Position:** Fixed right
- **Box Shadow:** `-4px 0 16px rgba(0, 0, 0, 0.5)`
- **Z-index:** 100

#### Chat Header
- **Background:** `#4CAF50` (matches preview mode color)
- **Padding:** 16px 20px
- **Title:** "Support Bot - Preview"
- **Font Size:** 16px
- **Font Weight:** 600
- **Color:** `#ffffff`

#### Message Area
- **Background:** `#16213e`
- **Padding:** 20px
- **Height:** calc(100vh - 60px - 80px) [minus header and input area]
- **Overflow:** Auto scroll (from bottom)
- **Scroll Behavior:** Smooth
- **Auto-scroll:** To latest message

### Message Bubbles

#### Bot Messages (Left-aligned)
- **Alignment:** Left
- **Background:** `#16213e`
- **Text Color:** `#e0e0e0`
- **Border:** 1px solid `#2a2a3e`
- **Border Radius:** 12px 12px 12px 4px (rounded except bottom-left)
- **Padding:** 12px 16px
- **Max Width:** 80%
- **Margin:** 8px 0
- **Font Size:** 14px
- **Line Height:** 1.5

**Bot Avatar/Icon:**
- Size: 32px × 32px
- Background: `#2196F3`
- Border radius: 50% (circle)
- Icon: Bot or support symbol
- Position: Left of message bubble
- Margin right: 12px

#### User Option Buttons (Right-aligned)
User selections appear as right-aligned chips/buttons.

- **Alignment:** Right
- **Background:** `#2196F3`
- **Text Color:** `#ffffff`
- **Border:** None
- **Border Radius:** 12px 12px 4px 12px (rounded except bottom-right)
- **Padding:** 10px 16px
- **Max Width:** 80%
- **Margin:** 8px 0
- **Font Size:** 14px
- **Font Weight:** 500
- **Cursor:** Default (not clickable after selection)

**Hover State (before selection):**
- **Background:** `#1976D2` (darker blue)
- **Cursor:** Pointer
- **Transform:** `translateY(-1px)`

**Selected/Sent State:**
- **Opacity:** 0.8
- **Cursor:** Default

### Option Selection Interface

When the bot presents options, display them as clickable buttons below the bot's message.

#### Option Button
- **Background:** `#2196F3`
- **Text Color:** `#ffffff`
- **Border:** 2px solid transparent
- **Border Radius:** 20px (pill shape)
- **Padding:** 10px 20px
- **Margin:** 6px 4px
- **Font Size:** 14px
- **Font Weight:** 500
- **Display:** Inline-block
- **Transition:** all 0.2s ease

**Hover State:**
- **Background:** `#1976D2`
- **Border Color:** `#FFD700`
- **Transform:** `scale(1.05)`
- **Cursor:** Pointer

**Active/Click State:**
- **Transform:** `scale(0.98)`

### Message Timing & Flow

#### Bot Message Appearance
- **Delay:** 300ms after previous action
- **Typing Indicator:** Optional 3-dot animation before message appears
- **Animation:** Fade in from left with slight slide

#### User Selection Feedback
- **Immediate:** Selected button moves to right side as user message
- **Bot Response:** Appears after 500ms delay
- **Smooth Scroll:** Auto-scroll to new messages

### Restart Button

Appears when reaching an end node.

- **Position:** Bottom of chat, centered
- **Background:** `#FF5722`
- **Text Color:** `#ffffff`
- **Text:** "🔄 Restart Conversation"
- **Padding:** 12px 24px
- **Border Radius:** 24px
- **Font Size:** 14px
- **Font Weight:** 600
- **Margin:** 16px auto
- **Box Shadow:** `0 2px 8px rgba(0, 0, 0, 0.3)`

**Hover State:**
- **Background:** `#E64A19` (darker orange)
- **Transform:** `translateY(-2px)`
- **Box Shadow:** `0 4px 12px rgba(0, 0, 0, 0.4)`

### Scroll Behavior
- **New Message:** Auto-scroll to bottom
- **User Scrolled Up:** Disable auto-scroll until user scrolls to bottom
- **Scroll Indicator:** Show "New message ↓" button if messages arrive while scrolled up

---

## 7. Responsive Behavior

### Breakpoints
- **Desktop:** ≥ 1024px
- **Tablet:** 768px - 1023px
- **Mobile:** < 768px

### Canvas Responsive Rules

#### Desktop (≥ 1024px)
- Full canvas view: 1200px × 800px scrollable
- Side panels: 300px width
- Chat preview: 400px slide-in

#### Tablet (768px - 1023px)
- Canvas scales to fit viewport
- Side panels: 250px width or overlay mode
- Chat preview: 350px slide-in

#### Mobile (< 768px)
- Full viewport canvas (pan and zoom)
- Panels: Full-screen overlay
- Chat preview: Full-screen overlay
- Touch gestures: Pinch to zoom, two-finger pan

---

## 8. Accessibility Considerations

### Color Contrast
All text meets WCAG AA standards (4.5:1 ratio minimum):
- Primary text (`#e0e0e0`) on dark background (`#1a1a2e`): ~12:1 ✓
- Secondary text (`#b0b0b0`) on dark background: ~8:1 ✓
- Button text on colored backgrounds: Verified individually

### Keyboard Navigation
- **Tab:** Navigate between nodes and interactive elements
- **Enter/Space:** Activate selected node or button
- **Escape:** Close modal or exit edit mode
- **Arrow Keys:** Navigate between connected nodes (optional enhancement)

### Screen Reader Support
- **ARIA Labels:** All interactive elements have descriptive labels
- **Role Attributes:** Proper semantic roles (button, dialog, navigation)
- **Live Regions:** Announce chat messages in preview mode
- **Focus Management:** Logical focus order, visible focus indicators

### Focus Indicators
- **Outline:** 2px solid `#FFD700`
- **Offset:** 2px
- **Visible:** Always visible for keyboard users

---

## 9. Animation & Transitions

### Timing Functions
- **Standard:** `cubic-bezier(0.4, 0, 0.2, 1)` - Material Design standard easing
- **Deceleration:** `cubic-bezier(0.0, 0, 0.2, 1)` - Entering elements
- **Acceleration:** `cubic-bezier(0.4, 0, 1, 1)` - Exiting elements
- **Sharp:** `cubic-bezier(0.4, 0, 0.6, 1)` - Quick transitions

### Duration Standards
- **Micro:** 100ms - Hover states, focus rings
- **Quick:** 200ms - Button clicks, state changes
- **Standard:** 300ms - Panel transitions, mode switches
- **Deliberate:** 500ms - Page transitions, major layout changes

### Performance
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left` (CPU intensive)
- Use `will-change` sparingly for elements that will animate

---

## 10. Component Hierarchy

```
App
├── TopBar
│   ├── Logo
│   ├── ModeIndicator
│   └── ModeToggleButton
├── EditorView (when mode === 'editor')
│   ├── Canvas
│   │   ├── GridBackground
│   │   ├── SVGConnectorLayer
│   │   │   └── Connector[] (SVG paths with arrows)
│   │   └── NodeLayer
│   │       └── NodeCard[]
│   │           ├── NodeHeader
│   │           ├── NodeBody
│   │           └── NodeOptions
│   └── EditPanel (conditional)
│       └── NodeEditForm
└── PreviewView (when mode === 'preview')
    ├── FlowVisualization (dimmed canvas view)
    └── ChatInterface
        ├── ChatHeader
        ├── MessageList
        │   ├── BotMessage[]
        │   └── UserMessage[]
        ├── OptionButtons[]
        └── RestartButton (conditional)
```

---

## Implementation Notes

### CSS Architecture
- Use CSS custom properties (variables) for colors and spacing
- BEM naming convention for class names
- Scoped styles per component (CSS Modules or styled-components)

### State Management
- Node positions and content
- Current selected node
- Current mode (editor/preview)
- Preview traversal state (current node, message history)
- Edit panel open/closed state

### Performance Considerations
- Virtual scrolling for large node counts (100+ nodes)
- Debounced canvas pan/zoom calculations
- Memoized connector path calculations
- Lazy rendering for off-screen nodes

### Browser Compatibility
- Target: Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features with appropriate polyfills
- CSS Grid and Flexbox for layout
- SVG for all vector graphics

---

## Design Rationale

This design system prioritizes:

1. **Visual Clarity:** Dark theme reduces eye strain during extended editing sessions; high contrast ensures readability.

2. **Semantic Color Coding:** Green (start), Blue (question), Orange (end) creates an intuitive mental model matching common UI patterns (green = go, blue = info, red/orange = stop).

3. **Professional Aesthetics:** Rounded corners, subtle shadows, and smooth animations create a modern, polished feel appropriate for enterprise software.

4. **Cognitive Load Reduction:** Consistent spacing, typography, and interaction patterns reduce the learning curve and mental effort required to use the tool.

5. **Scalability:** The design accommodates flows from simple (5-10 nodes) to complex (100+ nodes) through scrolling, panning, and zoom capabilities.

---

This design system serves as the single source of truth for all visual and interaction design decisions in the SupportFlow Visual Builder project.
