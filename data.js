// ───────────────────────────────────────────────────────────────────────────
// Single source of truth: every node is defined once, every edge once.
// The Plotly arrays at the bottom are DERIVED — never hand-maintain indices.
// ───────────────────────────────────────────────────────────────────────────

const GROUP_STYLE = {
  source:  { color: "#4C78A8", x: 0.001 }, // linke Spalte (Quellen)
  skill:   { color: "#9C59D1", x: 0.5   }, // mittlere Spalte (Fähigkeiten)
  outcome: { color: "#54A24B", x: 0.99  }, // rechte Spalte (Ergebnisse)
};

const NODES = [
  // Quellen
  { id: "bsc", label: "BSc Physik", group: "source", detail: {
    title: "BSc Physik",
    subtitle: "2013 – 2016, Universität des Saarlandes, Saarbrücken",
    items: [
      "Nebenfach: Mathematik",
      "Bachelorarbeit am Leibniz-Institut für Neue Materialien: Performance Evaluation of Supercapacitors Employing Nanoporous Carbon Materials"
    ],
  }},
  { id: "msc", label: "MSc Physik", group: "source", detail: {
    title: "MSc Physik",
    subtitle: "2016 – 2020, Karlsruher Institut für Technologie (KIT), Karlsruhe",
    items: [
      "Schwerpunkt: Theorie der Kondensierten Materie",
      "Ergänzung: Theoretische Teilchenphysik",
      "Nebenfach: Experimentelle Nanophysik",
      "Nichtphysikalisches Fach: Energiesysteme und -technik (EPFL-Auslandssemester)",
      "Masterarbeit (mit PTV Group): Machine Learning Approaches for Population Estimation for Travel Demand Modelling",
      "Auslandssemester an der EPFL in Lausanne, 2017 – 2018",
    ],
  }},
  { id: "aif", label: "AiF Projekt GmbH", group: "source", detail: {
    title: "Wissenschaftlicher Mitarbeiter",
    subtitle: "Okt. 2020 – Jul. 2021, AiF Projekt GmbH, Berlin",
    items: [
      "Fachliche Bewertung und schriftliche Begutachtung von Förderanträgen",
      "Betreute Programme: Zentrales Innovationsprogramm Mittelstand (ZIM), Bescheinigungsstelle Forschungszulage",
    ],
  }},
  { id: "enervis", label: "enervis energy advisors GmbH", group: "source", detail: {
    title: "Mathematiker, Analyst",
    subtitle: "Aug. 2021 – Jun. 2024, enervis energy advisors GmbH, Berlin",
    items: [
      "Alleinige Entwicklung eines Preisprognosemodells für europäische Herkunftsnachweise bis 2030",
      "Gemischt-ganzzahlige Optimierung (Matlab, Xpress-MP) zur Erlösprognose von Großbatteriespeichern und erneuerbaren Anlagen",
      "Analysen von historischen und prognostizierten Strompreisen und Energiemengen (Day-Ahead, Intraday, Regelleistung)",
      "Ergebnisvorstellung gegenüber Kunden im Rahmen von Workshops und Webinaren",
    ],
  }},
  { id: "projecttogether", label: "ProjectTogether gGmbH", group: "source", detail: {
    title: "Data Analyst, Team- und Projektmanager",
    subtitle: "Data Analyst: Dez. 2024 – Jun. 2026<br>Team- und Projektmanager: Mär. 2025 – Jun. 2026<br>ProjectTogether gGmbH, Berlin",
    items: [
      "Betrieb einer ETL-Pipeline (Python, Prefect, S3, PostgreSQL) für goal100.studio",
      "Datenpreprocessing von Behördendaten zum Genehmigungsprozess von Windenergieanlagen (Goal100 Monitor)",
      "Parametrisierung eines Bottom-Up-Prognosemodells für den deutschen Windenergie-Ausbau bis 2035",
      "Fachliche Anleitung einer Data Analystin zur Entwicklung einer ETL-Pipeline",
      "Analyse von Genehmigungsdauern, Antragsvolumina, EEG-Zahlungen/-Zuschlagsmengen, Gebotswerten und erzeugten Strommengen (BNetzA, Übertragungsnetzbetreiber, Genehmigungsbehörden, Projektierer)",
      "Hauptverantwortliche Erstellung und Koordination des Goal100 Windreports 2025/2 (inkl. Abstimmung mit externem Designstudio)",
      "Aufbereitung und Visualisierung komplexer Daten mit Python (Matplotlib, Seaborn, Plotly) und Google Slides",
    ],
  }},
  // Fähigkeiten
  { id: "mathematik", label: "Mathematik", group: "skill", detail: {
    title: "Mathematik",
    items: [
      "Kernfach im BSc und MSc Physik",
      "Anwendung in Energiemarktmodellierung und Optimierung bei enervis",
      "Stochastische Methoden, numerische Simulation, analytisches Problemlösen",
    ],
  }},
  { id: "physik", label: "Physik", group: "skill", detail: {
    title: "Physik",
    items: [
      "Hauptfach im BSc und MSc",
      "Schwerpunkt auf Theorie der Kondensierten Materie und Theoretischer Teilchenphysik",
      "Physikalische und mathematische Modellierung komplexer Systeme",
    ],
  }},
  { id: "datascience", label: "Data Science & Engineering", group: "skill", detail: {
    title: "Data Science und Data Engineering",
    items: [
      "Masterarbeit: ML zur Bevölkerungsschätzung für Verkehrsmodelle (mit PTV Group)",
      "ML-Methoden in der Masterarbeit: Random Forests, neuronale Netze",
      "Statistische Analyse und Preisprognose bei enervis",
      "Bottom-Up-Prognosemodell für den Windenergie-Ausbau bei ProjectTogether",
      "ETL-Architektur, CI/CD und Datenbankarbeit bei ProjectTogether",
      "PostgreSQL, S3, Prefect-Orchestrierung",
    ],
  }},
  { id: "energiewirtschaft", label: "Energiewirtschaft", group: "skill", detail: {
    title: "Energiewirtschaft",
    items: [
      "Preisprognose für europäische Herkunftsnachweise (enervis energy advisors GmbH)",
      "Strommarktanalyse: Day-Ahead, Intraday, Regelleistung",
      "Modellierung von Genehmigungen und Ausbau von Windenergieanlagen (ProjectTogether gGmbH)",
      "Kurs Energiesysteme an der EPFL (Auslandssemester)",
      "Analyse regulatorischer Rahmenbedingungen (EEG): Genehmigungsdauern, Antragsvolumina, Auktionsergebnisse",
      "Datenquellen: Bundesnetzagentur, Übertragungsnetzbetreiber, Genehmigungsbehörden, Projektierer",
    ],
  }},
  { id: "python", label: "Python", group: "skill", detail: {
    title: "Python",
    items: [
      "Masterarbeit: Entwicklung der ML-Pipeline (Bevölkerungsschätzung für Verkehrsmodelle)",
      "enervis: Datenanalyse, Dashboards, Analyse-Software",
      "ProjectTogether: pandas, GeoPandas, SciPy, NumPy, Matplotlib, Seaborn, Plotly, Prefect, pytest",
      "open-MaStR: Wartung und Weiterentwicklung einer Open-Source-Bibliothek",
    ],
  }},
  { id: "matlab", label: "Matlab", group: "skill", detail: {
    title: "Matlab",
    items: [
      "BSc Physik",
      "enervis: Gemischt-ganzzahlige Optimierung (mit Xpress-MP) für Erlösprognosen für Batteriespeicher und erneuerbare Anlagen",
    ],
  }},
  { id: "latex", label: "LaTeX", group: "skill", detail: {
    title: "LaTeX",
    items: [
      "Satzerstellung von BSc- und MSc-Abschlussarbeiten",
      "Gutachtenerstellung bei AiF Projekt GmbH",
      "Wissenschaftliche Veröffentlichungen",
    ],
  }},
  { id: "kommunikation", label: "Kommunikation", group: "skill", detail: {
    title: "Kommunikation",
    items: [
      "Gutachtenerstellung in der Forschungsförderung (AiF)",
      "Fachliche Anleitung einer Data Analystin (ProjectTogether gGmbH)",
      "Teamübergreifende Koordination und technische Dokumentation",
      "Abstimmung mit externem Designstudio zur Gestaltung des Goal100 Windreports",
    ],
  }},
  { id: "praesentationen", label: "Präsentationen", group: "skill", detail: {
    title: "Präsentationen",
    items: [
      "Kunden-Workshops und Webinare bei enervis",
      "Ergebnisvorstellungen bei ProjectTogether",
      "Akademische Seminarpräsentationen im MSc",
    ],
  }},
  { id: "analytischesdenken", label: "Analytisches Denken", group: "skill", detail: {
    title: "Analytisches Denken",
    items: [
      "Analytisches Problemlösen im BSc und MSc Physik",
      "Anwendung bei der Begutachtung von Forschungsförderanträgen (AiF)",
      "Mathematische und physikalische Modellierung unter Unsicherheit",
    ],
  }},
  { id: "laborarbeit", label: "Laborarbeit", group: "skill", detail: {
    title: "Laborarbeit",
    items: [
      "BSc: Experimentelle Arbeit am Leibniz-Institut für Neue Materialien (Superkondensatoren)",
      "EPFL-Auslandssemester: Laborpraktikum zu solar-thermischen Wasserreinigungsprototypen",
    ],
  }},
  { id: "wissenschaftlichesarbeiten", label: "Wissenschaftliches Arbeiten", group: "skill", detail: {
    title: "Wissenschaftliches Arbeiten",
    items: [
      "Masterarbeit mit der PTV Group: ML zur Bevölkerungsschätzung für Verkehrsmodelle",
      "Begutachtung von Forschungsförderanträgen (AiF Projekt GmbH)",
      "Statistische Modellierung und begutachtete Veröffentlichung",
    ],
  }},
  { id: "git", label: "Git", group: "skill", detail: {
    title: "Git",
    items: [
      "Versionskontrolle bei ProjectTogether und enervis (Mitarbeit an der Codebasis)",
      "open-MaStR: Beiträge und Releases via GitHub",
      "CI/CD-Anbindung der ETL-Pipeline (ProjectTogether gGmbH)",
    ],
  }},
  { id: "projektmanagement", label: "Projektmanagement", group: "skill", detail: {
    title: "Projektmanagement",
    items: [
      "Team- und Projektmanager bei ProjectTogether gGmbH ab Mär. 2025",
      "Personaladministration: Urlaubsanträge, Anwesenheitskonten, AU-Meldungen, Zeugniserstellung",
      "Hauptverantwortlich für den Goal100 Windreport: Analyse, Koordination mit externem Designstudio",
      "Fachliche Anleitung einer Data Analystin",
    ],
  }},
  // Ergebnisse
  { id: "veroeffentlichungen", label: "Veröffentlichungen", group: "outcome", detail: {
    title: "Veröffentlichungen",
    items: [
      "Goal100 Windreport 2025/2 (Jun. 2025) – Analyse des Status quo und Modellierung der Prognose",
      "Umweltbundesamt: Analyse eines Unternehmensentwertungsrechts für Strom-Herkunftsnachweise in Deutschland, Climate Change 24/2023",
      "Oehmichen et al. (2026): Korrigierte und ergänzte Anlagendaten zu genehmigten Windkraftanlagen in Deutschland (Zenodo). https://doi.org/10.5281/zenodo.18697247",
    ],
  }},
  { id: "energiemarktmodelle", label: "Energiemarktmodelle", group: "outcome", detail: {
    title: "Energiemarktmodelle",
    items: [
      "Preisprognosemodell für europäische Herkunftsnachweise bis 2030 (enervis energy advisors GmbH)",
      "Gemischt-ganzzahlige Optimierung zur Erlösprognose von Batteriespeichern und erneuerbaren Anlagen (enervis energy advisors GmbH)",
      "Bottom-Up-Prognosemodell für den deutschen Windenergie-Ausbau bis 2035 (ProjectTogether gGmbH)",
    ],
  }},
  { id: "datenpipelines", label: "Daten- und ETL-Pipelines", group: "outcome", detail: {
    title: "Daten- und ETL-Pipelines",
    items: [
      "ETL-Pipeline: heterogene Datenquellen → S3 → PostgreSQL für goal100.studio",
      "Datenpreprocessing von Behördendaten für den Goal100 Monitor",
      "open-MaStR: Implementierung eines partiellen Downloads für v0.16.0",
    ],
  }},
  { id: "kundenworkshops", label: "Kunden-Workshops", group: "outcome", detail: {
    title: "Kunden-Workshops",
    items: [
      "Präsentationen von Strom- und Energieprognosen in Kunden-Workshops bei enervis",
      "Webinare zu Ergebnissen der Energiemarktanalysen",
    ],
  }},
  { id: "opensource", label: "Open Source", group: "outcome", detail: {
    title: "Open Source",
    items: [
      "open-MaStR: Python-Bibliothek zur Abfrage und Aufbereitung des Marktstammdatenregisters (BNetzA)",
      "Mitarbeit seit v0.15.0",
      "Implementierung eines partiellen Downloads für v0.16.0",
      "Verantwortlicher für das Release von v0.17.0",
      "Bearbeitung von Issues und Review von Pull Requests",
    ],
    url: "https://github.com/OpenEnergyPlatform/open-MaStR",
  }},
  { id: "forschungsprojekte", label: "Forschungsprojekte", group: "outcome", detail: {
    title: "Forschungsprojekte",
    items: [
      "Bachelorarbeit: Performance Evaluation of Supercapacitors Employing Nanoporous Carbon Materials – Leibniz-Institut für Neue Materialien",
      "Masterarbeit: Machine Learning Approaches for Population Estimation for Travel Demand Modelling – KIT / PTV Group",
    ],
  }},
];

