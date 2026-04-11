import type { ProgramTranslation } from '../../schema.js'

export const frPrograms: Record<string, ProgramTranslation> = {
  'your-first-validation-week': {
    name: 'Votre Premiere Semaine de Validation',
    description: 'Testez votre hypothese la plus risquee en 5 jours. Cinq modes, une decision basee sur des preuves.',
    modeSequence: [
      { day: 1, modeSlug: '', description: 'Cartographiez votre modele economique. Identifiez 3 hypotheses cles.' },
      { day: 2, modeSlug: '', description: 'Classez vos hypotheses par risque. Choisissez la plus risquee.' },
      { day: 3, modeSlug: '', description: 'Concevez et lancez un test pour votre hypothese la plus risquee.' },
      { day: 4, modeSlug: '', description: 'En attendant les resultats, capturez les signaux de votre marche.' },
      {
        day: 5,
        modeSlug: '',
        description:
          'Passez en revue les resultats. Prenez votre decision : Perseverer/Pivoter/Experimenter a nouveau.',
      },
    ],
  },
  'async-maturity-sprint': {
    name: 'Sprint de Maturite Asynchrone',
    description:
      'Reduisez les heures de reunion, developpez le muscle de la decision asynchrone et empaquetez le travail pour votre equipe distribuee.',
    modeSequence: [
      {
        day: 1,
        modeSlug: '',
        description: 'Cartographiez votre cadence de reunions actuelle. Identifiez le surplus de reunions.',
      },
      { day: 2, modeSlug: '', description: "Definissez ou va chaque type d'information." },
      { day: 3, modeSlug: '', description: "Empaquetez votre prochaine mise a jour d'equipe en utilisant le format." },
      {
        day: 4,
        modeSlug: '',
        description: 'Convertissez une prochaine decision prevue en reunion en decision asynchrone.',
      },
      { day: 5, modeSlug: '', description: 'Empaquetez le resultat de la decision asynchrone. Mesurez la clarte.' },
      { day: 6, modeSlug: '', description: 'Rendez visible le travail invisible.' },
      { day: 7, modeSlug: '', description: 'Etablissez les parametres asynchrones par defaut pour votre equipe.' },
      { day: 8, modeSlug: '', description: 'Comblez les lacunes culturelles de votre configuration distribuee.' },
    ],
  },
  'scaling-readiness-check': {
    name: 'Bilan de Preparation a la Croissance',
    description: 'Preparez votre organisation pour 50+ personnes. Structure, connexions, priorites, execution.',
    modeSequence: [
      { day: 1, modeSlug: '', description: 'Cartographiez votre structure organisationnelle actuelle.' },
      { day: 2, modeSlug: '', description: 'Definissez les blueprints de vos equipes cles.' },
      { day: 3, modeSlug: '', description: 'Cartographiez les interactions equipe-a-equipe.' },
      { day: 4, modeSlug: '', description: 'Corrigez votre pire friction inter-equipes.' },
      { day: 5, modeSlug: '', description: "Alignez 3 a 5 priorites d'entreprise." },
      { day: 6, modeSlug: '', description: "Traduisez les priorites d'entreprise au niveau des equipes." },
      { day: 7, modeSlug: '', description: "Mettez en place le suivi d'execution inter-equipes." },
      { day: 8, modeSlug: '', description: 'Construisez votre tableau de bord a double metrique.' },
      { day: 9, modeSlug: '', description: 'Definissez les standards de qualite.' },
      { day: 10, modeSlug: '', description: "Suivez l'execution au niveau des equipes." },
      { day: 11, modeSlug: '', description: 'Portail qualite pour un livrable inter-equipes.' },
      { day: 12, modeSlug: '', description: "Re-cartographiez les connexions. Mesurez l'amelioration." },
    ],
  },
  'ai-colleague-bootcamp': {
    name: 'Bootcamp du Collegue IA',
    description: 'Configurez correctement la collaboration humain-IA. Contexte, delegation, verification, confiance.',
    modeSequence: [
      { day: 1, modeSlug: '', description: 'Chargez le contexte de votre business dans votre collegue IA.' },
      {
        day: 2,
        modeSlug: '',
        description: "Cartographiez vos taches : dirigees par l'humain, dirigees par l'IA, centaure.",
      },
      { day: 3, modeSlug: '', description: "Definissez quelles decisions l'IA peut prendre seule." },
      { day: 4, modeSlug: '', description: 'Construisez un protocole pour verifier la qualite des productions IA.' },
      { day: 5, modeSlug: '', description: "Structurez ce que l'IA doit savoir." },
      { day: 6, modeSlug: '', description: 'Fixez les niveaux de confiance sur la base de preuves, pas de ressentis.' },
      { day: 7, modeSlug: '', description: "Planifiez comment mettre a l'echelle ce qui fonctionne." },
    ],
  },
  'full-business-fitness': {
    name: 'Fitness Business Complet',
    description: "L'experience complete 7 Flows. 15 modes sur les quatre frameworks en 6 semaines.",
    modeSequence: [
      { day: 1, modeSlug: '', description: 'Cartographiez votre modele economique.' },
      { day: 2, modeSlug: '', description: 'Testez votre hypothese la plus risquee.' },
      { day: 3, modeSlug: '', description: 'Classez et engagez-vous sur vos priorites.' },
      { day: 4, modeSlug: '', description: 'Concevez votre cadence hebdomadaire.' },
      { day: 5, modeSlug: '', description: "Ameliorez la trouvabilite de l'information." },
      { day: 6, modeSlug: '', description: 'Pratiquez la communication asynchrone.' },
      { day: 7, modeSlug: '', description: 'Prenez votre premiere decision asynchrone structuree.' },
      { day: 8, modeSlug: '', description: 'Mettez en place la collaboration IA.' },
      { day: 9, modeSlug: '', description: 'Cartographiez les taches humaines vs IA.' },
      { day: 10, modeSlug: '', description: "Suivez l'execution avec visibilite." },
      { day: 11, modeSlug: '', description: 'Portail qualite pour votre travail.' },
      { day: 12, modeSlug: '', description: 'Capturez les signaux du marche.' },
      { day: 13, modeSlug: '', description: 'Calibrez les niveaux de confiance IA.' },
      { day: 14, modeSlug: '', description: 'Rendez visible le travail invisible.' },
      { day: 15, modeSlug: '', description: 'Revue de validation finale.' },
    ],
  },
}
