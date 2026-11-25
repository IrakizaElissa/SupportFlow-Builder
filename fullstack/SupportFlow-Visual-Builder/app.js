// SupportFlow - Main Application
(async function() {
  const flowData = await fetch('flow_data.json').then(r => r.json());
  const nodesContainer = document.getElementById('nodes-container');
  const svgEl = document.getElementById('connections-svg');

  const renderer = new GraphRenderer(nodesContainer, svgEl, flowData);
  renderer.renderNodes();
  renderer.enableEditing();

  window._renderer = renderer; // expose for other modules
  window._flowData = flowData;
})();
