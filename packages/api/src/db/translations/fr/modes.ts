import type { ModeTranslation } from '../../schema.js'

export const frModes: Record<string, ModeTranslation> = {
  validation: {
    name: 'Mode Validation',
    purpose:
      'Testez votre hypothese business la plus risquee avec des preuves et prenez une decision claire : Perseverer/Pivoter/Experimenter a nouveau.',
    trigger:
      'A utiliser quand vous etes sur le point de prendre une decision business importante basee sur une croyance non testee.',
    flowName: 'Validation',
    doneSignal: 'Pouvez-vous enoncer votre hypothese, les preuves pour ou contre, et votre decision en une phrase ?',
    fieldsSchema: [
      {
        name: 'Hypothese',
        description: 'La croyance specifique que vous testez. Doit etre falsifiable.',
        type: 'text' as const,
        required: true,
        example: 'Les designers freelances paieront 49 $/mois pour une facturation automatisee.',
      },
      {
        name: 'Niveau de risque',
        description: "L'ampleur des degats si cette hypothese est fausse.",
        type: 'text' as const,
        required: true,
        options: ['Eleve', 'Moyen', 'Faible'],
      },
      {
        name: 'Preuves actuelles',
        description: 'Ce que vous savez deja. Donnees, conversations, signaux.',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Design de l'experience",
        description: "Le test le moins cher et le plus rapide qui pourrait invalider l'hypothese.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Criteres de succes',
        description: "Le chiffre precis qui signifie que l'hypothese tient.",
        type: 'text' as const,
        required: true,
        example: "5 % de taux d'inscription en 7 jours.",
      },
      {
        name: 'Duree limitee',
        description: "Combien de temps dure l'experience.",
        type: 'text' as const,
        required: true,
        example: '7 jours.',
      },
      {
        name: 'Resultats',
        description: "Ce qui s'est reellement passe. Donnees brutes, pas d'interpretation.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Decision',
        description: 'Sur la base des preuves : Perseverer, Pivoter ou Experimenter a nouveau.',
        type: 'text' as const,
        required: true,
        options: ['Perseverer', 'Pivoter', 'Experimenter a nouveau'],
      },
      {
        name: 'Prochaine action',
        description: 'La prochaine etape concrete avec une date.',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Mise a jour de l'hypothese",
        description: 'Comment cette hypothese a-t-elle evolue a la lumiere de vos apprentissages ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Les hypotheses identifiees dans le Moteur Business alimentent la Validation',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "L'hypothese la plus prioritaire de la Pile de Priorites",
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Les resultats d'experience alimentent la Capture d'Insights",
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Les resultats valides peuvent etre empaquetes pour revue d'equipe",
      },
    ],
  },
  'insight-capture': {
    name: "Mode Capture d'Insights",
    purpose: 'Transformez les signaux bruts de votre marche en schemas structures et prochaines etapes actionnables.',
    trigger:
      'A utiliser quand vous avez des donnees brutes, des conversations clients ou des signaux de marche qui necessitent une structure.',
    flowName: 'Validation',
    doneSignal:
      "Pouvez-vous expliquer cet insight a quelqu'un qui n'etait pas dans la piece, avec assez de contexte pour qu'il puisse agir ?",
    fieldsSchema: [
      {
        name: 'Source du signal',
        description: "D'ou vient cet insight ?",
        type: 'text' as const,
        required: true,
        options: [
          'Conversation client',
          "Donnees d'utilisation",
          'Etude de marche',
          'Observation concurrentielle',
          "Retour d'equipe",
          'Autre',
        ],
      },
      {
        name: 'Signal brut',
        description: "L'observation exacte, la citation ou le point de donnees.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Correspondance de schema',
        description: 'Est-ce que cela se connecte a quelque chose que vous avez deja observe ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Intensite',
        description: 'Quelle est la force de ce signal ?',
        type: 'text' as const,
        required: true,
        options: ['Fort (sources multiples)', 'Modere (2+ signaux)', 'Faible (signal unique)'],
      },
      {
        name: 'Implication',
        description: "Si ce signal est reel, qu'est-ce que cela signifie pour votre business ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Action',
        description: 'Quelle prochaine etape concrete cet insight motive-t-il ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Les resultats d'experience alimentent la Capture d'Insights",
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Les insights valides orientent les propositions de valeur',
      },
    ],
  },
  'proposition-builder': {
    name: 'Mode Construction de Proposition',
    purpose:
      'Construisez des propositions de valeur etayees par des preuves en trois niveaux : Basique, Satisfaisant, Enchanteur.',
    trigger:
      "A utiliser quand vous devez articuler ce que vous offrez et pourquoi c'est important, en vous appuyant sur des preuves.",
    flowName: 'Validation',
    doneSignal:
      "Un nouveau membre d'equipe peut-il expliquer votre proposition de valeur en 30 secondes, en precisant a qui elle s'adresse et pourquoi ils s'y interessent ?",
    fieldsSchema: [
      {
        name: 'Client cible',
        description: "A qui s'adresse exactement cette proposition ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Enonce du probleme',
        description: 'Le probleme specifique que vous resolvez, dans leurs mots.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Niveau Basique',
        description: 'La valeur minimale viable -- ce que vous devez delivrer.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Niveau Satisfaisant',
        description: 'La valeur attendue qui repond au standard.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Niveau Enchanteur',
        description: 'La valeur inattendue qui cree de la fidelite.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Preuves',
        description: 'Quelles donnees validees soutiennent chaque niveau ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Differenciation',
        description: "Qu'est-ce qui rend votre proposition differente des alternatives ?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Les insights valides orientent les propositions',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La proposition alimente la conception du modele economique',
      },
    ],
  },
  'business-engine': {
    name: 'Mode Moteur Business',
    purpose:
      'Cartographiez les hypotheses de votre modele economique et identifiez celles qui pourraient briser le moteur.',
    trigger:
      'A utiliser quand vous devez comprendre comment votre business fonctionne en tant que systeme et quelles hypotheses sont porteuses.',
    flowName: 'Strategie',
    doneSignal:
      "Pouvez-vous expliquer votre modele economique en une phrase, nommer l'hypothese la plus risquee et dire quelles preuves vous avez ?",
    fieldsSchema: [
      {
        name: 'Modele de revenus',
        description: "Comment l'argent entre-t-il ? Soyez precis sur les prix et les canaux.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Structure de couts',
        description: "Ou va l'argent ? Couts fixes vs variables.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Hypotheses cles',
        description: 'Listez les 3 a 5 hypotheses dont depend votre modele.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Hypothese la plus risquee',
        description: 'Quelle hypothese, si elle est fausse, casse le modele ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Preuves actuelles',
        description: 'Quelles donnees soutiennent ou remettent en question chaque hypothese ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Economie unitaire',
        description: 'Revenu par unite, cout par unite, marge.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Les hypotheses alimentent le classement par priorite',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: "L'hypothese la plus risquee doit etre validee" },
    ],
  },
  'priority-stack': {
    name: 'Mode Pile de Priorites',
    purpose:
      'Creez un classement force de priorites base sur des preuves avec une liste claire de ce que vous Ne Faites Pas.',
    trigger:
      "A utiliser quand vous avez plus de choses a faire que de temps pour les faire, et que vous avez besoin d'une clarte impitoyable sur ce qui compte.",
    flowName: 'Strategie',
    doneSignal: "Pouvez-vous dire a quelqu'un vos 3 priorites principales et votre liste Ne Pas Faire sans hesiter ?",
    fieldsSchema: [
      {
        name: 'Candidats',
        description: 'Listez tout ce qui rivalise pour votre attention en ce moment.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Criteres',
        description: 'Quels criteres utiliserez-vous pour classer ? Impact, urgence, solidite des preuves.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Classement force',
        description: "Classez tous les candidats de 1 a N. Pas d'ex aequo.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Top 3',
        description: 'Vos 3 priorites principales avec une justification en une phrase chacune.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Liste Ne Pas Faire',
        description: 'Tout ce qui est en dessous de la ligne de coupe. Dites-le explicitement.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Allocation de temps',
        description: 'Comment votre temps sera-t-il reparti entre le top 3 cette periode ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Les hypotheses du Moteur Business doivent etre classees',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Les priorites principales alimentent le suivi d'execution",
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "L'hypothese la plus prioritaire va en Validation",
      },
    ],
  },
  'execution-tracker': {
    name: "Mode Suivi d'Execution",
    purpose: 'Suivez la visibilite du travail et identifiez les blocages avec un suivi asynchrone.',
    trigger: 'A utiliser quand vous devez voir ce qui se passe, ce qui est bloque et ce qui doit etre debloque.',
    flowName: 'Execution',
    doneSignal:
      'Pouvez-vous voir tout le travail en cours, savoir ce qui est bloque et avoir une action de deblocage specifique pour chaque obstacle ?',
    fieldsSchema: [
      {
        name: 'Elements de travail',
        description: 'Listez les elements de travail actifs lies a vos priorites.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Statut',
        description: 'Pour chaque element : Non demarre, En cours, Bloque, Termine.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Blocages',
        description: "Qu'est-ce qui est bloque et pourquoi ? Soyez precis.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Actions de deblocage',
        description: 'Pour chaque blocage : qui doit faire quoi avant quand ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Temps de cycle',
        description: 'Combien de temps entre le debut et la fin pour les elements recents ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: "Les priorites definissent ce qu'il faut suivre" },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Les elements termines vont au Controle de Livraison',
      },
    ],
  },
  'delivery-check': {
    name: 'Mode Controle de Livraison',
    purpose: 'Portail qualite pour le travail termine et suivi des performances post-livraison.',
    trigger:
      'A utiliser quand le travail est termine et necessite un controle qualite avant de le considerer comme livre.',
    flowName: 'Execution',
    doneSignal: 'Pouvez-vous affirmer en toute confiance que ce livrable est pret pour la personne qui le recoit ?',
    fieldsSchema: [
      {
        name: 'Livrable',
        description: "Qu'est-ce qui a ete livre ? Soyez precis.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Criteres de qualite',
        description: 'Quels standards doit-il respecter ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evaluation de la qualite',
        description: 'Repond-il a chaque critere ? Passe/Echec par element.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Problemes trouves',
        description: "Qu'est-ce qui doit etre corrige avant livraison ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Suivi post-livraison',
        description: 'Que surveillerez-vous apres la livraison pour confirmer la qualite ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Elements de travail termines du Suivi d'Execution",
      },
    ],
  },
  'information-architecture': {
    name: "Mode Architecture de l'Information",
    purpose:
      "Concevez ou l'information reside pour que les gens trouvent ce dont ils ont besoin en 5 minutes sans demander.",
    trigger:
      "A utiliser quand les gens n'arretent pas de demander ou sont les choses, que l'information est dupliquee ou perdue, ou que les nouveaux arrivants ne trouvent pas ce qu'il leur faut.",
    flowName: 'Informer',
    doneSignal:
      "Un nouveau membre d'equipe peut-il trouver n'importe quelle information critique en 5 minutes sans demander a quelqu'un ?",
    fieldsSchema: [
      {
        name: "Audit de l'information",
        description: "Ou l'information vit-elle actuellement ? Listez tous les outils et emplacements.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Points de douleur',
        description:
          'Quelle information est la plus difficile a trouver ? Quelles questions sont posees a repetition ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Categories',
        description: "Regroupez l'information en categories logiques.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Source unique de verite',
        description: "Pour chaque categorie, ou est l'emplacement canonique ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Test de trouvabilite',
        description: "Un nouveau membre d'equipe peut-il trouver X en 5 minutes ? Testez 3 elements courants.",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "La structure de l'information permet la conception du travail asynchrone",
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Les categories d'information alimentent la structure de connaissance IA",
      },
    ],
  },
  'flex-work-design': {
    name: 'Mode Design du Travail Flexible',
    purpose:
      "Definissez les parametres asynchrones par defaut, les exceptions synchrones, le budget reunions et les rythmes d'energie de votre equipe.",
    trigger:
      "A utiliser quand votre equipe passe trop de temps en reunions, travaille sur plusieurs fuseaux horaires ou a du mal avec l'equilibre vie pro/perso.",
    flowName: 'Informer',
    doneSignal:
      "Chaque membre de l'equipe peut-il expliquer quand privilegier l'asynchrone, quand le synchrone est approprie et quel est son budget reunions ?",
    fieldsSchema: [
      {
        name: 'Charge de reunions actuelle',
        description: "Combien d'heures par semaine chaque personne passe-t-elle en reunions ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Asynchrone par defaut',
        description: 'Quel est votre mode par defaut : asynchrone ou synchrone ? Definissez la regle.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Exceptions synchrones',
        description: "Qu'est-ce qui necessite specifiquement une interaction en temps reel ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Budget reunions',
        description: "Nombre maximum d'heures de reunion par personne et par semaine.",
        type: 'text' as const,
        required: true,
      },
      {
        name: "Rythmes d'energie",
        description: 'Quand les gens sont-ils les plus productifs ? Comment protegez-vous le travail en profondeur ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocole fuseaux horaires',
        description: "Comment gerez-vous l'asynchrone entre fuseaux ? Heures de chevauchement ?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "La structure de l'information permet le travail flexible",
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Le design du travail alimente la cadence d'equipe",
      },
    ],
  },
  'team-rhythm': {
    name: "Mode Rythme d'Equipe",
    purpose:
      "Concevez votre cadence hebdomadaire : points de contact synchrones, blocs de travail en profondeur, points de controle d'energie.",
    trigger:
      "A utiliser quand l'equipe manque d'une cadence reguliere, que les gens ne savent pas quand attendre les mises a jour, ou que le travail en profondeur est constamment interrompu.",
    flowName: 'Coordonner',
    doneSignal: "Chaque membre de l'equipe connait-il le rythme hebdomadaire sans consulter un calendrier ?",
    fieldsSchema: [
      {
        name: 'Cadence hebdomadaire',
        description: "Cartographiez le rythme hebdomadaire recurrent de l'equipe.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Points de contact synchrones',
        description: 'Listez les moments synchrones essentiels et leur objectif.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Blocs de travail en profondeur',
        description: 'Quand sont les periodes de concentration protegees ? Comment sont-elles appliquees ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Points de controle d'energie",
        description: "Comment verifiez-vous l'energie et la charge de travail de l'equipe ?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Le design du travail definit les contraintes de rythme',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Le rythme definit quand les decisions se prennent en asynchrone vs synchrone',
      },
    ],
  },
  'async-decision': {
    name: 'Mode Decision Asynchrone',
    purpose:
      'Prenez une decision claire de maniere asynchrone avec une question structuree, des options, une date limite et un protocole de desaccord.',
    trigger:
      "A utiliser quand une decision doit etre prise et qu'une reunion n'est pas le meilleur moyen de la prendre.",
    flowName: 'Coordonner',
    doneSignal:
      'La decision est-elle enregistree, la justification documentee et toutes les parties prenantes informees ?',
    fieldsSchema: [
      {
        name: 'Question de decision',
        description: 'La question specifique a trancher. Une phrase.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Options',
        description: 'Les options envisagees, avec les pour/contre de chacune.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Decideur', description: 'Qui prend la decision finale ?', type: 'text' as const, required: true },
      {
        name: 'Date limite',
        description: 'Quand la decision doit-elle etre prise ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Avis demande a',
        description: 'Qui doit donner son avis avant la date limite ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocole de desaccord',
        description: "Comment quelqu'un peut-il exprimer son desaccord ? Que se passe-t-il avec les objections ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Registre de decision',
        description: 'La decision finale, la justification et les personnes consultees.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Les decisions doivent etre empaquetees pour la visibilite de l'equipe",
      },
    ],
  },
  package: {
    name: 'Mode Empaquetage',
    purpose: 'Creez des paquets de communication autonomes qui ne necessitent pas de questions de suivi.',
    trigger:
      "A utiliser quand vous partagez du travail, des mises a jour ou des decisions avec des personnes qui n'etaient pas dans la piece.",
    flowName: 'Communiquer',
    doneSignal: "Quelqu'un peut-il agir sur ce paquet sans poser une seule question de clarification ?",
    fieldsSchema: [
      {
        name: 'Contexte',
        description: 'Que doit savoir le lecteur pour comprendre ceci ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Points cles',
        description: 'Les 3 a 5 choses les plus importantes. Numerotees.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Decision requise',
        description: 'Une decision est-elle necessaire ? De la part de qui ? Pour quand ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Date limite',
        description: 'Quand le lecteur doit-il repondre ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Format de retour',
        description: 'Comment le lecteur doit-il repondre ? Commenter, approuver, modifier ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Les resultats de validation peuvent etre empaquetes',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Les decisions doivent etre empaquetees' },
    ],
  },
  'contribution-tracker': {
    name: 'Mode Suivi des Contributions',
    purpose: 'Rendez visible le travail invisible a travers 5 types de contributions.',
    trigger:
      "A utiliser quand certains membres de l'equipe font un travail critique que personne ne voit, ou que la reconnaissance est biaisee vers les livrables visibles.",
    flowName: 'Reconnaitre',
    doneSignal: 'Pouvez-vous voir les contributions sur les 5 types, pas seulement la livraison ?',
    fieldsSchema: [
      {
        name: "Membre de l'equipe",
        description: 'Pour qui suivez-vous les contributions ?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Livraison', description: 'Les productions tangibles livrees.', type: 'text' as const, required: true },
      {
        name: 'Mentorat',
        description: 'Aider les autres a progresser, faire du pair, revoir, enseigner.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Documentation',
        description: 'Les ecrits qui aident les autres a travailler de maniere autonome.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Amelioration des processus',
        description: 'Rendre les systemes, outils ou workflows meilleurs.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Deblocage',
        description: 'Supprimer les obstacles pour les autres.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'culture-at-distance': {
    name: 'Mode Culture a Distance',
    purpose:
      'Definissez les comportements observables, les rituels, le protocole de conflit et les signaux de confiance pour les equipes distribuees.',
    trigger:
      'A utiliser quand la culture semble fragile dans une equipe distribuee -- les gens sont productifs mais deconnectes.',
    flowName: 'Culture',
    doneSignal:
      'Un nouveau collaborateur a distance pourrait-il comprendre la culture de votre equipe a partir de la documentation seule ?',
    fieldsSchema: [
      {
        name: 'Comportements observables',
        description: 'Quels comportements definissent votre culture ? Listez-en 5 visibles dans le travail asynchrone.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Rituels',
        description: 'Pratiques regulieres qui renforcent la culture. Pas des reunions -- des rituels.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocole de conflit',
        description: 'Comment gerez-vous les desaccords quand vous ne pouvez pas lire le langage corporel ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Signaux de confiance',
        description: "Qu'est-ce qui construit la confiance dans votre equipe distribuee ? Qu'est-ce qui l'erode ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Anti-patterns',
        description: 'Quels comportements essayez-vous activement de prevenir ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  dashboard: {
    name: 'Mode Tableau de Bord',
    purpose:
      'Mettez en place des metriques doubles : performance (temps de resolution, temps de cycle) et dynamique (apprentissage, collaboration, plaisir).',
    trigger:
      "A utiliser quand vous passez le cap des 50 personnes et que les metriques traditionnelles passent a cote du cote humain de l'organisation.",
    flowName: 'Surveiller',
    doneSignal: "Pouvez-vous voir a la fois la performance et la dynamique d'un coup d'oeil, et savoir quand agir ?",
    fieldsSchema: [
      {
        name: 'Metriques de performance',
        description: 'Indicateurs operationnels cles : temps de cycle, temps de resolution, delai de livraison.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Metriques de dynamique',
        description: "Indicateurs humains : taux d'apprentissage, score de collaboration, engagement, plaisir.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Sources de donnees',
        description: "D'ou vient chaque metrique ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadence de revue',
        description: 'A quelle frequence sont-elles passees en revue et par qui ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Declencheurs d'action",
        description: 'Quels niveaux de metriques declenchent une action ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Les signaux du tableau de bord alimentent la revue de la structure organisationnelle',
      },
    ],
  },
  'org-map': {
    name: 'Mode Cartographie Organisationnelle',
    purpose: "Creez une vue d'ensemble de votre organisation : types d'equipes, lacunes et chevauchements.",
    trigger: "A utiliser quand l'organisation grandit et que vous devez voir l'ensemble.",
    flowName: 'Structure',
    doneSignal: 'Pouvez-vous expliquer votre structure organisationnelle a un nouveau VP en 5 minutes ?',
    fieldsSchema: [
      {
        name: 'Equipes',
        description: 'Listez toutes les equipes avec leur type : Mission, Plateforme ou Cercle de Direction.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Taille des equipes', description: 'Effectif par equipe.', type: 'text' as const, required: true },
      { name: 'Lacunes', description: 'Quelles competences manquent ?', type: 'text' as const, required: true },
      {
        name: 'Chevauchements',
        description: 'Ou les equipes dupliquent-elles les efforts ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La cartographie organisationnelle identifie les equipes necessitant des blueprints',
      },
    ],
  },
  'team-blueprint': {
    name: "Mode Blueprint d'Equipe",
    purpose:
      "Definissez la mission, les membres, l'autorite decisionnelle, la cadence et les standards de qualite d'une equipe.",
    trigger:
      'A utiliser quand vous creez une nouvelle equipe ou quand une equipe existante manque de clarte sur son objectif et son autorite.',
    flowName: 'Structure',
    doneSignal: "Chaque membre de l'equipe peut-il enoncer la mission, son role et les decisions qu'il peut prendre ?",
    fieldsSchema: [
      {
        name: "Mission de l'equipe",
        description: 'Pourquoi cette equipe existe-t-elle ? Une phrase.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Membres',
        description: "Qui fait partie de l'equipe et quels sont leurs roles ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Autorite decisionnelle',
        description: 'Quelles decisions cette equipe peut-elle prendre sans escalade ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadence',
        description: "Comment l'equipe communique-t-elle et se coordonne-t-elle ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Standards de qualite',
        description: 'Quel niveau de qualite cette equipe maintient-elle ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Les blueprints d'equipe definissent les noeuds dans la cartographie des connexions",
      },
    ],
  },
  'connection-map': {
    name: 'Mode Cartographie des Connexions',
    purpose:
      "Cartographiez les interactions entre equipes : fluides, avec friction ou rompues. Trouvez les goulots d'etranglement.",
    trigger:
      'A utiliser quand la coordination inter-equipes est lente, que les transferts echouent ou que les equipes se renvoient la balle.',
    flowName: 'Connecter',
    doneSignal:
      "Pouvez-vous montrer a quelqu'un une carte de toutes les connexions inter-equipes avec des notes de qualite et des solutions aux goulots d'etranglement ?",
    fieldsSchema: [
      {
        name: "Paires d'equipes",
        description: "Listez toutes les paires d'interaction equipe-a-equipe.",
        type: 'text' as const,
        required: true,
      },
      {
        name: "Qualite de l'interaction",
        description: 'Pour chaque paire : Fluide, Avec friction ou Rompue.',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Goulots d'etranglement",
        description: "Quelles paires d'equipes sont les plus gros goulots d'etranglement ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Causes racines',
        description: "Pourquoi chaque goulot d'etranglement est-il bloque ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Actions correctives',
        description: "Quelle action specifique ameliorera chaque goulot d'etranglement ?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Les blueprints definissent les equipes a cartographier',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Les connexions problematiques necessitent un diagnostic de sante',
      },
    ],
  },
  'relationship-health': {
    name: 'Mode Sante Relationnelle',
    purpose: 'Diagnostiquez et reparez les frictions inter-equipes avec une analyse structuree.',
    trigger: 'A utiliser quand deux equipes ont une connexion Avec friction ou Rompue qui necessite une reparation.',
    flowName: 'Connecter',
    doneSignal:
      "Les deux equipes se sont-elles mises d'accord sur le protocole de reparation et engagees sur une date de revue ?",
    fieldsSchema: [
      {
        name: 'Equipes concernees',
        description: 'Quelles deux equipes ont la friction ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Generateurs de douleur',
        description: 'Quelles actions ou inactions specifiques causent de la douleur ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Ecart d'attentes",
        description: "Qu'attend chaque equipe de l'autre ? Ou les attentes different-elles ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Proposition de valeur',
        description: "Quelle valeur chaque equipe apporte-t-elle a l'autre ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocole de reparation',
        description: 'Actions convenues pour ameliorer la relation.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Connexions problematiques identifiees dans la Cartographie des Connexions',
      },
    ],
  },
  'company-priority': {
    name: "Mode Priorites de l'Entreprise",
    purpose:
      "Alignez 3 a 5 priorites d'entreprise avec des preuves, une traduction par equipe et une cartographie des dependances.",
    trigger:
      "A utiliser quand l'entreprise a trop de priorites, que les equipes tirent dans des directions differentes ou qu'une planification trimestrielle est necessaire.",
    flowName: 'Aligner',
    doneSignal:
      "Chaque responsable d'equipe peut-il expliquer les priorites de l'entreprise et comment son equipe y contribue ?",
    fieldsSchema: [
      {
        name: "Priorites de l'entreprise",
        description: "Listez 3 a 5 priorites de l'entreprise avec leur base factuelle.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Traduction par equipe',
        description: 'Que signifie chaque priorite pour chaque equipe ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dependances',
        description: 'Quelles priorites dependent de quelles equipes ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Resolution de conflits',
        description: "Quand les priorites entrent en conflit, laquelle l'emporte ?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Les priorites pilotent le suivi d'execution a grande echelle",
      },
    ],
  },
  'scaled-execution': {
    name: 'Mode Execution a Grande Echelle',
    purpose:
      "Suivez l'execution inter-equipes avec les connexions aux priorites, les livrables cles et les dependances.",
    trigger:
      'A utiliser quand plusieurs equipes travaillent vers les memes priorites et ont besoin de visibilite sur la progression des autres.',
    flowName: 'Executer',
    doneSignal: 'Pouvez-vous voir tout le travail inter-equipes, les dependances et les blocages en une seule vue ?',
    fieldsSchema: [
      {
        name: 'Connexion aux priorites',
        description: "A quelle priorite d'entreprise ce travail se rattache-t-il ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Livrables cles',
        description: "Qu'est-ce qui doit etre livre et par quelle equipe ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dependances inter-equipes',
        description: 'Quelles equipes dependent de quels livrables ?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Statut', description: 'Statut actuel de chaque livrable.', type: 'text' as const, required: true },
      {
        name: 'Blocages',
        description: 'Blocages inter-equipes et actions de deblocage.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "Les priorites definissent ce qu'il faut suivre a grande echelle",
      },
    ],
  },
  'quality-matrix': {
    name: 'Mode Matrice Qualite',
    purpose:
      "Definissez des standards de qualite coherents entre les equipes : a l'echelle de l'entreprise et specifiques par equipe.",
    trigger:
      "A utiliser quand la qualite varie d'une equipe a l'autre et qu'il n'y a pas de definition partagee de \"suffisamment bon\".",
    flowName: 'Qualite',
    doneSignal:
      "N'importe quel membre d'equipe peut-il consulter le standard de qualite pour son travail et savoir s'il le respecte ?",
    fieldsSchema: [
      {
        name: "Standards a l'echelle de l'entreprise",
        description: "Standards de qualite qui s'appliquent a toutes les equipes.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Standards specifiques par equipe',
        description: 'Standards propres a chaque equipe en fonction de leur domaine.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Mesure',
        description: 'Comment la qualite est-elle mesuree pour chaque standard ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Processus de revue',
        description: 'Qui revoit la qualite et a quelle frequence ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-onboarding': {
    name: 'Mode Integration du Collegue IA',
    purpose:
      "Definissez les roles du collegue IA, les sources de connaissance, les limites d'acces et les metriques de succes.",
    trigger:
      'A utiliser quand vous commencez a travailler avec des outils IA et que vous devez configurer la collaboration correctement.',
    flowName: 'Contexte',
    doneSignal:
      "Pourriez-vous remettre ce document d'integration a un nouveau membre d'equipe et il saurait exactement comment votre equipe utilise l'IA ?",
    fieldsSchema: [
      {
        name: "Role de l'IA",
        description: "Quel role l'IA joue-t-elle dans votre workflow ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Sources de connaissance',
        description: "A quelles informations l'IA a-t-elle besoin d'acceder ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: "Limites d'acces",
        description: "A quoi l'IA ne doit-elle PAS avoir acces ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Metriques de succes',
        description: 'Comment mesurerez-vous si la collaboration IA fonctionne ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadence de revue',
        description: 'A quelle frequence reverrez-vous la configuration de la collaboration IA ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Declencheurs d'escalade",
        description: "Quand un humain doit-il prendre le relais de l'IA ?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "La configuration IA alimente l'evaluation de la delegation de taches",
      },
    ],
  },
  'centaur-assessment': {
    name: 'Mode Evaluation Centaure',
    purpose:
      "Cartographiez chaque tache : dirigee par l'humain, dirigee par l'IA, ou centaure (les deux) avec une evaluation des capacites.",
    trigger:
      "A utiliser quand vous devez decider quelles taches l'IA peut gerer et lesquelles necessitent un jugement humain.",
    flowName: 'Contexte',
    doneSignal:
      'Pouvez-vous expliquer pour chaque tache recurrente qui la realise (humain, IA ou les deux) et pourquoi ?',
    fieldsSchema: [
      {
        name: 'Inventaire des taches',
        description: 'Listez toutes les taches recurrentes de votre workflow.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Classification',
        description: "Pour chaque tache : Dirigee par l'humain, Dirigee par l'IA ou Centaure.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evaluation des capacites',
        description: "Pour les taches IA/Centaure : dans quoi l'IA excelle-t-elle et ou a-t-elle besoin d'aide ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: "Parcours d'evolution",
        description: "Quelles taches Dirigees par l'humain pourraient devenir Centaure avec le temps ?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La configuration IA informe la delegation de taches',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'La carte de delegation informe les protocoles de decision',
      },
    ],
  },
  'decision-protocol': {
    name: 'Mode Protocole de Decision',
    purpose:
      "Definissez quand l'IA dirige les decisions vs les humains, les conditions de derogation et la cadence de retrospective.",
    trigger:
      "A utiliser quand l'IA est impliquee dans les decisions et que vous avez besoin de regles claires sur l'autorite et la derogation.",
    flowName: 'Gouverner',
    doneSignal:
      "Pour n'importe quel type de decision, pouvez-vous dire instantanement qui a l'autorite et ce qui declenche une derogation ?",
    fieldsSchema: [
      {
        name: 'Categories de decisions',
        description: 'Listez les types de decisions dans votre workflow.',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Carte d'autorite",
        description: "Pour chaque categorie : l'IA dirige, l'Humain dirige ou Partage.",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Conditions de derogation',
        description:
          "Quand un humain peut-il passer outre une decision IA ? Quand l'IA peut-elle passer outre une recommandation humaine ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadence de retrospective',
        description: 'A quelle frequence passez-vous en revue la qualite des decisions ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "La carte de delegation informe l'autorite decisionnelle",
      },
    ],
  },
  'verification-ritual': {
    name: 'Mode Rituel de Verification',
    purpose:
      'Construisez des protocoles de revue ajustes au risque : revue approfondie pour les enjeux eleves, libre circulation pour les enjeux faibles.',
    trigger:
      "A utiliser quand la qualite des productions IA varie et que vous avez besoin d'une verification coherente sans tout ralentir.",
    flowName: 'Gouverner',
    doneSignal:
      'Votre equipe peut-elle instantanement classifier toute production IA par niveau de risque et connaitre le protocole de revue ?',
    fieldsSchema: [
      {
        name: 'Categories de production',
        description: 'Listez les types de productions IA de votre equipe.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Niveau de risque',
        description: 'Pour chaque categorie : risque Eleve, Moyen ou Faible.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocole de revue',
        description: 'Pour chaque niveau de risque : quelle revue est requise ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Seuil de qualite',
        description: "Quel taux d'acceptation declenche une revue du protocole ?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'knowledge-architecture': {
    name: 'Mode Architecture des Connaissances',
    purpose:
      "Structurez le contexte persistant de l'IA pour que votre collegue IA ne pose pas les memes questions a chaque session.",
    trigger:
      "A utiliser quand l'IA redemande sans cesse un contexte qu'elle devrait deja avoir, ou donne des reponses qui ignorent les specificites de votre business.",
    flowName: 'Connaissance',
    doneSignal:
      'Votre collegue IA peut-il demarrer une nouvelle session et disposer immediatement du contexte necessaire pour etre utile ?',
    fieldsSchema: [
      {
        name: 'Domaines de connaissance',
        description: "Quelles categories de connaissances l'IA a-t-elle besoin ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Contexte persistant',
        description: "Pour chaque domaine : que doit toujours savoir l'IA ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Declencheurs de mise a jour',
        description: 'Quand chaque domaine de connaissance doit-il etre mis a jour ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: "Schema d'acces",
        description: "Comment l'IA accede-t-elle a ces connaissances ? Fichiers, API, prompts ?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: "La structure de l'information alimente la connaissance IA",
      },
    ],
  },
  'trust-calibration': {
    name: 'Mode Calibration de la Confiance',
    purpose:
      'Fixez les niveaux de confiance sur la base de preuves, pas de ressentis. Calibrez la sur-confiance et la sous-confiance.',
    trigger:
      "A utiliser quand vous suspectez que l'equipe fait trop ou pas assez confiance a l'IA, et que les decisions se prennent a l'instinct plutot qu'avec des donnees.",
    flowName: 'Confiance',
    doneSignal: "Pouvez-vous justifier chaque niveau de confiance avec des preuves, pas avec de l'intuition ?",
    fieldsSchema: [
      {
        name: 'Inventaire de confiance',
        description:
          "Pour chaque cas d'usage IA : niveau de confiance actuel (Sur-confiance, Calibre, Sous-confiance, Non teste).",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Preuves',
        description: 'Quelles donnees soutiennent chaque niveau de confiance ?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Actions de calibration',
        description: 'Pour la sur-confiance : ajouter de la verification. Pour la sous-confiance : lancer un pilote.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Calendrier de revue',
        description: 'Quand recalibrerez-vous les niveaux de confiance ?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-scaling': {
    name: "Mode Mise a l'Echelle de la Collaboration IA",
    purpose: "Planifiez comment la collaboration humain-IA evolue a mesure que l'organisation grandit.",
    trigger:
      "A utiliser quand la collaboration IA fonctionne pour une personne ou une equipe et doit passer a l'echelle de l'organisation.",
    flowName: 'Echelle',
    doneSignal:
      "Pouvez-vous presenter une feuille de route pour la collaboration IA que n'importe quel responsable d'equipe peut suivre ?",
    fieldsSchema: [
      {
        name: 'Etat actuel',
        description: "Comment la collaboration IA fonctionne-t-elle aujourd'hui ? Qui l'utilise, pour quoi ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: "Parcours de mise a l'echelle",
        description: 'Comment la collaboration IA devrait-elle evoluer ? Solo -> Equipe -> Organisation.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Standardisation vs Personnalisation',
        description: "Qu'est-ce qui devrait etre standard entre les equipes vs personnalise par equipe ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Besoins en infrastructure',
        description: "Quels outils, acces ou formations sont necessaires pour la mise a l'echelle ?",
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evaluation des risques',
        description: "Qu'est-ce qui pourrait mal tourner en mettant a l'echelle la collaboration IA ?",
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
}