// Kanten als [Quelle, Ziel] über IDs — jede Zeile ist eine Verbindung.
const LINKS = [
  // Quellen → Fähigkeiten
  ["bsc", "mathematik"],
  ["bsc", "physik"],
  ["bsc", "matlab"],
  ["bsc", "latex"],
  ["bsc", "analytischesdenken"],
  ["bsc", "laborarbeit"],
  ["bsc", "praesentationen"],
  ["msc", "mathematik"],
  ["msc", "physik"],
  ["msc", "datascience"],
  ["msc", "python"],
  ["msc", "latex"],
  ["msc", "analytischesdenken"],
  ["msc", "wissenschaftlichesarbeiten"],
  ["msc", "laborarbeit"],
  ["msc", "praesentationen"],
  ["msc", "energiewirtschaft"],
  ["aif", "kommunikation"],
  ["aif", "analytischesdenken"],
  ["aif", "wissenschaftlichesarbeiten"],
  ["enervis", "energiewirtschaft"],
  ["enervis", "mathematik"],
  ["enervis", "matlab"],
  ["enervis", "python"],
  ["enervis", "datascience"],
  ["enervis", "praesentationen"],
  ["enervis", "kommunikation"],
  ["projecttogether", "python"],
  ["projecttogether", "datascience"],
  ["projecttogether", "energiewirtschaft"],
  ["projecttogether", "kommunikation"],
  // Fähigkeiten → Ergebnisse
  ["mathematik", "veroeffentlichungen"],
  ["mathematik", "energiemarktmodelle"],
  ["mathematik", "datenpipelines"],
  ["physik", "veroeffentlichungen"],
  ["physik", "energiemarktmodelle"],
  ["physik", "forschungsprojekte"],
  ["datascience", "energiemarktmodelle"],
  ["datascience", "datenpipelines"],
  ["datascience", "veroeffentlichungen"],
  ["energiewirtschaft", "energiemarktmodelle"],
  ["energiewirtschaft", "datenpipelines"],
  ["python", "datenpipelines"],
  ["python", "energiemarktmodelle"],
  ["python", "opensource"],
  ["matlab", "energiemarktmodelle"],
  ["latex", "veroeffentlichungen"],
  ["latex", "forschungsprojekte"],
  ["kommunikation", "kundenworkshops"],
  ["kommunikation", "veroeffentlichungen"],
  ["praesentationen", "kundenworkshops"],
  ["analytischesdenken", "forschungsprojekte"],
  ["laborarbeit", "forschungsprojekte"],
  ["wissenschaftlichesarbeiten", "veroeffentlichungen"],
  ["wissenschaftlichesarbeiten", "forschungsprojekte"],
  // Quellen → Git
  ["projecttogether", "git"],
  ["enervis", "git"],
  // Quellen → Projektmanagement
  ["projecttogether", "projektmanagement"],
  // Git → Ergebnisse
  ["git", "datenpipelines"],
  ["git", "opensource"],
  ["git", "veroeffentlichungen"],
  // Projektmanagement → Ergebnisse
  ["projektmanagement", "kundenworkshops"],
  ["projektmanagement", "veroeffentlichungen"],
  ["projektmanagement", "datenpipelines"],
  ["projektmanagement", "forschungsprojekte"],
];

