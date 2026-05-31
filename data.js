const nodeLabels = [
  // Quellen (0–4)
  "BSc Physik",
  "MSc Physik",
  "AiF Projekt GmbH",
  "enervis energy advisors GmbH",
  "ProjectTogether gGmbH",
  // Fähigkeiten (5–17)
  "Mathematik",
  "Physik",
  "Informatik",
  "Data Science",
  "Energiewirtschaft",
  "Python",
  "Matlab",
  "LaTeX",
  "Kommunikation",
  "Präsentationen",
  "Analytisches Denken",
  "Laborarbeit",
  "Wissenschaftliches Arbeiten",
  // Ergebnisse (18–23)
  "Veröffentlichungen",
  "Energiemarktmodelle",
  "Daten- & ETL-Pipelines",
  "Kunden-Workshops",
  "Open Source",
  "Forschungsprojekte",
];

const nodeColors = [
  // Quellen — blau
  "#4C78A8","#4C78A8","#4C78A8","#4C78A8","#4C78A8",
  // Fähigkeiten — lila
  "#9C59D1","#9C59D1","#9C59D1","#9C59D1","#9C59D1",
  "#9C59D1","#9C59D1","#9C59D1","#9C59D1","#9C59D1",
  "#9C59D1","#9C59D1","#9C59D1",
  // Ergebnisse — grün
  "#54A24B","#54A24B","#54A24B","#54A24B","#54A24B","#54A24B",
];

const linkSource = [
  // Quellen → Fähigkeiten
  0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  2, 2, 2,
  3, 3, 3, 3, 3, 3, 3,
  4, 4, 4, 4, 4, 4,
  // Fähigkeiten → Ergebnisse
  5, 5, 5,
  6, 6, 6,
  7,
  8, 8, 8,
  9, 9,
  10, 10, 10,
  11,
  12, 12,
  13, 13,
  14,
  15,
  16,
  17, 17,
];

const linkTarget = [
  // Quellen → Fähigkeiten
  5, 6, 11, 12, 15, 16,
  5, 6, 8, 10, 7, 12, 15, 17, 16, 14, 9,
  13, 15, 17,
  9, 5, 11, 10, 8, 14, 13,
  10, 8, 7, 9, 13, 14,
  // Fähigkeiten → Ergebnisse
  18, 19, 20,
  18, 19, 23,
  20,
  19, 20, 18,
  19, 20,
  20, 19, 22,
  19,
  18, 23,
  21, 18,
  21,
  23,
  23,
  18, 23,
];

const linkValue = linkSource.map((src) => {
  if (src >= 5 && src <= 17) {
    const nIn  = linkTarget.filter(t => t === src).length;
    const nOut = linkSource.filter(s => s === src).length;
    return nIn / nOut;
  }
  return 1;
});

function evenY(n) {
  return Array.from({length: n}, (_, i) => (i + 0.5) / n);
}
const nodeX = [...Array(5).fill(0.001), ...Array(13).fill(0.5), ...Array(6).fill(0.999)];
const nodeY = [...evenY(5), ...evenY(13), ...evenY(6)];

