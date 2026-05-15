import knowledge from "@/data/knowledge.json";
import type { BotReply, ChatMessage, KnowledgeBase, Vehicle } from "@/types";

const kb = knowledge as KnowledgeBase;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export const formatXof = (amount: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);

export function findVehicle(message: string): Vehicle | undefined {
  const clean = normalize(message);

  return kb.vehicles.find((vehicle) => {
    const fullName = normalize(`${vehicle.brand} ${vehicle.model}`);
    const model = normalize(vehicle.model);
    const brand = normalize(vehicle.brand);

    return (
      clean.includes(fullName) ||
      clean.includes(model) ||
      (clean.includes(brand) && clean.includes(String(vehicle.year)))
    );
  });
}

function vehicleSummary(vehicle: Vehicle) {
  return `${vehicle.brand} ${vehicle.model} ${vehicle.year} : ${formatXof(
    vehicle.priceXof,
  )}, ${vehicle.availability.toLowerCase()}, ${vehicle.mileageKm.toLocaleString(
    "fr-FR",
  )} km, ${vehicle.transmission.toLowerCase()}. ${vehicle.highlight}`;
}

function listAvailableVehicles() {
  return kb.vehicles
    .filter((vehicle) => vehicle.availability === "Disponible")
    .slice(0, 5)
    .map(vehicleSummary)
    .join("\n");
}

function findService(message: string) {
  const clean = normalize(message);

  return kb.serviceTariffs.find((service) => {
    const label = normalize(service.label);
    return label
      .split(" ")
      .filter((part) => part.length > 3)
      .some((part) => clean.includes(part));
  });
}

function serviceSummary(serviceId: string) {
  const service = kb.serviceTariffs.find((item) => item.id === serviceId);
  if (!service) return "";

  return `${service.label} : a partir de ${formatXof(
    service.priceFromXof,
  )}, duree estimee ${service.duration}. ${service.details}`;
}

function answerFaq(message: string) {
  const clean = normalize(message);
  return kb.faq.find((item) => {
    const questionTerms = normalize(item.question)
      .split(/\s+/)
      .filter((term) => term.length > 4);
    const hits = questionTerms.filter((term) => clean.includes(term)).length;
    return hits >= 2;
  });
}

export function answerLocally(
  userMessage: string,
  _history: ChatMessage[] = [],
): BotReply {
  const clean = normalize(userMessage);
  const vehicle = findVehicle(userMessage);

  if (clean.includes("rendez") || clean.includes("rdv")) {
    return {
      message:
        "Bien sur. Je peux ouvrir le formulaire de rendez-vous. Indiquez votre nom, votre telephone, le service souhaite et votre date preferee.",
      action: "book_appointment",
    };
  }

  if (
    clean.includes("conseiller") ||
    clean.includes("whatsapp") ||
    clean.includes("humain") ||
    clean.includes("commercial")
  ) {
    return {
      message:
        "Je peux vous mettre en relation avec un conseiller Auto Abidjan sur WhatsApp.",
      action: "contact_advisor",
    };
  }

  if (
    clean.includes("voyant") ||
    clean.includes("moteur") ||
    clean.includes("clignote")
  ) {
    return {
      message:
        "Si le voyant moteur est fixe, evitez les longs trajets et programmez un diagnostic electronique a partir de 30 000 FCFA. S'il clignote ou si le moteur broute, arretez le vehicule et contactez un conseiller.",
      action: "book_appointment",
    };
  }

  if (clean.includes("horaire") || clean.includes("ouvert")) {
    return {
      message: `Nos horaires : ${kb.dealership.openingHours.join(". ")}.`,
      action: "none",
    };
  }

  if (
    clean.includes("adresse") ||
    clean.includes("situe") ||
    clean.includes("zone 4")
  ) {
    return {
      message: `${kb.dealership.name} est situe ${kb.dealership.address}, ${kb.dealership.city}.`,
      action: "none",
    };
  }

  if (vehicle) {
    return {
      message: vehicleSummary(vehicle),
      action:
        clean.includes("voir") || clean.includes("photo")
          ? "show_vehicle"
          : "show_vehicle",
      vehicleId: vehicle.id,
    };
  }

  if (
    clean.includes("vehicule") ||
    clean.includes("voiture") ||
    clean.includes("modele") ||
    clean.includes("suv") ||
    clean.includes("automatique")
  ) {
    return {
      message: `Voici quelques vehicules disponibles chez Auto Abidjan :\n${listAvailableVehicles()}`,
      action: "none",
    };
  }

  if (clean.includes("vidange")) {
    return {
      message: `${serviceSummary("vidange-standard")} Pour un SUV ou une berline recente : ${serviceSummary(
        "vidange-premium",
      )}`,
      action: "book_appointment",
    };
  }

  const service = findService(userMessage);
  if (service) {
    return {
      message: `${service.label} : a partir de ${formatXof(
        service.priceFromXof,
      )}. Duree estimee : ${service.duration}. ${service.details}`,
      action: "book_appointment",
    };
  }

  const faq = answerFaq(userMessage);
  if (faq) {
    return {
      message: faq.answer,
      action: "none",
    };
  }

  return {
    message:
      "Je n'ai pas cette information dans la base Auto Abidjan. Je peux vous mettre en relation avec un conseiller pour verifier rapidement.",
    action: "contact_advisor",
  };
}
