import type { ModeTranslation } from '../../schema.js'

export const nlModes: Record<string, ModeTranslation> = {
  validation: {
    name: 'Validatiemodus',
    purpose:
      'Test je riskantste bedrijfsaanname met bewijs en neem een duidelijke Doorgaan/Bijsturen/Opnieuw-testen-beslissing.',
    trigger:
      'Gebruik wanneer je een belangrijke bedrijfsbeslissing wilt nemen op basis van iets wat je gelooft maar niet hebt getest.',
    flowName: 'Validatie',
    doneSignal: 'Kun je je aanname, het bewijs voor of tegen, en je beslissing in één zin formuleren?',
    fieldsSchema: [
      {
        name: 'Aanname',
        description: 'De specifieke overtuiging die je test. Moet weerlegbaar zijn.',
        type: 'text' as const,
        required: true,
        example: 'Freelance designers betalen €49/maand voor geautomatiseerde facturatie.',
      },
      {
        name: 'Risiconiveau',
        description: 'Hoeveel schade als deze aanname onjuist is.',
        type: 'text' as const,
        required: true,
        options: ['Hoog', 'Gemiddeld', 'Laag'],
      },
      {
        name: 'Huidig bewijs',
        description: 'Wat je al weet. Data, gesprekken, signalen.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Experimentontwerp',
        description: 'De goedkoopste, snelste test die de aanname zou kunnen weerleggen.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Succescriteria',
        description: 'Het specifieke getal dat betekent dat de aanname klopt.',
        type: 'text' as const,
        required: true,
        example: '5% aanmeldingspercentage binnen 7 dagen.',
      },
      {
        name: 'Tijdskader',
        description: 'Hoe lang het experiment loopt.',
        type: 'text' as const,
        required: true,
        example: '7 dagen.',
      },
      {
        name: 'Resultaten',
        description: 'Wat er daadwerkelijk is gebeurd. Ruwe data, geen interpretatie.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Beslissing',
        description: 'Op basis van het bewijs: Doorgaan, Bijsturen of Opnieuw testen.',
        type: 'text' as const,
        required: true,
        options: ['Doorgaan', 'Bijsturen', 'Opnieuw testen'],
      },
      {
        name: 'Volgende actie',
        description: 'De specifieke volgende stap met een datum.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Aanname-update',
        description: 'Hoe is deze aanname veranderd op basis van wat je hebt geleerd?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Aannames uit de Business Engine worden ingevoerd in Validatie',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Aanname met hoogste prioriteit uit de Prioriteitenstapel',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Experimentresultaten worden ingevoerd in Inzichtregistratie',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Gevalideerde resultaten kunnen worden verpakt voor teamreview',
      },
    ],
  },
  'insight-capture': {
    name: 'Inzichtregistratie',
    purpose: 'Verwerk ruwe signalen uit je markt tot gestructureerde patronen en uitvoerbare vervolgstappen.',
    trigger: 'Gebruik wanneer je ruwe data, klantgesprekken of marktsignalen hebt die structuur nodig hebben.',
    flowName: 'Validatie',
    doneSignal:
      'Kun je dit inzicht uitleggen aan iemand die er niet bij was, met genoeg context zodat die persoon ernaar kan handelen?',
    fieldsSchema: [
      {
        name: 'Signaalbron',
        description: 'Waar kwam dit inzicht vandaan?',
        type: 'text' as const,
        required: true,
        options: ['Klantgesprek', 'Gebruiksdata', 'Marktonderzoek', 'Concurrentieobservatie', 'Teamfeedback', 'Overig'],
      },
      {
        name: 'Rauw signaal',
        description: 'De exacte observatie, het citaat of datapunt.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Patroonmatch',
        description: 'Sluit dit aan bij iets dat je eerder hebt gezien?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Sterkte',
        description: 'Hoe sterk is dit signaal?',
        type: 'text' as const,
        required: true,
        options: ['Sterk (meerdere bronnen)', 'Matig (2+ signalen)', 'Zwak (enkel signaal)'],
      },
      {
        name: 'Implicatie',
        description: 'Als dit signaal echt is, wat betekent het voor je business?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Actie',
        description: 'Welke specifieke vervolgstap drijft dit inzicht aan?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Experimentresultaten worden ingevoerd in Inzichtregistratie',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Gevalideerde inzichten informeren waardeproposities',
      },
    ],
  },
  'proposition-builder': {
    name: 'Propositiebouwer',
    purpose: 'Bouw bewijs-onderbouwde waardeproposities in drie niveaus: Basis, Tevredensteller, Verrassend goed.',
    trigger: 'Gebruik wanneer je moet verwoorden wat je aanbiedt en waarom het ertoe doet, onderbouwd met bewijs.',
    flowName: 'Validatie',
    doneSignal:
      'Kan een nieuw teamlid je waardepropositie in 30 seconden uitleggen, inclusief voor wie het is en waarom het hen interesseert?',
    fieldsSchema: [
      { name: 'Doelklant', description: 'Voor wie precies is deze propositie?', type: 'text' as const, required: true },
      {
        name: 'Probleemstelling',
        description: 'Het specifieke probleem dat je oplost, in hun woorden.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Basisniveau',
        description: 'De minimale waarde — wat je moet leveren.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Tevredensteller-niveau',
        description: 'Verwachte waarde die aan de standaard voldoet.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Verrassend-goed-niveau',
        description: 'Onverwachte waarde die loyaliteit creëert.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Bewijs',
        description: 'Welke gevalideerde data ondersteunen elk niveau?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Differentiatie',
        description: 'Wat maakt jouw propositie anders dan alternatieven?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Gevalideerde inzichten informeren proposities' },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Propositie vloeit in het bedrijfsmodelontwerp' },
    ],
  },
  'business-engine': {
    name: 'Business-Engine-modus',
    purpose: 'Breng je bedrijfsmodel-aannames in kaart en identificeer welke de motor kunnen laten vastlopen.',
    trigger: 'Gebruik wanneer je moet begrijpen hoe je business als systeem werkt en welke aannames dragend zijn.',
    flowName: 'Strategie',
    doneSignal:
      'Kun je je bedrijfsmodel in één zin uitleggen, de riskantste aanname noemen en zeggen welk bewijs je ervoor hebt?',
    fieldsSchema: [
      {
        name: 'Verdienmodel',
        description: 'Hoe komt geld binnen? Wees specifiek over prijsstelling en kanalen.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kostenstructuur',
        description: 'Waar gaat geld naartoe? Vaste vs. variabele kosten.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kernaannames',
        description: 'Noem de 3-5 aannames waarvan je model afhankelijk is.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Riskantste aanname',
        description: 'Welke aanname, als die onjuist is, breekt het model?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Huidig bewijs',
        description: 'Welke data ondersteunen of weerspreken elke aanname?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Eenheidseconomie',
        description: 'Omzet per eenheid, kosten per eenheid, marge.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Aannames vloeien in de prioriteitenrangschikking',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Riskantste aanname moet gevalideerd worden' },
    ],
  },
  'priority-stack': {
    name: 'Prioriteitenstapel-modus',
    purpose: 'Maak een bewijs-onderbouwde gedwongen rangschikking van prioriteiten met een duidelijke Niet-doen-lijst.',
    trigger:
      'Gebruik wanneer je meer te doen hebt dan tijd om het te doen, en meedogenloze helderheid nodig hebt over wat ertoe doet.',
    flowName: 'Strategie',
    doneSignal: 'Kun je iemand je top 3 prioriteiten en je Niet-doen-lijst zonder aarzeling vertellen?',
    fieldsSchema: [
      {
        name: 'Kandidaten',
        description: 'Noem alles wat op dit moment om je aandacht concurreert.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Criteria',
        description: 'Welke criteria gebruik je om te rangschikken? Impact, urgentie, bewijskracht.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Gedwongen rangschikking',
        description: 'Rangschik alle kandidaten van 1 tot N. Geen gelijke plaatsen toegestaan.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Top 3',
        description: 'Je top 3 prioriteiten met elk een onderbouwing in één zin.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Niet-doen-lijst',
        description: 'Alles onder de scheidslijn. Zeg het expliciet.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Tijdsverdeling',
        description: 'Hoe verdeel je je tijd over de top 3 deze periode?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Aannames uit de Business Engine moeten gerangschikt worden',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Topprioriteiten vloeien in uitvoeringstracking' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Aanname met hoogste prioriteit gaat naar Validatie',
      },
    ],
  },
  'execution-tracker': {
    name: 'Uitvoeringstracker-modus',
    purpose: 'Volg werkzichtbaarheid en identificeer blokkades met async-first statustracking.',
    trigger: 'Gebruik wanneer je moet zien wat er gebeurt, wat vastzit en wat gedeblokkeerd moet worden.',
    flowName: 'Uitvoering',
    doneSignal:
      'Kun je al het actieve werk zien, weten wat geblokkeerd is en een specifieke deblokkeringsactie hebben voor elke blokkade?',
    fieldsSchema: [
      {
        name: 'Werkitems',
        description: 'Noem actieve werkitems die verbonden zijn aan je prioriteiten.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Status',
        description: 'Per item: Niet gestart, In uitvoering, Geblokkeerd, Klaar.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Blokkades',
        description: 'Wat is geblokkeerd en waarom? Wees specifiek.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Deblokkeringsacties',
        description: 'Per blokkade: wie moet wat doen voor wanneer?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Doorlooptijd',
        description: 'Hoe lang van start tot voltooiing voor recente items?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Prioriteiten definiëren wat gevolgd wordt' },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Voltooide items gaan naar de Leveringscontrole' },
    ],
  },
  'delivery-check': {
    name: 'Leveringscontrole',
    purpose: 'Kwaliteitspoort voor voltooid werk en monitoring van prestaties na levering.',
    trigger: 'Gebruik wanneer werk klaar is en een kwaliteitscontrole nodig heeft voordat het als opgeleverd geldt.',
    flowName: 'Uitvoering',
    doneSignal: 'Kun je met vertrouwen zeggen dat dit resultaat klaar is voor de persoon die het ontvangt?',
    fieldsSchema: [
      { name: 'Oplevering', description: 'Wat is opgeleverd? Wees specifiek.', type: 'text' as const, required: true },
      {
        name: 'Kwaliteitscriteria',
        description: 'Aan welke standaarden moet het voldoen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kwaliteitsbeoordeling',
        description: 'Voldoet het aan elk criterium? Geslaagd/Niet geslaagd per item.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Gevonden problemen',
        description: 'Wat moet gerepareerd worden voor oplevering?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Monitoring na levering',
        description: 'Wat ga je na levering in de gaten houden om kwaliteit te bevestigen?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Voltooide werkitems uit de Uitvoeringstracker' },
    ],
  },
  'information-architecture': {
    name: 'Informatiearchitectuur-modus',
    purpose:
      'Ontwerp waar informatie leeft zodat mensen in 5 minuten kunnen vinden wat ze nodig hebben zonder te vragen.',
    trigger:
      'Gebruik wanneer mensen blijven vragen waar dingen zijn, informatie gedupliceerd of verloren raakt, of nieuwe teamleden niet kunnen vinden wat ze nodig hebben.',
    flowName: 'Informeren',
    doneSignal: 'Kan een nieuw teamlid elk kritisch stuk informatie binnen 5 minuten vinden zonder iemand te vragen?',
    fieldsSchema: [
      {
        name: 'Informatie-audit',
        description: 'Waar leeft informatie momenteel? Noem alle tools en locaties.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Pijnpunten',
        description: 'Welke informatie is het moeilijkst te vinden? Welke vragen worden herhaaldelijk gesteld?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Categorieën',
        description: 'Groepeer informatie in logische categorieën.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Single Source of Truth',
        description: 'Per categorie: waar is de canonieke locatie?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Vindbaarheidstest',
        description: 'Kan een nieuw teamlid X in 5 minuten vinden? Test 3 veelvoorkomende items.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Informatiestructuur maakt asynchroon werkontwerp mogelijk',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Informatiecategorieën vloeien in de AI-kennisstructuur',
      },
    ],
  },
  'flex-work-design': {
    name: 'Flexibel-werken-ontwerp',
    purpose: 'Definieer async-standaarden, sync-uitzonderingen, meetingbudget en energieritmes voor je team.',
    trigger:
      'Gebruik wanneer je team te veel tijd in meetings besteedt, over tijdzones heen werkt of worstelt met werk-privégrenzen.',
    flowName: 'Informeren',
    doneSignal:
      'Kan elk teamlid uitleggen wanneer async standaard is, wanneer sync gepast is en wat het meetingbudget is?',
    fieldsSchema: [
      {
        name: 'Huidige meetingbelasting',
        description: 'Hoeveel uur per week besteedt elke persoon aan meetings?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Async-standaard',
        description: 'Wat is je standaard: async of sync? Definieer de regel.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Sync-uitzonderingen',
        description: 'Wat vereist specifiek realtime interactie?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Meetingbudget',
        description: 'Maximale meetinguren per persoon per week.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Energieritmes',
        description: 'Wanneer zijn mensen het productiefst? Hoe bescherm je diep werk?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Tijdzoneprotocol',
        description: 'Hoe ga je om met async over tijdzones? Overlappingsuren?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Informatiestructuur maakt flexibel werken mogelijk',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Werkontwerp vloeit in het teamritme' },
    ],
  },
  'team-rhythm': {
    name: 'Teamritme-modus',
    purpose: 'Ontwerp je weekritme: sync-contactmomenten, diep-werkblokken, energie-checkpoints.',
    trigger:
      'Gebruik wanneer het team een consistent ritme mist, niemand weet wanneer updates komen, of diep werk steeds wordt onderbroken.',
    flowName: 'Coördineren',
    doneSignal: 'Weet elk teamlid het weekritme zonder in de agenda te kijken?',
    fieldsSchema: [
      {
        name: 'Weekritme',
        description: 'Breng het terugkerende weekritme van het team in kaart.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Sync-contactmomenten',
        description: 'Noem de essentiële sync-momenten en hun doel.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Diep-werkblokken',
        description: 'Wanneer zijn beschermde focusperiodes? Hoe worden ze gehandhaafd?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Energie-checkpoints',
        description: 'Hoe check je teamenergie en werkbelasting?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Werkontwerp definieert ritme-beperkingen' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Ritme definieert wanneer beslissingen async vs. sync genomen worden',
      },
    ],
  },
  'async-decision': {
    name: 'Async-beslissingsmodus',
    purpose:
      'Neem een duidelijke beslissing asynchroon met gestructureerde vraag, opties, deadline en bezwaarprotocol.',
    trigger: 'Gebruik wanneer er een beslissing genomen moet worden en een meeting niet de beste manier is.',
    flowName: 'Coördineren',
    doneSignal: 'Is de beslissing vastgelegd, de onderbouwing gedocumenteerd en alle betrokkenen geïnformeerd?',
    fieldsSchema: [
      {
        name: 'Beslissingsvraag',
        description: 'De specifieke vraag waarover beslist wordt. Eén zin.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Opties',
        description: 'De opties die overwogen worden, met voor- en nadelen.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Beslisser',
        description: 'Wie neemt de uiteindelijke beslissing?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Deadline',
        description: 'Wanneer moet de beslissing genomen zijn?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Input gevraagd van',
        description: 'Wie moet zich uitspreken voor de deadline?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Bezwaarprotocol',
        description: 'Hoe kan iemand bezwaar maken? Wat gebeurt er met bezwaren?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Beslissingsverslag',
        description: 'De uiteindelijke beslissing, onderbouwing en wie geraadpleegd is.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Beslissingen moeten verpakt worden voor teamzichtbaarheid',
      },
    ],
  },
  package: {
    name: 'Pakketmodus',
    purpose: 'Maak zelfstandige communicatiepakketten die geen vervolgvragen vereisen.',
    trigger: 'Gebruik wanneer je werk, updates of beslissingen deelt met mensen die er niet bij waren.',
    flowName: 'Communiceren',
    doneSignal: 'Kan iemand op basis van dit pakket handelen zonder een enkele verduidelijkingsvraag te stellen?',
    fieldsSchema: [
      {
        name: 'Context',
        description: 'Wat moet de lezer weten om dit te begrijpen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kernpunten',
        description: 'De 3-5 belangrijkste punten. Genummerd.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Beslissing nodig',
        description: 'Is er een beslissing nodig? Van wie? Voor wanneer?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Deadline', description: 'Wanneer moet de lezer reageren?', type: 'text' as const, required: true },
      {
        name: 'Feedbackformaat',
        description: 'Hoe moet de lezer reageren? Commentaar, goedkeuring, bewerking?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Validatieresultaten kunnen verpakt worden' },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Beslissingen moeten verpakt worden' },
    ],
  },
  'contribution-tracker': {
    name: 'Bijdragetracker-modus',
    purpose: 'Maak onzichtbaar werk zichtbaar over 5 bijdragetypes.',
    trigger:
      'Gebruik wanneer sommige teamleden cruciaal werk doen dat niemand ziet, of erkenning scheef richting zichtbare resultaten gaat.',
    flowName: 'Erkennen',
    doneSignal: 'Kun je bijdragen over alle 5 types zien, niet alleen levering?',
    fieldsSchema: [
      { name: 'Teamlid', description: 'Voor wie volg je bijdragen?', type: 'text' as const, required: true },
      { name: 'Levering', description: 'Tastbare opgeleverde resultaten.', type: 'text' as const, required: true },
      {
        name: 'Mentoring',
        description: 'Anderen helpen groeien, pairing, reviews, onderwijzen.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Documentatie',
        description: 'Teksten die anderen helpen zelfstandig te werken.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Procesverbetering',
        description: 'Systemen, tools of workflows verbeteren.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Deblokkeren',
        description: 'Obstakels voor anderen verwijderen.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'culture-at-distance': {
    name: 'Cultuur-op-afstand-modus',
    purpose: 'Definieer observeerbaar gedrag, rituelen, conflictprotocol en vertrouwenssignalen voor verspreide teams.',
    trigger: 'Gebruik wanneer cultuur dun aanvoelt in een verspreid team — mensen zijn productief maar niet verbonden.',
    flowName: 'Cultuur',
    doneSignal: 'Zou een nieuwe remote medewerker je teamcultuur kunnen begrijpen alleen op basis van documentatie?',
    fieldsSchema: [
      {
        name: 'Observeerbaar gedrag',
        description: 'Welk gedrag definieert je cultuur? Noem 5 die zichtbaar zijn in async werk.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Rituelen',
        description: 'Regelmatige praktijken die de cultuur versterken. Geen meetings — rituelen.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Conflictprotocol',
        description: 'Hoe ga je om met meningsverschillen wanneer je geen lichaamstaal kunt lezen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Vertrouwenssignalen',
        description: 'Wat bouwt vertrouwen op in je verspreide team? Wat ondermijnt het?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Anti-patronen',
        description: 'Welk gedrag probeer je actief te voorkomen?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  dashboard: {
    name: 'Dashboard-modus',
    purpose:
      'Stel dubbele meetwaarden in: prestatie (oplostijd, doorlooptijd) en dynamiek (leren, samenwerking, plezier).',
    trigger:
      'Gebruik bij opschaling voorbij 50 personen wanneer traditionele meetwaarden de menselijke kant van de organisatie missen.',
    flowName: 'Monitoren',
    doneSignal: 'Kun je zowel prestatie als dynamiek in één oogopslag zien en weten wanneer je moet handelen?',
    fieldsSchema: [
      {
        name: 'Prestatiemeetwaarden',
        description: 'Belangrijke operationele meetwaarden: doorlooptijd, oplostijd, leadtijd.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dynamiekmeetwaarden',
        description: 'Menselijke meetwaarden: leertempo, samenwerkingsscore, betrokkenheid, plezier.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Databronnen', description: 'Waar komt elke meetwaarde vandaan?', type: 'text' as const, required: true },
      {
        name: 'Reviewritme',
        description: 'Hoe vaak worden deze beoordeeld en door wie?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Actietriggers',
        description: 'Welke meetwaardeniveaus triggeren actie?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Dashboardsignalen vloeien in de organisatiestructuurreview',
      },
    ],
  },
  'org-map': {
    name: 'Org-map-modus',
    purpose: 'Maak een vogelvluchtoverzicht van je organisatie: teamtypes, gaten en overlappingen.',
    trigger: 'Gebruik wanneer de organisatie groeit en je het totaalplaatje moet zien.',
    flowName: 'Structuur',
    doneSignal: 'Kun je je organisatiestructuur uitleggen aan een nieuwe VP in 5 minuten?',
    fieldsSchema: [
      {
        name: 'Teams',
        description: 'Noem alle teams met type: Missie, Platform of Leiderschapskring.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Teamgroottes', description: 'Aantal personen per team.', type: 'text' as const, required: true },
      { name: 'Gaten', description: 'Welke capaciteiten ontbreken?', type: 'text' as const, required: true },
      {
        name: 'Overlappingen',
        description: 'Waar dupliceren teams inspanning?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Org-map identificeert teams die blueprints nodig hebben',
      },
    ],
  },
  'team-blueprint': {
    name: 'Team-blueprint-modus',
    purpose: 'Definieer missie, leden, beslissingsbevoegdheid, ritme en kwaliteitsstandaarden voor een team.',
    trigger:
      'Gebruik bij het opzetten van een nieuw team of wanneer een bestaand team helderheid mist over doel en bevoegdheid.',
    flowName: 'Structuur',
    doneSignal: 'Kan elk teamlid de missie, zijn rol en welke beslissingen hij of zij kan nemen benoemen?',
    fieldsSchema: [
      { name: 'Teammissie', description: 'Waarom bestaat dit team? Eén zin.', type: 'text' as const, required: true },
      {
        name: 'Leden',
        description: 'Wie zit er in het team en wat zijn hun rollen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Beslissingsbevoegdheid',
        description: 'Welke beslissingen kan dit team nemen zonder escalatie?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ritme',
        description: 'Hoe communiceert en coördineert het team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kwaliteitsstandaarden',
        description: 'Welke kwaliteitslat hanteert dit team?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Team-blueprints definiëren knooppunten in de verbindingskaart',
      },
    ],
  },
  'connection-map': {
    name: 'Verbindingskaart-modus',
    purpose: 'Breng teaminteracties in kaart: soepel, wrijving of defect. Vind knelpunten.',
    trigger: 'Gebruik wanneer cross-team coördinatie traag is, overdrachten mislukken of teams elkaar de schuld geven.',
    flowName: 'Verbinden',
    doneSignal:
      'Kun je iemand een kaart laten zien van alle teamverbindingen met kwaliteitsbeoordelingen en knelpuntoplossingen?',
    fieldsSchema: [
      {
        name: 'Teamparen',
        description: 'Noem alle team-naar-team interactieparen.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Interactiekwaliteit',
        description: 'Per paar: Soepel, Wrijving of Defect.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Knelpunten',
        description: 'Welke teamparen zijn de grootste knelpunten?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Oorzaken', description: 'Waarom zit elk knelpunt vast?', type: 'text' as const, required: true },
      {
        name: 'Oplossingsacties',
        description: 'Welke specifieke actie verbetert elk knelpunt?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Blueprints definiëren de teams om in kaart te brengen',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Probleemverbindingen hebben een gezondheidsdiagnose nodig',
      },
    ],
  },
  'relationship-health': {
    name: 'Relatiegezondheid-modus',
    purpose: 'Diagnosticeer en repareer cross-team wrijving met gestructureerde analyse.',
    trigger: 'Gebruik wanneer twee teams een wrijvings- of defecte verbinding hebben die gerepareerd moet worden.',
    flowName: 'Verbinden',
    doneSignal: 'Hebben beide teams ingestemd met het oplossingsprotocol en zich vastgelegd op een reviewdatum?',
    fieldsSchema: [
      {
        name: 'Betrokken teams',
        description: 'Welke twee teams hebben de wrijving?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Pijnveroorzakers',
        description: 'Welke specifieke acties of nalatigheden veroorzaken pijn?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Verwachtingskloof',
        description: 'Wat verwacht elk team van het andere? Waar verschillen de verwachtingen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Waardepropositie',
        description: 'Welke waarde biedt elk team aan het andere?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Oplossingsprotocol',
        description: 'Overeengekomen acties om de relatie te verbeteren.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Probleemverbindingen geïdentificeerd in de Verbindingskaart',
      },
    ],
  },
  'company-priority': {
    name: 'Bedrijfsprioriteiten-modus',
    purpose: 'Lijn 3-5 bedrijfsprioriteiten uit met bewijs, teamvertaling en afhankelijkheidskaart.',
    trigger:
      'Gebruik wanneer het bedrijf te veel prioriteiten heeft, teams in verschillende richtingen trekken of kwartaalplanning nodig is.',
    flowName: 'Uitlijnen',
    doneSignal: 'Kan elke teamleider de bedrijfsprioriteiten uitleggen en hoe zijn team bijdraagt?',
    fieldsSchema: [
      {
        name: 'Bedrijfsprioriteiten',
        description: 'Noem 3-5 bedrijfsprioriteiten met bewijsbasis.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Teamvertaling',
        description: 'Wat betekent elke prioriteit voor elk team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Afhankelijkheden',
        description: 'Welke prioriteiten zijn afhankelijk van welke teams?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Conflictoplossing',
        description: 'Als prioriteiten botsen, welke wint?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Prioriteiten sturen uitvoeringstracking op schaal',
      },
    ],
  },
  'scaled-execution': {
    name: 'Geschaalde-uitvoering-modus',
    purpose: 'Volg cross-team uitvoering met prioriteitsverbindingen, sleutelresultaten en afhankelijkheden.',
    trigger:
      'Gebruik wanneer meerdere teams aan dezelfde prioriteiten werken en inzicht nodig hebben in elkaars voortgang.',
    flowName: 'Uitvoeren',
    doneSignal: 'Kun je al het cross-team werk, afhankelijkheden en blokkades in één weergave zien?',
    fieldsSchema: [
      {
        name: 'Prioriteitsverbinding',
        description: 'Met welke bedrijfsprioriteit is dit werk verbonden?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Sleutelresultaten',
        description: 'Wat moet opgeleverd worden en door welk team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cross-team afhankelijkheden',
        description: 'Welke teams zijn afhankelijk van welke resultaten?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Status', description: 'Huidige status van elk resultaat.', type: 'text' as const, required: true },
      {
        name: 'Blokkades',
        description: 'Cross-team blokkades en deblokkeringsacties.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Prioriteiten definiëren wat op schaal gevolgd wordt',
      },
    ],
  },
  'quality-matrix': {
    name: 'Kwaliteitsmatrix-modus',
    purpose: 'Definieer consistente kwaliteitsstandaarden over teams heen: bedrijfsbreed plus teamspecifiek.',
    trigger: 'Gebruik wanneer kwaliteit varieert tussen teams en er geen gedeelde definitie van "goed genoeg" is.',
    flowName: 'Kwaliteit',
    doneSignal: 'Kan elk teamlid de kwaliteitsstandaard voor zijn werk opzoeken en weten of hij eraan voldoet?',
    fieldsSchema: [
      {
        name: 'Bedrijfsbrede standaarden',
        description: 'Kwaliteitsstandaarden die voor elk team gelden.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Teamspecifieke standaarden',
        description: 'Standaarden uniek voor elk team op basis van hun domein.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Meting',
        description: 'Hoe wordt kwaliteit gemeten voor elke standaard?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Reviewproces',
        description: 'Wie beoordeelt kwaliteit en hoe vaak?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-onboarding': {
    name: 'AI-collega-onboarding-modus',
    purpose: 'Definieer AI-collegarollen, kennisbronnen, toegangsgrenzen en succesmeetwaarden.',
    trigger: 'Gebruik wanneer je begint met AI-tools en de samenwerking goed moet opzetten.',
    flowName: 'Context',
    doneSignal:
      'Zou je dit onboardingdocument aan een nieuw teamlid kunnen geven en zou die precies weten hoe je team AI gebruikt?',
    fieldsSchema: [
      { name: 'AI-rol', description: 'Welke rol speelt de AI in je workflow?', type: 'text' as const, required: true },
      {
        name: 'Kennisbronnen',
        description: 'Welke informatie heeft de AI toegang tot nodig?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Toegangsgrenzen',
        description: 'Waar mag de AI GEEN toegang toe hebben?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Succesmeetwaarden',
        description: 'Hoe meet je of de AI-samenwerking werkt?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Reviewritme',
        description: 'Hoe vaak beoordeel je de AI-samenwerkingsopzet?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Escalatietriggers',
        description: 'Wanneer moet een mens het overnemen van de AI?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'AI-opzet vloeit in de taakdelegatiebeoordeling' },
    ],
  },
  'centaur-assessment': {
    name: 'Centaur-beoordelingsmodus',
    purpose: 'Breng elke taak in kaart: mensgestuurd, AI-gestuurd of centaur (beiden) met capaciteitsbeoordeling.',
    trigger:
      'Gebruik wanneer je moet beslissen welke taken AI kan afhandelen en welke menselijk oordeelsvermogen nodig hebben.',
    flowName: 'Context',
    doneSignal: 'Kun je voor elke terugkerende taak uitleggen wie hem doet (mens, AI of beiden) en waarom?',
    fieldsSchema: [
      {
        name: 'Taakinventaris',
        description: 'Noem alle terugkerende taken in je workflow.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Classificatie',
        description: 'Per taak: Mensgestuurd, AI-gestuurd of Centaur.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Capaciteitsbeoordeling',
        description: 'Voor AI/Centaur-taken: waar is de AI goed in en waar heeft die hulp nodig?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ontwikkelpad',
        description: 'Welke mensgestuurde taken zouden na verloop van tijd centaur kunnen worden?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'AI-opzet informeert taakdelegatie' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Delegatiekaart informeert beslissingsprotocollen',
      },
    ],
  },
  'decision-protocol': {
    name: 'Beslissingsprotocol-modus',
    purpose: 'Definieer wanneer AI beslissingen leidt vs. mensen, overstemmingsvoorwaarden en retrospectief ritme.',
    trigger:
      'Gebruik wanneer AI betrokken is bij beslissingen en je duidelijke regels nodig hebt over bevoegdheid en overstemming.',
    flowName: 'Besturen',
    doneSignal:
      'Kun je voor elk beslissingstype direct zeggen wie de bevoegdheid heeft en wat een overstemming triggert?',
    fieldsSchema: [
      {
        name: 'Beslissingscategorieën',
        description: 'Noem de types beslissingen in je workflow.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Bevoegdheidskaart',
        description: 'Per categorie: AI leidt, Mens leidt of Gedeeld.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Overstemmingsvoorwaarden',
        description:
          'Wanneer kan een mens een AI-beslissing overstemmen? Wanneer kan AI een menselijke aanbeveling overstemmen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Retrospectief ritme',
        description: 'Hoe vaak beoordeel je de beslissingskwaliteit?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Delegatiekaart informeert beslissingsbevoegdheid',
      },
    ],
  },
  'verification-ritual': {
    name: 'Verificatieritueel-modus',
    purpose: 'Bouw risicogeschaalde reviewprotocollen: hoog risico krijgt diepe review, laag risico stroomt vrij.',
    trigger:
      'Gebruik wanneer de kwaliteit van AI-output varieert en je consistente verificatie nodig hebt zonder alles te vertragen.',
    flowName: 'Besturen',
    doneSignal: 'Kan je team elke AI-output direct classificeren op risiconiveau en het reviewprotocol kennen?',
    fieldsSchema: [
      {
        name: 'Outputcategorieën',
        description: 'Noem de types AI-output die je team produceert.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Risiconiveau',
        description: 'Per categorie: Hoog, Gemiddeld of Laag risico.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Reviewprotocol',
        description: 'Per risiconiveau: welke review is vereist?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kwaliteitsdrempel',
        description: 'Welk acceptatiepercentage triggert een review van het protocol?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'knowledge-architecture': {
    name: 'Kennisarchitectuur-modus',
    purpose: 'Structureer persistente AI-context zodat je AI-collega niet elke sessie dezelfde vragen stelt.',
    trigger:
      'Gebruik wanneer AI steeds om context vraagt die het al zou moeten hebben, of antwoorden geeft die je bedrijfsspecifieke kenmerken negeren.',
    flowName: 'Kennis',
    doneSignal:
      'Kan je AI-collega een nieuwe sessie starten en direct de context hebben die nodig is om nuttig te zijn?',
    fieldsSchema: [
      {
        name: 'Kennisdomeinen',
        description: 'Welke categorieën kennis heeft de AI nodig?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Persistente context',
        description: 'Per domein: wat moet de AI altijd weten?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Update-triggers',
        description: 'Wanneer moet elk kennisdomein bijgewerkt worden?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Toegangspatroon',
        description: "Hoe benadert de AI deze kennis? Bestanden, API's, prompts?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Informatiestructuur vloeit in AI-kennis' },
    ],
  },
  'trust-calibration': {
    name: 'Vertrouwenskalibratie-modus',
    purpose:
      'Stel vertrouwensniveaus in op basis van bewijs, niet gevoel. Kalibreer oververtrouwen en ondervertrouwen.',
    trigger:
      'Gebruik wanneer je vermoedt dat het team AI te veel of te weinig vertrouwt, en beslissingen op onderbuikgevoel in plaats van data genomen worden.',
    flowName: 'Vertrouwen',
    doneSignal: 'Kun je elk vertrouwensniveau onderbouwen met bewijs, niet intuïtie?',
    fieldsSchema: [
      {
        name: 'Vertrouwensinventaris',
        description:
          'Per AI-toepassing: huidig vertrouwensniveau (Oververtrouwen, Gekalibreerd, Ondervertrouwen, Ongetest).',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Bewijs',
        description: 'Welke data ondersteunen elk vertrouwensniveau?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Kalibratieacties',
        description: 'Bij oververtrouwen: verificatie toevoegen. Bij ondervertrouwen: pilot uitvoeren.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Reviewplanning',
        description: 'Wanneer ga je de vertrouwensniveaus opnieuw kalibreren?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-scaling': {
    name: 'AI-samenwerking-schaalmodus',
    purpose: 'Plan hoe mens-AI-samenwerking evolueert naarmate de organisatie groeit.',
    trigger:
      'Gebruik wanneer AI-samenwerking werkt voor één persoon of team en opgeschaald moet worden naar de organisatie.',
    flowName: 'Opschalen',
    doneSignal: 'Kun je een roadmap voor AI-samenwerking presenteren die elke teamleider kan volgen?',
    fieldsSchema: [
      {
        name: 'Huidige situatie',
        description: 'Hoe werkt AI-samenwerking vandaag? Wie gebruikt het, waarvoor?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Opschalingspad',
        description: 'Hoe zou AI-samenwerking moeten evolueren? Solo → Team → Organisatie.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Standaardisatie vs. maatwerk',
        description: 'Wat moet standaard zijn over teams vs. aangepast per team?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Infrastructuurbehoeften',
        description: 'Welke tools, toegang of training is nodig om op te schalen?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Risicobeoordeling',
        description: 'Wat kan misgaan als je AI-samenwerking opschaalt?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
}
