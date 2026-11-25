# SupportFlow Visual Builder

**Live Demo**: https://supportflowbuilder.vercel.app

## Overview

A visual decision tree editor for chatbot flows, built with vanilla JavaScript — no flowchart libraries, no component frameworks. Demonstrates custom SVG/DOM rendering, in-place editing, graph traversal, and drag-and-drop interaction.

This project showcases fundamental web development skills including DOM manipulation, SVG graphics programming, event handling, and state management, all implemented from scratch without relying on external visualization libraries or UI frameworks.

## Setup Instructions

Because the application uses `fetch('flow_data.json')` to load flow data, it requires a local HTTP server to run properly. Opening `index.html` directly with the `file://` protocol will fail due to CORS restrictions on JSON fetch requests.

### Option 1: Python HTTP Server (Recommended)

If you have Python installed:

```bash
# Navigate to the project directory
cd fullstack/SupportFlow-Visual-Builder

# Start a local server on port 8080
python -m http.server 8080

# Open your browser to:
# http://localhost:8080
```

### Option 2: Node.js HTTP Server

If you have Node.js installed:

```bash
# Navigate to the project directory
cd fullstack/SupportFlow-Visual-Builder

# Use npx to run a simple server
npx serve .

# Or install http-server globally
npm install -g http-server
http-server -p 8080

# Open your browser to:
# http://localhost:8080
```

### Important Note

**Do not** attempt to open `index.html` directly by double-clicking it or using `file://` protocol. The browser will block the JSON fetch request, and the application will not load properly.

## Features

### Story 1 - Visual Graph

Nodes are rendered from `flow_data.json` at their specified x/y coordinates. The canvas displays a spatial representation of the entire decision tree:

- **Node Cards:** Each node is rendered as a styled card with its type (start, question, end) clearly indicated
- **Absolute Positioning:** Nodes are positioned using CSS absolute positioning based on their JSON coordinates
- **Type-Based Styling:** Color-coded nodes (green=start, blue=question, orange=end) provide immediate visual context
- **SVG Connection Lines:** Smooth curved paths connect nodes showing the flow direction

### Story 2 - Editor Mode

Click any node to edit its text in-place with two editing mechanisms:

- **Direct Inline Editing:** Click a node to make its text contenteditable directly on the canvas
- **Properties Panel:** A side panel opens showing structured editing fields for the selected node
  - Node type indicator
  - Multi-line textarea for text editing
  - Unsaved changes indicator
  - Apply changes button
- **Real-time Updates:** Changes propagate immediately to both the canvas and underlying data model
- **Visual Feedback:** Selected nodes are highlighted with a gold border

### Story 3 - Preview Mode

Toggle to a full-screen chat interface and traverse the bot flow as an end-user would experience it:

- **Chat Interface:** A realistic chat UI slides in from the right
- **Bot Messages:** Messages appear with natural timing delays
- **User Options:** Clickable buttons represent user choices
- **Flow Traversal:** Navigate through the decision tree by selecting options
- **Path Highlighting:** Active connections are highlighted on the background canvas
- **Breadcrumb Trail:** Visual indicator shows the path taken through the flow
- **Restart Capability:** When reaching an end node, restart the conversation

### Story 4 - Wildcard Feature

Drag-and-drop repositioning with localStorage persistence plus auto-layout reset:

- **Drag-and-Drop:** Click and drag any node to reposition it on the canvas
  - Pure mousedown/mousemove/mouseup implementation (no libraries)
  - Live connection line updates while dragging
  - Smooth visual feedback with cursor changes
- **localStorage Persistence:** Custom layouts survive page reload
  - Positions are saved automatically after each drag operation
  - Layout is restored on application startup
- **Auto-Layout Algorithm:** One-click reset to hierarchical tree layout
  - BFS (Breadth-First Search) traversal from start node
  - Hierarchical positioning: level-based vertical spacing
  - Automatic horizontal distribution based on sibling count
  - Clears custom layouts and returns to clean tree view

