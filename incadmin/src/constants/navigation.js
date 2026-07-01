import {
  LayoutDashboard,
  Megaphone,
  BookOpen,
  Image,
  Users,
  UserCog,
  Tags,
  GraduationCap,
  Mail,
  Settings,
  LogOut,
  Newspaper,
  FlaskConical,
  Building2,
  Briefcase,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "MAIN",
    items: [{ label: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Notices", path: "/notices", icon: Megaphone },
      { label: "Programs", path: "/programs", icon: BookOpen },
      { label: "Facilities", path: "/facilities", icon: Building2 },
      { label: "Units", path: "/units", icon: Briefcase },
      { label: "Blog", path: "/blogs", icon: Newspaper },
      { label: "Journal", path: "/journals", icon: FlaskConical },
      { label: "Gallery", path: "/gallery", icon: Image },
    ],
  },
  {
    title: "PEOPLE",
    items: [
      { label: "Faculty", path: "/faculty", icon: Users },
      { label: "Staff", path: "/staff", icon: UserCog },
      { label: "Categories", path: "/categories", icon: Tags },
    ],
  },
  {
    title: "SUBMISSIONS",
    items: [
      { label: "Admissions", path: "/admissions", icon: GraduationCap },
      { label: "Contacts", path: "/contacts", icon: Mail },
    ],
  },
  {
    title: "ACCOUNT",
    items: [{ label: "Settings", path: "/settings", icon: Settings }],
  },
];

export const LOGOUT_ITEM = { label: "Logout", icon: LogOut };

const EXTRA_ROUTE_LABELS = {
  "/notifications": "Notifications",
  "/settings": "Settings",
};

export function getRouteLabel(pathname) {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.path === pathname) return item.label;
    }
  }
  return EXTRA_ROUTE_LABELS[pathname] ?? "Dashboard";
}
