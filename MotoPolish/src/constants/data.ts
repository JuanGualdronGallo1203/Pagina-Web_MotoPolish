import { 
  Clock, Shield, Star, Award, Heart, Users, 
  Zap, Sparkles, PaintBucket, Wrench, Car, 
  Droplets, Gem, Flame, 
  Disc as DiscIcon, 
  CloudFog 
} from 'lucide-react';

export const COMPANY_INFO = {
  name: "MotoPolish",
  slogan: "EMBELLECIMIENTO & RESTAURACIÓN AUTOMOTRIZ",
  description: "En MotoPolish, no solo cuidamos tu auto, ¡lo elevamos a un nivel superior de excelencia! Fusionamos la pasión por los automóviles con la precisión artística, garantizando que tu vehículo refleje tu estilo único.",
  phone: "3154174412",
  whatsappUrl: "https://wa.me/573154174412",
  social: {
    facebook: "https://www.facebook.com/MotoPolishSantander",
    instagram: "https://www.instagram.com/motopolish_santander/",
    tiktok: "https://www.tiktok.com/@motopolishsantander",
    youtube: "https://www.youtube.com/@motopolishsantander"
  }
};

export const TIMELINE = [
  { year: "2005", title: "Los Inicios", description: "Luis inicia su trayectoria en Bucaramanga, adquiriendo experiencia clave en detailing y alistamiento automotriz durante 3 años." },
  { year: "2017", title: "Especialización", description: "Ingreso a Suzuki en Lebrija. Desarrollo como técnico especializado en mantenimiento de motocicletas." },
  { year: "2019", title: "Nace un Sueño", description: "Se da el paso a la independencia creando 'Motoplus', el primer proyecto de emprendimiento en el sector." },
  { year: "2020", title: "Pausa Estratégica", description: "Debido a la pandemia global, las operaciones de Motoplus se detienen temporalmente." },
  { year: "2021", title: "Renacimiento: MotoPolish", description: "Luis retoma el proyecto con identidad renovada y legalizada como MotoPolish en el barrio La Esmeralda." },
  { year: "2024", title: "Expansión y Nueva Sede", description: "Traslado a la sede actual en Barrio Los Sauces. Planta física más amplia y mejores instalaciones para un servicio integral." }
];

export const VALUES = [
  { title: "Trabajo en equipo", icon: Users, desc: "Logramos objetivos comunes compartiendo conocimientos." },
  { title: "Compromiso", icon: Heart, desc: "Entrega total en cada servicio contratado." },
  { title: "Cumplimiento", icon: Clock, desc: "Garantía en los tiempos de entrega pactados." },
  { title: "Servicio", icon: Sparkles, desc: "Atención integral priorizando la satisfacción del cliente." },
  { title: "Honestidad", icon: Shield, desc: "Transparencia y verdad en cada diagnóstico." },
  { title: "Responsabilidad", icon: Award, desc: "Cumplimiento estricto de los objetivos planeados." }
];

export const SERVICES = [
  {
    category: "Estética de Motos",
    description: "Cuidado detallado para dejar tu moto como nueva.",
    items: [
      { title: "Embellecimiento General", price: "$105.000", desc: "Limpieza profunda, desengrase y brillo.", icon: Sparkles },
      { title: "Pintura de Tanque", price: "$190.000", desc: "Restauración de color y acabado profesional.", icon: PaintBucket },
      { title: "Latonería de Tanques", price: "$50.000", desc: "Eliminación de golpes y abolladuras.", icon: Wrench },
      { title: "Polichado Pastas Inyectadas", price: "$90.000", desc: "Recuperación de brillo en plásticos.", icon: Gem },
      { title: "Pintura Pastas de Moto", price: "$95.000", desc: "Renovación de color en plásticos laterales.", icon: PaintBucket },
      { title: "Restauración Fibra de Vidrio", price: "$18.000", desc: "Reconstrucción y reparación de piezas.", icon: Wrench },
    ]
  },
  {
    category: "Personalización Exclusiva",
    description: "Dale un estilo único con técnicas avanzadas.",
    items: [
      { title: "Pintura Hidroimpresión", price: "$70.000", desc: "Técnica novedosa de transferencia por agua.", icon: Droplets, isNew: true },
      { title: "Pintura Efecto Cromado", price: "$150.000", desc: "Acabado espejo de alta reflectividad.", icon: Star },
      { title: "Diseño Personalizado", price: "$80.000", desc: "Aerografía y diseños únicos a medida.", icon: PaintBucket },
      { title: "Colores Personalizados", price: "$105.000", desc: "Mezclas exclusivas para un tono único.", icon: PaintBucket },
      { title: "Pintura de Rines", price: "$50.000", desc: "Personalización de rines (par).", icon: DiscIcon },
    ]
  },
  {
    category: "Línea Automotriz (Carros)",
    description: "Soluciones profesionales para automóviles.",
    items: [
      { title: "Detallado Completo", price: "$450.000", desc: "Pulido, polichado, encerado y cerámico.", icon: Car },
      { title: "Pintura de Módulos", price: "$370.000", desc: "Pintura por pieza (puerta, capó, etc).", icon: PaintBucket },
      { title: "Latonería de Módulos", price: "$170.000", desc: "Reparación de golpes en carrocería.", icon: Wrench },
      { title: "Pulida de Farola", price: "$50.000", desc: "Recuperación de transparencia y luz.", icon: Zap },
    ]
  },
  {
    category: "Motor & Farolas",
    description: "Mantenimiento y limpieza técnica.",
    items: [
      { title: "Lavado Vapor Motor", price: "$140.000", desc: "Limpieza profunda y segura con vapor.", icon: CloudFog },
      { title: "Desmanchado Vapor Motor", price: "$190.000", desc: "Eliminación de manchas difíciles y grasa.", icon: Flame },
      { title: "Restauración Farolas (Moto)", price: "$40.000", desc: "Pulido y protección UV.", icon: Zap },
    ]
  }
];