## Design System

For comprehensive design documentation, see [design-system.md](./design-system.md).

### Color Semantics Summary

The application uses semantic color coding to provide intuitive visual cues:

- **Green (`#4CAF50`)** - Start nodes: Entry points, beginning of flow, positive action
- **Blue (`#2196F3`)** - Question nodes: Decision points, user interaction required
- **Orange (`#FF5722`)** - End nodes: Terminal states, resolution, completion
- **Gold (`#FFD700`)** - Selection/Active state: Currently selected node, active traversal path
- **Dark Navy (`#1a1a2e`)** - Canvas background: Professional dark theme reduces eye strain

The design system document covers canvas design, node card specifications, connector styling, chat interface layout, responsive behavior, accessibility considerations, and animation guidelines.

## Custom Graph Rendering Strategy

### Why No Library?

This project intentionally avoids using flowchart or graph visualization libraries (like D3.js, Cytoscape, or React Flow). This constraint demonstrates deep understanding of DOM coordinate systems, SVG graphics programming, and low-level rendering concepts that are often abstracted away by frameworks. Building from scratch provides complete control over the rendering pipeline and proves mastery of fundamental web technologies.

### Node Rendering Approach

Nodes are rendered as absolutely-positioned `<div>` elements within a relatively-positioned container. Each node's position is read from the `flow_data.json` file, which specifies x/y coordinates. The rendering process:

1. Parse the JSON data structure containing nodes and their positions
2. For each node, create a `<div>` element with the class `node` and type-specific class (e.g., `node-start`)
3. Apply inline styles setting `position: absolute`, `left: {x}px`, `top: {y}px`
4. Populate the node's inner HTML with header, body text, and option chips
5. Append to the nodes container

This approach gives pixel-perfect control over layout while maintaining semantic HTML structure.

### SVG Connection Lines

Connection lines are drawn using an SVG layer positioned behind the nodes container (lower z-index). The rendering algorithm:

1. Create an `<svg>` element that spans the entire canvas
2. For each node's options, calculate connection paths to target nodes
3. Find anchor points using DOM element measurements:
   - **Source anchor:** Bottom-center of source node using `offsetLeft + (offsetWidth / 2)` for x, `offsetTop + offsetHeight` for y
   - **Target anchor:** Top-center of target node using `offsetLeft + (offsetWidth / 2)` for x, `offsetTop` for y
4. Draw paths using quadratic Bézier curves (`Q` command in SVG path syntax):
   - Start point: source anchor
   - Control point: midpoint between source and target, offset vertically for natural curve
   - End point: target anchor
5. Add arrow markers using SVG `<defs><marker>` definitions
   - Polygon-based arrowhead
   - Applied to path with `marker-end` attribute

The quadratic Bézier approach creates smooth, organic-looking curves that feel natural and professional compared to straight lines or rigid angles.

### Live Updates During Interaction

When a node is dragged, the system maintains synchronization between three representations:

1. **Data Model:** The `flowData.nodes` array is updated with new x/y coordinates
2. **DOM Elements:** Node `<div>` positions are updated via inline style changes
3. **SVG Connections:** `renderConnections()` is called to redraw all connection paths

This immediate update cycle happens on every `mousemove` event during drag, creating smooth visual feedback. Connection lines remain perfectly anchored to their nodes throughout the drag operation because anchor points are recalculated from live DOM measurements using `offsetLeft`, `offsetTop`, `offsetWidth`, and `offsetHeight`.

## Wildcard Feature Justification

### Drag-and-Drop is the Canonical Gesture

For spatial editors — tools where users arrange elements in 2D space — drag-and-drop is the expected interaction pattern. Users instinctively try to drag elements to rearrange them. Supporting this gesture makes the editor feel natural and professional.

### localStorage Persistence Preserves User Work

