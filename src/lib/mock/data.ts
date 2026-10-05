// Mock domain data for the Relay WhatsApp CRM.
// Replace with API responses later — shapes here mirror the intended API.

export type LeadStatus = "new" | "qualified" | "customer" | "inactive";
export type ContactType = "lead" | "customer";

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Manager" | "Agent";
  status: "online" | "offline";
  conversations: number;
  lastActive: string;
  team: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  tags: string[];
  status: LeadStatus;
  type: ContactType;
  assignedAgentId: string;
  lastActivity: string;
  createdAt: string;
  notes: { id: string; body: string; author: string; at: string }[];
}

export interface Message {
  id: string;
  kind: "in" | "out" | "note";
  body: string;
  at: string;
  author?: string;
  read?: boolean;
}

export interface Conversation {
  id: string;
  contactId: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  status: "open" | "pending" | "resolved";
  starred: boolean;
  assignedAgentId: string | null;
  tags: string[];
  messages: Message[];
}

export interface Campaign {
  id: string;
  name: string;
  audience: string;
  template: string;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  status: "sent" | "scheduled" | "draft" | "running";
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: "Marketing" | "Utility" | "Authentication";
  language: string;
  status: "approved" | "pending" | "rejected";
  updatedAt: string;
  body: string;
  variables: string[];
}

export type NodeKind =
  | "trigger"
  | "condition"
  | "action"
  | "wait"
  | "assignment"
  | "message"
  | "tag"
  | "webhook";

export interface FlowNode {
  id: string;
  kind: NodeKind;
  title: string;
  detail: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  state: "active" | "paused" | "draft";
  runs: number;
  conversion: number;
  updatedAt: string;
  nodes: FlowNode[];
}

export const AGENTS: Agent[] = [
  { id: "a1", name: "Saqib Haroon", email: "saqib@clickmasters.io", role: "Owner", status: "online", conversations: 18, lastActive: "Just now", team: "Leadership" },
  { id: "a2", name: "Ayesha Khan", email: "ayesha@clickmasters.io", role: "Admin", status: "online", conversations: 24, lastActive: "2 min ago", team: "Sales" },
  { id: "a3", name: "Bilal Ahmed", email: "bilal@clickmasters.io", role: "Manager", status: "online", conversations: 21, lastActive: "8 min ago", team: "Sales" },
  { id: "a4", name: "Hira Naveed", email: "hira@clickmasters.io", role: "Agent", status: "online", conversations: 16, lastActive: "12 min ago", team: "Support" },
  { id: "a5", name: "Daniel Oyelaran", email: "daniel@clickmasters.io", role: "Agent", status: "offline", conversations: 11, lastActive: "3 hours ago", team: "Support" },
  { id: "a6", name: "Mariam Yousaf", email: "mariam@clickmasters.io", role: "Agent", status: "offline", conversations: 9, lastActive: "Yesterday", team: "Onboarding" },
  { id: "a7", name: "Tom Whitfield", email: "tom@clickmasters.io", role: "Manager", status: "online", conversations: 14, lastActive: "25 min ago", team: "Growth" },
  { id: "a8", name: "Zara Sheikh", email: "zara@clickmasters.io", role: "Agent", status: "offline", conversations: 7, lastActive: "2 days ago", team: "Support" },
];

export const TAGS = [
  "hot lead",
  "pricing",
  "demo",
  "seo",
  "web design",
  "renewal",
  "support",
  "vip",
  "cold",
  "follow-up",
];

