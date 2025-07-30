// ./lojas.js
export const lojas = [
  {
    id: 1,
    name: "Padaria Central",
    desc: "Pães artesanais e café fresquinho o dia todo.",
    description: "A Padaria Central é referência em pães artesanais e produtos frescos, com café especial e atendimento de qualidade. Venha conhecer nossa linha de produtos exclusivos!",
    type: "Restaurantes",
    lat: -22.911096,
    lng: -42.844117,
    logo: "https://i.pinimg.com/736x/61/1b/08/611b082b8afcf25f3ca09265dd30a0d6.jpg",
    image: "https://i.pinimg.com/736x/68/a4/9c/68a49c29cf35874e07fb02d8a647bc35.jpg",
    phone: "(21) 99999-1234",
    website: "https://padariacentral.com.br",
    rating: 4,
    reviews: 128,
    distance: "1.2 km",
    address: "Rua das Flores, 123 - Centro, Maricá - RJ",
    horario: {
      segunda: "06:00 - 18:00",
      terca: "06:00 - 18:00",
      quarta: "06:00 - 18:00",
      quinta: "06:00 - 18:00",
      sexta: "06:00 - 18:00",
      sabado: "07:00 - 14:00",
      domingo: "Fechado",
    },
    hours: "Seg-Sex: 06:00 - 18:00",
  },
  {
    id: 2,
    name: "Vida Pet Shop",
    desc: "Banho & tosa, rações e acessórios para seu pet.",
    description: "Especialistas em cuidados com animais, oferecendo serviços de banho e tosa, além de uma grande variedade de rações e acessórios premium.",
    type: "Pet Shop",
    lat: -22.913224,
    lng: -42.932569,
    logo: "https://t3.ftcdn.net/jpg/02/53/08/30/360_F_253083014_MH4h16llY6063TBkG8h7SDBuSyaOV2vi.jpg",
    image: "https://i.pinimg.com/736x/a2/7f/bb/a27fbb10cc6f89da8f8af9dd9f4e44c0.jpg",
    phone: "(21) 98888-5678",
    website: "https://vidapetshop.com",
    rating: 5,
    reviews: 94,
    distance: "2.4 km",
    address: "Av. Atlântica, 500 - Centro, Maricá - RJ",
    horario: {
      segunda: "09:00 - 19:00",
      terca: "09:00 - 19:00",
      quarta: "09:00 - 19:00",
      quinta: "09:00 - 19:00",
      sexta: "09:00 - 19:00",
      sabado: "09:00 - 16:00",
      domingo: "Fechado",
    },
    hours: "Seg-Sáb: 09:00 - 19:00",
  },
  {
    id: 3,
    name: "Mercado Maricá Center",
    desc: "Supermercado completo com delivery rápido.",
    description: "O Mercado Maricá Center oferece uma ampla gama de produtos alimentícios, bebidas e itens de limpeza, com serviço de entrega rápida para sua comodidade.",
    type: "Supermercado",
    lat: -22.935082,
    lng: -42.902722,
    logo: "https://www.shutterstock.com/image-vector/supermarket-logo-design-vector-260nw-2506967339.jpg",
    image: "https://www.luminososfachadas.com.br/imagens/fachada-supermercado-acm-valor.jpg",
    phone: "(21) 97777-4567",
    website: "https://maricacenter.com.br",
    rating: 4,
    reviews: 210,
    distance: "3.1 km",
    address: "Rua Principal, 800 - Maricá - RJ",
    horario: {
      segunda: "08:00 - 22:00",
      terca: "08:00 - 22:00",
      quarta: "08:00 - 22:00",
      quinta: "08:00 - 22:00",
      sexta: "08:00 - 22:00",
      sabado: "08:00 - 22:00",
      domingo: "08:00 - 14:00",
    },
    hours: "Todos os dias: 08:00 - 22:00",
  },
];




// icons.ts / icons.js

export const CATEGORY_COLORS = {
  "Pet Shop": "#ff69b4",
  "Academia": "#8b5cf6",
  "Supermercado": "#22c55e",
  "Restaurante": "#f97316",
  "Padaria": "#fbbf24",
  default: "#3b82f6",
};

export const CATEGORY_EMOJIS = {
  "Pet Shop": "🐶",
  "Academia": "🏋️",
  "Supermercado": "🛒",
  "Restaurante": "🍽️",
  "Padaria": "🥐",
  default: "🏪",
};

// Gera um pin SVG com cor + emoji
export function makeSvgPin(color, emoji) {
  const svg = `
  <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="${color}" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
    <text x="12" y="13.5" font-size="8" text-anchor="middle" alignment-baseline="middle"> ${emoji} </text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getMarkerIcon(type) {
  const color = CATEGORY_COLORS[type] || CATEGORY_COLORS.default;
  const emoji = CATEGORY_EMOJIS[type] || CATEGORY_EMOJIS.default;
  const url = makeSvgPin(color, emoji);

  if (typeof window === "undefined" || !window.google?.maps) {
    return { url };
  }

  return {
    url,
    scaledSize: new window.google.maps.Size(40, 40),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(20, 40),
  };
}


export default lojas;
