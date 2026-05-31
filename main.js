const panel = document.getElementById("detail-panel");

function renderPanel(idx) {
  const d = nodeData[idx];
  if (!d) {
    panel.innerHTML = '<p class="panel-instruction">Keine Details verfügbar.</p>';
    return;
  }
  const subtitle = d.subtitle
    ? `<p class="panel-subtitle">${d.subtitle}</p>`
    : "";
  const items = d.items
    .map(item => `<li>${item}</li>`)
    .join("");
  const link = d.url
    ? `<a class="panel-link" href="${d.url}" target="_blank" rel="noopener">Zum Projekt →</a>`
    : "";
  panel.innerHTML = `
    <h2 class="panel-title">${d.title}</h2>
    ${subtitle}
    <ul class="panel-items">${items}</ul>
    ${link}
  `;
}

function resetPanel() {
  panel.innerHTML = '<p class="panel-instruction">Knoten anklicken für Details</p>';
}

const data = [{
  type: "sankey",
  orientation: "h",
  node: {
    pad: 20,
    thickness: 24,
    line: { color: "#30363d", width: 0.5 },
    label: nodeLabels,
    color: nodeColors,
    x: nodeX,
    y: nodeY,
    hovertemplate: "<b>%{label}</b><extra></extra>",
  },
  link: {
    source: linkSource,
    target: linkTarget,
    value: linkValue,
    color: "rgba(150, 150, 180, 0.25)",
    hovertemplate: "%{source.label} → %{target.label}<extra></extra>",
  },
}];

const layout = {
  paper_bgcolor: "#0d1117",
  plot_bgcolor: "#0d1117",
  font: { color: "#e6edf3", family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", size: 13 },
  margin: { l: 20, r: 20, t: 10, b: 10 },
};

const defaultLinkColor = "rgba(150, 150, 180, 0.25)";
const activeLinkColor  = "rgba(150, 150, 180, 0.7)";
const dimLinkColor     = "rgba(150, 150, 180, 0.04)";
let activeNode = null;

function dimColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},0.15)`;
}

function applyHighlight(gd, nodeIndex) {
  const connectedLinks = new Set();
  const connectedNodes = new Set([nodeIndex]);
  linkSource.forEach((src, i) => {
    if (src === nodeIndex || linkTarget[i] === nodeIndex) {
      connectedLinks.add(i);
      connectedNodes.add(src);
      connectedNodes.add(linkTarget[i]);
    }
  });
  Plotly.restyle(gd, {
    "link.color": [linkSource.map((_, i) => connectedLinks.has(i) ? activeLinkColor : dimLinkColor)],
    "node.color": [nodeColors.map((c, i) => connectedNodes.has(i) ? c : dimColor(c))],
  });
}

function resetHighlight(gd) {
  Plotly.restyle(gd, {
    "link.color": [linkSource.map(() => defaultLinkColor)],
    "node.color": [nodeColors.slice()],
  });
}

Plotly.newPlot("sankey", data, layout, { responsive: true, displayModeBar: false })
  .then(function(gd) {
    gd.on("plotly_click", function(eventData) {
      if (!eventData.points.length) return;
      const pt = eventData.points[0];
      if (pt.source !== undefined) return;
      const idx = pt.pointNumber;
      if (activeNode === idx) {
        activeNode = null;
        resetHighlight(gd);
        resetPanel();
      } else {
        activeNode = idx;
        applyHighlight(gd, idx);
        renderPanel(idx);
      }
    });

    gd.on("plotly_doubleclick", function() {
      activeNode = null;
      resetHighlight(gd);
      resetPanel();
    });
  });
