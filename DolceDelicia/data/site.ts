export type NavLink = { href: string; label: string };

export type MenuCategory = "doces" | "salgados" | "combos" | "bebidas" | "refeicoes";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  image: string;
  badge?: string;
};

export type Location = {
  id: string;
  name: string;
  subtitle: string;
  address: string;
  hours: string;
  image: string;
  mapsUrl: string;
};

export type FaqItem = {
  category: "Pedidos" | "Produtos" | "Entrega" | "Pagamento";
  question: string;
  answer: string;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/unidades", label: "Unidades" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/faq", label: "FAQ" },
  { href: "/contato", label: "Contato" },
];

export const locations: Location[] = [
  {
    id: "biopark",
    name: "Biopark",
    subtitle: "Edifício Charles Darwin",
    address: "Av. Max Planck, 3797 — Biopark, Toledo — PR, 85920-025",
    hours: "Segunda a sexta, das 7h às 22h30",
    image: "/images/units/biopark.jpg",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+Max+Planck+3797+Toledo+PR",
  },
  {
    id: "matriz",
    name: "Matriz",
    subtitle: "Dolce Delícia Alimentos",
    address: "Rua São João, 7408 — Jardim Gisela, Toledo — PR, 85905-055",
    hours: "Segunda a sexta, das 7h às 17h",
    image: "/images/units/matriz.jpg",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Sao+Joao+7408+Toledo+PR",
  },
  {
    id: "filial",
    name: "Filial",
    subtitle: "Dolce Delícia Lancheira Feliz",
    address: "Rua Guarani, 2463 — Jardim La Salle, Toledo — PR, 85902-030",
    hours: "Segunda a sexta, das 9h às 18h30",
    image: "/images/units/filial.jpeg",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Guarani+2463+Toledo+PR",
  },
];

export const menuItems: MenuItem[] = [
  {
    id: "bombom-aberto",
    name: "Bombom aberto",
    description: "Sobremesa cremosa com chocolate e fruta, preparada em camadas.",
    category: "doces",
    price: 11,
    image: "/images/menu/bombom.jpg",
    badge: "Queridinho",
  },
  {
    id: "donuts",
    name: "Donuts",
    description: "Massa macia, cobertura generosa e aquele toque divertido.",
    category: "doces",
    price: 8.5,
    image: "/images/menu/donuts.jpg",
  },
  {
    id: "fatia-bolo",
    name: "Fatia de bolo",
    description: "Uma pausa doce com sabor de receita feita em casa.",
    category: "doces",
    price: 4,
    image: "/images/menu/fatia.jpg",
  },
  {
    id: "brownie",
    name: "Brownie grande",
    description: "Chocolate intenso, centro macio e casquinha delicada.",
    category: "doces",
    price: 12,
    image: "/images/menu/brownie.jpg",
  },
  {
    id: "cupcakes",
    name: "Cupcakes — 100 un.",
    description: "Encomenda especial para celebrar com cor e muito sabor.",
    category: "combos",
    price: 350,
    image: "/images/menu/cupcakes.jpg",
    badge: "Encomenda",
  },
  {
    id: "cento-salgados",
    name: "Salgados fritos — 100 un.",
    description: "Coxinha, bolinha de queijo, pastel, quibe e outras opções.",
    category: "combos",
    price: 85,
    image: "/images/menu/cento-misto.jpg",
    badge: "Para festas",
  },
  {
    id: "coxinha",
    name: "Coxinha",
    description: "Clássica, dourada e com recheio de frango bem temperado.",
    category: "salgados",
    price: 8,
    image: "/images/menu/coxinhas.jpg",
  },
  {
    id: "empadinha",
    name: "Empadinha",
    description: "Massa delicada e recheio cremoso de frango.",
    category: "salgados",
    price: 9,
    image: "/images/menu/empadinha.jpg",
  },
  {
    id: "assado-calabresa",
    name: "Assado de calabresa",
    description: "Massa leve e recheio saboroso, ideal para qualquer hora.",
    category: "salgados",
    price: 8,
    image: "/images/menu/assado.jpg",
  },
  {
    id: "cappuccino",
    name: "Cappuccino italiano",
    description: "Café cremoso para acompanhar um doce ou uma boa conversa.",
    category: "bebidas",
    price: 11.99,
    image: "/images/menu/cappuccino.jpg",
  },
  {
    id: "suco-morango",
    name: "Suco de morango",
    description: "Refrescante, frutado e preparado na hora.",
    category: "bebidas",
    price: 8,
    image: "/images/menu/suco-morango.jpg",
  },
  {
    id: "strogonoff",
    name: "Strogonoff",
    description: "Arroz, batata palha e strogonoff de carne.",
    category: "refeicoes",
    price: 20,
    image: "/images/menu/strogonoff.jpg",
    badge: "Executivo",
  },
];

