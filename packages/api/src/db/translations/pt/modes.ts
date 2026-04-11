import type { ModeTranslation } from '../../schema.js'

export const ptModes: Record<string, ModeTranslation> = {
  validation: {
    name: 'Modo Validação',
    purpose:
      'Teste o pressuposto de negócio mais arriscado com evidências e tome uma decisão clara: Perseverar/Pivotar/Experimentar Novamente.',
    trigger:
      'Use quando estiver prestes a tomar uma decisão de negócio significativa baseada em algo que acredita mas não testou.',
    flowName: 'Validação',
    doneSignal: 'Consegue declarar o seu pressuposto, a evidência a favor ou contra, e a sua decisão numa frase?',
    fieldsSchema: [
      {
        name: 'Pressuposto',
        description: 'A crença específica que está a testar. Deve ser falsificável.',
        type: 'text' as const,
        required: true,
        example: 'Designers freelancers vão pagar 49€/mês por faturação automatizada.',
      },
      {
        name: 'Nível de Risco',
        description: 'Quanto dano se este pressuposto estiver errado.',
        type: 'text' as const,
        required: true,
        options: ['Alto', 'Médio', 'Baixo'],
      },
      {
        name: 'Evidência Atual',
        description: 'O que já sabe. Dados, conversas, sinais.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Design do Experimento',
        description: 'O teste mais barato e rápido que poderia refutar o pressuposto.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Critérios de Sucesso',
        description: 'O número específico que significa que o pressuposto se mantém.',
        type: 'text' as const,
        required: true,
        example: '5% de taxa de registo em 7 dias.',
      },
      {
        name: 'Prazo Limite',
        description: 'Quanto tempo dura o experimento.',
        type: 'text' as const,
        required: true,
        example: '7 dias.',
      },
      {
        name: 'Resultados',
        description: 'O que realmente aconteceu. Dados brutos, não interpretação.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Decisão',
        description: 'Com base na evidência: Perseverar, Pivotar ou Experimentar Novamente.',
        type: 'text' as const,
        required: true,
        options: ['Perseverar', 'Pivotar', 'Experimentar Novamente'],
      },
      {
        name: 'Próxima Ação',
        description: 'O próximo passo específico com uma data.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Atualização do Pressuposto',
        description: 'Como é que este pressuposto mudou com base no que aprendeu?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Pressupostos identificados no Motor de Negócio alimentam a Validação',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Pressuposto de maior prioridade da Pilha de Prioridades',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Resultados do experimento alimentam a Captura de Insights',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Resultados validados podem ser empacotados para revisão da equipa',
      },
    ],
  },
  'insight-capture': {
    name: 'Modo Captura de Insights',
    purpose: 'Transforme sinais brutos do seu mercado em padrões estruturados e próximos passos acionáveis.',
    trigger: 'Use quando tiver dados brutos, conversas com clientes ou sinais de mercado que precisam de estrutura.',
    flowName: 'Validação',
    doneSignal: 'Consegue explicar este insight a alguém que não estava na sala, com contexto suficiente para agir?',
    fieldsSchema: [
      {
        name: 'Fonte do Sinal',
        description: 'De onde veio este insight?',
        type: 'text' as const,
        required: true,
        options: [
          'Conversa com cliente',
          'Dados de utilização',
          'Pesquisa de mercado',
          'Observação da concorrência',
          'Feedback da equipa',
          'Outro',
        ],
      },
      {
        name: 'Sinal Bruto',
        description: 'A observação exata, citação ou ponto de dados.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Correspondência de Padrão',
        description: 'Isto liga-se a algo que já viu antes?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Força',
        description: 'Quão forte é este sinal?',
        type: 'text' as const,
        required: true,
        options: ['Forte (múltiplas fontes)', 'Moderado (2+ sinais)', 'Fraco (sinal único)'],
      },
      {
        name: 'Implicação',
        description: 'Se este sinal é real, o que significa para o seu negócio?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ação',
        description: 'Que próximo passo específico este insight motiva?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Resultados do experimento alimentam a Captura de Insights',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Insights validados informam propostas de valor' },
    ],
  },
  'proposition-builder': {
    name: 'Modo Construtor de Propostas',
    purpose: 'Construa propostas de valor baseadas em evidências em três níveis: Básico, Satisfatório, Encantador.',
    trigger: 'Use quando precisa de articular o que oferece e porque importa, com base em evidências.',
    flowName: 'Validação',
    doneSignal:
      'Um novo membro da equipa consegue explicar a sua proposta de valor em 30 segundos, incluindo para quem é e porque se importam?',
    fieldsSchema: [
      {
        name: 'Cliente-Alvo',
        description: 'Para quem exatamente é esta proposta?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Declaração do Problema',
        description: 'O problema específico que está a resolver, nas palavras deles.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Nível Básico',
        description: 'O valor mínimo viável — o que tem de entregar.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Nível Satisfatório',
        description: 'Valor esperado que cumpre o padrão.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Nível Encantador',
        description: 'Valor inesperado que cria lealdade.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evidência',
        description: 'Que dados validados suportam cada nível?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Diferenciação',
        description: 'O que torna a sua proposta diferente das alternativas?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Insights validados informam propostas' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'A proposta alimenta o design do modelo de negócio',
      },
    ],
  },
  'business-engine': {
    name: 'Modo Motor de Negócio',
    purpose: 'Mapeie os pressupostos do seu modelo de negócio e identifique quais podem quebrar o motor.',
    trigger:
      'Use quando precisa de entender como o seu negócio funciona como sistema e quais pressupostos são estruturais.',
    flowName: 'Estratégia',
    doneSignal:
      'Consegue explicar o seu modelo de negócio numa frase, nomear o pressuposto mais arriscado e dizer que evidência tem?',
    fieldsSchema: [
      {
        name: 'Modelo de Receita',
        description: 'Como entra o dinheiro? Seja específico sobre preços e canais.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Estrutura de Custos',
        description: 'Para onde vai o dinheiro? Custos fixos vs variáveis.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Pressupostos-Chave',
        description: 'Liste os 3-5 pressupostos de que o seu modelo depende.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Pressuposto Mais Arriscado',
        description: 'Qual pressuposto, se errado, quebra o modelo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evidência Atual',
        description: 'Que dados suportam ou desafiam cada pressuposto?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Economia Unitária',
        description: 'Receita por unidade, custo por unidade, margem.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Pressupostos alimentam a classificação de prioridades',
      },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'O pressuposto mais arriscado deve ser validado' },
    ],
  },
  'priority-stack': {
    name: 'Modo Pilha de Prioridades',
    purpose: 'Crie uma classificação forçada de prioridades baseada em evidências com uma lista clara de Não Fazer.',
    trigger: 'Use quando tem mais coisas para fazer do que tempo, e precisa de clareza implacável sobre o que importa.',
    flowName: 'Estratégia',
    doneSignal: 'Consegue dizer a alguém as suas 3 prioridades principais e a sua lista de Não Fazer sem hesitar?',
    fieldsSchema: [
      {
        name: 'Candidatos',
        description: 'Liste tudo o que compete pela sua atenção agora.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Critérios',
        description: 'Que critérios vai usar para classificar? Impacto, urgência, força da evidência.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Classificação Forçada',
        description: 'Classifique todos os candidatos de 1 a N. Sem empates.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Top 3',
        description: 'As suas 3 prioridades principais com uma frase de justificação cada.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Lista de Não Fazer',
        description: 'Tudo abaixo da linha de corte. Diga-o explicitamente.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Alocação de Tempo',
        description: 'Como vai dividir o seu tempo entre as 3 prioridades neste período?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Pressupostos do Motor de Negócio precisam de classificação',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Prioridades principais alimentam o acompanhamento de execução',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'O pressuposto de maior prioridade vai para Validação',
      },
    ],
  },
  'execution-tracker': {
    name: 'Modo Rastreador de Execução',
    purpose: 'Acompanhe a visibilidade do trabalho e identifique bloqueios com rastreamento assíncrono.',
    trigger: 'Use quando precisa de ver o que está a acontecer, o que está parado e o que precisa de ser desbloqueado.',
    flowName: 'Execução',
    doneSignal:
      'Consegue ver todo o trabalho ativo, saber o que está bloqueado e ter uma ação de desbloqueio para cada bloqueio?',
    fieldsSchema: [
      {
        name: 'Itens de Trabalho',
        description: 'Liste os itens de trabalho ativos ligados às suas prioridades.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Estado',
        description: 'Para cada item: Não Iniciado, Em Progresso, Bloqueado, Concluído.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Bloqueios',
        description: 'O que está bloqueado e porquê? Seja específico.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ações de Desbloqueio',
        description: 'Para cada bloqueio: quem precisa de fazer o quê até quando?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Tempo de Ciclo',
        description: 'Quanto tempo do início à conclusão para itens recentes?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Prioridades definem o que acompanhar' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Itens concluídos vão para a Verificação de Entrega',
      },
    ],
  },
  'delivery-check': {
    name: 'Modo Verificação de Entrega',
    purpose: 'Verificação de qualidade do trabalho concluído e monitorização do desempenho pós-entrega.',
    trigger:
      'Use quando o trabalho está feito e precisa de uma verificação de qualidade antes de o considerar entregue.',
    flowName: 'Execução',
    doneSignal: 'Consegue dizer com confiança que este entregável está pronto para quem o recebe?',
    fieldsSchema: [
      {
        name: 'Entregável',
        description: 'O que foi entregue? Seja específico.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Critérios de Qualidade',
        description: 'Que padrões deve cumprir?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Avaliação de Qualidade',
        description: 'Cumpre cada critério? Aprovado/Reprovado por item.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Problemas Encontrados',
        description: 'O que precisa de correção antes da entrega?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Monitorização Pós-Entrega',
        description: 'O que vai observar após a entrega para confirmar a qualidade?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Itens de trabalho concluídos do Rastreador de Execução',
      },
    ],
  },
  'information-architecture': {
    name: 'Modo Arquitetura da Informação',
    purpose: 'Defina onde a informação vive para que as pessoas encontrem o que precisam em 5 minutos sem perguntar.',
    trigger:
      'Use quando as pessoas continuam a perguntar onde estão as coisas, a informação está duplicada ou perdida, ou novos membros não encontram o que precisam.',
    flowName: 'Informar',
    doneSignal:
      'Um novo membro da equipa consegue encontrar qualquer informação crítica em 5 minutos sem perguntar a alguém?',
    fieldsSchema: [
      {
        name: 'Auditoria da Informação',
        description: 'Onde vive atualmente a informação? Liste todas as ferramentas e localizações.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Pontos de Dor',
        description: 'Que informação é mais difícil de encontrar? Que perguntas são feitas repetidamente?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Categorias',
        description: 'Agrupe a informação em categorias lógicas.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Fonte Única de Verdade',
        description: 'Para cada categoria, onde é a localização canónica?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Teste de Encontrabilidade',
        description: 'Um novo membro da equipa consegue encontrar X em 5 minutos? Teste 3 itens comuns.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'A estrutura de informação permite o design de trabalho assíncrono',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'As categorias de informação alimentam a estrutura de conhecimento da IA',
      },
    ],
  },
  'flex-work-design': {
    name: 'Modo Design de Trabalho Flexível',
    purpose:
      'Defina padrões assíncronos, exceções síncronas, orçamento de reuniões e ritmos de energia para a sua equipa.',
    trigger:
      'Use quando a sua equipa passa demasiado tempo em reuniões, trabalha em fusos horários diferentes ou tem dificuldade com limites trabalho-vida.',
    flowName: 'Informar',
    doneSignal:
      'Cada membro da equipa consegue explicar quando usar assíncrono por defeito, quando o síncrono é apropriado e qual é o seu orçamento de reuniões?',
    fieldsSchema: [
      {
        name: 'Carga Atual de Reuniões',
        description: 'Quantas horas por semana cada pessoa passa em reuniões?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Padrão Assíncrono',
        description: 'Qual é o seu padrão: assíncrono ou síncrono? Defina a regra.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Exceções Síncronas',
        description: 'O que especificamente requer interação em tempo real?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Orçamento de Reuniões',
        description: 'Máximo de horas de reunião por pessoa por semana.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ritmos de Energia',
        description: 'Quando é que as pessoas são mais produtivas? Como protege o trabalho profundo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocolo de Fusos Horários',
        description: 'Como lida com o assíncrono entre fusos? Horas de sobreposição?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'A estrutura de informação permite o trabalho flexível',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'O design de trabalho alimenta a cadência da equipa',
      },
    ],
  },
  'team-rhythm': {
    name: 'Modo Ritmo da Equipa',
    purpose:
      'Defina a sua cadência semanal: pontos de contacto síncronos, blocos de trabalho profundo, checkpoints de energia.',
    trigger:
      'Use quando a equipa não tem uma cadência consistente, as pessoas não sabem quando esperar atualizações ou o trabalho profundo é constantemente interrompido.',
    flowName: 'Coordenar',
    doneSignal: 'Todos os membros da equipa sabem o ritmo semanal sem consultar o calendário?',
    fieldsSchema: [
      {
        name: 'Cadência Semanal',
        description: 'Mapeie o ritmo semanal recorrente da equipa.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Pontos de Contacto Síncronos',
        description: 'Liste os momentos síncronos essenciais e o seu propósito.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Blocos de Trabalho Profundo',
        description: 'Quando são os períodos de foco protegidos? Como são aplicados?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Checkpoints de Energia',
        description: 'Como verifica a energia e carga de trabalho da equipa?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'O design de trabalho define as restrições do ritmo',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'O ritmo define quando as decisões acontecem de forma assíncrona vs síncrona',
      },
    ],
  },
  'async-decision': {
    name: 'Modo Decisão Assíncrona',
    purpose:
      'Tome uma decisão clara de forma assíncrona com pergunta estruturada, opções, prazo e protocolo de dissidência.',
    trigger: 'Use quando uma decisão precisa de ser tomada e uma reunião não é a melhor forma de a tomar.',
    flowName: 'Coordenar',
    doneSignal: 'A decisão está registada, a fundamentação documentada e todos os stakeholders notificados?',
    fieldsSchema: [
      {
        name: 'Pergunta de Decisão',
        description: 'A pergunta específica a ser decidida. Uma frase.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Opções',
        description: 'As opções em consideração, com prós/contras para cada.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Decisor', description: 'Quem toma a decisão final?', type: 'text' as const, required: true },
      { name: 'Prazo', description: 'Quando é que a decisão deve ser tomada?', type: 'text' as const, required: true },
      {
        name: 'Contribuição Solicitada De',
        description: 'Quem precisa de dar opinião antes do prazo?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocolo de Dissidência',
        description: 'Como é que alguém pode discordar? O que acontece com objeções?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Registo de Decisão',
        description: 'A decisão final, fundamentação e quem foi consultado.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'As decisões devem ser empacotadas para visibilidade da equipa',
      },
    ],
  },
  package: {
    name: 'Modo Pacote',
    purpose: 'Crie pacotes de comunicação autónomos que não requerem perguntas de acompanhamento.',
    trigger: 'Use quando partilha trabalho, atualizações ou decisões com pessoas que não estavam na sala.',
    flowName: 'Comunicar',
    doneSignal: 'Alguém consegue agir com base neste pacote sem fazer uma única pergunta de esclarecimento?',
    fieldsSchema: [
      {
        name: 'Contexto',
        description: 'O que é que o leitor precisa de saber para entender isto?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Pontos-Chave',
        description: 'As 3-5 coisas mais importantes. Numeradas.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Decisão Necessária',
        description: 'É necessária uma decisão? De quem? Até quando?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Prazo',
        description: 'Quando é que o leitor precisa de responder?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Formato de Feedback',
        description: 'Como deve o leitor responder? Comentar, aprovar, editar?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Resultados de validação podem ser empacotados' },
      { direction: 'feeds_into' as const, modeSlug: '', description: 'As decisões devem ser empacotadas' },
    ],
  },
  'contribution-tracker': {
    name: 'Modo Rastreador de Contribuições',
    purpose: 'Torne visível o trabalho invisível em 5 tipos de contribuição.',
    trigger:
      'Use quando alguns membros da equipa fazem trabalho crítico que ninguém vê, ou o reconhecimento está enviesado para entregáveis visíveis.',
    flowName: 'Reconhecer',
    doneSignal: 'Consegue ver contribuições em todos os 5 tipos, não apenas entregas?',
    fieldsSchema: [
      {
        name: 'Membro da Equipa',
        description: 'Para quem está a rastrear contribuições?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Entrega', description: 'Resultados tangíveis entregues.', type: 'text' as const, required: true },
      {
        name: 'Mentoria',
        description: 'Ajudar outros a crescer, trabalho em par, revisão, ensino.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Documentação',
        description: 'Escrita que ajuda outros a trabalhar de forma independente.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Melhoria de Processos',
        description: 'Melhorar sistemas, ferramentas ou fluxos de trabalho.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Desbloqueio', description: 'Remover obstáculos para outros.', type: 'text' as const, required: true },
    ],
    composabilityHooks: [],
  },
  'culture-at-distance': {
    name: 'Modo Cultura à Distância',
    purpose:
      'Defina comportamentos observáveis, rituais, protocolo de conflito e sinais de confiança para equipas distribuídas.',
    trigger: 'Use quando a cultura parece fraca numa equipa distribuída — as pessoas são produtivas mas desconectadas.',
    flowName: 'Cultura',
    doneSignal: 'Um novo contratado remoto conseguiria entender a cultura da equipa apenas pela documentação?',
    fieldsSchema: [
      {
        name: 'Comportamentos Observáveis',
        description: 'Que comportamentos definem a sua cultura? Liste 5 visíveis no trabalho assíncrono.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Rituais',
        description: 'Práticas regulares que reforçam a cultura. Não reuniões — rituais.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocolo de Conflito',
        description: 'Como lida com desacordos quando não consegue ler linguagem corporal?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Sinais de Confiança',
        description: 'O que constrói confiança na sua equipa distribuída? O que a erode?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Anti-Padrões',
        description: 'Que comportamentos está ativamente a tentar prevenir?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  dashboard: {
    name: 'Modo Painel de Controlo',
    purpose:
      'Configure métricas duplas: desempenho (tempo de resolução, tempo de ciclo) e dinâmicas (aprendizagem, colaboração, diversão).',
    trigger: 'Use ao escalar para mais de 50 pessoas e as métricas tradicionais falham o lado humano da organização.',
    flowName: 'Monitorizar',
    doneSignal: 'Consegue ver tanto desempenho como dinâmicas num relance e saber quando agir?',
    fieldsSchema: [
      {
        name: 'Métricas de Desempenho',
        description: 'Métricas operacionais chave: tempo de ciclo, tempo de resolução, lead time.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Métricas de Dinâmicas',
        description: 'Métricas humanas: taxa de aprendizagem, pontuação de colaboração, compromisso, diversão.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Fontes de Dados', description: 'De onde vem cada métrica?', type: 'text' as const, required: true },
      {
        name: 'Cadência de Revisão',
        description: 'Com que frequência são revisadas e por quem?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Gatilhos de Ação',
        description: 'Que níveis de métricas desencadeiam ação?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Sinais do painel alimentam a revisão da estrutura organizacional',
      },
    ],
  },
  'org-map': {
    name: 'Modo Mapa Organizacional',
    purpose: 'Crie uma visão panorâmica da sua organização: tipos de equipa, lacunas e sobreposições.',
    trigger: 'Use quando a organização está a crescer e precisa de ver o quadro completo.',
    flowName: 'Estrutura',
    doneSignal: 'Consegue explicar a estrutura da sua organização a um novo VP em 5 minutos?',
    fieldsSchema: [
      {
        name: 'Equipas',
        description: 'Liste todas as equipas com tipo: Missão, Plataforma ou Círculo de Liderança.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dimensão das Equipas',
        description: 'Número de pessoas por equipa.',
        type: 'text' as const,
        required: true,
      },
      { name: 'Lacunas', description: 'Que capacidades estão em falta?', type: 'text' as const, required: true },
      {
        name: 'Sobreposições',
        description: 'Onde é que as equipas estão a duplicar esforço?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'O mapa organizacional identifica equipas que precisam de blueprints',
      },
    ],
  },
  'team-blueprint': {
    name: 'Modo Blueprint da Equipa',
    purpose: 'Defina missão, membros, autoridade de decisão, cadência e padrões de qualidade para uma equipa.',
    trigger:
      'Use quando criar uma nova equipa ou quando uma equipa existente não tem clareza sobre o seu propósito e autoridade.',
    flowName: 'Estrutura',
    doneSignal: 'Todos os membros da equipa conseguem declarar a missão, o seu papel e que decisões podem tomar?',
    fieldsSchema: [
      {
        name: 'Missão da Equipa',
        description: 'Porque é que esta equipa existe? Uma frase.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Membros',
        description: 'Quem faz parte da equipa e quais são os seus papéis?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Autoridade de Decisão',
        description: 'Que decisões pode esta equipa tomar sem escalar?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadência',
        description: 'Como é que a equipa comunica e coordena?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Padrões de Qualidade',
        description: 'Que padrão de qualidade esta equipa mantém?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Os blueprints de equipa definem nós no mapa de conexões',
      },
    ],
  },
  'connection-map': {
    name: 'Modo Mapa de Conexões',
    purpose: 'Mapeie interações entre equipas: fluida, com fricção ou quebrada. Encontre gargalos.',
    trigger: 'Use quando a coordenação entre equipas é lenta, as passagens falham ou as equipas se culpam mutuamente.',
    flowName: 'Conectar',
    doneSignal:
      'Consegue mostrar a alguém um mapa de todas as conexões entre equipas com classificações de qualidade e correções de gargalos?',
    fieldsSchema: [
      {
        name: 'Pares de Equipas',
        description: 'Liste todos os pares de interação equipa-a-equipa.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Qualidade da Interação',
        description: 'Para cada par: Fluida, Com Fricção ou Quebrada.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Gargalos',
        description: 'Quais pares de equipas são os maiores gargalos?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Causas Raiz',
        description: 'Porque é que cada gargalo está parado?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ações de Correção',
        description: 'Que ação específica vai melhorar cada gargalo?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      { direction: 'feeds_into' as const, modeSlug: '', description: 'Os blueprints definem as equipas a mapear' },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Conexões problemáticas precisam de diagnóstico de saúde',
      },
    ],
  },
  'relationship-health': {
    name: 'Modo Saúde das Relações',
    purpose: 'Diagnostique e corrija fricção entre equipas com análise estruturada.',
    trigger: 'Use quando duas equipas têm uma conexão Com Fricção ou Quebrada que precisa de reparação.',
    flowName: 'Conectar',
    doneSignal: 'Ambas as equipas concordaram com o protocolo de correção e comprometeram-se com uma data de revisão?',
    fieldsSchema: [
      {
        name: 'Equipas Envolvidas',
        description: 'Quais duas equipas têm a fricção?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Geradores de Dor',
        description: 'Que ações ou inações específicas causam dor?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Lacuna de Expectativas',
        description: 'O que espera cada equipa da outra? Onde diferem as expectativas?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Proposta de Valor',
        description: 'Que valor cada equipa fornece à outra?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocolo de Correção',
        description: 'Ações acordadas para melhorar a relação.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'Conexões problemáticas identificadas no Mapa de Conexões',
      },
    ],
  },
  'company-priority': {
    name: 'Modo Prioridade da Empresa',
    purpose: 'Alinhe 3-5 prioridades da empresa com evidências, tradução para equipas e mapeamento de dependências.',
    trigger:
      'Use quando a empresa tem demasiadas prioridades, as equipas estão a puxar em direções diferentes ou é necessário planeamento trimestral.',
    flowName: 'Alinhar',
    doneSignal:
      'Todos os líderes de equipa conseguem explicar as prioridades da empresa e como a sua equipa contribui?',
    fieldsSchema: [
      {
        name: 'Prioridades da Empresa',
        description: 'Liste 3-5 prioridades da empresa com base em evidências.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Tradução para Equipas',
        description: 'O que significa cada prioridade para cada equipa?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dependências',
        description: 'Que prioridades dependem de que equipas?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Resolução de Conflitos',
        description: 'Quando as prioridades conflituam, qual ganha?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'As prioridades conduzem o acompanhamento de execução em escala',
      },
    ],
  },
  'scaled-execution': {
    name: 'Modo Execução em Escala',
    purpose: 'Acompanhe a execução entre equipas com ligações a prioridades, entregáveis-chave e dependências.',
    trigger:
      'Use quando múltiplas equipas trabalham nas mesmas prioridades e precisam de visibilidade sobre o progresso das outras.',
    flowName: 'Executar',
    doneSignal: 'Consegue ver todo o trabalho entre equipas, dependências e bloqueios numa só vista?',
    fieldsSchema: [
      {
        name: 'Ligação à Prioridade',
        description: 'A que prioridade da empresa este trabalho se liga?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Entregáveis-Chave',
        description: 'O que deve ser entregue e por que equipa?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Dependências Entre Equipas',
        description: 'Que equipas dependem de que entregáveis?',
        type: 'text' as const,
        required: true,
      },
      { name: 'Estado', description: 'Estado atual de cada entregável.', type: 'text' as const, required: true },
      {
        name: 'Bloqueios',
        description: 'Bloqueios entre equipas e ações de desbloqueio.',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'As prioridades definem o que acompanhar em escala',
      },
    ],
  },
  'quality-matrix': {
    name: 'Modo Matriz de Qualidade',
    purpose:
      'Defina padrões de qualidade consistentes entre equipas: transversais à empresa mais específicos por equipa.',
    trigger: 'Use quando a qualidade varia entre equipas e não há uma definição partilhada de "bom o suficiente".',
    flowName: 'Qualidade',
    doneSignal:
      'Qualquer membro da equipa consegue consultar o padrão de qualidade para o seu trabalho e saber se o cumpre?',
    fieldsSchema: [
      {
        name: 'Padrões Transversais',
        description: 'Padrões de qualidade que se aplicam a todas as equipas.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Padrões Específicos de Equipa',
        description: 'Padrões únicos de cada equipa baseados no seu domínio.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Medição',
        description: 'Como é medida a qualidade para cada padrão?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Processo de Revisão',
        description: 'Quem revisa a qualidade e com que frequência?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-onboarding': {
    name: 'Modo Integração de Colega IA',
    purpose: 'Defina papéis de colegas IA, fontes de conhecimento, limites de acesso e métricas de sucesso.',
    trigger:
      'Use quando começar a trabalhar com ferramentas de IA e precisar de configurar a colaboração corretamente.',
    flowName: 'Contexto',
    doneSignal:
      'Poderia entregar este documento de integração a um novo membro da equipa e ele saberia exatamente como a sua equipa usa IA?',
    fieldsSchema: [
      {
        name: 'Papel da IA',
        description: 'Que papel desempenha a IA no seu fluxo de trabalho?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Fontes de Conhecimento',
        description: 'A que informação a IA precisa de ter acesso?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Limites de Acesso',
        description: 'A que é que a IA NÃO deve ter acesso?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Métricas de Sucesso',
        description: 'Como vai medir se a colaboração com IA está a funcionar?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadência de Revisão',
        description: 'Com que frequência vai rever a configuração da colaboração com IA?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Gatilhos de Escalação',
        description: 'Quando é que um humano deve assumir o controlo da IA?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'A configuração de IA alimenta a avaliação de delegação de tarefas',
      },
    ],
  },
  'centaur-assessment': {
    name: 'Modo Avaliação Centauro',
    purpose:
      'Mapeie cada tarefa: liderada por humano, liderada por IA ou centauro (ambos) com avaliação de capacidade.',
    trigger: 'Use quando precisa de decidir que tarefas a IA pode tratar e quais precisam de julgamento humano.',
    flowName: 'Contexto',
    doneSignal: 'Consegue explicar para cada tarefa recorrente quem a faz (humano, IA ou ambos) e porquê?',
    fieldsSchema: [
      {
        name: 'Inventário de Tarefas',
        description: 'Liste todas as tarefas recorrentes no seu fluxo de trabalho.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Classificação',
        description: 'Para cada tarefa: Liderada por Humano, Liderada por IA ou Centauro.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Avaliação de Capacidade',
        description: 'Para tarefas IA/Centauro: em que é a IA boa e onde precisa de ajuda?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Caminho de Evolução',
        description: 'Que tarefas Lideradas por Humano poderiam tornar-se Centauro ao longo do tempo?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'A configuração de IA informa a delegação de tarefas',
      },
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'O mapa de delegação informa os protocolos de decisão',
      },
    ],
  },
  'decision-protocol': {
    name: 'Modo Protocolo de Decisão',
    purpose: 'Defina quando a IA lidera decisões vs humanos, condições de substituição e cadência de retrospetiva.',
    trigger: 'Use quando a IA está envolvida em decisões e precisa de regras claras sobre autoridade e substituição.',
    flowName: 'Governar',
    doneSignal:
      'Para qualquer tipo de decisão, consegue dizer instantaneamente quem tem autoridade e o que desencadeia uma substituição?',
    fieldsSchema: [
      {
        name: 'Categorias de Decisão',
        description: 'Liste os tipos de decisões no seu fluxo de trabalho.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Mapa de Autoridade',
        description: 'Para cada categoria: IA lidera, Humano lidera ou Partilhada.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Condições de Substituição',
        description:
          'Quando pode um humano substituir uma decisão da IA? Quando pode a IA substituir uma recomendação humana?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Cadência de Retrospetiva',
        description: 'Com que frequência revisa a qualidade das decisões?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'O mapa de delegação informa a autoridade de decisão',
      },
    ],
  },
  'verification-ritual': {
    name: 'Modo Ritual de Verificação',
    purpose:
      'Construa protocolos de revisão escalados por risco: alto risco tem revisão profunda, baixo risco flui livremente.',
    trigger: 'Use quando a qualidade do output da IA varia e precisa de verificação consistente sem atrasar tudo.',
    flowName: 'Governar',
    doneSignal:
      'A sua equipa consegue classificar instantaneamente qualquer output de IA por nível de risco e saber o protocolo de revisão?',
    fieldsSchema: [
      {
        name: 'Categorias de Output',
        description: 'Liste os tipos de output de IA que a sua equipa produz.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Nível de Risco',
        description: 'Para cada categoria: risco Alto, Médio ou Baixo.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Protocolo de Revisão',
        description: 'Para cada nível de risco: que revisão é necessária?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Limiar de Qualidade',
        description: 'Que taxa de aceitação desencadeia uma revisão do protocolo?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'knowledge-architecture': {
    name: 'Modo Arquitetura do Conhecimento',
    purpose:
      'Estruture o contexto persistente da IA para que o seu colega IA não faça as mesmas perguntas em cada sessão.',
    trigger:
      'Use quando a IA continua a pedir contexto que já deveria ter, ou dá respostas que ignoram as especificidades do seu negócio.',
    flowName: 'Conhecimento',
    doneSignal:
      'O seu colega IA consegue iniciar uma nova sessão e imediatamente ter o contexto necessário para ser útil?',
    fieldsSchema: [
      {
        name: 'Domínios de Conhecimento',
        description: 'Que categorias de conhecimento a IA precisa?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Contexto Persistente',
        description: 'Para cada domínio: o que a IA deve saber sempre?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Gatilhos de Atualização',
        description: 'Quando é que cada domínio de conhecimento deve ser atualizado?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Padrão de Acesso',
        description: 'Como é que a IA acede a este conhecimento? Ficheiros, APIs, prompts?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [
      {
        direction: 'feeds_into' as const,
        modeSlug: '',
        description: 'A estrutura de informação alimenta o conhecimento da IA',
      },
    ],
  },
  'trust-calibration': {
    name: 'Modo Calibração de Confiança',
    purpose:
      'Defina níveis de confiança baseados em evidências, não em sentimentos. Calibre excesso e falta de confiança.',
    trigger:
      'Use quando suspeita que a equipa confia demasiado ou muito pouco na IA, e as decisões são tomadas com base na intuição em vez de dados.',
    flowName: 'Confiança',
    doneSignal: 'Consegue justificar cada nível de confiança com evidências, não intuição?',
    fieldsSchema: [
      {
        name: 'Inventário de Confiança',
        description:
          'Para cada caso de uso de IA: nível de confiança atual (Excesso de Confiança, Calibrado, Falta de Confiança, Não Testado).',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Evidência',
        description: 'Que dados suportam cada nível de confiança?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Ações de Calibração',
        description: 'Para excesso de confiança: adicionar verificação. Para falta de confiança: executar um piloto.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Calendário de Revisão',
        description: 'Quando vai recalibrar os níveis de confiança?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
  'ai-scaling': {
    name: 'Modo Escalar Colaboração IA',
    purpose: 'Planeie como a colaboração humano-IA evolui à medida que a organização cresce.',
    trigger:
      'Use quando a colaboração com IA está a funcionar para uma pessoa ou equipa e precisa de escalar para a organização.',
    flowName: 'Escalar',
    doneSignal: 'Consegue apresentar um roteiro para colaboração com IA que qualquer líder de equipa pode seguir?',
    fieldsSchema: [
      {
        name: 'Estado Atual',
        description: 'Como funciona a colaboração com IA hoje? Quem a usa, para quê?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Caminho de Escala',
        description: 'Como deve a colaboração com IA evoluir? Solo → Equipa → Organização.',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Padronização vs Personalização',
        description: 'O que deve ser padrão entre equipas vs personalizado por equipa?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Necessidades de Infraestrutura',
        description: 'Que ferramentas, acessos ou formação são necessários para escalar?',
        type: 'text' as const,
        required: true,
      },
      {
        name: 'Avaliação de Risco',
        description: 'O que pode correr mal ao escalar a colaboração com IA?',
        type: 'text' as const,
        required: true,
      },
    ],
    composabilityHooks: [],
  },
}
