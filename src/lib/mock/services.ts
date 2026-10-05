// Mock service layer. Swap these implementations for real API calls later —
// the signatures are intentionally API-shaped (async, promise-returning).

import {
  AGENTS,
  AUTOMATIONS,
  CAMPAIGNS,
  CONTACTS,
  CONVERSATIONS,
  TEMPLATES,
  type Agent,
  type Automation,
  type Campaign,
  type Contact,
  type Conversation,
  type Message,
  type Template,
} from "./data";

const latency = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function getContacts(): Promise<Contact[]> {
  await latency();
  return CONTACTS;
}

export async function getConversations(): Promise<Conversation[]> {
  await latency();
  return CONVERSATIONS;
}

export async function getCampaigns(): Promise<Campaign[]> {
  await latency();
  return CAMPAIGNS;
}

export async function getAutomations(): Promise<Automation[]> {
  await latency();
  return AUTOMATIONS;
}

export async function getTemplates(): Promise<Template[]> {
  await latency();
  return TEMPLATES;
}

export async function getAgents(): Promise<Agent[]> {
  await latency(200);
  return AGENTS;
}

export async function sendMessage(
  conversationId: string,
  body: string,
  kind: Message["kind"] = "out",
): Promise<Message> {
  await latency(120);
  return {
    id: `${conversationId}-${Date.now()}`,
    kind,
    body,
    at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    author: kind === "note" ? "Saqib Haroon" : "Agent",
    read: false,
  };
}

export async function createContact(input: Partial<Contact>): Promise<Contact> {
  await latency(120);
  return {
    id: `c-${Date.now()}`,
    name: input.name ?? "Unnamed contact",
    phone: input.phone ?? "",
    email: input.email ?? "",
    company: input.company ?? "",
    tags: input.tags ?? [],
    status: input.status ?? "new",
    type: input.type ?? "lead",
    assignedAgentId: input.assignedAgentId ?? "a1",
    lastActivity: "Just now",
    createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    notes: [],
  };
}

export async function createCampaign(input: Partial<Campaign>): Promise<Campaign> {
  await latency(120);
  return {
    id: `cp-${Date.now()}`,
    name: input.name ?? "Untitled campaign",
    audience: input.audience ?? "All contacts",
    template: input.template ?? "welcome_customer",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    status: input.status ?? "scheduled",
    createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  };
}
