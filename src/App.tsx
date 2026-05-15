import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  CreditCard,
  Gauge,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Settings2,
  ShieldCheck,
  Siren,
  Wrench,
} from "lucide-react";
import knowledge from "@/data/knowledge.json";
import { askBot } from "@/lib/groq";
import { answerLocally, findVehicle, formatXof } from "@/lib/localBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import type {
  AppointmentRequest,
  BotReply,
  ChatMessage,
  KnowledgeBase,
  Vehicle,
} from "@/types";

const kb = knowledge as KnowledgeBase;
const storageKey = "auto-assist-groq-key";

const starterMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Bonjour, je suis AutoPilot. Je peux vous aider pour un vehicule, un tarif SAV, un voyant moteur, les horaires ou une prise de rendez-vous.",
  },
];

const quickPrompts = [
  "Avez-vous un Toyota RAV4 disponible ?",
  "Quel est le prix d'une vidange ?",
  "Mon voyant moteur est allume, c'est grave ?",
  "Je veux prendre rendez-vous samedi",
  "Quels sont vos horaires ?",
];

const channelStats = [
  { label: "WhatsApp", value: "24/7", icon: MessageCircle },
  { label: "Atelier", value: "7 tarifs", icon: Wrench },
  { label: "Stock", value: "10 modeles", icon: CarFront },
];

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getWhatsAppUrl(
  message = "Bonjour Auto Abidjan, je souhaite parler a un conseiller.",
) {
  const phone = kb.dealership.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="overflow-hidden border-primary/15 shadow-soft">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/70 px-3 py-2 text-sm font-bold text-white shadow-sm backdrop-blur">
          {formatXof(vehicle.priceXof)}
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="leading-tight">
              {vehicle.brand} {vehicle.model}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {vehicle.year} - {vehicle.transmission} - {vehicle.fuel}
            </p>
          </div>
          <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-300">
            {vehicle.availability}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md bg-muted/70 p-3">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Gauge className="h-4 w-4" />
              Kilometrage
            </p>
            <p className="mt-1 font-semibold">
              {vehicle.mileageKm.toLocaleString("fr-FR")} km
            </p>
          </div>
          <div className="rounded-md bg-muted/70 p-3">
            <p className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              Option
            </p>
            <p className="mt-1 font-semibold">Financement</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {vehicle.highlight}
        </p>
        <Button
          className="w-full"
          onClick={() =>
            window.open(
              getWhatsAppUrl(
                `Bonjour Auto Abidjan, je souhaite voir le ${vehicle.brand} ${vehicle.model} ${vehicle.year}.`,
              ),
              "_blank",
            )
          }
        >
          <MessageCircle className="h-4 w-4" />
          Demander une visite
        </Button>
      </CardContent>
    </Card>
  );
}

function AppointmentPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [request, setRequest] = useState<AppointmentRequest>({
    fullName: "",
    phone: "",
    service: "Vidange standard",
    preferredDate: "",
  });
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const submitAppointment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <Card className="border-primary/30 bg-primary/5 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Rendez-vous atelier
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="space-y-3 rounded-md bg-card p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Demande preparee
            </p>
            <p className="text-muted-foreground">
              Pour le MVP, la demande est pre-remplie. Envoyez-la au conseiller
              WhatsApp pour confirmer le creneau.
            </p>
            <Button
              className="w-full"
              onClick={() =>
                window.open(
                  getWhatsAppUrl(
                    `Bonjour Auto Abidjan, je souhaite confirmer un RDV. Nom: ${request.fullName}. Telephone: ${request.phone}. Service: ${request.service}. Date preferee: ${request.preferredDate}.`,
                  ),
                  "_blank",
                )
              }
            >
              <MessageCircle className="h-4 w-4" />
              Envoyer sur WhatsApp
            </Button>
          </div>
        ) : (
          <form className="grid gap-3" onSubmit={submitAppointment}>
            <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
              Nom complet
              <Input
                required
                placeholder="Ex: Awa Kouame"
                value={request.fullName}
                onChange={(event) =>
                  setRequest({ ...request, fullName: event.target.value })
                }
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
              Telephone
              <Input
                required
                placeholder="+225 07..."
                value={request.phone}
                onChange={(event) =>
                  setRequest({ ...request, phone: event.target.value })
                }
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
              Service souhaite
              <Input
                required
                placeholder="Vidange, diagnostic, freins..."
                value={request.service}
                onChange={(event) =>
                  setRequest({ ...request, service: event.target.value })
                }
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
              Date preferee
              <Input
                required
                type="datetime-local"
                value={request.preferredDate}
                onChange={(event) =>
                  setRequest({ ...request, preferredDate: event.target.value })
                }
              />
            </label>
            <Button type="submit">
              <CalendarDays className="h-4 w-4" />
              Preparer la demande
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser ? (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          AP
        </div>
      ) : null}
      <div
        className={`max-w-[88%] whitespace-pre-line rounded-2xl px-6 py-5 text-lg leading-8 shadow-sm ${
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-card text-card-foreground"
        }`}
      >
        {message.content}
      </div>
      {isUser ? (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-secondary text-xs font-bold text-secondary-foreground">
          CL
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  const [showChat, setShowChat] = useState(false);
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem(storageKey) ?? "",
  );
  const [apiKeyDraft, setApiKeyDraft] = useState(apiKey);
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
    kb.vehicles[0],
  );
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState(
    apiKey ? "Cle Groq active" : "Mode demo local",
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const availableCount = useMemo(
    () =>
      kb.vehicles.filter((vehicle) => vehicle.availability === "Disponible")
        .length,
    [],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const saveApiKey = () => {
    const trimmed = apiKeyDraft.trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem(storageKey, trimmed);
      setApiStatus("Cle Groq active");
    } else {
      localStorage.removeItem(storageKey);
      setApiStatus("Mode demo local");
    }
  };

  const applyAction = (reply: BotReply, userMessage: string) => {
    if (reply.action === "book_appointment") {
      setAppointmentOpen(true);
    }

    if (reply.action === "contact_advisor") {
      setAppointmentOpen(false);
    }

    if (reply.action === "show_vehicle") {
      const vehicle =
        kb.vehicles.find((item) => item.id === reply.vehicleId) ??
        findVehicle(userMessage);
      if (vehicle) {
        setSelectedVehicle(vehicle);
      }
    }
  };

  const sendMessage = async (forcedPrompt?: string) => {
    const text = (forcedPrompt ?? input).trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await askBot(text, messages.slice(-10), apiKey);
      applyAction(reply, text);
      setMessages([
        ...nextMessages,
        { id: createId(), role: "assistant", content: reply.message },
      ]);
      if (apiKey) setApiStatus("Cle Groq active");
    } catch (error) {
      const fallback = answerLocally(text, messages.slice(-10));
      applyAction(fallback, text);
      setMessages([
        ...nextMessages,
        {
          id: createId(),
          role: "assistant",
          content: `${fallback.message}\n\nMode secours local active : l'appel Groq n'a pas abouti.`,
        },
      ]);
      setApiStatus("Groq indisponible, mode secours local");
    } finally {
      setIsTyping(false);
    }
  };

  const submitChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage();
  };

  if (!showChat) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black text-white">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-80" fill="white" />

        <div className="absolute inset-0">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_44%,transparent_0%,rgba(0,0,0,0.18)_28%,rgba(0,0,0,0.82)_74%)]" />

        <section className="relative z-10 flex min-h-screen items-end px-5 py-6 sm:items-center sm:px-8 lg:px-14">
          <div className="max-w-xl pb-6 sm:pb-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/10 px-3 py-2 text-sm font-semibold text-white/85 backdrop-blur">
              <Bot className="h-4 w-4" />
              Auto Abidjan - démo assistant SAV et ventes
              Github dev days 2026
            </div>
            <h1 className="text-5xl font-bold leading-none tracking-normal sm:text-6xl lg:text-7xl">
              AutoPilot
              <span className="block text-white/55">démo assistant SAV et ventes
              Github dev days 2026</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/72">
              Posez une question sur un vehicule, un tarif SAV, un voyant
              moteur ou un rendez-vous. L'assistant repond avec la base Auto
              Abidjan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-12 bg-white px-5 text-black hover:bg-white/90"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle className="h-5 w-5" />
                Discuter avec AutoPilot
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="h-12 border-white/20 bg-white/10 px-5 text-white hover:bg-white/15"
                onClick={() =>
                  window.open(getWhatsAppUrl(), "_blank", "noopener")
                }
              >
                <Phone className="h-5 w-5" />
                Conseiller WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-4 lg:px-6">
        <header className="rounded-lg border border-white/10 bg-card/88 p-4 shadow-soft backdrop-blur">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold leading-tight">
                    AutoPilot
                  </h1>
                  <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs font-bold text-emerald-300">
                    SAV + ventes
                  </span>
                  <span className="rounded-md border border-secondary/20 bg-secondary/15 px-2 py-1 text-xs font-bold text-secondary">
                    Abidjan Zone 4
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Assistant client pour disponibilites vehicules, tarifs
                  atelier, voyant moteur, horaires et rendez-vous concession.
                </p>
                <button
                  className="mt-3 text-sm font-semibold text-primary hover:underline"
                  onClick={() => setShowChat(false)}
                  type="button"
                >
                  Retour au showroom 3D
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {channelStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-white/10 bg-white/[0.04] p-3"
                >
                  <item.icon className="mb-2 h-4 w-4 text-primary" />
                  <p className="text-lg font-bold leading-none">{item.value}</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">
          <section className="flex min-h-[680px] flex-col overflow-hidden rounded-lg border border-white/10 bg-card shadow-soft lg:h-[calc(100vh-128px)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Conversation client</h2>
                  <p className="text-base leading-6 text-muted-foreground">
                    Contexte limite aux 10 derniers messages
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <Clock3 className="h-4 w-4" />
                  Reponse rapide
                </span>
                <span className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  Base controlee
                </span>
              </div>
            </div>

            <div className="chat-surface flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping ? (
                <div className="flex items-end justify-start gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                    AP
                  </div>
                  <div className="rounded-2xl rounded-bl-md border border-border bg-card px-6 py-5 text-lg leading-8 text-muted-foreground shadow-sm">
                    AutoPilot ecrit
                    <span className="typing-dot">.</span>
                    <span className="typing-dot delay-150">.</span>
                    <span className="typing-dot delay-300">.</span>
                  </div>
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border bg-card p-4">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-5 py-3 text-base font-semibold text-muted-foreground transition-colors hover:border-primary/35 hover:bg-primary/10 hover:text-primary"
                    onClick={() => void sendMessage(prompt)}
                    type="button"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form className="flex gap-2" onSubmit={submitChat}>
                <Input
                  className="h-16 px-5 text-lg"
                  placeholder="Posez votre question au concessionnaire..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                />
                <Button type="submit" size="icon" disabled={isTyping}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </section>

          <aside className="space-y-4 lg:max-h-[calc(100vh-128px)] lg:overflow-y-auto lg:pr-1">
            <Card className="border-white/10 bg-card/95">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  Poste conseiller
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm">
                  <p className="flex items-center gap-2 font-semibold">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                    {apiStatus}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    La cle Groq reste en localStorage pour ce MVP.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Cle Groq"
                    value={apiKeyDraft}
                    onChange={(event) => setApiKeyDraft(event.target.value)}
                  />
                  <Button
                    size="icon"
                    title="Enregistrer la cle"
                    onClick={saveApiKey}
                  >
                    <KeyRound className="h-5 w-5" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => setAppointmentOpen(true)}
                >
                  <CalendarDays className="h-4 w-4" />
                  Prendre rendez-vous
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() =>
                    window.open(getWhatsAppUrl(), "_blank", "noopener")
                  }
                >
                  <MessageCircle className="h-4 w-4" />
                  Parler a un conseiller
                </Button>
                <div className="grid gap-2 rounded-md border border-secondary/25 bg-secondary/10 p-3 text-sm text-secondary">
                  <p className="flex items-center gap-2 font-semibold">
                    <Siren className="h-4 w-4" />
                    Signal SAV important
                  </p>
                  <p className="text-xs leading-5">
                    Un voyant moteur clignotant doit etre oriente vers un
                    diagnostic atelier ou un conseiller.
                  </p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-muted-foreground">
                  <p className="flex items-center gap-2 font-semibold text-card-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {kb.dealership.address}
                  </p>
                  <p className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {kb.dealership.phone}
                  </p>
                  <p className="mt-1 flex items-center gap-2">
                    <CarFront className="h-4 w-4" />
                    {availableCount} vehicules disponibles
                  </p>
                </div>
              </CardContent>
            </Card>

            <AppointmentPanel
              open={appointmentOpen}
              onClose={() => setAppointmentOpen(false)}
            />

            {selectedVehicle ? <VehicleCard vehicle={selectedVehicle} /> : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