Developers and designers invest time in arranging their flow layouts for optimal visualization. Without persistence, this work is lost on every page refresh, which is frustrating and unprofessional. By saving positions to `localStorage`, the application respects user effort and maintains layout customizations across sessions.

### Auto-Layout Provides Clean Reset

While custom layouts are valuable, sometimes users want to return to a clean, algorithmically-generated view. The auto-layout feature uses a hierarchical BFS (Breadth-First Search) algorithm to arrange nodes in a tree structure:

- Start node at the top
- Each level positioned at regular vertical intervals
- Nodes horizontally distributed within their level based on total sibling count
- Creates a clean, readable tree visualization instantly

The combination of custom drag-and-drop layout with one-click reset to auto-layout gives users full control: manual precision when needed, automatic organization when desired.

### Pure JavaScript Implementation

This feature is implemented without any drag-and-drop library. The implementation uses:

- `mousedown` event to capture initial click position and element position
- `mousemove` event to calculate delta offsets (`clientX` - start position) and update element position
- `mouseup` event to end the drag operation and persist the new layout
- Coordinate math to maintain smooth dragging relative to cursor position

This demonstrates mastery of event-driven programming and coordinate system transformations.

## Project Structure

```
SupportFlow-Visual-Builder/
├── index.html          # App shell and DOM structure
├── styles.css          # All custom styles (no frameworks)
├── app.js              # Main app: load data, wire up modules, mode toggle
├── graph-renderer.js   # Node rendering, SVG connections, drag-and-drop
├── chat-engine.js      # Preview mode chat interface and graph traversal
├── flow_data.json      # Decision tree data (nodes + positions)
├── design-system.md    # Design documentation
├── LICENSE             # MIT License
└── README.md           # This file
```

### File Responsibilities

**index.html**
- Application shell with semantic HTML structure
- Canvas wrapper for graph visualization
- Properties panel for node editing
- Chat overlay for preview mode
- Script loading in dependency order

**styles.css**
- Complete styling for all UI components
- Dark theme with semantic color system
- Responsive layout rules
- Animation and transition definitions
- No external CSS frameworks

**app.js**
- Application entry point
- Fetches and loads `flow_data.json`
- Initializes GraphRenderer and ChatEngine
- Manages mode toggle between editor and preview
- Coordinates communication between modules

**graph-renderer.js**
- Core rendering logic for nodes and connections
- SVG path calculation and drawing
- In-place editing functionality
- Properties panel management
- Drag-and-drop implementation
- Auto-layout algorithm (BFS-based)
- localStorage persistence

**chat-engine.js**
- Preview mode chat interface
- Flow traversal logic
- Bot message timing and display
- User option handling
- Breadcrumb path tracking
- Connection highlighting during traversal

**flow_data.json**
- Data model for the decision tree
- Node definitions (id, type, text, position, options)
- Canvas metadata (theme, dimensions)
- Easily editable structure for creating new flows

## Git History

The project was built incrementally with meaningful commits documenting each feature addition:

1. **Initialize git repository for SupportFlow project**
   - Initial repository setup
   - Project structure created

2. **docs: add comprehensive design system documentation for SupportFlow Visual Builder**
   - Created `design-system.md` with complete visual specifications
   - Defined color semantics, typography, spacing, and component guidelines
   - Established design language before implementation

3. **Create basic HTML canvas structure**
   - Built `index.html` with semantic structure
   - Added toolbar, canvas wrapper, properties panel, and preview overlay
   - Set up script loading order

4. **feat: implement node rendering with absolute positioning**
   - Created `graph-renderer.js` with GraphRenderer class
   - Implemented node rendering from JSON data
   - Applied absolute positioning based on coordinates
   - Added type-based styling classes

5. **feat: Add SVG connection lines between nodes**
   - Implemented SVG layer for connection paths
   - Calculated anchor points from DOM measurements
   - Drew quadratic Bézier curves between nodes
   - Added arrow markers with SVG defs

