import type { ModeTranslation } from '../../schema.js'

export const itModes: Record<string, ModeTranslation> = {
  validation: {
    name: 'Modalità Validazione',
    purpose:
      'Testa il presupposto di business più rischioso con le evidenze e prendi una decisione chiara: Perseverare/Pivotare/Sperimentare di Nuovo.',
    trigger:
      'Usa quando stai per prendere una decisione di business significativa basata su qualcosa che credi ma non hai testato.',
    flowName: 'Validazione',
    doneSignal:
      "Riesci a dichiarare il tuo presupposto, l'evidenza a favore o contro, e la tua decisione in una frase?",
    fieldsSchema: [
      {
        name: 'Presupposto',
        description: 'La convinzione specifica che stai testando. Deve essere falsificabile.',
        type: 'text' as const,
        required: true,
        example: 'I designer freelance pagheranno 49€/mese per la fatturazione automatizzata.',
      },
      {
        name: 'Livello di Rischio',
        description: 'Quanto danno se questo presupposto è sbagliato.',
        type: 'text' as const,
        required: true,
        options: ['Alto', 'Medio', 'Basso'],
      },
      {
        name: 'Evidenza Attuale',
        description: 'Cosa sai già. Dati, conversazioni, segnali.',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Design dell'Esperimento",
        description: 'Il test più economico e veloce che potrebbe smentire il presupposto.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Criteri di Successo',
        description: 'Il numero specifico che significa che il presupposto regge.',
        type: 'text' as const,
        required: true,
        example: '5% di tasso di registrazione entro 7 giorni.',
      },
      {
        name: 'Limite di Tempo',
        description: "Quanto dura l'esperimento.",
        type: 'text' as const,
        required: true,
        example: '7 giorni.',
      },
      {
        name: 'Risultati',
        description: 'Cosa è successo realmente. Dati grezzi, non interpretazione.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Decisione',
        description: "In base all'evidenza: Perseverare, Pivotare o Sperimentare di Nuovo.",
        type: 'text' as const,
        required: true,
        options: ['Perseverare', 'Pivotare', 'Sperimentare di Nuovo'],
      },
      {
        name: 'Prossima Azione',
        description: 'Il prossimo passo specifico con una data.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Aggiornamento del Presupposto',
        description: 'Come è cambiato questo presupposto in base a ciò che hai appreso?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'I presupposti identificati nel Motore di Business alimentano la Validazione',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Il presupposto con la priorità più alta dalla Pila delle Priorità',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "I risultati dell'esperimento alimentano la Cattura di Insight",
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'I risultati validati possono essere impacchettati per la revisione del team',
      },
    ],
  },
  'insight-capture': {
    name: 'Modalità Cattura Insight',
    purpose: 'Trasforma segnali grezzi dal tuo mercato in pattern strutturati e prossimi passi azionabili.',
    trigger: 'Usa quando hai dati grezzi, conversazioni con clienti o segnali di mercato che necessitano di struttura.',
    flowName: 'Validazione',
    doneSignal:
      'Riesci a spiegare questo insight a qualcuno che non era nella stanza, con contesto sufficiente per agire?',
    fieldsSchema: [
      {
        name: 'Fonte del Segnale',
        description: 'Da dove viene questo insight?',
        type: 'text' as const,
        required: true,
        options: [
          'Conversazione con cliente',
          'Dati di utilizzo',
          'Ricerca di mercato',
          'Osservazione dei competitor',
          'Feedback del team',
          'Altro',
        ],
      },
      {
        name: 'Segnale Grezzo',
        description: "L'osservazione esatta, la citazione o il dato.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Corrispondenza di Pattern',
        description: 'Questo si collega a qualcosa che hai già visto?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Intensità',
        description: 'Quanto è forte questo segnale?',
        type: 'text' as const,
        required: true,
        options: ['Forte (fonti multiple)', 'Moderato (2+ segnali)', 'Debole (segnale singolo)'],
      },
      {
        name: 'Implicazione',
        description: 'Se questo segnale è reale, cosa significa per il tuo business?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Azione',
        description: 'Quale prossimo passo specifico guida questo insight?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "I risultati dell'esperimento alimentano la Cattura di Insight",
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Gli insight validati informano le proposte di valore',
      },
    ],
  },
  'proposition-builder': {
    name: 'Modalità Costruttore di Proposte',
    purpose: 'Costruisci proposte di valore basate su evidenze in tre livelli: Base, Soddisfacente, Delizioso.',
    trigger: 'Usa quando devi articolare cosa offri e perché conta, fondato su evidenze.',
    flowName: 'Validazione',
    doneSignal:
      'Un nuovo membro del team riesce a spiegare la tua proposta di valore in 30 secondi, incluso a chi è destinata e perché interessa?',
    fieldsSchema: [
      {
        name: 'Cliente Target',
        description: 'Per chi è esattamente questa proposta?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dichiarazione del Problema',
        description: 'Il problema specifico che stai risolvendo, con le loro parole.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Livello Base',
        description: 'Il valore minimo praticabile — ciò che devi assolutamente offrire.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Livello Soddisfacente',
        description: 'Valore atteso che soddisfa lo standard.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Livello Delizioso',
        description: 'Valore inaspettato che crea fedeltà.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evidenza',
        description: 'Quali dati validati supportano ogni livello?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Differenziazione',
        description: 'Cosa rende la tua proposta diversa dalle alternative?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Gli insight validati informano le proposte' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La proposta alimenta il design del modello di business',
      },
    ],
  },
  'business-engine': {
    name: 'Modalità Motore di Business',
    purpose: 'Mappa i presupposti del tuo modello di business e identifica quali potrebbero rompere il motore.',
    trigger: 'Usa quando devi capire come funziona il tuo business come sistema e quali presupposti sono portanti.',
    flowName: 'Strategia',
    doneSignal:
      'Riesci a spiegare il tuo modello di business in una frase, nominare il presupposto più rischioso e dire quale evidenza hai?',
    fieldsSchema: [
      {
        name: 'Modello di Ricavo',
        description: 'Come entrano i soldi? Sii specifico su prezzi e canali.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Struttura dei Costi',
        description: 'Dove vanno i soldi? Costi fissi vs variabili.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Presupposti Chiave',
        description: 'Elenca i 3-5 presupposti da cui dipende il tuo modello.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Presupposto Più Rischioso',
        description: 'Quale presupposto, se sbagliato, rompe il modello?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evidenza Attuale',
        description: 'Quali dati supportano o sfidano ogni presupposto?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Economia Unitaria',
        description: 'Ricavo per unità, costo per unità, margine.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'I presupposti alimentano la classificazione delle priorità',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Il presupposto più rischioso deve essere validato',
      },
    ],
  },
  'priority-stack': {
    name: 'Modalità Pila delle Priorità',
    purpose: 'Crea una classificazione forzata delle priorità basata su evidenze con una chiara lista Non Fare.',
    trigger:
      'Usa quando hai più cose da fare che tempo a disposizione e hai bisogno di chiarezza spietata su ciò che conta.',
    flowName: 'Strategia',
    doneSignal: 'Riesci a dire a qualcuno le tue 3 priorità principali e la tua lista Non Fare senza esitare?',
    fieldsSchema: [
      {
        name: 'Candidati',
        description: 'Elenca tutto ciò che compete per la tua attenzione adesso.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Criteri',
        description: "Quali criteri userai per classificare? Impatto, urgenza, forza dell'evidenza.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Classificazione Forzata',
        description: 'Classifica tutti i candidati da 1 a N. Nessun pareggio.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Top 3',
        description: 'Le tue 3 priorità principali con una frase di giustificazione ciascuna.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Lista Non Fare',
        description: 'Tutto sotto la linea di taglio. Dichiaralo esplicitamente.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Allocazione del Tempo',
        description: 'Come dividerai il tuo tempo tra le 3 priorità in questo periodo?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'I presupposti dal Motore di Business necessitano di classificazione',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Le priorità principali alimentano il tracciamento dell'esecuzione",
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Il presupposto con la priorità più alta va alla Validazione',
      },
    ],
  },
  'execution-tracker': {
    name: 'Modalità Tracciatore di Esecuzione',
    purpose: 'Traccia la visibilità del lavoro e identifica i blocchi con tracciamento asincrono.',
    trigger: 'Usa quando devi vedere cosa sta succedendo, cosa è fermo e cosa deve essere sbloccato.',
    flowName: 'Esecuzione',
    doneSignal:
      "Riesci a vedere tutto il lavoro attivo, sapere cosa è bloccato e avere un'azione di sblocco per ogni blocco?",
    fieldsSchema: [
      {
        name: 'Elementi di Lavoro',
        description: 'Elenca gli elementi di lavoro attivi collegati alle tue priorità.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Stato',
        description: 'Per ogni elemento: Non Iniziato, In Corso, Bloccato, Completato.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Blocchi',
        description: 'Cosa è bloccato e perché? Sii specifico.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Azioni di Sblocco',
        description: 'Per ogni blocco: chi deve fare cosa entro quando?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Tempo di Ciclo',
        description: "Quanto tempo dall'inizio al completamento per gli elementi recenti?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Le priorità definiscono cosa tracciare' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Gli elementi completati vanno alla Verifica di Consegna',
      },
    ],
  },
  'delivery-check': {
    name: 'Modalità Verifica di Consegna',
    purpose: 'Controllo qualità del lavoro completato e monitoraggio delle performance post-consegna.',
    trigger: 'Usa quando il lavoro è terminato e necessita di un controllo qualità prima di considerarlo consegnato.',
    flowName: 'Esecuzione',
    doneSignal: 'Riesci a dire con fiducia che questo deliverable è pronto per chi lo riceve?',
    fieldsSchema: [
      {
        name: 'Deliverable',
        description: 'Cosa è stato consegnato? Sii specifico.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Criteri di Qualità',
        description: 'Quali standard deve soddisfare?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Valutazione della Qualità',
        description: 'Soddisfa ogni criterio? Superato/Non Superato per elemento.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Problemi Trovati',
        description: 'Cosa deve essere corretto prima della consegna?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Monitoraggio Post-Consegna',
        description: 'Cosa osserverai dopo la consegna per confermare la qualità?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Elementi di lavoro completati dal Tracciatore di Esecuzione',
      },
    ],
  },
  'information-architecture': {
    name: "Modalità Architettura dell'Informazione",
    purpose:
      'Definisci dove vivono le informazioni affinché le persone trovino ciò che serve in 5 minuti senza chiedere.',
    trigger:
      'Usa quando le persone continuano a chiedere dove sono le cose, le informazioni sono duplicate o perse, o i nuovi arrivati non trovano ciò che serve.',
    flowName: 'Informare',
    doneSignal:
      'Un nuovo membro del team riesce a trovare qualsiasi informazione critica in 5 minuti senza chiedere a nessuno?',
    fieldsSchema: [
      {
        name: 'Audit delle Informazioni',
        description: 'Dove vivono attualmente le informazioni? Elenca tutti gli strumenti e le posizioni.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Punti Critici',
        description: 'Quali informazioni sono più difficili da trovare? Quali domande vengono fatte ripetutamente?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Categorie',
        description: 'Raggruppa le informazioni in categorie logiche.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Fonte Unica di Verità',
        description: "Per ogni categoria, dov'è la posizione canonica?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Test di Reperibilità',
        description: 'Un nuovo membro del team riesce a trovare X in 5 minuti? Testa 3 elementi comuni.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La struttura informativa abilita il design del lavoro asincrono',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Le categorie informative alimentano la struttura di conoscenza dell'IA",
      },
    ],
  },
  'flex-work-design': {
    name: 'Modalità Design del Lavoro Flessibile',
    purpose:
      'Definisci impostazioni predefinite asincrone, eccezioni sincrone, budget riunioni e ritmi energetici per il tuo team.',
    trigger:
      'Usa quando il tuo team passa troppo tempo in riunioni, lavora su fusi orari diversi o fatica con i confini lavoro-vita.',
    flowName: 'Informare',
    doneSignal:
      "Ogni membro del team riesce a spiegare quando usare l'asincrono come default, quando il sincrono è appropriato e qual è il suo budget riunioni?",
    fieldsSchema: [
      {
        name: 'Carico Riunioni Attuale',
        description: 'Quante ore a settimana ogni persona passa in riunioni?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Default Asincrono',
        description: 'Qual è il tuo default: asincrono o sincrono? Definisci la regola.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Eccezioni Sincrone',
        description: 'Cosa richiede specificamente interazione in tempo reale?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Budget Riunioni',
        description: 'Massimo ore di riunione per persona a settimana.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ritmi Energetici',
        description: 'Quando le persone sono più produttive? Come proteggi il lavoro profondo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocollo Fusi Orari',
        description: "Come gestisci l'asincrono tra fusi orari? Ore di sovrapposizione?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La struttura informativa abilita il lavoro flessibile',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Il design del lavoro alimenta la cadenza del team',
      },
    ],
  },
  'team-rhythm': {
    name: 'Modalità Ritmo del Team',
    purpose:
      'Definisci la tua cadenza settimanale: momenti sincroni, blocchi di lavoro profondo, checkpoint energetici.',
    trigger:
      'Usa quando il team non ha una cadenza costante, le persone non sanno quando aspettarsi aggiornamenti o il lavoro profondo viene costantemente interrotto.',
    flowName: 'Coordinare',
    doneSignal: 'Ogni membro del team conosce il ritmo settimanale senza controllare il calendario?',
    fieldsSchema: [
      {
        name: 'Cadenza Settimanale',
        description: 'Mappa il ritmo settimanale ricorrente del team.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Momenti Sincroni',
        description: 'Elenca i momenti sincroni essenziali e il loro scopo.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Blocchi di Lavoro Profondo',
        description: 'Quando sono i periodi di focus protetti? Come vengono applicati?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Checkpoint Energetici',
        description: "Come verifichi l'energia e il carico di lavoro del team?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Il design del lavoro definisce i vincoli del ritmo',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Il ritmo definisce quando le decisioni avvengono in modo asincrono vs sincrono',
      },
    ],
  },
  'async-decision': {
    name: 'Modalità Decisione Asincrona',
    purpose:
      'Prendi una decisione chiara in modo asincrono con domanda strutturata, opzioni, scadenza e protocollo di dissenso.',
    trigger: 'Usa quando una decisione deve essere presa e una riunione non è il modo migliore per prenderla.',
    flowName: 'Coordinare',
    doneSignal: 'La decisione è registrata, la motivazione documentata e tutti gli stakeholder notificati?',
    fieldsSchema: [
      {
        name: 'Domanda Decisionale',
        description: 'La domanda specifica su cui decidere. Una frase.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Opzioni',
        description: 'Le opzioni in considerazione, con pro/contro per ciascuna.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Decisore', description: 'Chi prende la decisione finale?', type: 'text' as const, required: true },
      {
        name: 'Scadenza',
        description: 'Entro quando deve essere presa la decisione?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Input Richiesto Da',
        description: 'Chi deve esprimersi prima della scadenza?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocollo di Dissenso',
        description: 'Come può qualcuno dissentire? Cosa succede con le obiezioni?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Registro della Decisione',
        description: 'La decisione finale, la motivazione e chi è stato consultato.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Le decisioni devono essere impacchettate per la visibilità del team',
      },
    ],
  },
  package: {
    name: 'Modalità Pacchetto',
    purpose: 'Crea pacchetti di comunicazione autonomi che non richiedono domande di follow-up.',
    trigger: 'Usa quando condividi lavoro, aggiornamenti o decisioni con persone che non erano presenti.',
    flowName: 'Comunicare',
    doneSignal: 'Qualcuno riesce ad agire su questo pacchetto senza fare una singola domanda di chiarimento?',
    fieldsSchema: [
      {
        name: 'Contesto',
        description: 'Cosa deve sapere il lettore per capire questo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Punti Chiave',
        description: 'Le 3-5 cose più importanti. Numerate.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Decisione Necessaria',
        description: 'Serve una decisione? Da chi? Entro quando?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Scadenza',
        description: 'Entro quando il lettore deve rispondere?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Formato del Feedback',
        description: 'Come deve rispondere il lettore? Commentare, approvare, modificare?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'I risultati della validazione possono essere impacchettati',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Le decisioni devono essere impacchettate' },
    ],
  },
  'contribution-tracker': {
    name: 'Modalità Tracciatore dei Contributi',
    purpose: 'Rendi visibile il lavoro invisibile in 5 tipi di contributo.',
    trigger:
      'Usa quando alcuni membri del team svolgono lavoro critico che nessuno vede, o il riconoscimento è sbilanciato verso i deliverable visibili.',
    flowName: 'Riconoscere',
    doneSignal: 'Riesci a vedere i contributi in tutti i 5 tipi, non solo le consegne?',
    fieldsSchema: [
      {
        name: 'Membro del Team',
        description: 'Per chi stai tracciando i contributi?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Consegna', description: 'Output tangibili consegnati.', type: 'text' as const, required: true },
      {
        name: 'Mentoring',
        description: 'Aiutare gli altri a crescere, lavorare in coppia, revisionare, insegnare.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Documentazione',
        description: 'Scrittura che aiuta gli altri a lavorare in autonomia.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Miglioramento dei Processi',
        description: 'Migliorare sistemi, strumenti o flussi di lavoro.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Sblocco', description: 'Rimuovere ostacoli per gli altri.', type: 'text' as const, required: true },
    ],
    composabilityHooks: [],
  },
  'culture-at-distance': {
    name: 'Modalità Cultura a Distanza',
    purpose:
      'Definisci comportamenti osservabili, rituali, protocollo di conflitto e segnali di fiducia per team distribuiti.',
    trigger: 'Usa quando la cultura sembra debole in un team distribuito — le persone sono produttive ma disconnesse.',
    flowName: 'Cultura',
    doneSignal: 'Un nuovo assunto da remoto riuscirebbe a capire la cultura del team dalla sola documentazione?',
    fieldsSchema: [
      {
        name: 'Comportamenti Osservabili',
        description: 'Quali comportamenti definiscono la tua cultura? Elencane 5 visibili nel lavoro asincrono.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Rituali',
        description: 'Pratiche regolari che rafforzano la cultura. Non riunioni — rituali.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocollo di Conflitto',
        description: 'Come gestisci i disaccordi quando non puoi leggere il linguaggio del corpo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Segnali di Fiducia',
        description: 'Cosa costruisce fiducia nel tuo team distribuito? Cosa la erode?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Anti-Pattern',
        description: 'Quali comportamenti stai attivamente cercando di prevenire?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  dashboard: {
    name: 'Modalità Cruscotto',
    purpose:
      'Configura metriche doppie: performance (tempo di risoluzione, tempo di ciclo) e dinamiche (apprendimento, collaborazione, divertimento).',
    trigger:
      "Usa quando si scala oltre 50 persone e le metriche tradizionali mancano il lato umano dell'organizzazione.",
    flowName: 'Monitorare',
    doneSignal: "Riesci a vedere sia performance che dinamiche a colpo d'occhio e sapere quando agire?",
    fieldsSchema: [
      {
        name: 'Metriche di Performance',
        description: 'Metriche operative chiave: tempo di ciclo, tempo di risoluzione, lead time.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Metriche di Dinamiche',
        description: 'Metriche umane: tasso di apprendimento, punteggio di collaborazione, impegno, divertimento.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Fonti dei Dati', description: 'Da dove proviene ogni metrica?', type: 'text' as const, required: true },
      {
        name: 'Cadenza di Revisione',
        description: 'Con quale frequenza vengono revisionate e da chi?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Trigger di Azione',
        description: "Quali livelli di metriche innescano un'azione?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'I segnali del cruscotto alimentano la revisione della struttura organizzativa',
      },
    ],
  },
  'org-map': {
    name: 'Modalità Mappa Organizzativa',
    purpose: "Crea una visione d'insieme della tua organizzazione: tipi di team, lacune e sovrapposizioni.",
    trigger: "Usa quando l'organizzazione sta crescendo e hai bisogno di vedere il quadro completo.",
    flowName: 'Struttura',
    doneSignal: 'Riesci a spiegare la struttura della tua organizzazione a un nuovo VP in 5 minuti?',
    fieldsSchema: [
      {
        name: 'Team',
        description: 'Elenca tutti i team con tipo: Missione, Piattaforma o Circolo di Leadership.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dimensione dei Team',
        description: 'Numero di persone per team.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Lacune', description: 'Quali capacità mancano?', type: 'text' as const, required: true },
      {
        name: 'Sovrapposizioni',
        description: 'Dove i team stanno duplicando gli sforzi?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La mappa organizzativa identifica i team che necessitano di blueprint',
      },
    ],
  },
  'team-blueprint': {
    name: 'Modalità Blueprint del Team',
    purpose: 'Definisci missione, membri, autorità decisionale, cadenza e standard di qualità per un team.',
    trigger: 'Usa quando crei un nuovo team o quando un team esistente manca di chiarezza su scopo e autorità.',
    flowName: 'Struttura',
    doneSignal:
      'Ogni membro del team riesce a dichiarare la missione, il proprio ruolo e quali decisioni può prendere?',
    fieldsSchema: [
      {
        name: 'Missione del Team',
        description: 'Perché esiste questo team? Una frase.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Membri',
        description: 'Chi fa parte del team e quali sono i loro ruoli?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Autorità Decisionale',
        description: 'Quali decisioni può prendere questo team senza escalare?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Cadenza', description: 'Come comunica e si coordina il team?', type: 'text' as const, required: true },
      {
        name: 'Standard di Qualità',
        description: 'Quale livello di qualità mantiene questo team?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'I blueprint del team definiscono i nodi nella mappa delle connessioni',
      },
    ],
  },
  'connection-map': {
    name: 'Modalità Mappa delle Connessioni',
    purpose: 'Mappa le interazioni tra team: fluide, con attrito o interrotte. Trova i colli di bottiglia.',
    trigger: 'Usa quando il coordinamento tra team è lento, i passaggi falliscono o i team si incolpano a vicenda.',
    flowName: 'Connettere',
    doneSignal:
      'Riesci a mostrare a qualcuno una mappa di tutte le connessioni tra team con valutazioni di qualità e correzioni dei colli di bottiglia?',
    fieldsSchema: [
      {
        name: 'Coppie di Team',
        description: 'Elenca tutte le coppie di interazione team-a-team.',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Qualità dell'Interazione",
        description: 'Per ogni coppia: Fluida, Con Attrito o Interrotta.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Colli di Bottiglia',
        description: 'Quali coppie di team sono i colli di bottiglia più critici?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cause Radice',
        description: 'Perché ogni collo di bottiglia è bloccato?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Azioni Correttive',
        description: 'Quale azione specifica migliorerà ogni collo di bottiglia?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'I blueprint definiscono i team da mappare' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Le connessioni problematiche necessitano di diagnosi di salute',
      },
    ],
  },
  'relationship-health': {
    name: 'Modalità Salute delle Relazioni',
    purpose: "Diagnostica e correggi l'attrito tra team con analisi strutturata.",
    trigger: 'Usa quando due team hanno una connessione Con Attrito o Interrotta che necessita di riparazione.',
    flowName: 'Connettere',
    doneSignal:
      'Entrambi i team hanno concordato il protocollo correttivo e si sono impegnati su una data di revisione?',
    fieldsSchema: [
      { name: 'Team Coinvolti', description: "Quali due team hanno l'attrito?", type: 'text' as const, required: true },
      {
        name: 'Generatori di Dolore',
        description: 'Quali azioni o inazioni specifiche causano dolore?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Divario di Aspettative',
        description: "Cosa si aspetta ogni team dall'altro? Dove differiscono le aspettative?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Proposta di Valore',
        description: "Quale valore fornisce ogni team all'altro?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocollo Correttivo',
        description: 'Azioni concordate per migliorare la relazione.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Connessioni problematiche identificate nella Mappa delle Connessioni',
      },
    ],
  },
  'company-priority': {
    name: 'Modalità Priorità Aziendali',
    purpose: 'Allinea 3-5 priorità aziendali con evidenze, traduzione per i team e mappatura delle dipendenze.',
    trigger:
      "Usa quando l'azienda ha troppe priorità, i team tirano in direzioni diverse o serve la pianificazione trimestrale.",
    flowName: 'Allineare',
    doneSignal: 'Ogni team leader riesce a spiegare le priorità aziendali e come il suo team contribuisce?',
    fieldsSchema: [
      {
        name: 'Priorità Aziendali',
        description: 'Elenca 3-5 priorità aziendali con base di evidenza.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Traduzione per i Team',
        description: 'Cosa significa ogni priorità per ogni team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dipendenze',
        description: 'Quali priorità dipendono da quali team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Risoluzione dei Conflitti',
        description: 'Quando le priorità sono in conflitto, quale prevale?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Le priorità guidano il tracciamento dell'esecuzione su scala",
      },
    ],
  },
  'scaled-execution': {
    name: 'Modalità Esecuzione su Scala',
    purpose: "Traccia l'esecuzione tra team con collegamenti alle priorità, deliverable chiave e dipendenze.",
    trigger:
      'Usa quando più team lavorano sulle stesse priorità e hanno bisogno di visibilità sui progressi degli altri.',
    flowName: 'Eseguire',
    doneSignal: "Riesci a vedere tutto il lavoro tra team, le dipendenze e i blocchi in un'unica vista?",
    fieldsSchema: [
      {
        name: 'Collegamento alla Priorità',
        description: 'A quale priorità aziendale si collega questo lavoro?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Deliverable Chiave',
        description: 'Cosa deve essere consegnato e da quale team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dipendenze tra Team',
        description: 'Quali team dipendono da quali deliverable?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Stato', description: 'Stato attuale di ogni deliverable.', type: 'text' as const, required: true },
      { name: 'Blocchi', description: 'Blocchi tra team e azioni di sblocco.', type: 'text' as const, required: true },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Le priorità definiscono cosa tracciare su scala',
      },
    ],
  },
  'quality-matrix': {
    name: 'Modalità Matrice della Qualità',
    purpose: "Definisci standard di qualità coerenti tra i team: trasversali all'azienda più specifici per team.",
    trigger: 'Usa quando la qualità varia tra i team e non c\'è una definizione condivisa di "abbastanza buono".',
    flowName: 'Qualità',
    doneSignal:
      'Qualsiasi membro del team riesce a consultare lo standard di qualità per il proprio lavoro e sapere se lo soddisfa?',
    fieldsSchema: [
      {
        name: 'Standard Trasversali',
        description: 'Standard di qualità che si applicano a tutti i team.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Standard Specifici per Team',
        description: 'Standard unici per ogni team basati sul loro dominio.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Misurazione',
        description: 'Come viene misurata la qualità per ogni standard?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Processo di Revisione',
        description: 'Chi revisiona la qualità e con quale frequenza?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-onboarding': {
    name: 'Modalità Onboarding del Collega IA',
    purpose: 'Definisci ruoli dei colleghi IA, fonti di conoscenza, confini di accesso e metriche di successo.',
    trigger: 'Usa quando inizi a lavorare con strumenti IA e devi configurare la collaborazione correttamente.',
    flowName: 'Contesto',
    doneSignal:
      "Potresti consegnare questo documento di onboarding a un nuovo membro del team e saprebbe esattamente come il tuo team usa l'IA?",
    fieldsSchema: [
      {
        name: "Ruolo dell'IA",
        description: "Quale ruolo svolge l'IA nel tuo flusso di lavoro?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Fonti di Conoscenza',
        description: "A quali informazioni l'IA deve avere accesso?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Confini di Accesso',
        description: "A cosa l'IA NON deve avere accesso?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Metriche di Successo',
        description: "Come misurerai se la collaborazione con l'IA funziona?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadenza di Revisione',
        description: "Con quale frequenza revisionerai la configurazione della collaborazione con l'IA?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Trigger di Escalation',
        description: "Quando un umano deve subentrare all'IA?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La configurazione IA alimenta la valutazione della delega dei compiti',
      },
    ],
  },
  'centaur-assessment': {
    name: 'Modalità Valutazione Centauro',
    purpose:
      "Mappa ogni compito: guidato dall'umano, guidato dall'IA o centauro (entrambi) con valutazione delle capacità.",
    trigger: "Usa quando devi decidere quali compiti l'IA può gestire e quali necessitano di giudizio umano.",
    flowName: 'Contesto',
    doneSignal: 'Riesci a spiegare per ogni compito ricorrente chi lo svolge (umano, IA o entrambi) e perché?',
    fieldsSchema: [
      {
        name: 'Inventario dei Compiti',
        description: 'Elenca tutti i compiti ricorrenti nel tuo flusso di lavoro.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Classificazione',
        description: "Per ogni compito: Guidato dall'Umano, Guidato dall'IA o Centauro.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Valutazione delle Capacità',
        description: "Per i compiti IA/Centauro: in cosa è brava l'IA e dove ha bisogno di aiuto?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Percorso Evolutivo',
        description: "Quali compiti Guidati dall'Umano potrebbero diventare Centauro nel tempo?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La configurazione IA informa la delega dei compiti',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La mappa di delega informa i protocolli decisionali',
      },
    ],
  },
  'decision-protocol': {
    name: 'Modalità Protocollo Decisionale',
    purpose: "Definisci quando l'IA guida le decisioni vs gli umani, condizioni di override e cadenza retrospettiva.",
    trigger: "Usa quando l'IA è coinvolta nelle decisioni e servono regole chiare su autorità e override.",
    flowName: 'Governare',
    doneSignal:
      "Per qualsiasi tipo di decisione, riesci a dire istantaneamente chi ha l'autorità e cosa innesca un override?",
    fieldsSchema: [
      {
        name: 'Categorie Decisionali',
        description: 'Elenca i tipi di decisioni nel tuo flusso di lavoro.',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Mappa dell'Autorità",
        description: 'Per ogni categoria: IA guida, Umano guida o Condivisa.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Condizioni di Override',
        description:
          "Quando un umano può fare override su una decisione IA? Quando l'IA può fare override su una raccomandazione umana?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadenza Retrospettiva',
        description: 'Con quale frequenza revisioni la qualità delle decisioni?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "La mappa di delega informa l'autorità decisionale",
      },
    ],
  },
  'verification-ritual': {
    name: 'Modalità Rituale di Verifica',
    purpose:
      'Costruisci protocolli di revisione scalati per rischio: alto rischio ha revisione approfondita, basso rischio scorre libero.',
    trigger: "Usa quando la qualità dell'output IA varia e serve una verifica coerente senza rallentare tutto.",
    flowName: 'Governare',
    doneSignal:
      'Il tuo team riesce a classificare istantaneamente qualsiasi output IA per livello di rischio e conoscere il protocollo di revisione?',
    fieldsSchema: [
      {
        name: 'Categorie di Output',
        description: 'Elenca i tipi di output IA che il tuo team produce.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Livello di Rischio',
        description: 'Per ogni categoria: rischio Alto, Medio o Basso.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocollo di Revisione',
        description: 'Per ogni livello di rischio: quale revisione è richiesta?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Soglia di Qualità',
        description: 'Quale tasso di accettazione innesca una revisione del protocollo?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'knowledge-architecture': {
    name: 'Modalità Architettura della Conoscenza',
    purpose:
      "Struttura il contesto persistente dell'IA affinché il tuo collega IA non faccia le stesse domande ad ogni sessione.",
    trigger:
      "Usa quando l'IA continua a chiedere contesto che dovrebbe già avere, o dà risposte che ignorano le specificità del tuo business.",
    flowName: 'Conoscenza',
    doneSignal:
      'Il tuo collega IA riesce ad iniziare una nuova sessione e avere immediatamente il contesto necessario per essere utile?',
    fieldsSchema: [
      {
        name: 'Domini di Conoscenza',
        description: "Quali categorie di conoscenza servono all'IA?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Contesto Persistente',
        description: "Per ogni dominio: cosa deve sapere sempre l'IA?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Trigger di Aggiornamento',
        description: 'Quando ogni dominio di conoscenza deve essere aggiornato?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Pattern di Accesso',
        description: "Come accede l'IA a questa conoscenza? File, API, prompt?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "La struttura informativa alimenta la conoscenza dell'IA",
      },
    ],
  },
  'trust-calibration': {
    name: 'Modalità Calibrazione della Fiducia',
    purpose: 'Imposta livelli di fiducia basati su evidenze, non sensazioni. Calibra eccesso e carenza di fiducia.',
    trigger:
      "Usa quando sospetti che il team si fidi troppo o troppo poco dell'IA, e le decisioni vengono prese a sensazione anziché sui dati.",
    flowName: 'Fiducia',
    doneSignal: 'Riesci a giustificare ogni livello di fiducia con evidenze, non intuizione?',
    fieldsSchema: [
      {
        name: 'Inventario della Fiducia',
        description:
          "Per ogni caso d'uso IA: livello di fiducia attuale (Eccesso di Fiducia, Calibrato, Carenza di Fiducia, Non Testato).",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evidenza',
        description: 'Quali dati supportano ogni livello di fiducia?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Azioni di Calibrazione',
        description: 'Per eccesso di fiducia: aggiungere verifica. Per carenza di fiducia: avviare un pilota.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Calendario di Revisione',
        description: 'Quando ricalibrerai i livelli di fiducia?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-scaling': {
    name: 'Modalità Scalare la Collaborazione IA',
    purpose: "Pianifica come la collaborazione umano-IA evolve man mano che l'organizzazione cresce.",
    trigger: "Usa quando la collaborazione IA funziona per una persona o un team e deve scalare all'organizzazione.",
    flowName: 'Scalare',
    doneSignal: 'Riesci a presentare una roadmap per la collaborazione IA che qualsiasi team leader può seguire?',
    fieldsSchema: [
      {
        name: 'Stato Attuale',
        description: 'Come funziona la collaborazione IA oggi? Chi la usa, per cosa?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Percorso di Scala',
        description: 'Come deve evolvere la collaborazione IA? Solo → Team → Organizzazione.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Standardizzazione vs Personalizzazione',
        description: 'Cosa deve essere standard tra i team vs personalizzato per team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Necessità Infrastrutturali',
        description: 'Quali strumenti, accessi o formazione servono per scalare?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Valutazione del Rischio',
        description: 'Cosa potrebbe andare storto scalando la collaborazione IA?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
}
