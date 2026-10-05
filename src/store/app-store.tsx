import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AGENTS,
  AUTOMATIONS,
  CAMPAIGNS,
  CONTACTS,
  CONVERSATIONS,
  TEMPLATES,
  WORKSPACES,
  type Agent,
  type Automation,
  type Campaign,
  type Contact,
  type Conversation,
  type FlowNode,
  type Message,
  type Template,
} from "@/lib/mock/data";

interface AppState {
  loading: boolean;
  agents: Agent[];
  contacts: Contact[];
  conversations: Conversation[];
  campaigns: Campaign[];
  templates: Template[];
  automations: Automation[];
  workspaceId: string;
  setWorkspaceId: (id: string) => void;

  addContact: (c: Contact) => void;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  appendMessage: (conversationId: string, message: Message) => void;
  markRead: (conversationId: string) => void;
  toggleStar: (conversationId: string) => void;
  setConversationStatus: (conversationId: string, status: Conversation["status"]) => void;
  assignConversation: (conversationId: string, agentId: string | null) => void;
  addConversationTag: (conversationId: string, tag: string) => void;

  addCampaign: (c: Campaign) => void;
  deleteCampaign: (id: string) => void;

  addTemplate: (t: Template) => void;
  deleteTemplate: (id: string) => void;

  toggleAutomation: (id: string) => void;
  updateAutomationNodes: (id: string, nodes: FlowNode[]) => void;
  deleteAutomation: (id: string) => void;

  addAgent: (a: Agent) => void;
  updateAgent: (id: string, patch: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);
  const [automations, setAutomations] = useState<Automation[]>(AUTOMATIONS);
  const [workspaceId, setWorkspaceId] = useState(WORKSPACES[0].id);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const patchConversation = (id: string, fn: (c: Conversation) => Conversation) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));

  const value = useMemo<AppState>(
    () => ({
      loading,
      agents,
      contacts,
      conversations,
      campaigns,
      templates,
      automations,
      workspaceId,
      setWorkspaceId,

      addContact: (c) => setContacts((p) => [c, ...p]),
      updateContact: (id, patch) =>
        setContacts((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      deleteContact: (id) => setContacts((p) => p.filter((c) => c.id !== id)),

      appendMessage: (cid, message) =>
        patchConversation(cid, (c) => ({
          ...c,
          messages: [...c.messages, message],
          lastMessage: message.kind === "note" ? c.lastMessage : message.body,
          lastAt: message.kind === "note" ? c.lastAt : message.at,
        })),
      markRead: (cid) => patchConversation(cid, (c) => ({ ...c, unread: 0 })),
      toggleStar: (cid) => patchConversation(cid, (c) => ({ ...c, starred: !c.starred })),
      setConversationStatus: (cid, status) => patchConversation(cid, (c) => ({ ...c, status })),
      assignConversation: (cid, agentId) =>
        patchConversation(cid, (c) => ({ ...c, assignedAgentId: agentId })),
      addConversationTag: (cid, tag) =>
        patchConversation(cid, (c) =>
          c.tags.includes(tag) ? c : { ...c, tags: [...c.tags, tag] },
        ),

      addCampaign: (c) => setCampaigns((p) => [c, ...p]),
      deleteCampaign: (id) => setCampaigns((p) => p.filter((c) => c.id !== id)),

      addTemplate: (t) => setTemplates((p) => [t, ...p]),
      deleteTemplate: (id) => setTemplates((p) => p.filter((t) => t.id !== id)),

      toggleAutomation: (id) =>
        setAutomations((p) =>
          p.map((a) =>
            a.id === id
              ? { ...a, state: a.state === "active" ? "paused" : "active", updatedAt: "Just now" }
              : a,
          ),
        ),
      updateAutomationNodes: (id, nodes) =>
        setAutomations((p) => p.map((a) => (a.id === id ? { ...a, nodes, updatedAt: "Just now" } : a))),
      deleteAutomation: (id) => setAutomations((p) => p.filter((a) => a.id !== id)),

      addAgent: (a) => setAgents((p) => [...p, a]),
      updateAgent: (id, patch) => setAgents((p) => p.map((a) => (a.id === id ? { ...a, ...patch } : a))),
      removeAgent: (id) => setAgents((p) => p.filter((a) => a.id !== id)),
    }),
    [loading, agents, contacts, conversations, campaigns, templates, automations, workspaceId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppStoreProvider");
  return ctx;
}

export function useAgentName(agents: Agent[], id: string | null | undefined) {
  if (!id) return "Unassigned";
  return agents.find((a) => a.id === id)?.name ?? "Unassigned";
}