6. **feat: implement node click and edit functionality**
   - Added click event handling for node selection
   - Implemented contenteditable for inline text editing
   - Created properties panel with structured editing
   - Added visual feedback for selected state

7. **feat: Add real-time text update on canvas**
   - Synchronized changes between properties panel and canvas
   - Implemented unsaved changes indicator
   - Added apply changes functionality
   - Propagated updates to underlying data model

8. **feat: Create preview/play mode toggle**
   - Implemented mode switching in `app.js`
   - Added visual indicators for current mode
   - Showed/hid appropriate UI elements per mode
   - Created mode toggle button with state management

9. **feat: implement chat interface for preview mode**
   - Built chat UI with message display area
   - Created `chat-engine.js` for preview logic
   - Implemented bot message rendering with timing delays
   - Added user option buttons

10. **feat: Add graph traversal logic for chatbot flow**
    - Implemented flow navigation in ChatEngine
    - Added breadcrumb trail showing traversal path
    - Highlighted active connections during traversal
    - Added restart functionality at end nodes

11. **feat: implement wildcard feature with auto-layout and drag-and-drop**
    - Implemented drag-and-drop with pure JavaScript
    - Added localStorage persistence for custom layouts
    - Created auto-layout algorithm using BFS traversal
    - Added live connection updates during dragging
    - Implemented layout save/load functionality

12. **Create comprehensive README with documentation** (current commit)
    - Complete project documentation
    - Setup instructions with multiple server options
    - Feature descriptions for all user stories
    - Technical explanation of rendering strategy
    - Git history documentation

## Technical Highlights

### Vanilla JavaScript Architecture

This project demonstrates that complex, interactive UIs can be built without frameworks:

- **No React/Vue/Angular:** Pure JavaScript with DOM APIs
- **No D3/Cytoscape:** Custom SVG rendering from scratch
- **No drag libraries:** Pure event-driven coordinate math
- **No build tools:** Works directly in the browser

### Skills Demonstrated

- **DOM Manipulation:** Creating, positioning, and updating elements dynamically
- **SVG Graphics:** Path calculation, Bézier curves, markers, coordinate systems
- **Event Handling:** Mouse events, event delegation, state management
- **Data Modeling:** JSON structure design, in-memory data updates
- **State Persistence:** localStorage API for saving user preferences
- **Algorithm Implementation:** BFS graph traversal for auto-layout
- **Coordinate Math:** Anchor point calculation, delta offsets, transformations
- **CSS Styling:** Custom design system, dark theme, responsive layout
- **Async Programming:** fetch API, Promise handling, timing delays
- **Code Organization:** Modular architecture with separation of concerns

## Browser Compatibility

The application uses modern web APIs and targets current browsers:

- **Chrome/Edge:** Fully supported (latest versions)
- **Firefox:** Fully supported (latest versions)
- **Safari:** Fully supported (latest versions)
- **Minimum Requirements:** ES6+ support, fetch API, SVG 1.1

No polyfills or transpilation are required for modern browsers.

## Future Enhancements

Potential additions to extend the project:

- **Add Node:** UI for creating new nodes dynamically
- **Delete Node:** Remove nodes and update connections
- **Edit Connections:** Drag connection endpoints to rewire flow
- **Export/Import:** Save flows as JSON files
- **Undo/Redo:** Command pattern for action history
- **Zoom and Pan:** Transform controls for large flows
- **Multi-select:** Select and move multiple nodes together
- **Keyboard Shortcuts:** Power user workflow improvements
- **Validation:** Detect unreachable nodes or circular flows
- **Templates:** Pre-built flow templates for common use cases

## License

MIT License - See [LICENSE](./LICENSE) file for details.

## Credits

Developed as part of the AmaliTech DEG Project-based Challenges.

Built with vanilla JavaScript, HTML5, CSS3, and SVG.