// ───────────────────────────────────────────────────────────────────────────
// Derivation — Plotly-Eingaben werden aus dem Modell oben berechnet.
// ───────────────────────────────────────────────────────────────────────────

function evenY(n) {
  return Array.from({ length: n }, (_, i) => (i + 0.5) / n);
}

const idIndex = Object.fromEntries(NODES.map((n, i) => [n.id, i]));

const nodeLabels = NODES.map(n => n.label);
const nodeColors = NODES.map(n => GROUP_STYLE[n.group].color);
const nodeX      = NODES.map(n => GROUP_STYLE[n.group].x);
const nodeDetail = NODES.map(n => n.detail);

// nodeY: jede Gruppe füllt ihre Spalte gleichmäßig (Reihenfolge: source, skill, outcome).
const nodeY = ["source", "skill", "outcome"].flatMap(group => {
  const members = NODES.filter(n => n.group === group);
  return evenY(members.length);
});

const linkSource = LINKS.map(([s]) => idIndex[s]);
const linkTarget = LINKS.map(([, t]) => idIndex[t]);

// Flusserhaltung: jede ausgehende Kante eines Fähigkeits-Knotens wird mit nIn/nOut
// gewichtet, damit der Knoten auf beiden Seiten gleich hoch gefüllt ist.
const inCount  = {};
const outCount = {};
linkSource.forEach((src, i) => {
  outCount[src] = (outCount[src] || 0) + 1;
  inCount[linkTarget[i]] = (inCount[linkTarget[i]] || 0) + 1;
});
const linkValue = linkSource.map(src =>
  NODES[src].group === "skill" ? inCount[src] / outCount[src] : 1
);
