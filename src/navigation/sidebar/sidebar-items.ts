import {
  Banknote,
  Briefcase,
  Building2,
  ClipboardList,
  CreditCard,
  type LucideIcon,
  Mail,
  MessageSquare,
  Newspaper,
  ReceiptText,
  UserCircle,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const companySidebarItems: NavGroup[] = [
  {
    id: 1,
    items: [
      {
        title: "Mon entreprise",
        url: "/dashboard/company",
        icon: Building2,
      },
      {
        title: "Offres d'emploi",
        url: "/dashboard/my-jobs",
        icon: Briefcase,
      },
      {
        title: "Candidatures",
        url: "/dashboard/my-applications",
        icon: ClipboardList,
      },
      {
        title: "Facturation",
        url: "/dashboard/billing",
        icon: CreditCard,
      },
    ],
  },
];

export const candidateSidebarItems: NavGroup[] = [
  {
    id: 1,
    items: [
      {
        title: "Offres d'emploi",
        url: "/dashboard/jobs",
        icon: Briefcase,
        comingSoon: true,
      },
      {
        title: "Mes candidatures",
        url: "/dashboard/my-applications",
        icon: ClipboardList,
        comingSoon: true,
      },
      {
        title: "Infos personnelles",
        url: "/dashboard/profile",
        icon: UserCircle,
        comingSoon: true,
      },
    ],
  },
];

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboard",
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Offres d'emploi",
        url: "/dashboard/jobs",
        icon: Briefcase,
      },
      {
        title: "Messagerie",
        url: "/dashboard/messages",
        icon: MessageSquare,
        // comingSoon: true,
      },
      {
        title: "Blog",
        url: "/dashboard/blog",
        icon: Newspaper,
      },
      {
        title: "Newsletter",
        url: "/dashboard/newsletter",
        icon: Mail,
      },
      // {
      //   title: "Analytics",
      //   url: "/dashboard/coming-soon",
      //   icon: Gauge,
      //   comingSoon: true,
      // },
      // {
      //   title: "E-commerce",
      //   url: "/dashboard/coming-soon",
      //   icon: ShoppingBag,
      //   comingSoon: true,
      // },
      // {
      //   title: "Academy",
      //   url: "/dashboard/coming-soon",
      //   icon: GraduationCap,
      //   comingSoon: true,
      // },
      // {
      //   title: "Logistics",
      //   url: "/dashboard/coming-soon",
      //   icon: Forklift,
      //   comingSoon: true,
      // },
    ],
  },
  {
    id: 2,
    label: "Analytics",
    items: [
      // {
      //   title: "Email",
      //   url: "/dashboard/coming-soon",
      //   icon: Mail,
      //   comingSoon: true,
      // },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        title: "Contrats",
        url: "/dashboard/contracts",
        icon: ReceiptText,
      },
      // {
      //   title: "Calendar",
      //   url: "/dashboard/coming-soon",
      //   icon: Calendar,
      //   comingSoon: true,
      // },
      // {
      //   title: "Kanban",
      //   url: "/dashboard/coming-soon",
      //   icon: Kanban,
      //   comingSoon: true,
      // },
      // {
      //   title: "Invoice",
      //   url: "/dashboard/coming-soon",
      //   icon: ReceiptText,
      //   comingSoon: true,
      // },
      // {
      //   title: "Users",
      //   url: "/dashboard/coming-soon",
      //   icon: Users,
      //   comingSoon: true,
      // },
      // {
      //   title: "Roles",
      //   url: "/dashboard/coming-soon",
      //   icon: Lock,
      //   comingSoon: true,
      // },
      // {
      //   title: "Authentication",
      //   url: "/auth",
      //   icon: Fingerprint,
      //   subItems: [
      //     { title: "Login v1", url: "/auth/v1/login", newTab: true },
      //     { title: "Login v2", url: "/auth/v2/login", newTab: true },
      //     { title: "Register v1", url: "/auth/v1/register", newTab: true },
      //     { title: "Register v2", url: "/auth/v2/register", newTab: true },
      //   ],
      // },
    ],
  },
  // {
  //   id: 3,
  //   label: "Misc",
  //   items: [
  //     {
  //       title: "Others",
  //       url: "/dashboard/coming-soon",
  //       icon: SquareArrowUpRight,
  //       comingSoon: true,
  //     },
  //   ],
  // },
];