const nodeData = {
  // Quellen
  0: {
    title: "BSc Physik",
    subtitle: "2013 – 2016",
    items: [
      "Universität des Saarlandes, Saarbrücken",
      "Nebenfach: Mathematik",
      "Bachelorarbeit am Leibniz-Institut für Neue Materialien: Performance Evaluation of Supercapacitors Employing Nanoporous Carbon Materials",
      "Abschlussnote: 1,9",
    ],
  },
  1: {
    title: "MSc Physik",
    subtitle: "2016 – 2020",
    items: [
      "Karlsruher Institut für Technologie (KIT)",
      "Schwerpunkt: Mathematische Modellierung komplexer Systeme",
      "Masterarbeit (mit PTV Group): Machine Learning Approaches for Population Estimation for Travel Demand Modelling",
      "Auslandssemester an der EPFL Lausanne, 2017–2018",
      "Abschlussnote: 1,4",
    ],
  },
  2: {
    title: "AiF Projekt GmbH",
    subtitle: "Okt. 2020 – Jul. 2021",
    items: [
      "Wissenschaftlicher Mitarbeiter, Berlin",
      "Erstellung von Gutachten in der Forschungsförderung",
    ],
  },
  3: {
    title: "enervis energy advisors",
    subtitle: "Aug. 2021 – Jun. 2024",
    items: [
      "Mathematiker, Berlin",
      "Alleinige Entwicklungsverantwortung für ein Preisprognosemodell für europäische Herkunftsnachweise bis 2030",
      "Implementierung von gemischt-ganzzahligen Optimierungsproblemen (Matlab & Xpress-MP) zur Erlösprognose von Großbatteriespeichern und erneuerbaren Anlagen",
      "Analysen von historischen und prognostizierten Strompreisen und Energiemengen (Day-Ahead, Intraday, Regelleistung)",
      "Ergebnisvorstellung gegenüber Kunden im Rahmen von Workshops und Webinaren",
    ],
  },
  4: {
    title: "ProjectTogether",
    subtitle: "Dez. 2024 – heute",
    items: [
      "Data Analyst & Team- und Projektmanager, Berlin",
      "Betrieb einer ETL-Pipeline (Python, Prefect, S3, PostgreSQL) für goal100.studio",
      "Datenpreprocessing von Behördendaten zum Genehmigungsprozess von Windenergieanlagen (Goal100 Monitor)",
      "Parametrisierung eines Bottom-Up-Prognosemodells für den deutschen Windenergie-Ausbau bis 2035",
      "Fachliche Anleitung einer Data Analystin zur Entwicklung einer ETL-Pipeline",
    ],
  },
  // Fähigkeiten
  5: {
    title: "Mathematik",
    items: [
      "Kernfach im BSc & MSc Physik",
      "Angewendet in der Energiemarktmodellierung und Optimierung bei enervis",
      "Stochastische Methoden, numerische Simulation, analytisches Problemlösen",
    ],
  },
  6: {
    title: "Physik",
    items: [
      "Hauptfach im BSc & MSc",
      "Schwerpunkt auf Theorie der Kondensierten Materie und Theoretischer Teilchenphysik",
      "Physikalische und mathematische Modellierung komplexer Systeme",
    ],
  },
  7: {
    title: "Informatik",
    items: [
      "ML-Methoden in der Masterarbeit: Random Forests, neuronale Netze",
      "ETL-Architektur, CI/CD und Datenbankarbeit bei ProjectTogether",
      "PostgreSQL, S3, Prefect-Orchestrierung",
    ],
  },
  8: {
    title: "Data Science",
    items: [
      "Masterarbeit: ML zur Bevölkerungsschätzung aus Geodaten",
      "Statistische Analyse und Preisprognose bei enervis",
      "Bottom-Up-Prognosemodell für den Windenergie-Ausbau bei ProjectTogether",
    ],
  },
  9: {
    title: "Energiewirtschaft",
    items: [
      "Preisprognose für europäische Herkunftsnachweise (enervis)",
      "Strommarktanalyse: Day-Ahead, Intraday, Regelleistung",
      "Modellierung von Genehmigungen und Ausbau von Windenergieanlagen (ProjectTogether)",
      "Kurs Energiesysteme an der EPFL (Auslandssemester)",
    ],
  },
  10: {
    title: "Python",
    items: [
      "Masterarbeit: Entwicklung einer ML-Pipeline",
      "enervis: Datenanalyse, Dashboards, Analyse-Software",
      "ProjectTogether: pandas, GeoPandas, SciPy, NumPy, Matplotlib, Prefect, pytest",
      "open-MaStR: Wartung und Weiterentwicklung einer Open-Source-Bibliothek",
    ],
  },
  11: {
    title: "Matlab",
    items: [
      "BSc & MSc Studium",
      "enervis: Gemischt-ganzzahlige Optimierung mit Xpress-MP",
      "Erlösprognose für Batteriespeicher und erneuerbare Anlagen",
    ],
  },
  12: {
    title: "TeX",
    items: [
      "Satzerstellung von BSc- & MSc-Abschlussarbeiten",
      "Gutachtenerstellung bei AiF Projekt GmbH",
      "Wissenschaftliche Veröffentlichungen",
    ],
  },
  13: {
    title: "Kommunikation",
    items: [
      "Gutachtenerstellung in der Forschungsförderung (AiF)",
      "Fachliche Anleitung einer Data Analystin (ProjectTogether)",
      "Teamübergreifende Koordination und technische Dokumentation",
    ],
  },
  14: {
    title: "Präsentationen",
    items: [
      "Kunden-Workshops und Webinare bei enervis",
      "Ergebnisvorstellungen bei ProjectTogether",
      "Akademische Seminarpräsentationen im MSc",
    ],
  },
  15: {
    title: "Analytisches Denken",
    items: [
      "Analytisches Problemlösen im BSc & MSc Physik entwickelt",
      "Angewendet bei der Begutachtung von Forschungsförderanträgen (AiF)",
      "Mathematische und physikalische Modellierung unter Unsicherheit",
    ],
  },
  16: {
    title: "Laborarbeit",
    items: [
      "BSc: Experimentelle Arbeit am Leibniz-Institut für Neue Materialien (Superkondensatoren)",
      "EPFL-Auslandssemester: Laborpraktikum zu solar-thermischen Wasserreinigungsprototypen",
    ],
  },
  17: {
    title: "Wissenschaftliches Arbeiten",
    items: [
      "Masterarbeit in Kooperation mit der PTV Group (ML für Verkehrsmodelle)",
      "Begutachtung von Forschungsförderanträgen (AiF Projekt GmbH)",
      "Statistische Modellierung und begutachtete Veröffentlichung",
    ],
  },
  // Ergebnisse
  18: {
    title: "Veröffentlichungen",
    items: [
      "Goal100 Windreport 2025_2 (Jun. 2025) – Analyse des Status quo und Modellierung der Prognose",
      "Umweltbundesamt: Analyse eines Unternehmensentwertungsrechts für Strom-Herkunftsnachweise in Deutschland, Climate Change 24/2023",
    ],
  },
  19: {
    title: "Energiemarktmodelle",
    items: [
      "Preisprognosemodell für europäische Herkunftsnachweise bis 2030 (enervis)",
      "Gemischt-ganzzahlige Optimierung zur Erlösprognose von Batteriespeichern und erneuerbaren Anlagen (enervis)",
      "Bottom-Up-Prognosemodell für den deutschen Windenergie-Ausbau bis 2035 (ProjectTogether)",
    ],
  },
  20: {
    title: "Daten- & ETL-Pipelines",
    items: [
      "ETL-Pipeline: heterogene Datenquellen → S3 → PostgreSQL für goal100.studio",
      "Datenpreprocessing von Behördendaten für den Goal100 Monitor",
      "open-MaStR: Implementierung eines partiellen Downloads für v0.16.0",
    ],
  },
  21: {
    title: "Kunden-Workshops",
    items: [
      "Präsentationen von Strom- und Energieprognosen in Kunden-Workshops bei enervis",
      "Webinare zu Ergebnissen der Energiemarktanalyse",
    ],
  },
  22: {
    title: "Open Source",
    items: [
      "open-MaStR: Python-Bibliothek zur Abfrage und Aufbereitung des Marktstammdatenregisters (BNetzA)",
      "Mitarbeit seit v0.15.0",
      "Implementierung eines partiellen Downloads für v0.16.0",
      "Verantwortlicher für das Release von v0.17.0",
      "Bearbeitung von Issues und Review von Pull Requests",
    ],
    url: "https://github.com/OpenEnergyPlatform/open-MaStR",
  },
  23: {
    title: "Forschungsprojekte",
    items: [
      "Bachelorarbeit: Performance Evaluation of Supercapacitors Employing Nanoporous Carbon Materials – Leibniz-Institut für Neue Materialien",
      "Masterarbeit: Machine Learning Approaches for Population Estimation for Travel Demand Modelling – KIT / PTV Group",
    ],
  },
};
