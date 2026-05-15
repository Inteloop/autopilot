export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  priceXof: number;
  availability: "Disponible" | "Sur commande" | "Reserve";
  mileageKm: number;
  fuel: string;
  transmission: string;
  imageUrl: string;
  highlight: string;
};

export type ServiceTariff = {
  id: string;
  label: string;
  priceFromXof: number;
  duration: string;
  details: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type KnowledgeBase = {
  dealership: {
    name: string;
    address: string;
    city: string;
    phone: string;
    whatsapp: string;
    email: string;
    openingHours: string[];
    services: string[];
  };
  vehicles: Vehicle[];
  serviceTariffs: ServiceTariff[];
  faq: FaqItem[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type BotAction =
  | "none"
  | "book_appointment"
  | "show_vehicle"
  | "contact_advisor";

export type BotReply = {
  message: string;
  action: BotAction;
  vehicleId?: string;
};

export type AppointmentRequest = {
  fullName: string;
  phone: string;
  service: string;
  preferredDate: string;
};