const contactSeed: Array<[string, string, string, string, string[], LeadStatus, ContactType, string, string, string]> = [
  ["Fatima Iqbal", "+92 300 4412 889", "fatima@northbay.pk", "Northbay Textiles", ["hot lead", "pricing"], "new", "lead", "a2", "4 min ago", "12 Sep 2026"],
  ["Omar Siddiqui", "+92 321 7788 120", "omar@meridianauto.com", "Meridian Auto", ["demo", "seo"], "qualified", "lead", "a3", "18 min ago", "09 Sep 2026"],
  ["Grace Mbeki", "+44 7700 900412", "grace@lumenclinic.co.uk", "Lumen Clinic", ["vip", "renewal"], "customer", "customer", "a1", "32 min ago", "02 Aug 2026"],
  ["Hassan Raza", "+92 333 2210 776", "hassan@rivo.pk", "Rivo Logistics", ["follow-up"], "qualified", "lead", "a4", "1 hour ago", "28 Aug 2026"],
  ["Elena Petrova", "+49 151 2233 4455", "elena@bergstudio.de", "Berg Studio", ["web design"], "new", "lead", "a2", "2 hours ago", "14 Sep 2026"],
  ["Ahmed Nawaz", "+92 345 9911 220", "ahmed@saffronhouse.pk", "Saffron House", ["support"], "customer", "customer", "a5", "3 hours ago", "11 Jul 2026"],
  ["Laura Bennett", "+1 415 555 0173", "laura@driftwoodco.com", "Driftwood & Co", ["pricing", "hot lead"], "new", "lead", "a3", "4 hours ago", "15 Sep 2026"],
  ["Imran Malik", "+92 302 6677 812", "imran@zenithsteel.pk", "Zenith Steel", ["cold"], "inactive", "lead", "a6", "Yesterday", "21 Jun 2026"],
  ["Nadia Farooq", "+92 311 5544 398", "nadia@bluepetal.pk", "Blue Petal Events", ["demo"], "qualified", "lead", "a4", "Yesterday", "05 Sep 2026"],
  ["Peter Okonkwo", "+234 802 445 1190", "peter@arcnine.ng", "Arc Nine Studios", ["seo", "renewal"], "customer", "customer", "a7", "Yesterday", "19 May 2026"],
  ["Sara Qureshi", "+92 334 1199 006", "sara@velvetthreads.pk", "Velvet Threads", ["web design", "hot lead"], "new", "lead", "a2", "2 days ago", "13 Sep 2026"],
  ["Michael Brandt", "+61 412 887 340", "michael@harbourfit.au", "Harbour Fit", ["support", "vip"], "customer", "customer", "a1", "2 days ago", "30 Mar 2026"],
  ["Rabia Aslam", "+92 307 2244 551", "rabia@daisycare.pk", "Daisy Care", ["follow-up"], "qualified", "lead", "a3", "2 days ago", "01 Sep 2026"],
  ["Yusuf Demir", "+90 532 664 1180", "yusuf@anadoluline.tr", "Anadolu Line", ["pricing"], "new", "lead", "a8", "3 days ago", "10 Sep 2026"],
  ["Chloe Martin", "+33 6 12 45 88 90", "chloe@maisonlune.fr", "Maison Lune", ["web design"], "qualified", "lead", "a7", "3 days ago", "27 Aug 2026"],
  ["Adeel Shah", "+92 300 8811 442", "adeel@cratebox.pk", "Cratebox", ["renewal"], "customer", "customer", "a5", "4 days ago", "18 Apr 2026"],
  ["Sofia Alvarez", "+34 612 998 441", "sofia@ventana.es", "Ventana Design", ["cold"], "inactive", "lead", "a6", "5 days ago", "08 Feb 2026"],
  ["Kamran Javed", "+92 313 7788 991", "kamran@orbitmart.pk", "Orbit Mart", ["hot lead", "demo"], "new", "lead", "a4", "5 days ago", "14 Sep 2026"],
  ["Ruth Adeyemi", "+234 811 220 5567", "ruth@palmgrove.ng", "Palm Grove Foods", ["support"], "customer", "customer", "a8", "6 days ago", "22 Jan 2026"],
  ["Daniyal Tariq", "+92 336 5566 778", "daniyal@stackly.pk", "Stackly", ["seo", "follow-up"], "qualified", "lead", "a3", "1 week ago", "16 Aug 2026"],
  ["Anna Kowalski", "+48 601 334 778", "anna@nordicbrew.pl", "Nordic Brew", ["pricing"], "new", "lead", "a2", "1 week ago", "07 Sep 2026"],
  ["Bilal Sheikh", "+92 321 4455 661", "bilal@luxefloor.pk", "Luxe Flooring", ["vip"], "customer", "customer", "a1", "1 week ago", "12 Dec 2025"],
];

