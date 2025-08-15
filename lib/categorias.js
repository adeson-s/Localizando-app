import { Shirt, Utensils, ShoppingCart, Dumbbell } from 'lucide-react';


export const TAG_SUGESTOES = [
  { value: "roupas", label: "Roupas" },
  { value: "restaurantes", label: "Restaurantes" },
  { value: "artesanato", label: "Artesanato" },
  { value: "vegano", label: "Vegano" },
  { value: "24h", label: "24h" },
  { value: "pet_friendly", label: "Pet-friendly" },
  { value: "desconto", label: "Desconto" },
  { value: "caseiro", label: "Caseiro" },
  { value: "moda", label: "Moda" },
  { value: "eletronicos", label: "Eletrônicos" },
];

export const gcategories = [
  {
    id: "roupas",
    name: "Roupas",
    icon: Shirt,
    color: "bg-blue-500",
    textColor: "text-blue-500",
    bgLight: "bg-blue-50",
  },
  {
    id: "restaurantes",
    name: "Restaurantes",
    icon: Utensils,
    color: "bg-orange-400",
    textColor: "text-orange-400",
    bgLight: "bg-orange-50",
  },
  {
    id: "supermercados",
    name: "Supermercados",
    icon: ShoppingCart,
    color: "bg-green-500",
    textColor: "text-green-500",
    bgLight: "bg-green-50",
  },
  {
    id: "academias",
    name: "Academias",
    icon: Dumbbell,
    color: "bg-purple-400",
    textColor: "text-purple-400",
    bgLight: "bg-purple-50",
  },
  // Removed the Cart key because it's already included as ShoppingCart
];
