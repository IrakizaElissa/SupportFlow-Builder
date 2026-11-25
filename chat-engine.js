// SupportFlow - Chat Engine for Preview Mode

class ChatEngine {
  constructor() {
    this.messagesEl = document.getElementById('chat-messages');
    this.optionsEl = document.getElementById('chat-options');
    this.flowData = null;
    this.currentNodeId = null;
    this.messageDelay = 400; // ms between bot messages for natural feel
    this.visitedPath = [];
  }

  start(flowData) {
    this.flowData = flowData;
    this.reset();
    // Find start node
    const startNode = flowData.nodes.find(n => n.type === 'start');
    if (!startNode) {
      this._addBotMessage('Error: No start node found in flow data.');
      return;
    }
    setTimeout(() => this._showNode(startNode.id), 300);
  }

  reset() {
    if (this.messagesEl) this.messagesEl.innerHTML = '';
    if (this.optionsEl) this.optionsEl.innerHTML = '';
    this.currentNodeId = null;
    this.visitedPath = [];
    // Clear any active connector highlights
    document.querySelectorAll('.connection-path.active').forEach(p => p.classList.remove('active'));
  }

  _getNode(nodeId) {
    return this.flowData?.nodes.find(n => n.id === nodeId) ?? null;
  }

  _showNode(nodeId) {
    // At the top of _showNode, track visited path
    if (!this.visitedPath.includes(nodeId)) {
      this.visitedPath.push(nodeId);
    }

    this.currentNodeId = nodeId;
    const node = this._getNode(nodeId);
    if (!node) return;

    this._addBotMessage(node.text);

    // Update canvas breadcrumb
    this._updateBreadcrumb();

    // Highlight this node on canvas
    document.querySelectorAll('.node').forEach(el => el.style.opacity = '0.5');
    const activeEl = document.getElementById(`node-${nodeId}`);
    if (activeEl) activeEl.style.opacity = '1';

    // Show options or end
    setTimeout(() => {
      this.optionsEl.innerHTML = '';
      if (node.type === 'end' || node.options.length === 0) {
        this._addBotMessage('--- End of flow ---');
        const restartBtn = document.createElement('button');
        restartBtn.textContent = '↺ Start Over';
        restartBtn.className = 'chat-option-btn restart-btn';
        restartBtn.onclick = () => this.start(this.flowData);
        this.optionsEl.appendChild(restartBtn);
      } else {
        node.options.forEach(option => {
          const btn = document.createElement('button');
          btn.textContent = option.label;
          btn.className = 'chat-option-btn';
          btn.onclick = () => this._selectOption(option, nodeId);
          this.optionsEl.appendChild(btn);
        });
      }
    }, this.messageDelay);
  }

  _selectOption(option, fromNodeId) {
    // Add user message
    this._addUserMessage(option.label);
    // Clear options
    this.optionsEl.innerHTML = '';
    // Highlight the connection path
    this._highlightConnection(fromNodeId, option.nextId);
    
    // After highlighting current connection, also keep all previous connections visible at lower opacity:
    document.querySelectorAll('.connection-path.visited').forEach(p => p.style.opacity = '0.4');
    // Mark current as visited after a delay
    const currentPath = document.querySelector(`.connection-path[data-from="${fromNodeId}"][data-to="${option.nextId}"]`);
    if (currentPath) {
      setTimeout(() => {
        currentPath.classList.remove('active');
        currentPath.classList.add('visited');
        currentPath.style.stroke = '#4CAF50';
      }, 1000);
    }
    
    // Navigate to next node
    setTimeout(() => this._showNode(option.nextId), this.messageDelay);
  }

  _highlightConnection(fromId, toId) {
    // Remove all active highlights
    document.querySelectorAll('.connection-path.active').forEach(p => p.classList.remove('active'));
    // Find and highlight the matching path
    const path = document.querySelector(`.connection-path[data-from="${fromId}"][data-to="${toId}"]`);
    if (path) path.classList.add('active');
  }

  _addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-message bot-message';
    msg.textContent = text;
    this.messagesEl.appendChild(msg);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  _addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-message user-message';
    msg.textContent = text;
    this.messagesEl.appendChild(msg);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  _updateBreadcrumb() {
    let el = document.getElementById('chat-breadcrumb');
    if (!el) {
      el = document.createElement('div');
      el.id = 'chat-breadcrumb';
      el.className = 'chat-breadcrumb';
      this.messagesEl.parentElement.insertBefore(el, this.messagesEl);
    }
    const names = this.visitedPath.map(id => {
      const n = this._getNode(id);
      return n ? `<span class="crumb">${n.type}</span>` : '';
    });
    el.innerHTML = names.join(' › ');
  }
}

window._chatEngine = new ChatEngine();
