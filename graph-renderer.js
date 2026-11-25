// SupportFlow - Custom Graph Renderer

class GraphRenderer {
  constructor(nodesContainer, svgEl, flowData) {
    this.nodesContainer = nodesContainer;
    this.svgEl = svgEl;
    this.flowData = flowData;
    this.selectedNodeId = null;
    this.onNodeEdit = null; // callback(nodeId, newText)
  }

  renderNodes() {
    // Clear existing nodes
    this.nodesContainer.innerHTML = '';

    // Create a div for each node
    this.flowData.nodes.forEach(node => {
      const nodeDiv = document.createElement('div');
      nodeDiv.id = `node-${node.id}`;
      nodeDiv.className = `node node-${node.type}`;
      nodeDiv.style.position = 'absolute';
      nodeDiv.style.left = node.position.x + 'px';
      nodeDiv.style.top = node.position.y + 'px';
      nodeDiv.setAttribute('data-node-id', node.id);

      // Build inner HTML
      const optionsHTML = node.options && node.options.length > 0
        ? node.options.map(o => `<span class="option-chip">${o.label}</span>`).join('')
        : '';

      nodeDiv.innerHTML = `
        <div class="node-header">
          <span class="node-type-badge">${node.type.toUpperCase()}</span>
        </div>
        <div class="node-body">
          <p class="node-text">${node.text}</p>
          <div class="node-options">
            ${optionsHTML}
          </div>
        </div>
      `;

      this.nodesContainer.appendChild(nodeDiv);
    });

    // Render connections after DOM layout is computed
    setTimeout(() => this.renderConnections(), 0);
  }

