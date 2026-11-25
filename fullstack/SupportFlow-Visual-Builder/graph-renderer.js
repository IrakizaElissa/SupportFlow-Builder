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
