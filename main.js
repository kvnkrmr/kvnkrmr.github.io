const panel = document.getElementById("detail-panel");

// Wandelt http(s)-URLs in einem Text in klickbare Links um (doi.org → "DOI →").
function linkify(text) {
  return text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    const label = url.includes("doi.org") ? "DOI →" : url;
    return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
  });
}

function renderPanel(idx) {
  const d = nodeDetail[idx];
  if (!d) {
    panel.innerHTML = '<p class="panel-instruction">Keine Details verfügbar.</p>';
    return;
  }
  const subtitle = d.subtitle
    ? `<p class="panel-subtitle">${d.subtitle}</p>`
    : "";
  const items = d.items
    .map(item => `<li>${linkify(item)}</li>`)
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
  arrangement: "fixed",
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

// Berechnet gleichmäßig verteilte y-Positionen für eine Plot-Höhe H (px).
// Knotenhöhen sind flussproportional; wir rekonstruieren Plotlys Skala, damit
// die Lücken (oben, zwischen, unten) in jeder Spalte wirklich gleich sind.
function computeEvenY(H) {
  const pad = data[0].node.pad;
  const n = nodeX.length;

  // Knotenwerte = max(eingehend, ausgehend) der Linkwerte.
  const inSum = new Array(n).fill(0);
  const outSum = new Array(n).fill(0);
  linkSource.forEach((s, k) => {
    outSum[s] += linkValue[k];
    inSum[linkTarget[k]] += linkValue[k];
  });
  const value = Array.from({ length: n }, (_, i) => Math.max(inSum[i], outSum[i]));

  // Knoten nach Spalte (x-Wert) gruppieren, Reihenfolge = Knotenindex.
  const cols = new Map();
  nodeX.forEach((x, i) => { (cols.get(x) || cols.set(x, []).get(x)).push(i); });
  const colArrays = [...cols.values()];
  const maxN = Math.max(...colArrays.map(c => c.length));
  const Vmax = Math.max(...colArrays.map(c => c.reduce((a, i) => a + value[i], 0)));
  const scale = (H - (maxN - 1) * pad) / Vmax; // gleiche Plotly-Skala für alle Spalten

  const y = nodeY.slice();
  colArrays.forEach(ids => {
    const heights = ids.map(i => value[i] * scale);
    const totalH = heights.reduce((a, b) => a + b, 0);
    const gap = (H - totalH) / (ids.length + 1); // gleiche Lücke oben, zwischen, unten
    let cursor = gap;
    ids.forEach((i, k) => {
      y[i] = (cursor + heights[k] / 2) / H;
      cursor += heights[k] + gap;
    });
  });
  return y;
}

// Plot-Höhe (px) der Zeichenfläche aus dem Container ableiten.
function plotHeight() {
  const el = document.getElementById("sankey");
  const h = (el && el.clientHeight) || window.innerHeight * 0.7;
  return h - layout.margin.t - layout.margin.b;
}

// y-Positionen schon VOR dem ersten Rendern setzen → kein Springen beim Laden.
data[0].node.y = computeEvenY(plotHeight());

Plotly.newPlot("sankey", data, layout, { responsive: true, displayModeBar: false })
  .then(function(gd) {
    // Bei Größenänderung neu verteilen.
    window.addEventListener("resize", () => {
      Plotly.restyle(gd, { "node.y": [computeEvenY(plotHeight())] });
    });

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