  renderConnections() {
    // Clear existing connections
    this.svgEl.innerHTML = '';

    // Add arrowhead marker definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
      </marker>
    `;
    this.svgEl.appendChild(defs);

    // For each node, draw a path for each option
    this.flowData.nodes.forEach(node => {
      node.options.forEach(option => {
        const sourceEl = document.getElementById(`node-${node.id}`);
        const targetEl = document.getElementById(`node-${option.nextId}`);
        if (!sourceEl || !targetEl) return;

        const start = this.getNodeCenter(sourceEl); // bottom-center of source
        const end = this.getNodeTop(targetEl);       // top-center of target

        // Quadratic bezier: control point is halfway, offset vertically
        const cpX = (start.x + end.x) / 2;
        const cpY = start.y + (end.y - start.y) * 0.5;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${start.x} ${start.y} Q ${cpX} ${cpY} ${end.x} ${end.y}`);
        path.setAttribute('stroke', '#666');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('opacity', '0.7');
        path.setAttribute('marker-end', 'url(#arrowhead)');
        path.setAttribute('class', 'connection-path');
        path.setAttribute('data-from', node.id);
        path.setAttribute('data-to', option.nextId);
        this.svgEl.appendChild(path);
      });
    });
  }

  updateConnections() {
    this.renderConnections();
  }

  getNodeCenter(nodeEl) {
    // Returns bottom-center of a node element
    const x = nodeEl.offsetLeft + nodeEl.offsetWidth / 2;
    const y = nodeEl.offsetTop + nodeEl.offsetHeight;
    return { x, y };
  }

  getNodeTop(nodeEl) {
    // Returns top-center of a node element
    const x = nodeEl.offsetLeft + nodeEl.offsetWidth / 2;
    const y = nodeEl.offsetTop;
    return { x, y };
  }

  enableEditing() {
    this.nodesContainer.addEventListener('click', (e) => {
      const nodeEl = e.target.closest('.node');
      if (!nodeEl) {
        // Click on empty canvas: deselect
        this.deselectAll();
        return;
      }
      // Avoid triggering edit if clicking an already-active contenteditable
      if (e.target.classList.contains('node-text') && nodeEl.classList.contains('selected')) {
        return;
      }
      this.selectNode(nodeEl.dataset.nodeId);
    });
  }

  selectNode(nodeId) {
    this.deselectAll();
    this.selectedNodeId = nodeId;
    const nodeEl = document.getElementById(`node-${nodeId}`);
    if (!nodeEl) return;
    nodeEl.classList.add('selected');
    // Make node-text contenteditable
    const textEl = nodeEl.querySelector('.node-text');
    if (textEl) {
      textEl.setAttribute('contenteditable', 'true');
      textEl.focus();
      // Place cursor at end
      const range = document.createRange();
      range.selectNodeContents(textEl);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      // Listen for input changes
      textEl.addEventListener('input', () => {
        const node = this.flowData.nodes.find(n => n.id === nodeId);
        if (node) {
          node.text = textEl.textContent.trim();
          if (this.onNodeEdit) this.onNodeEdit(nodeId, node.text);
        }
      }, { once: false });
    }

    // Update properties panel
    const panel = document.getElementById('properties-panel');
    const panelTypeEl = document.getElementById('properties-node-type');
    const panelTextInput = document.getElementById('properties-text-input');
    const unsavedIndicator = document.getElementById('unsaved-indicator');
    const saveBtn = document.getElementById('save-node-btn');

    if (panel) {
      const node = this.flowData.nodes.find(n => n.id === nodeId);
      if (!node) return;
      panelTypeEl.textContent = node.type.toUpperCase() + ' Node';
      panelTextInput.value = node.text;
      unsavedIndicator.classList.add('hidden');
      panel.classList.remove('hidden');

      // Sync panel textarea -> canvas node text
      panelTextInput.oninput = () => {
        unsavedIndicator.classList.remove('hidden');
      };
      saveBtn.onclick = () => {
        node.text = panelTextInput.value.trim();
        // Update the contenteditable element on canvas
        const canvasTextEl = document.getElementById(`node-${nodeId}`)?.querySelector('.node-text');
        if (canvasTextEl) canvasTextEl.textContent = node.text;
        unsavedIndicator.classList.add('hidden');
        if (this.onNodeEdit) this.onNodeEdit(nodeId, node.text);
      };

      document.getElementById('properties-close-btn').onclick = () => {
        panel.classList.add('hidden');
        this.deselectAll();
      };
    }
  }

  deselectAll() {
    document.querySelectorAll('.node.selected').forEach(el => {
      el.classList.remove('selected');
      const textEl = el.querySelector('.node-text');
      if (textEl) textEl.removeAttribute('contenteditable');
    });
    this.selectedNodeId = null;
    const panel = document.getElementById('properties-panel');
    if (panel) panel.classList.add('hidden');
  }

  enableDragAndDrop() {
    this.nodesContainer.querySelectorAll('.node').forEach(nodeEl => {
      this._makeDraggable(nodeEl);
    });
  }

  _makeDraggable(nodeEl) {
    let isDragging = false;
    let startMouseX, startMouseY, startLeft, startTop;

    nodeEl.addEventListener('mousedown', (e) => {
      // Don't drag when clicking contenteditable text
      if (e.target.getAttribute('contenteditable') === 'true') return;
      isDragging = true;
      startMouseX = e.clientX;
      startMouseY = e.clientY;
      startLeft = parseInt(nodeEl.style.left) || 0;
      startTop = parseInt(nodeEl.style.top) || 0;
      nodeEl.style.zIndex = '50';
      nodeEl.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startMouseX;
      const dy = e.clientY - startMouseY;
      const newLeft = Math.max(0, startLeft + dx);
      const newTop = Math.max(0, startTop + dy);
      nodeEl.style.left = newLeft + 'px';
      nodeEl.style.top = newTop + 'px';
      // Update flow data position
      const nodeId = nodeEl.dataset.nodeId;
      const node = this.flowData.nodes.find(n => n.id === nodeId);
      if (node) {
        node.position.x = newLeft;
        node.position.y = newTop;
      }
      // Redraw connections live
      this.updateConnections();
    });

    document.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      nodeEl.style.zIndex = '';
      nodeEl.style.cursor = '';
      // Save layout to localStorage
      this.saveLayout();
    });
  }

  saveLayout() {
    const layout = {};
    this.flowData.nodes.forEach(n => {
      layout[n.id] = { x: n.position.x, y: n.position.y };
    });
    localStorage.setItem('supportflow-layout', JSON.stringify(layout));
  }

  loadLayout() {
    const saved = localStorage.getItem('supportflow-layout');
    if (!saved) return false;
    const layout = JSON.parse(saved);
    this.flowData.nodes.forEach(n => {
      if (layout[n.id]) {
        n.position.x = layout[n.id].x;
        n.position.y = layout[n.id].y;
      }
    });
    return true;
  }

  autoLayout() {
    // Hierarchical layout: BFS from start node
    const startNode = this.flowData.nodes.find(n => n.type === 'start');
    if (!startNode) return;

    const visited = new Set();
    const queue = [{ id: startNode.id, level: 0, siblingIndex: 0, siblingCount: 1 }];
    const levelCounts = {};
    const levelPositions = {};

    // Count nodes per level
    const tempQueue = [{ id: startNode.id, level: 0 }];
    const tempVisited = new Set();
    while (tempQueue.length) {
      const { id, level } = tempQueue.shift();
      if (tempVisited.has(id)) continue;
      tempVisited.add(id);
      levelCounts[level] = (levelCounts[level] || 0) + 1;
      const node = this.flowData.nodes.find(n => n.id === id);
      if (node) node.options.forEach(o => tempQueue.push({ id: o.nextId, level: level + 1 }));
    }

    // Assign positions
    while (queue.length) {
      const { id, level } = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);

      levelPositions[level] = (levelPositions[level] || 0);
      const count = levelCounts[level] || 1;
      const totalWidth = this.flowData.meta?.canvas_size?.w || 1200;
      const x = (totalWidth / (count + 1)) * (levelPositions[level] + 1) - 110;
      const y = 60 + level * 220;

      const node = this.flowData.nodes.find(n => n.id === id);
      if (node) {
        node.position.x = Math.max(10, x);
        node.position.y = y;
      }
      levelPositions[level]++;

      if (node) {
        node.options.forEach(o => queue.push({ id: o.nextId, level: level + 1 }));
      }
    }

    // Re-render
    this.nodesContainer.innerHTML = '';
    this.renderNodes();
    this.enableEditing();
    this.enableDragAndDrop();
    localStorage.removeItem('supportflow-layout');
  }
}

window.GraphRenderer = GraphRenderer;