export const CONTACTS: Contact[] = contactSeed.map((c, i) => ({
  id: `c${i + 1}`,
  name: c[0],
  phone: c[1],
  email: c[2],
  company: c[3],
  tags: c[4],
  status: c[5],
  type: c[6],
  assignedAgentId: c[7],
  lastActivity: c[8],
  createdAt: c[9],
  notes:
    i % 4 === 0
      ? [
          {
            id: `n${i}`,
            body: "Customer requested pricing information for the growth package.",
            author: "Ayesha Khan",
            at: "Today, 09:42",
          },
        ]
      : [],
}));

function thread(pairs: Array<[Message["kind"], string, string]>): Message[] {
  return pairs.map((p, i) => ({
    id: `m${i}`,
    kind: p[0],
    body: p[1],
    at: p[2],
    author: p[0] === "note" ? "Ayesha Khan" : p[0] === "out" ? "Agent" : undefined,
    read: p[0] === "out" ? i < pairs.length - 1 : undefined,
  }));
}

const convSeed: Array<[string, string, number, Conversation["status"], boolean, string | null, string[]]> = [
  ["c1", "Can you share the pricing for the growth plan?", "09:41", 3, "open", true, "a2", ["pricing", "hot lead"]],
  ["c2", "Perfect, let's schedule the demo for Thursday.", "09:18", 0, "open", false, "a3", ["demo"]],
  ["c3", "Thanks for the quick turnaround yesterday!", "08:57", 0, "resolved", true, "a1", ["vip"]],
  ["c4", "Do you handle bulk shipment notifications?", "08:44", 2, "open", false, "a4", ["follow-up"]],
  ["c5", "I've attached our brand guidelines.", "08:20", 1, "pending", false, null, ["web design"]],
  ["c6", "My last order hasn't arrived yet.", "Yesterday", 0, "open", false, "a5", ["support"]],
  ["c7", "What's included in the SEO retainer?", "Yesterday", 4, "open", true, "a3", ["pricing"]],
  ["c8", "Not interested at the moment, thanks.", "Yesterday", 0, "resolved", false, "a6", ["cold"]],
  ["c9", "Can we move the demo to next week?", "Yesterday", 1, "pending", false, "a4", ["demo"]],
  ["c10", "Renewal invoice received, processing today.", "Mon", 0, "resolved", false, "a7", ["renewal"]],
  ["c11", "Loved the mockups — small change on the hero.", "Mon", 2, "open", false, null, ["web design"]],
  ["c12", "Our team grew, need 5 more seats.", "Mon", 0, "open", false, "a1", ["vip"]],
  ["c13", "Please send the appointment reminder again.", "Sun", 1, "open", false, "a3", ["follow-up"]],
  ["c14", "How long does onboarding usually take?", "Sun", 0, "pending", false, "a8", ["pricing"]],
  ["c15", "Sharing the signed proposal now.", "Sat", 0, "resolved", true, "a7", ["hot lead"]],
];

export const CONVERSATIONS: Conversation[] = convSeed.map((c, i) => ({
  id: `conv${i + 1}`,
  contactId: c[0],
  lastMessage: c[1],
  lastAt: c[2],
  unread: c[3],
  status: c[4],
  starred: c[5],
  assignedAgentId: c[6],
  tags: c[7],
  messages: thread([
    ["in", "Hi there! I found you through your website.", "09:12"],
    ["out", "Hello! Great to hear from you — how can we help today?", "09:14"],
    ["in", c[1], c[2] === "09:41" ? "09:41" : "09:20"],
    ["note", "Customer requested pricing information. Sending the growth deck.", "09:22"],
    ["out", "Absolutely — sharing our plans and a short breakdown in a moment.", "09:24"],
  ]),
}));

