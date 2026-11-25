// SupportFlow - Main Application
(async function() {
  const flowData = await fetch('flow_data.json').then(r => r.json());
  const nodesContainer = document.getElementById('nodes-container');
  const svgEl = document.getElementById('connections-svg');
  const toggleBtn = document.getElementById('toggle-mode-btn');
  const modeIndicator = document.getElementById('mode-indicator');
  const previewOverlay = document.getElementById('preview-overlay');
  const toolbar = document.getElementById('toolbar');

  const renderer = new GraphRenderer(nodesContainer, svgEl, flowData);
  renderer.renderNodes();
  renderer.enableEditing();

  window._renderer = renderer;
  window._flowData = flowData;

  let isPreviewMode = false;

  function enterPreviewMode() {
    isPreviewMode = true;
    // Deselect any selected node
    renderer.deselectAll();
    // Update toolbar
    modeIndicator.textContent = 'Preview Mode';
    toggleBtn.textContent = '✏ Edit';
    toolbar.style.borderBottomColor = '#4CAF50';
    // Show preview overlay
    previewOverlay.classList.remove('hidden');
    // Start chat engine
    window._chatEngine.start(flowData);
  }

  function exitPreviewMode() {
    isPreviewMode = false;
    modeIndicator.textContent = 'Editor Mode';
    toggleBtn.textContent = '▶ Preview';
    toolbar.style.borderBottomColor = '#2196F3';
    previewOverlay.classList.add('hidden');
    window._chatEngine.reset();
  }

  toggleBtn.addEventListener('click', () => {
    if (isPreviewMode) exitPreviewMode();
    else enterPreviewMode();
  });

  document.getElementById('close-preview-btn').addEventListener('click', exitPreviewMode);

  window._enterPreviewMode = enterPreviewMode;
  window._exitPreviewMode = exitPreviewMode;
})();
