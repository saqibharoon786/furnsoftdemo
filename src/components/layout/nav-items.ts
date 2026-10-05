import {
  BarChart3,
  Bot,
  Contact,
  LayoutDashboard,
  MessagesSquare,
  Plug,
  Send,
  Settings,
  FileText,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Inbox", to: "/inbox", icon: MessagesSquare, badge: "14" },
  { label: "Contacts", to: "/contacts", icon: Contact },
  { label: "Campaigns", to: "/campaigns", icon: Send },
  { label: "Automation", to: "/automation", icon: Bot },
  { label: "Templates", to: "/templates", icon: FileText },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Team", to: "/team", icon: Users },
  { label: "Integrations", to: "/integrations", icon: Plug },
  { label: "Settings", to: "/settings", icon: Settings },
];