export const CAMPAIGNS: Campaign[] = [
  { id: "cp1", name: "September Website Offer", audience: "All leads · 4,210", template: "welcome_customer", sent: 4210, delivered: 4102, read: 3388, replied: 612, status: "sent", createdAt: "12 Sep 2026" },
  { id: "cp2", name: "Appointment Reminder", audience: "Booked clients · 388", template: "appointment_reminder", sent: 388, delivered: 384, read: 351, replied: 122, status: "sent", createdAt: "10 Sep 2026" },
  { id: "cp3", name: "New Customer Welcome", audience: "New customers · 512", template: "welcome_customer", sent: 512, delivered: 508, read: 470, replied: 98, status: "running", createdAt: "08 Sep 2026" },
  { id: "cp4", name: "SEO Consultation Follow-up", audience: "SEO tag · 1,120", template: "lead_followup", sent: 1120, delivered: 1090, read: 812, replied: 244, status: "sent", createdAt: "05 Sep 2026" },
  { id: "cp5", name: "Ramadan Early Access", audience: "VIP customers · 240", template: "welcome_customer", sent: 0, delivered: 0, read: 0, replied: 0, status: "scheduled", createdAt: "02 Oct 2026" },
  { id: "cp6", name: "Payment Reminder — Q3", audience: "Overdue invoices · 96", template: "payment_reminder", sent: 96, delivered: 95, read: 88, replied: 41, status: "sent", createdAt: "28 Aug 2026" },
  { id: "cp7", name: "Abandoned Inquiry Nudge", audience: "Cold leads · 1,840", template: "lead_followup", sent: 0, delivered: 0, read: 0, replied: 0, status: "draft", createdAt: "26 Aug 2026" },
  { id: "cp8", name: "Web Design Portfolio Drop", audience: "Web design tag · 760", template: "welcome_customer", sent: 760, delivered: 742, read: 590, replied: 133, status: "sent", createdAt: "19 Aug 2026" },
  { id: "cp9", name: "Customer Feedback Survey", audience: "Active customers · 1,405", template: "lead_followup", sent: 1405, delivered: 1388, read: 1010, replied: 388, status: "sent", createdAt: "12 Aug 2026" },
  { id: "cp10", name: "Winback — Inactive 90 Days", audience: "Inactive · 2,300", template: "lead_followup", sent: 0, delivered: 0, read: 0, replied: 0, status: "draft", createdAt: "04 Aug 2026" },
];

