import type { ProgramTranslation } from '../../schema.js'

export const itPrograms: Record<string, ProgramTranslation> = {
  'your-first-validation-week': {
    name: 'La Tua Prima Settimana di Validazione',
    description:
      'Testa il tuo presupposto più rischioso in 5 giorni. Cinque modalità, una decisione basata su evidenze.',
    modeSequence: [
      { day: 1, modeSlug: '', description: 'Mappa il tuo modello di business. Identifica 3 presupposti chiave.' },
      { day: 2, modeSlug: '', description: 'Classifica i tuoi presupposti per rischio. Scegli il più rischioso.' },
      { day: 3, modeSlug: '', description: 'Progetta e lancia un test per il tuo presupposto più rischioso.' },
      { day: 4, modeSlug: '', description: 'Mentre aspetti i risultati, cattura segnali dal tuo mercato.' },
      {
        day: 5,
        modeSlug: '',
        description: 'Rivedi i risultati. Prendi la tua decisione di Perseverare/Pivotare/Sperimentare di Nuovo.',
      },
    ],
  },
  'async-maturity-sprint': {
    name: 'Sprint di Maturità Asincrona',
    description:
      'Riduci le ore di riunione, sviluppa il muscolo decisionale asincrono e impacchetta il lavoro per il tuo team distribuito.',
    modeSequence: [
      { day: 1, modeSlug: '', description: "Mappa la tua cadenza di riunioni attuale. Identifica l'eccesso." },
      { day: 2, modeSlug: '', description: 'Definisci quali informazioni vanno dove.' },
      { day: 3, modeSlug: '', description: 'Impacchetta il tuo prossimo aggiornamento di team usando il formato.' },
      { day: 4, modeSlug: '', description: 'Converti una decisione basata su riunione in asincrona.' },
      { day: 5, modeSlug: '', description: 'Impacchetta il risultato della decisione asincrona. Misura la chiarezza.' },
      { day: 6, modeSlug: '', description: 'Rendi visibile il lavoro invisibile.' },
      { day: 7, modeSlug: '', description: 'Imposta i default asincroni per il tuo team.' },
      { day: 8, modeSlug: '', description: 'Affronta le lacune culturali nella tua configurazione distribuita.' },
    ],
  },
  'scaling-readiness-check': {
    name: 'Verifica di Prontezza alla Scala',
    description: 'Prepara la tua organizzazione per 50+ persone. Struttura, connessioni, priorità, esecuzione.',
    modeSequence: [
      { day: 1, modeSlug: '', description: 'Mappa la tua struttura organizzativa attuale.' },
      { day: 2, modeSlug: '', description: 'Definisci i blueprint per i tuoi team chiave.' },
      { day: 3, modeSlug: '', description: 'Mappa le interazioni team-a-team.' },
      { day: 4, modeSlug: '', description: 'Correggi il peggior attrito tra team.' },
      { day: 5, modeSlug: '', description: 'Allinea 3-5 priorità aziendali.' },
      { day: 6, modeSlug: '', description: 'Traduci le priorità aziendali a livello di team.' },
      { day: 7, modeSlug: '', description: "Configura il tracciamento dell'esecuzione tra team." },
      { day: 8, modeSlug: '', description: 'Costruisci il tuo cruscotto a metriche doppie.' },
      { day: 9, modeSlug: '', description: 'Definisci gli standard di qualità.' },
      { day: 10, modeSlug: '', description: "Traccia l'esecuzione a livello di team." },
      { day: 11, modeSlug: '', description: 'Verifica la qualità di un deliverable tra team.' },
      { day: 12, modeSlug: '', description: 'Rimappa le connessioni. Misura il miglioramento.' },
    ],
  },
  'ai-colleague-bootcamp': {
    name: 'Bootcamp del Collega IA',
    description: 'Configura la collaborazione umano-IA correttamente. Contesto, delega, verifica, fiducia.',
    modeSequence: [
      { day: 1, modeSlug: '', description: 'Carica il contesto del tuo business nel tuo collega IA.' },
      { day: 2, modeSlug: '', description: "Mappa i tuoi compiti: guidati dall'umano, guidati dall'IA, centauro." },
      { day: 3, modeSlug: '', description: "Definisci quali decisioni l'IA può prendere da sola." },
      { day: 4, modeSlug: '', description: "Costruisci un protocollo per verificare la qualità dell'output IA." },
      { day: 5, modeSlug: '', description: "Struttura ciò che l'IA deve sapere." },
      { day: 6, modeSlug: '', description: 'Imposta livelli di fiducia basati su evidenze, non sensazioni.' },
      { day: 7, modeSlug: '', description: 'Pianifica come scalare ciò che funziona.' },
    ],
  },
  'full-business-fitness': {
    name: 'Fitness Aziendale Completo',
    description: "L'esperienza completa 7 Flows. 15 modalità su tutti e quattro i framework in 6 settimane.",
    modeSequence: [
      { day: 1, modeSlug: '', description: 'Mappa il tuo modello di business.' },
      { day: 2, modeSlug: '', description: 'Testa il tuo presupposto più rischioso.' },
      { day: 3, modeSlug: '', description: 'Classifica e impegnati sulle priorità.' },
      { day: 4, modeSlug: '', description: 'Progetta la tua cadenza settimanale.' },
      { day: 5, modeSlug: '', description: 'Correggi la reperibilità delle informazioni.' },
      { day: 6, modeSlug: '', description: 'Pratica la comunicazione asincrona.' },
      { day: 7, modeSlug: '', description: 'Prendi la tua prima decisione asincrona strutturata.' },
      { day: 8, modeSlug: '', description: 'Configura la collaborazione IA.' },
      { day: 9, modeSlug: '', description: 'Mappa compiti umani vs IA.' },
      { day: 10, modeSlug: '', description: "Traccia l'esecuzione con visibilità." },
      { day: 11, modeSlug: '', description: 'Verifica la qualità del tuo lavoro.' },
      { day: 12, modeSlug: '', description: 'Cattura segnali di mercato.' },
      { day: 13, modeSlug: '', description: "Calibra i livelli di fiducia nell'IA." },
      { day: 14, modeSlug: '', description: 'Rendi visibile il lavoro invisibile.' },
      { day: 15, modeSlug: '', description: 'Revisione finale di validazione.' },
    ],
  },
}