export const faqItems: FaqItem[] = [
  {
    category: "Pedidos",
    question: "Como faço um pedido ou encomenda?",
    answer: "Escolha um produto no cardápio e toque em pedir, ou fale diretamente com nossa equipe pelo WhatsApp. A mensagem já chega com o contexto do seu pedido.",
  },
  {
    category: "Entrega",
    question: "Em quais regiões vocês fazem entregas?",
    answer: "Atendemos Toledo e região. A disponibilidade, o prazo e a taxa dependem do endereço e do tamanho do pedido; confirme tudo pelo WhatsApp.",
  },
  {
    category: "Produtos",
    question: "Há opções sem lactose ou sem glúten?",
    answer: "A disponibilidade pode variar e a cozinha também manipula outros ingredientes. Converse com a equipe antes do pedido para receber a orientação adequada para sua necessidade.",
  },
  {
    category: "Pedidos",
    question: "Vocês atendem festas e eventos?",
    answer: "Sim. Há combos, salgados, doces e opções em grandes quantidades para aniversários, confraternizações e eventos. Recomendamos solicitar orçamento com antecedência.",
  },
  {
    category: "Entrega",
    question: "Qual é o prazo para uma encomenda?",
    answer: "O prazo varia conforme os itens e a quantidade. A equipe informa a primeira data disponível ao receber os detalhes do pedido.",
  },
  {
    category: "Pagamento",
    question: "Quais formas de pagamento são aceitas?",
    answer: "As condições são confirmadas no atendimento. Fale com a equipe para saber as opções disponíveis para sua unidade ou encomenda.",
  },
  {
    category: "Produtos",
    question: "Os preços do cardápio estão sempre atualizados?",
    answer: "Os valores exibidos são a referência publicada pela Dolce Delícia e podem sofrer alterações. Confirme o total no momento do pedido.",
  },
];

export const timeline = [
  { year: "2018", text: "A primeira fornada nasce na cozinha de casa, com receitas de família e vontade de transformar um momento difícil." },
  { year: "2019", text: "Os pedidos crescem e a produção começa a conquistar novas mesas em Toledo." },
  { year: "2020", text: "A estrutura aumenta, uma equipe se forma e a marca ganha novos caminhos." },
  { year: "2021", text: "A Dolce se aproxima das escolas e encontra uma vocação especial nos lanches infantis." },
  { year: "2022", text: "O cuidado com alimentação escolar orienta processos, cardápios e novas parcerias." },
  { year: "2023", text: "Cantinas e refeições completas ampliam o jeito Dolce de acolher." },
  { year: "2024", text: "Novos pontos de venda tornam a marca mais presente na rotina da cidade." },
  { year: "2025", text: "A equipe se consolida e as encomendas para festas ganham ainda mais espaço." },
  { year: "2026", text: "Três unidades, muitos sonhos e a mesma essência da primeira receita." },
];

export const socials = {
  instagram: "https://www.instagram.com/dolcedeliciasoficial/?hl=pt",
  facebook: "https://www.facebook.com/share/1GvRVjRffQ/?mibextid=wwXIfr",
  email: "mailto:chris.colodel@hotmail.com",
  phone: "tel:+5545998064748",
};