export const TEMPLATES: Template[] = [
  { id: "t1", name: "welcome_customer", category: "Marketing", language: "English (US)", status: "approved", updatedAt: "12 Sep 2026", body: "Hi {{customer_name}} 👋 Welcome to {{company_name}}! We're thrilled to have you. Reply here any time — a real person always answers.", variables: ["{{customer_name}}", "{{company_name}}"] },
  { id: "t2", name: "appointment_reminder", category: "Utility", language: "English (UK)", status: "approved", updatedAt: "10 Sep 2026", body: "Reminder: your appointment with {{1}} is on {{2}}. Reply RESCHEDULE if you need a different time.", variables: ["{{1}}", "{{2}}"] },
  { id: "t3", name: "payment_reminder", category: "Utility", language: "English (US)", status: "approved", updatedAt: "28 Aug 2026", body: "Hello {{customer_name}}, invoice {{1}} of {{2}} is due on {{3}}. You can pay securely from your dashboard.", variables: ["{{customer_name}}", "{{1}}", "{{2}}", "{{3}}"] },
  { id: "t4", name: "lead_followup", category: "Marketing", language: "English (US)", status: "approved", updatedAt: "22 Aug 2026", body: "Hi {{customer_name}}, just following up on your enquiry about {{1}}. Would a quick 15-minute call this week help?", variables: ["{{customer_name}}", "{{1}}"] },
  { id: "t5", name: "otp_verification", category: "Authentication", language: "English (US)", status: "approved", updatedAt: "18 Aug 2026", body: "{{1}} is your {{company_name}} verification code. It expires in 10 minutes. Never share this code.", variables: ["{{1}}", "{{company_name}}"] },
  { id: "t6", name: "order_shipped", category: "Utility", language: "English (US)", status: "pending", updatedAt: "16 Aug 2026", body: "Good news {{customer_name}} — order {{1}} has shipped. Track it here: {{2}}", variables: ["{{customer_name}}", "{{1}}", "{{2}}"] },
  { id: "t7", name: "seasonal_offer", category: "Marketing", language: "Urdu", status: "pending", updatedAt: "14 Aug 2026", body: "{{customer_name}}, this week only: {{1}} off every package at {{company_name}}. Reply YES for details.", variables: ["{{customer_name}}", "{{1}}", "{{company_name}}"] },
  { id: "t8", name: "feedback_request", category: "Marketing", language: "English (US)", status: "approved", updatedAt: "09 Aug 2026", body: "Thanks for choosing {{company_name}}, {{customer_name}}. How did we do? Rate us 1–5 and we'll act on it.", variables: ["{{company_name}}", "{{customer_name}}"] },
  { id: "t9", name: "support_handover", category: "Utility", language: "English (US)", status: "approved", updatedAt: "02 Aug 2026", body: "You're now chatting with {{1}} from our support team. They have your full history — no need to repeat anything.", variables: ["{{1}}"] },
  { id: "t10", name: "renewal_notice", category: "Marketing", language: "English (UK)", status: "rejected", updatedAt: "29 Jul 2026", body: "{{customer_name}}, your {{1}} plan renews on {{2}}. Want to upgrade before it does?", variables: ["{{customer_name}}", "{{1}}", "{{2}}"] },
];

const flow = (nodes: Array<[NodeKind, string, string]>): FlowNode[] =>
  nodes.map((n, i) => ({ id: `fn${i + 1}`, kind: n[0], title: n[1], detail: n[2] }));

