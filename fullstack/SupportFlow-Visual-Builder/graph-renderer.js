// SupportFlow - Custom Graph Renderer

class GraphRenderer {
  constructor(nodesContainer, svgEl, flowData) {
    this.nodesContainer = nodesContainer;
    this.svgEl = svgEl;
    this.flowData = flowData;
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
}

window.GraphRenderer = GraphRenderer;
