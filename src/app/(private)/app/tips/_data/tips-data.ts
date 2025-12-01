export type TipCategory = "limpeza" | "tratamento" | "hidratacao" | "protecao";

export type Tip = {
  id: string;
  category: TipCategory;
  title: string;
  description: string;
  steps: string[];
  frequency: string;
  bestTime: string;
  tips: string[];
  warnings?: string[];
};

export const tipsData: Tip[] = [
  {
    id: "limpeza-1",
    category: "limpeza",
    title: "Como Aplicar Gel de Limpeza",
    description:
      "A limpeza é o primeiro e mais importante passo da sua rotina. Aprenda a técnica correta para remover impurezas sem agredir a pele.",
    steps: [
      "Molhe o rosto com água morna (nunca quente ou gelada)",
      "Aplique uma pequena quantidade do gel (tamanho de uma moeda) nas mãos",
      "Faça espuma esfregando as mãos",
      "Massageie suavemente o rosto em movimentos circulares por 30-60 segundos",
      "Dê atenção especial à zona T (testa, nariz e queixo)",
      "Enxágue completamente com água morna",
      "Seque o rosto com uma toalha limpa, dando leves batidinhas (não esfregue)",
    ],
    frequency: "2 vezes ao dia (manhã e noite)",
    bestTime: "Ao acordar e antes de dormir",
    tips: [
      "Use água morna, nunca quente - água muito quente remove a oleosidade natural da pele",
      "Não esfregue com força - seja gentil para não irritar",
      "Certifique-se de enxaguar completamente - resíduos podem causar irritação",
      "Use uma toalha limpa sempre - toalhas úmidas acumulam bactérias",
    ],
    warnings: [
      "Se sua pele ficar repuxada após a limpeza, o produto pode ser muito forte",
      "Evite produtos com fragrância se tiver pele sensível",
    ],
  },
  {
    id: "limpeza-2",
    category: "limpeza",
    title: "Dupla Limpeza (Oil Cleansing)",
    description:
      "Técnica coreana que remove maquiagem e protetor solar de forma eficaz antes da limpeza regular.",
    steps: [
      "Com o rosto SECO, aplique o óleo de limpeza ou água micelar",
      "Massageie por 1 minuto, focando em áreas com maquiagem",
      "Adicione um pouco de água para emulsificar o óleo",
      "Enxágue completamente",
      "Aplique o gel de limpeza normal como segundo passo",
      "Enxágue novamente",
    ],
    frequency: "1 vez ao dia (à noite, quando usar maquiagem ou protetor)",
    bestTime: "À noite, antes da limpeza regular",
    tips: [
      "A dupla limpeza é essencial se você usa protetor solar ou maquiagem",
      "O primeiro passo remove produtos à base de óleo",
      "O segundo passo limpa a pele propriamente dita",
    ],
  },
  {
    id: "tratamento-1",
    category: "tratamento",
    title: "Como Aplicar Vitamina C (Sérum)",
    description:
      "A Vitamina C é um poderoso antioxidante que ilumina e protege a pele. Aprenda a aplicar corretamente.",
    steps: [
      "Limpe e seque completamente o rosto",
      "Aplique 3-4 gotas do sérum na palma da mão",
      "Aqueça o produto entre as palmas",
      "Pressione suavemente nas bochechas, testa e queixo",
      "Espalhe com movimentos ascendentes",
      "Dê leves batidinhas para melhor absorção",
      "Aguarde 1-2 minutos antes do próximo passo",
      "Não esqueça do pescoço e colo",
    ],
    frequency: "1 vez ao dia",
    bestTime: "Pela MANHÃ (potencializa a proteção solar)",
    tips: [
      "Vitamina C funciona melhor pela manhã, antes do protetor solar",
      "Aguarde a absorção completa antes de aplicar outros produtos",
      "Guarde em local fresco e escuro - a Vitamina C oxida com luz e calor",
      "Se o produto ficar amarronzado, está oxidado e deve ser descartado",
    ],
    warnings: [
      "Pode causar leve ardência no início - isso é normal",
      "Se houver irritação intensa, reduza a frequência ou concentração",
      "Não misture com Niacinamida no mesmo momento (pode reduzir eficácia)",
    ],
  },
  {
    id: "tratamento-2",
    category: "tratamento",
    title: "Como Aplicar Retinol/Ácidos",
    description:
      "Retinol e ácidos são ativos potentes para renovação celular. Uso correto é essencial.",
    steps: [
      "Use APENAS à noite (esses ativos são fotossensíveis)",
      "Limpe e seque completamente o rosto",
      "Aguarde 5-10 minutos após a limpeza (pele deve estar seca)",
      "Aplique uma quantidade do tamanho de uma ervilha",
      "Espalhe uniformemente, evitando área dos olhos",
      "Aguarde 20-30 minutos",
      "Aplique hidratante por cima",
    ],
    frequency:
      "2-3 vezes por semana (iniciantes) / Diariamente (pele acostumada)",
    bestTime: "À NOITE, sempre",
    tips: [
      "Comece devagar: 1-2x por semana e aumente gradualmente",
      "A técnica 'sandwich': hidratante → retinol → hidratante reduz irritação",
      "SEMPRE use protetor solar no dia seguinte",
      "Descamação leve é normal nas primeiras semanas",
    ],
    warnings: [
      "NUNCA use durante gravidez ou amamentação",
      "Não use se estiver tomando Isotretinoína (Roacutan)",
      "Evite exposição solar sem proteção",
      "Pode aumentar sensibilidade - reduza se houver irritação excessiva",
    ],
  },
  {
    id: "tratamento-3",
    category: "tratamento",
    title: "Como Aplicar Ácido Hialurônico",
    description:
      "O ácido hialurônico é um hidratante poderoso que retém água na pele.",
    steps: [
      "Aplique na pele ÚMIDA (logo após limpeza ou tônico)",
      "Use 2-3 gotas",
      "Espalhe uniformemente por todo o rosto",
      "Pressione suavemente para absorção",
      "Aplique hidratante por cima para selar a umidade",
    ],
    frequency: "1-2 vezes ao dia",
    bestTime: "Manhã e/ou noite",
    tips: [
      "CRUCIAL: aplique em pele úmida - o ácido hialurônico atrai água",
      "Em clima seco, pode puxar água da pele se não houver umidade externa",
      "Sempre sele com hidratante por cima",
      "Pode ser usado com qualquer outro ativo",
    ],
  },
  {
    id: "hidratacao-1",
    category: "hidratacao",
    title: "Como Aplicar Hidratante Facial",
    description:
      "O hidratante sela a umidade e fortalece a barreira cutânea. Técnica correta maximiza benefícios.",
    steps: [
      "Aplique em pele limpa (após séruns, se usar)",
      "Use quantidade do tamanho de uma moeda pequena",
      "Aqueça entre as palmas das mãos",
      "Pressione suavemente nas bochechas, testa, nariz e queixo",
      "Espalhe com movimentos ascendentes",
      "Massageie suavemente até absorção completa",
      "Não esqueça pescoço e colo",
    ],
    frequency: "2 vezes ao dia",
    bestTime: "Manhã e noite",
    tips: [
      "Movimentos ascendentes ajudam a combater flacidez",
      "Aguarde 1-2 minutos antes do protetor solar",
      "Pele oleosa também precisa de hidratante - escolha textura gel",
      "Pescoço e colo envelhecem rápido - sempre inclua na rotina",
    ],
  },
  {
    id: "hidratacao-2",
    category: "hidratacao",
    title: "Como Aplicar Creme para Área dos Olhos",
    description:
      "A pele ao redor dos olhos é delicada e precisa de cuidados especiais.",
    steps: [
      "Use quantidade mínima (tamanho de um grão de arroz para ambos os olhos)",
      "Aqueça o produto entre os dedos anelares",
      "Aplique com leves batidinhas ao redor da órbita ocular",
      "Comece do canto interno e vá para fora",
      "Não puxe ou estique a pele",
      "Evite aplicar muito perto da linha dos cílios",
    ],
    frequency: "1-2 vezes ao dia",
    bestTime: "Manhã e/ou noite",
    tips: [
      "Use o dedo anelar - é o mais fraco e evita pressão excessiva",
      "Menos é mais - excesso pode causar inchaço",
      "Aplique pelo menos 30 minutos antes de dormir para evitar inchaço",
      "Mantenha na geladeira para efeito descongestionante",
    ],
    warnings: [
      "Não aplique muito próximo aos olhos - pode causar irritação",
      "Se tiver tendência a inchaço, use apenas pela manhã",
    ],
  },
  {
    id: "protecao-1",
    category: "protecao",
    title: "Como Aplicar Protetor Solar Facial",
    description:
      "O protetor solar é o passo MAIS IMPORTANTE da rotina. Aplicação correta garante proteção efetiva.",
    steps: [
      "Aplique como ÚLTIMO passo da rotina de manhã",
      "Use quantidade generosa: 2 dedos de produto (técnica dos dois dedos)",
      "Aplique em todo o rosto, pescoço e orelhas",
      "Espalhe uniformemente sem esfregar muito",
      "Aguarde 15-20 minutos antes de sair ao sol",
      "Não esqueça: lábios, orelhas, pescoço e mãos",
    ],
    frequency: "Diariamente, mesmo em dias nublados",
    bestTime: "Pela manhã, 15-20 minutos antes da exposição solar",
    tips: [
      "REAPLICAR a cada 2-3 horas se estiver exposto ao sol",
      "A quantidade importa: pouco protetor = pouca proteção",
      "Use FPS 30 no mínimo, idealmente FPS 50+",
      "Protetor solar não vence - use a quantidade correta",
      "Dias nublados também têm radiação UV",
    ],
    warnings: [
      "Sem protetor solar, todos os outros produtos perdem eficácia",
      "Ativos como Vitamina C e Retinol EXIGEM proteção solar",
    ],
  },
  {
    id: "protecao-2",
    category: "protecao",
    title: "Reaplicação de Protetor Solar",
    description:
      "Reaplicar o protetor é tão importante quanto a primeira aplicação.",
    steps: [
      "Remova excesso de oleosidade com papel absorvente (se necessário)",
      "Aplique nova camada de protetor",
      "Se usar maquiagem, use protetor em pó ou spray",
      "Espalhe uniformemente",
    ],
    frequency: "A cada 2-3 horas durante exposição solar",
    bestTime: "Durante o dia, conforme necessário",
    tips: [
      "Existem protetores em pó para reaplicar sobre maquiagem",
      "Protetores em spray facilitam a reaplicação",
      "Se estiver nadando ou suando, reaplique imediatamente após",
      "Mantenha um protetor na bolsa para reaplicações",
    ],
  },
];

export const categoryInfo = {
  limpeza: {
    title: "Limpeza",
    description: "Fundação de toda rotina de skincare",
    icon: "🧼",
    color: "from-blue-500 to-cyan-500",
  },
  tratamento: {
    title: "Tratamento",
    description: "Ativos para necessidades específicas",
    icon: "✨",
    color: "from-purple-500 to-pink-500",
  },
  hidratacao: {
    title: "Hidratação",
    description: "Nutrição e barreira cutânea",
    icon: "💧",
    color: "from-green-500 to-emerald-500",
  },
  protecao: {
    title: "Proteção Solar",
    description: "Defesa contra envelhecimento",
    icon: "☀️",
    color: "from-orange-500 to-yellow-500",
  },
};