export const AUTOMATIONS: Automation[] = [
  {
    id: "au1",
    name: "New Lead Welcome",
    description: "Greets every first-time WhatsApp enquiry and routes pricing questions to sales.",
    state: "active",
    runs: 3412,
    conversion: 38.4,
    updatedAt: "Today",
    nodes: flow([
      ["trigger", "New WhatsApp Message", "First message from an unknown number"],
      ["condition", 'Message contains "pricing"', "Case insensitive keyword match"],
      ["action", "Send Template", "welcome_customer"],
      ["wait", "Wait 1 Day", "Pause before follow-up"],
      ["condition", "Customer replied?", "Yes → assign · No → follow up"],
      ["assignment", "Assign to Sales", "Round robin across Sales team"],
    ]),
  },
  { id: "au2", name: "Missed Message Follow-up", description: "Nudges conversations with no agent reply after 2 hours.", state: "active", runs: 1288, conversion: 26.1, updatedAt: "Yesterday", nodes: flow([["trigger", "No Agent Reply", "2 hours elapsed"], ["action", "Send Template", "lead_followup"], ["tag", "Add Tag", "follow-up"]]) },
  { id: "au3", name: "Appointment Reminder", description: "Sends a reminder 24 hours before each booking.", state: "active", runs: 964, conversion: 61.8, updatedAt: "2 days ago", nodes: flow([["trigger", "Booking Created", "From calendar sync"], ["wait", "Wait Until T-24h", "Relative to appointment"], ["message", "Send Reminder", "appointment_reminder"]]) },
  { id: "au4", name: "Abandoned Inquiry", description: "Re-engages leads that went quiet after asking a question.", state: "paused", runs: 742, conversion: 14.2, updatedAt: "4 days ago", nodes: flow([["trigger", "Conversation Idle", "3 days of silence"], ["condition", "Lead status is new", "Skip customers"], ["action", "Send Template", "lead_followup"]]) },
  { id: "au5", name: "Customer Feedback", description: "Asks for a rating after a conversation is resolved.", state: "active", runs: 2109, conversion: 44.7, updatedAt: "5 days ago", nodes: flow([["trigger", "Conversation Resolved", "Any agent"], ["wait", "Wait 2 Hours", "Let the dust settle"], ["message", "Send Survey", "feedback_request"]]) },
  { id: "au6", name: "VIP Fast Lane", description: "Routes VIP-tagged customers straight to senior agents.", state: "active", runs: 388, conversion: 72.5, updatedAt: "1 week ago", nodes: flow([["trigger", "New WhatsApp Message", "Any inbound"], ["condition", "Has tag vip", "Tag match"], ["assignment", "Assign to Leadership", "Saqib or Ayesha"]]) },
  { id: "au7", name: "Webhook to CRM", description: "Pushes every qualified lead to the external CRM.", state: "draft", runs: 0, conversion: 0, updatedAt: "1 week ago", nodes: flow([["trigger", "Lead Qualified", "Status changed"], ["webhook", "POST to CRM", "https://api.example.com/leads"]]) },
  { id: "au8", name: "Winback Sequence", description: "Three-step re-engagement for inactive contacts.", state: "draft", runs: 0, conversion: 0, updatedAt: "2 weeks ago", nodes: flow([["trigger", "Inactive 90 Days", "No inbound message"], ["message", "Send Offer", "seasonal_offer"], ["wait", "Wait 3 Days", ""], ["condition", "Replied?", "Yes → tag hot lead"]]) },
];

export const CONVERSATION_SERIES = [
  { day: "Mon", conversations: 268, leads: 42, messages: 1180 },
  { day: "Tue", conversations: 312, leads: 51, messages: 1345 },
  { day: "Wed", conversations: 289, leads: 38, messages: 1240 },
  { day: "Thu", conversations: 358, leads: 64, messages: 1520 },
  { day: "Fri", conversations: 401, leads: 72, messages: 1688 },
  { day: "Sat", conversations: 246, leads: 33, messages: 990 },
  { day: "Sun", conversations: 198, leads: 27, messages: 812 },
];

export const AGENT_PERFORMANCE = [
  { agent: "Ayesha Khan", conversations: 412, replies: 1980, responseTime: "1m 12s", resolved: 388, conversion: 41.2 },
  { agent: "Bilal Ahmed", conversations: 366, replies: 1712, responseTime: "1m 38s", resolved: 341, conversion: 37.8 },
  { agent: "Hira Naveed", conversations: 298, replies: 1420, responseTime: "2m 04s", resolved: 271, conversion: 33.5 },
  { agent: "Tom Whitfield", conversations: 254, replies: 1188, responseTime: "1m 52s", resolved: 233, conversion: 35.9 },
  { agent: "Daniel Oyelaran", conversations: 188, replies: 902, responseTime: "2m 41s", resolved: 166, conversion: 28.4 },
  { agent: "Zara Sheikh", conversations: 142, replies: 688, responseTime: "3m 06s", resolved: 121, conversion: 24.1 },
];

export const CHANNEL_MIX = [
  { name: "Inbound", value: 6280 },
  { name: "Campaign", value: 4120 },
  { name: "Automation", value: 3310 },
  { name: "Agent outbound", value: 2190 },
];

export const WORKSPACES = [
  { id: "w1", name: "ClickMasters", plan: "Pro Plan" },
  { id: "w2", name: "Northbay Group", plan: "Starter" },
  { id: "w3", name: "Lumen Clinic", plan: "Business" },
];

export const CURRENT_USER = {
  name: "Saqib Haroon",
  email: "saqib@clickmasters.io",
  role: "Owner",
};
