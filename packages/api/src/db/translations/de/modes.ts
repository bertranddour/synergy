import type { ModeTranslation } from '../../schema.js'

export const deModes: Record<string, ModeTranslation> = {
  validation: {
    name: 'Validierungsmodus',
    purpose:
      'Teste deine riskanteste Geschäftsannahme mit Belegen und triff eine klare Weitermachen/Umschwenken/Erneut-testen-Entscheidung.',
    trigger:
      'Nutze diesen Modus, wenn du eine wichtige Geschäftsentscheidung auf Basis einer ungeprüften Annahme treffen willst.',
    flowName: 'Validierung',
    doneSignal:
      'Kannst du deine Annahme, die Belege dafür oder dagegen und deine Entscheidung in einem Satz formulieren?',
    fieldsSchema: [
      {
        name: 'Annahme',
        description: 'Die konkrete Überzeugung, die du testest. Muss widerlegbar sein.',
        type: 'text' as const,
        required: true,
        example: 'Freelance-Designer zahlen 49 €/Monat für automatisierte Rechnungsstellung.',
      },
      {
        name: 'Risikoniveau',
        description: 'Wie groß ist der Schaden, wenn diese Annahme falsch ist.',
        type: 'text' as const,
        required: true,
        options: ['Hoch', 'Mittel', 'Niedrig'],
      },
      {
        name: 'Aktuelle Belege',
        description: 'Was du bereits weißt. Daten, Gespräche, Signale.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Experimentdesign',
        description: 'Der günstigste, schnellste Test, der die Annahme widerlegen könnte.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Erfolgskriterien',
        description: 'Die konkrete Zahl, die bedeutet, dass die Annahme stimmt.',
        type: 'text' as const,
        required: true,
        example: '5 % Anmeldequote innerhalb von 7 Tagen.',
      },
      {
        name: 'Zeitrahmen',
        description: 'Wie lange das Experiment läuft.',
        type: 'text' as const,
        required: true,
        example: '7 Tage.',
      },
      {
        name: 'Ergebnisse',
        description: 'Was tatsächlich passiert ist. Rohdaten, keine Interpretation.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Entscheidung',
        description: 'Basierend auf den Belegen: Weitermachen, Umschwenken oder Erneut testen.',
        type: 'text' as const,
        required: true,
        options: ['Weitermachen', 'Umschwenken', 'Erneut testen'],
      },
      {
        name: 'Nächste Aktion',
        description: 'Der konkrete nächste Schritt mit Datum.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Annahme-Update',
        description: 'Wie hat sich diese Annahme aufgrund deiner Erkenntnisse verändert?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Annahmen aus dem Business-Engine-Modus fließen in die Validierung ein',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Annahme mit höchster Priorität aus dem Prioritätenstapel',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Experimentergebnisse fließen in die Erkenntniserfassung ein',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Validierte Ergebnisse können für die Teamüberprüfung verpackt werden',
      },
    ],
  },
  'insight-capture': {
    name: 'Erkenntniserfassung',
    purpose: 'Verwandle Rohsignale aus deinem Markt in strukturierte Muster und umsetzbare nächste Schritte.',
    trigger: 'Nutze diesen Modus, wenn du Rohdaten, Kundengespräche oder Marktsignale hast, die Struktur brauchen.',
    flowName: 'Validierung',
    doneSignal:
      'Kannst du diese Erkenntnis jemandem erklären, der nicht dabei war, mit genug Kontext, damit die Person handeln kann?',
    fieldsSchema: [
      {
        name: 'Signalquelle',
        description: 'Woher kam diese Erkenntnis?',
        type: 'text' as const,
        required: true,
        options: [
          'Kundengespräch',
          'Nutzungsdaten',
          'Marktforschung',
          'Wettbewerbsbeobachtung',
          'Team-Feedback',
          'Sonstiges',
        ],
      },
      {
        name: 'Rohsignal',
        description: 'Die genaue Beobachtung, das Zitat oder der Datenpunkt.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Musterabgleich',
        description: 'Verbindet sich das mit etwas, das du schon einmal gesehen hast?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Stärke',
        description: 'Wie stark ist dieses Signal?',
        type: 'text' as const,
        required: true,
        options: ['Stark (mehrere Quellen)', 'Mäßig (2+ Signale)', 'Schwach (einzelnes Signal)'],
      },
      {
        name: 'Auswirkung',
        description: 'Wenn dieses Signal real ist, was bedeutet es für dein Business?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Aktion',
        description: 'Welchen konkreten nächsten Schritt treibt diese Erkenntnis an?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Experimentergebnisse fließen in die Erkenntniserfassung ein',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Validierte Erkenntnisse informieren Wertversprechen',
      },
    ],
  },
  'proposition-builder': {
    name: 'Wertversprechen-Builder',
    purpose: 'Erstelle evidenzbasierte Wertversprechen in drei Stufen: Basis, Zufriedensteller, Begeisterer.',
    trigger: 'Nutze diesen Modus, wenn du formulieren musst, was du anbietest und warum es zählt, belegt durch Fakten.',
    flowName: 'Validierung',
    doneSignal:
      'Kann ein neues Teammitglied dein Wertversprechen in 30 Sekunden erklären, einschließlich Zielgruppe und warum es sie interessiert?',
    fieldsSchema: [
      {
        name: 'Zielkunde',
        description: 'Für wen genau ist dieses Wertversprechen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Problembeschreibung',
        description: 'Das konkrete Problem, das du löst, in deren Worten.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Basis-Stufe',
        description: 'Der minimale Mehrwert — was du liefern musst.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Zufriedensteller-Stufe',
        description: 'Erwarteter Mehrwert, der dem Standard entspricht.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Begeisterer-Stufe',
        description: 'Unerwarteter Mehrwert, der Loyalität erzeugt.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Belege',
        description: 'Welche validierten Daten stützen jede Stufe?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Differenzierung',
        description: 'Was unterscheidet dein Wertversprechen von Alternativen?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Validierte Erkenntnisse informieren Wertversprechen',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Wertversprechen fließen in das Geschäftsmodelldesign ein',
      },
    ],
  },
  'business-engine': {
    name: 'Business-Engine-Modus',
    purpose: 'Bilde deine Geschäftsmodellannahmen ab und identifiziere, welche den Motor zum Stehen bringen könnten.',
    trigger:
      'Nutze diesen Modus, wenn du verstehen musst, wie dein Business als System funktioniert und welche Annahmen tragend sind.',
    flowName: 'Strategie',
    doneSignal:
      'Kannst du dein Geschäftsmodell in einem Satz erklären, die riskanteste Annahme benennen und sagen, welche Belege du dafür hast?',
    fieldsSchema: [
      {
        name: 'Erlösmodell',
        description: 'Wie kommt Geld rein? Sei konkret bei Preisgestaltung und Kanälen.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kostenstruktur',
        description: 'Wohin fließt das Geld? Fixe vs. variable Kosten.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kernannahmen',
        description: 'Liste die 3–5 Annahmen, von denen dein Modell abhängt.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Riskanteste Annahme',
        description: 'Welche Annahme bricht das Modell, wenn sie falsch ist?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Aktuelle Belege',
        description: 'Welche Daten stützen oder widersprechen jeder Annahme?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Stückökonomie',
        description: 'Umsatz pro Einheit, Kosten pro Einheit, Marge.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Annahmen fließen in die Prioritätenrangfolge ein',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Riskanteste Annahme sollte validiert werden' },
    ],
  },
  'priority-stack': {
    name: 'Prioritätenstapel-Modus',
    purpose: 'Erstelle ein evidenzbasiertes Zwangsranking von Prioritäten mit einer klaren Nicht-tun-Liste.',
    trigger:
      'Nutze diesen Modus, wenn du mehr Aufgaben als Zeit hast und schonungslose Klarheit brauchst, was wirklich zählt.',
    flowName: 'Strategie',
    doneSignal: 'Kannst du jemandem deine Top 3 Prioritäten und deine Nicht-tun-Liste ohne Zögern nennen?',
    fieldsSchema: [
      {
        name: 'Kandidaten',
        description: 'Liste alles, was gerade um deine Aufmerksamkeit konkurriert.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kriterien',
        description: 'Nach welchen Kriterien rankst du? Wirkung, Dringlichkeit, Belegstärke.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Zwangsranking',
        description: 'Ranke alle Kandidaten von 1 bis N. Keine Gleichplatzierungen erlaubt.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Top 3',
        description: 'Deine Top 3 Prioritäten mit jeweils einer Begründung in einem Satz.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Nicht-tun-Liste',
        description: 'Alles unterhalb der Grenze. Sag es explizit.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Zeitaufteilung',
        description: 'Wie verteilst du deine Zeit auf die Top 3 in diesem Zeitraum?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Annahmen aus dem Business-Engine-Modus müssen gerankt werden',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Top-Prioritäten fließen ins Ausführungstracking ein',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Annahme mit höchster Priorität geht zur Validierung',
      },
    ],
  },
  'execution-tracker': {
    name: 'Ausführungstracker-Modus',
    purpose: 'Verfolge Arbeitssichtbarkeit und identifiziere Blocker mit Async-first-Statusverfolgung.',
    trigger: 'Nutze diesen Modus, wenn du sehen musst, was passiert, was feststeckt und was entblockt werden muss.',
    flowName: 'Ausführung',
    doneSignal:
      'Kannst du alle aktiven Arbeiten sehen, wissen was blockiert ist und eine konkrete Entblockungsaktion für jeden Blocker haben?',
    fieldsSchema: [
      {
        name: 'Arbeitselemente',
        description: 'Liste aktive Arbeitselemente, die mit deinen Prioritäten verbunden sind.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Status',
        description: 'Für jedes Element: Nicht gestartet, In Bearbeitung, Blockiert, Erledigt.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Blocker',
        description: 'Was ist blockiert und warum? Sei konkret.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Entblockungsaktionen',
        description: 'Für jeden Blocker: Wer muss was bis wann tun?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Durchlaufzeit',
        description: 'Wie lange dauert es von Start bis Abschluss bei aktuellen Elementen?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Prioritäten definieren, was verfolgt wird' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Abgeschlossene Elemente gehen zur Lieferprüfung',
      },
    ],
  },
  'delivery-check': {
    name: 'Lieferprüfung',
    purpose: 'Qualitätsprüfung für abgeschlossene Arbeit und Überwachung der Leistung nach Lieferung.',
    trigger:
      'Nutze diesen Modus, wenn Arbeit erledigt ist und eine Qualitätsprüfung braucht, bevor sie als ausgeliefert gilt.',
    flowName: 'Ausführung',
    doneSignal: 'Kannst du sicher sagen, dass dieses Ergebnis bereit ist für die Person, die es erhält?',
    fieldsSchema: [
      {
        name: 'Liefergegenstand',
        description: 'Was wurde geliefert? Sei konkret.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Qualitätskriterien',
        description: 'Welche Standards muss es erfüllen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Qualitätsbewertung',
        description: 'Erfüllt es jedes Kriterium? Bestanden/Nicht bestanden pro Element.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Gefundene Mängel',
        description: 'Was muss vor der Auslieferung behoben werden?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Überwachung nach Lieferung',
        description: 'Was beobachtest du nach der Lieferung, um die Qualität zu bestätigen?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Abgeschlossene Arbeitselemente aus dem Ausführungstracker',
      },
    ],
  },
  'information-architecture': {
    name: 'Informationsarchitektur-Modus',
    purpose: 'Gestalte, wo Informationen liegen, damit Menschen in 5 Minuten finden, was sie brauchen, ohne zu fragen.',
    trigger:
      'Nutze diesen Modus, wenn ständig gefragt wird, wo Dinge sind, Informationen dupliziert oder verloren gehen, oder neue Teammitglieder nicht finden, was sie brauchen.',
    flowName: 'Informieren',
    doneSignal: 'Kann ein neues Teammitglied jede kritische Information in 5 Minuten finden, ohne jemanden zu fragen?',
    fieldsSchema: [
      {
        name: 'Informationsaudit',
        description: 'Wo liegen Informationen aktuell? Liste alle Tools und Orte.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Schmerzpunkte',
        description: 'Welche Informationen sind am schwersten zu finden? Welche Fragen werden immer wieder gestellt?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kategorien',
        description: 'Gruppiere Informationen in logische Kategorien.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Single Source of Truth',
        description: 'Für jede Kategorie: Wo ist der kanonische Speicherort?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Auffindbarkeitstest',
        description: 'Kann ein neues Teammitglied X in 5 Minuten finden? Teste 3 häufige Elemente.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Informationsstruktur ermöglicht asynchrones Arbeitsdesign',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Informationskategorien fließen in die KI-Wissensstruktur ein',
      },
    ],
  },
  'flex-work-design': {
    name: 'Flexibles-Arbeiten-Design',
    purpose: 'Definiere Async-Standardwerte, Sync-Ausnahmen, Meeting-Budget und Energierhythmen für dein Team.',
    trigger:
      'Nutze diesen Modus, wenn dein Team zu viel Zeit in Meetings verbringt, über Zeitzonen hinweg arbeitet oder mit Work-Life-Grenzen kämpft.',
    flowName: 'Informieren',
    doneSignal:
      'Kann jedes Teammitglied erklären, wann Async der Standard ist, wann Sync angemessen ist und wie hoch das Meeting-Budget ist?',
    fieldsSchema: [
      {
        name: 'Aktuelle Meeting-Last',
        description: 'Wie viele Stunden pro Woche verbringt jede Person in Meetings?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Async-Standard',
        description: 'Was ist dein Standard: Async oder Sync? Definiere die Regel.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Sync-Ausnahmen',
        description: 'Was erfordert konkret Echtzeit-Interaktion?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Meeting-Budget',
        description: 'Maximale Meeting-Stunden pro Person pro Woche.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Energierhythmen',
        description: 'Wann sind die Leute am produktivsten? Wie schützt du Tiefenarbeit?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Zeitzonen-Protokoll',
        description: 'Wie handhabt ihr Async über Zeitzonen? Überlappungsstunden?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Informationsstruktur ermöglicht flexibles Arbeiten',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Arbeitsdesign fließt in den Team-Rhythmus ein' },
    ],
  },
  'team-rhythm': {
    name: 'Team-Rhythmus-Modus',
    purpose: 'Gestalte deinen Wochenrhythmus: Sync-Berührungspunkte, Tiefenarbeitsblöcke, Energie-Checkpoints.',
    trigger:
      'Nutze diesen Modus, wenn dem Team ein konsistenter Rhythmus fehlt, niemand weiß, wann Updates kommen, oder Tiefenarbeit ständig unterbrochen wird.',
    flowName: 'Koordinieren',
    doneSignal: 'Kennt jedes Teammitglied den Wochenrhythmus, ohne in den Kalender zu schauen?',
    fieldsSchema: [
      {
        name: 'Wochenrhythmus',
        description: 'Bilde den wiederkehrenden Wochenrhythmus des Teams ab.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Sync-Berührungspunkte',
        description: 'Liste die wesentlichen Sync-Momente und ihren Zweck.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Tiefenarbeitsblöcke',
        description: 'Wann sind geschützte Fokusphasen? Wie werden sie durchgesetzt?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Energie-Checkpoints',
        description: 'Wie prüfst du Team-Energie und Arbeitsbelastung?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Arbeitsdesign definiert Rhythmus-Einschränkungen',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Rhythmus definiert, wann Entscheidungen async vs. sync getroffen werden',
      },
    ],
  },
  'async-decision': {
    name: 'Async-Entscheidungsmodus',
    purpose:
      'Triff eine klare Entscheidung asynchron mit strukturierter Fragestellung, Optionen, Deadline und Widerspruchsprotokoll.',
    trigger:
      'Nutze diesen Modus, wenn eine Entscheidung getroffen werden muss und ein Meeting nicht der beste Weg dafür ist.',
    flowName: 'Koordinieren',
    doneSignal: 'Ist die Entscheidung dokumentiert, die Begründung festgehalten und alle Beteiligten informiert?',
    fieldsSchema: [
      {
        name: 'Entscheidungsfrage',
        description: 'Die konkrete Frage, über die entschieden wird. Ein Satz.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Optionen',
        description: 'Die zur Wahl stehenden Optionen mit Vor-/Nachteilen.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Entscheider',
        description: 'Wer trifft die endgültige Entscheidung?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Deadline',
        description: 'Bis wann muss die Entscheidung getroffen werden?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Input angefordert von',
        description: 'Wer muss sich vor der Deadline äußern?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Widerspruchsprotokoll',
        description: 'Wie kann jemand widersprechen? Was passiert mit Einwänden?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Entscheidungsprotokoll',
        description: 'Die endgültige Entscheidung, Begründung und wer konsultiert wurde.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Entscheidungen sollten für die Team-Sichtbarkeit verpackt werden',
      },
    ],
  },
  package: {
    name: 'Paket-Modus',
    purpose: 'Erstelle eigenständige Kommunikationspakete, die keine Rückfragen erfordern.',
    trigger:
      'Nutze diesen Modus, wenn du Arbeit, Updates oder Entscheidungen mit Personen teilst, die nicht dabei waren.',
    flowName: 'Kommunizieren',
    doneSignal: 'Kann jemand auf Basis dieses Pakets handeln, ohne eine einzige Rückfrage zu stellen?',
    fieldsSchema: [
      {
        name: 'Kontext',
        description: 'Was muss der Leser wissen, um das zu verstehen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kernpunkte',
        description: 'Die 3–5 wichtigsten Punkte. Nummeriert.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Entscheidung nötig',
        description: 'Wird eine Entscheidung benötigt? Von wem? Bis wann?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Deadline', description: 'Bis wann muss der Leser antworten?', type: 'text' as const, required: true },
      {
        name: 'Feedback-Format',
        description: 'Wie soll der Leser reagieren? Kommentieren, genehmigen, bearbeiten?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Validierungsergebnisse können verpackt werden' },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Entscheidungen sollten verpackt werden' },
    ],
  },
  'contribution-tracker': {
    name: 'Beitragstracker-Modus',
    purpose: 'Mache unsichtbare Arbeit sichtbar über 5 Beitragstypen.',
    trigger:
      'Nutze diesen Modus, wenn Teammitglieder kritische Arbeit leisten, die niemand sieht, oder Anerkennung verzerrt auf sichtbare Ergebnisse ausgerichtet ist.',
    flowName: 'Anerkennen',
    doneSignal: 'Kannst du Beiträge über alle 5 Typen sehen, nicht nur Lieferung?',
    fieldsSchema: [
      {
        name: 'Teammitglied',
        description: 'Für wen verfolgst du die Beiträge?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Lieferung', description: 'Greifbare ausgelieferte Ergebnisse.', type: 'text' as const, required: true },
      {
        name: 'Mentoring',
        description: 'Anderen helfen zu wachsen, Pairing, Reviews, Lehren.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dokumentation',
        description: 'Texte, die anderen helfen, eigenständig zu arbeiten.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Prozessverbesserung',
        description: 'Systeme, Tools oder Workflows verbessern.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Entblocken', description: 'Hindernisse für andere beseitigen.', type: 'text' as const, required: true },
    ],
    composabilityHooks: [],
  },
  'culture-at-distance': {
    name: 'Kultur-auf-Distanz-Modus',
    purpose:
      'Definiere beobachtbare Verhaltensweisen, Rituale, Konfliktprotokoll und Vertrauenssignale für verteilte Teams.',
    trigger:
      'Nutze diesen Modus, wenn die Kultur in einem verteilten Team dünn wirkt — die Leute sind produktiv, aber nicht verbunden.',
    flowName: 'Kultur',
    doneSignal: 'Könnte ein neuer Remote-Mitarbeiter deine Teamkultur allein aus der Dokumentation verstehen?',
    fieldsSchema: [
      {
        name: 'Beobachtbare Verhaltensweisen',
        description: 'Welche Verhaltensweisen definieren deine Kultur? Liste 5, die in async Arbeit sichtbar sind.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Rituale',
        description: 'Regelmäßige Praktiken, die die Kultur stärken. Keine Meetings — Rituale.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Konfliktprotokoll',
        description: 'Wie geht ihr mit Meinungsverschiedenheiten um, wenn ihr keine Körpersprache lesen könnt?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Vertrauenssignale',
        description: 'Was baut Vertrauen in deinem verteilten Team auf? Was untergräbt es?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Anti-Muster',
        description: 'Welche Verhaltensweisen versuchst du aktiv zu verhindern?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  dashboard: {
    name: 'Dashboard-Modus',
    purpose:
      'Richte duale Kennzahlen ein: Leistung (Lösungszeit, Durchlaufzeit) und Dynamik (Lernen, Zusammenarbeit, Spaß).',
    trigger:
      'Nutze diesen Modus beim Skalieren über 50 Personen hinaus, wenn klassische Kennzahlen die menschliche Seite der Organisation übersehen.',
    flowName: 'Überwachen',
    doneSignal: 'Kannst du sowohl Leistung als auch Dynamik auf einen Blick sehen und weißt, wann du handeln musst?',
    fieldsSchema: [
      {
        name: 'Leistungskennzahlen',
        description: 'Wichtige operative Kennzahlen: Durchlaufzeit, Lösungszeit, Vorlaufzeit.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dynamik-Kennzahlen',
        description: 'Menschliche Kennzahlen: Lernrate, Zusammenarbeitswert, Engagement, Spaß.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Datenquellen', description: 'Woher stammt jede Kennzahl?', type: 'text' as const, required: true },
      {
        name: 'Überprüfungsrhythmus',
        description: 'Wie oft werden diese überprüft und von wem?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Aktionsauslöser',
        description: 'Welche Kennzahlniveaus lösen eine Aktion aus?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Dashboard-Signale fließen in die Organisationsstrukturüberprüfung ein',
      },
    ],
  },
  'org-map': {
    name: 'Org-Map-Modus',
    purpose: 'Erstelle eine Vogelperspektive deiner Organisation: Teamtypen, Lücken und Überschneidungen.',
    trigger: 'Nutze diesen Modus, wenn die Organisation wächst und du das Gesamtbild sehen musst.',
    flowName: 'Struktur',
    doneSignal: 'Kannst du deine Organisationsstruktur einem neuen VP in 5 Minuten erklären?',
    fieldsSchema: [
      {
        name: 'Teams',
        description: 'Liste alle Teams mit Typ: Mission, Plattform oder Führungskreis.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Teamgrößen', description: 'Personenzahl pro Team.', type: 'text' as const, required: true },
      { name: 'Lücken', description: 'Welche Fähigkeiten fehlen?', type: 'text' as const, required: true },
      {
        name: 'Überschneidungen',
        description: 'Wo duplizieren Teams den Aufwand?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Org-Map identifiziert Teams, die Blueprints brauchen',
      },
    ],
  },
  'team-blueprint': {
    name: 'Team-Blueprint-Modus',
    purpose: 'Definiere Mission, Mitglieder, Entscheidungsbefugnis, Rhythmus und Qualitätsstandards für ein Team.',
    trigger:
      'Nutze diesen Modus beim Erstellen eines neuen Teams oder wenn einem bestehenden Team Klarheit über Zweck und Befugnisse fehlt.',
    flowName: 'Struktur',
    doneSignal: 'Kann jedes Teammitglied die Mission, seine Rolle und welche Entscheidungen es treffen kann, benennen?',
    fieldsSchema: [
      {
        name: 'Team-Mission',
        description: 'Warum existiert dieses Team? Ein Satz.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Mitglieder',
        description: 'Wer ist im Team und was sind ihre Rollen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Entscheidungsbefugnis',
        description: 'Welche Entscheidungen kann dieses Team ohne Eskalation treffen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Rhythmus',
        description: 'Wie kommuniziert und koordiniert sich das Team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Qualitätsstandards',
        description: 'Welche Qualitätsmesslatte hält dieses Team?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Team-Blueprints definieren Knoten in der Verbindungskarte',
      },
    ],
  },
  'connection-map': {
    name: 'Verbindungskarte-Modus',
    purpose: 'Bilde Team-Interaktionen ab: reibungslos, mit Reibung oder defekt. Finde Engpässe.',
    trigger:
      'Nutze diesen Modus, wenn teamübergreifende Koordination langsam ist, Übergaben verloren gehen oder Teams sich gegenseitig beschuldigen.',
    flowName: 'Verbinden',
    doneSignal:
      'Kannst du jemandem eine Karte aller Team-Verbindungen mit Qualitätsbewertungen und Engpass-Lösungen zeigen?',
    fieldsSchema: [
      {
        name: 'Team-Paare',
        description: 'Liste alle Team-zu-Team-Interaktionspaare.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Interaktionsqualität',
        description: 'Für jedes Paar: Reibungslos, Reibung oder Defekt.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Engpässe',
        description: 'Welche Team-Paare sind die größten Engpässe?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Ursachen', description: 'Warum steckt jeder Engpass fest?', type: 'text' as const, required: true },
      {
        name: 'Lösungsaktionen',
        description: 'Welche konkrete Aktion verbessert jeden Engpass?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Blueprints definieren die abzubildenden Teams' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Problemverbindungen brauchen eine Gesundheitsdiagnose',
      },
    ],
  },
  'relationship-health': {
    name: 'Beziehungsgesundheit-Modus',
    purpose: 'Diagnostiziere und behebe teamübergreifende Reibung mit strukturierter Analyse.',
    trigger:
      'Nutze diesen Modus, wenn zwei Teams eine Reibungs- oder Defekt-Verbindung haben, die repariert werden muss.',
    flowName: 'Verbinden',
    doneSignal: 'Haben beide Teams dem Lösungsprotokoll zugestimmt und sich auf einen Überprüfungstermin festgelegt?',
    fieldsSchema: [
      {
        name: 'Beteiligte Teams',
        description: 'Welche zwei Teams haben die Reibung?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Schmerzverursacher',
        description: 'Welche konkreten Aktionen oder Unterlassungen verursachen Schmerz?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Erwartungslücke',
        description: 'Was erwartet jedes Team vom anderen? Wo unterscheiden sich die Erwartungen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Wertversprechen',
        description: 'Welchen Wert bietet jedes Team dem anderen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Lösungsprotokoll',
        description: 'Vereinbarte Aktionen zur Verbesserung der Beziehung.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Problemverbindungen identifiziert in der Verbindungskarte',
      },
    ],
  },
  'company-priority': {
    name: 'Unternehmensprioritäten-Modus',
    purpose: 'Stimme 3–5 Unternehmensprioritäten ab mit Belegen, Team-Übersetzung und Abhängigkeitskartierung.',
    trigger:
      'Nutze diesen Modus, wenn das Unternehmen zu viele Prioritäten hat, Teams in verschiedene Richtungen ziehen oder eine Quartalsplanung ansteht.',
    flowName: 'Ausrichten',
    doneSignal: 'Kann jeder Teamleiter die Unternehmensprioritäten erklären und wie sein Team beiträgt?',
    fieldsSchema: [
      {
        name: 'Unternehmensprioritäten',
        description: 'Liste 3–5 Unternehmensprioritäten mit Belegbasis.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Team-Übersetzung',
        description: 'Was bedeutet jede Priorität für jedes Team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Abhängigkeiten',
        description: 'Welche Prioritäten hängen von welchen Teams ab?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Konfliktlösung',
        description: 'Wenn Prioritäten kollidieren, welche gewinnt?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Prioritäten steuern das Ausführungstracking im großen Maßstab',
      },
    ],
  },
  'scaled-execution': {
    name: 'Skalierte-Ausführung-Modus',
    purpose:
      'Verfolge teamübergreifende Ausführung mit Prioritätsverbindungen, Schlüsselergebnissen und Abhängigkeiten.',
    trigger:
      'Nutze diesen Modus, wenn mehrere Teams an denselben Prioritäten arbeiten und Einblick in den Fortschritt der anderen brauchen.',
    flowName: 'Ausführen',
    doneSignal: 'Kannst du alle teamübergreifenden Arbeiten, Abhängigkeiten und Blocker in einer Ansicht sehen?',
    fieldsSchema: [
      {
        name: 'Prioritätsverbindung',
        description: 'Mit welcher Unternehmenspriorität ist diese Arbeit verbunden?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Schlüsselergebnisse',
        description: 'Was muss geliefert werden und von welchem Team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Teamübergreifende Abhängigkeiten',
        description: 'Welche Teams sind von welchen Ergebnissen abhängig?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Status', description: 'Aktueller Status jedes Ergebnisses.', type: 'text' as const, required: true },
      {
        name: 'Blocker',
        description: 'Teamübergreifende Blocker und Entblockungsaktionen.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Prioritäten definieren, was im großen Maßstab verfolgt wird',
      },
    ],
  },
  'quality-matrix': {
    name: 'Qualitätsmatrix-Modus',
    purpose: 'Definiere einheitliche Qualitätsstandards teamübergreifend: unternehmensweit plus teamspezifisch.',
    trigger:
      'Nutze diesen Modus, wenn Qualität zwischen Teams variiert und es keine gemeinsame Definition von "gut genug" gibt.',
    flowName: 'Qualität',
    doneSignal:
      'Kann jedes Teammitglied den Qualitätsstandard für seine Arbeit nachschlagen und wissen, ob es ihn erfüllt?',
    fieldsSchema: [
      {
        name: 'Unternehmensweite Standards',
        description: 'Qualitätsstandards, die für jedes Team gelten.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Teamspezifische Standards',
        description: 'Standards, die einzigartig für jedes Team basierend auf ihrem Bereich sind.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Messung',
        description: 'Wie wird Qualität für jeden Standard gemessen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Überprüfungsprozess',
        description: 'Wer überprüft die Qualität und wie oft?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-onboarding': {
    name: 'KI-Kollegen-Onboarding-Modus',
    purpose: 'Definiere KI-Kollegenrollen, Wissensquellen, Zugriffsgrenzen und Erfolgskennzahlen.',
    trigger:
      'Nutze diesen Modus, wenn du anfängst, mit KI-Tools zu arbeiten, und die Zusammenarbeit richtig aufsetzen musst.',
    flowName: 'Kontext',
    doneSignal:
      'Könntest du dieses Onboarding-Dokument einem neuen Teammitglied geben und es würde genau wissen, wie dein Team KI einsetzt?',
    fieldsSchema: [
      {
        name: 'KI-Rolle',
        description: 'Welche Rolle spielt die KI in deinem Workflow?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Wissensquellen',
        description: 'Auf welche Informationen braucht die KI Zugriff?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Zugriffsgrenzen',
        description: 'Worauf sollte die KI KEINEN Zugriff haben?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Erfolgskennzahlen',
        description: 'Wie misst du, ob die KI-Zusammenarbeit funktioniert?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Überprüfungsrhythmus',
        description: 'Wie oft überprüfst du das KI-Zusammenarbeits-Setup?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Eskalationsauslöser',
        description: 'Wann sollte ein Mensch von der KI übernehmen?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'KI-Setup fließt in die Aufgabendelegationsbewertung ein',
      },
    ],
  },
  'centaur-assessment': {
    name: 'Zentaur-Bewertungsmodus',
    purpose: 'Ordne jede Aufgabe zu: menschengeführt, KI-geführt oder Zentaur (beide) mit Fähigkeitsbewertung.',
    trigger:
      'Nutze diesen Modus, wenn du entscheiden musst, welche Aufgaben die KI übernehmen kann und welche menschliches Urteilsvermögen brauchen.',
    flowName: 'Kontext',
    doneSignal:
      'Kannst du für jede wiederkehrende Aufgabe erklären, wer sie erledigt (Mensch, KI oder beide) und warum?',
    fieldsSchema: [
      {
        name: 'Aufgabeninventar',
        description: 'Liste alle wiederkehrenden Aufgaben in deinem Workflow.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Klassifizierung',
        description: 'Für jede Aufgabe: Menschengeführt, KI-geführt oder Zentaur.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Fähigkeitsbewertung',
        description: 'Für KI/Zentaur-Aufgaben: Worin ist die KI gut und wo braucht sie Hilfe?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Entwicklungspfad',
        description: 'Welche menschengeführten Aufgaben könnten mit der Zeit zu Zentaur werden?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'KI-Setup informiert Aufgabendelegation' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Delegationskarte informiert Entscheidungsprotokolle',
      },
    ],
  },
  'decision-protocol': {
    name: 'Entscheidungsprotokoll-Modus',
    purpose:
      'Definiere, wann KI Entscheidungen führt vs. Menschen, Überstimmungsbedingungen und Retrospektiven-Rhythmus.',
    trigger:
      'Nutze diesen Modus, wenn KI an Entscheidungen beteiligt ist und du klare Regeln für Befugnis und Überstimmung brauchst.',
    flowName: 'Steuern',
    doneSignal:
      'Kannst du für jeden Entscheidungstyp sofort sagen, wer die Befugnis hat und was eine Überstimmung auslöst?',
    fieldsSchema: [
      {
        name: 'Entscheidungskategorien',
        description: 'Liste die Arten von Entscheidungen in deinem Workflow.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Befugniskarte',
        description: 'Für jede Kategorie: KI führt, Mensch führt oder Geteilt.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Überstimmungsbedingungen',
        description:
          'Wann kann ein Mensch eine KI-Entscheidung überstimmen? Wann kann KI eine menschliche Empfehlung überstimmen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Retrospektiven-Rhythmus',
        description: 'Wie oft überprüfst du die Entscheidungsqualität?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Delegationskarte informiert Entscheidungsbefugnis',
      },
    ],
  },
  'verification-ritual': {
    name: 'Verifizierungsritual-Modus',
    purpose:
      'Erstelle risikoskalierte Überprüfungsprotokolle: Hohes Risiko bekommt tiefe Prüfung, niedriges Risiko fließt frei.',
    trigger:
      'Nutze diesen Modus, wenn die Qualität von KI-Output schwankt und du eine konsistente Verifizierung brauchst, ohne alles zu verlangsamen.',
    flowName: 'Steuern',
    doneSignal:
      'Kann dein Team jeden KI-Output sofort nach Risikoniveau einordnen und das Überprüfungsprotokoll kennen?',
    fieldsSchema: [
      {
        name: 'Output-Kategorien',
        description: 'Liste die Arten von KI-Output, die dein Team produziert.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Risikoniveau',
        description: 'Für jede Kategorie: Hohes, mittleres oder niedriges Risiko.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Überprüfungsprotokoll',
        description: 'Für jedes Risikoniveau: Welche Überprüfung ist erforderlich?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Qualitätsschwelle',
        description: 'Welche Akzeptanzrate löst eine Überprüfung des Protokolls aus?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'knowledge-architecture': {
    name: 'Wissensarchitektur-Modus',
    purpose:
      'Strukturiere persistenten KI-Kontext, damit dein KI-Kollege nicht in jeder Sitzung die gleichen Fragen stellt.',
    trigger:
      'Nutze diesen Modus, wenn die KI ständig nach Kontext fragt, den sie bereits haben sollte, oder Antworten gibt, die deine Geschäftsspezifika ignorieren.',
    flowName: 'Wissen',
    doneSignal:
      'Kann dein KI-Kollege eine neue Sitzung starten und sofort den nötigen Kontext haben, um nützlich zu sein?',
    fieldsSchema: [
      {
        name: 'Wissensdomänen',
        description: 'Welche Wissenskategorien braucht die KI?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Persistenter Kontext',
        description: 'Für jede Domäne: Was sollte die KI immer wissen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Update-Auslöser',
        description: 'Wann sollte jede Wissensdomäne aktualisiert werden?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Zugriffsmuster',
        description: 'Wie greift die KI auf dieses Wissen zu? Dateien, APIs, Prompts?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Informationsstruktur fließt in KI-Wissen ein' },
    ],
  },
  'trust-calibration': {
    name: 'Vertrauenskalibrierung-Modus',
    purpose: 'Setze Vertrauensniveaus basierend auf Belegen, nicht auf Gefühl. Kalibriere Über- und Untervertrauen.',
    trigger:
      'Nutze diesen Modus, wenn du vermutest, dass das Team der KI zu sehr oder zu wenig vertraut und Entscheidungen nach Bauchgefühl statt Daten getroffen werden.',
    flowName: 'Vertrauen',
    doneSignal: 'Kannst du jedes Vertrauensniveau mit Belegen begründen, nicht mit Intuition?',
    fieldsSchema: [
      {
        name: 'Vertrauensinventar',
        description:
          'Für jeden KI-Anwendungsfall: aktuelles Vertrauensniveau (Übervertrauen, Kalibriert, Untervertrauen, Ungetestet).',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Belege',
        description: 'Welche Daten stützen jedes Vertrauensniveau?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kalibrierungsaktionen',
        description: 'Bei Übervertrauen: Verifizierung hinzufügen. Bei Untervertrauen: Pilotversuch starten.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Überprüfungsplan',
        description: 'Wann wirst du die Vertrauensniveaus neu kalibrieren?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-scaling': {
    name: 'KI-Zusammenarbeit-Skalierungsmodus',
    purpose: 'Plane, wie sich die Mensch-KI-Zusammenarbeit mit dem Wachstum der Organisation entwickelt.',
    trigger:
      'Nutze diesen Modus, wenn KI-Zusammenarbeit für eine Person oder ein Team funktioniert und auf die Organisation skaliert werden muss.',
    flowName: 'Skalieren',
    doneSignal: 'Kannst du eine Roadmap für KI-Zusammenarbeit präsentieren, der jeder Teamleiter folgen kann?',
    fieldsSchema: [
      {
        name: 'Aktueller Stand',
        description: 'Wie funktioniert KI-Zusammenarbeit heute? Wer nutzt sie, wofür?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Skalierungspfad',
        description: 'Wie sollte sich KI-Zusammenarbeit entwickeln? Solo → Team → Organisation.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Standardisierung vs. Anpassung',
        description: 'Was sollte teamübergreifend standardisiert vs. pro Team angepasst sein?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Infrastrukturbedarf',
        description: 'Welche Tools, Zugänge oder Schulungen sind für die Skalierung nötig?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Risikobewertung',
        description: 'Was könnte schiefgehen, wenn du KI-Zusammenarbeit skalierst?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
}
