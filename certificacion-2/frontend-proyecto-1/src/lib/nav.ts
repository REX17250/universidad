import type { Role } from "./session";

export type IconName = "home" | "bell" | "user" | "plus" | "book" | "calendar" | "grades" | "history" | "map" | "groups" | "building" | "layers" | "door" | "shield" | "cap" | "teacher" | "megaphone" | "chart";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  section?: string; // titulo de grupo en el menu
}

// Menu por rol. Cada fase agrega aqui sus pantallas (solo las que ya existen).
export const NAV: Record<Role, NavItem[]> = {
  estudiante: [
    { href: "/estudiante", label: "Inicio", icon: "home" },
    { href: "/estudiante/matricula", label: "Matricular", icon: "plus" },
    { href: "/estudiante/materias", label: "Mis materias", icon: "book" },
    { href: "/estudiante/horario", label: "Horario", icon: "calendar" },
    { href: "/estudiante/notas", label: "Notas", icon: "grades" },
    { href: "/estudiante/historial", label: "Historial", icon: "history" },
    { href: "/estudiante/malla", label: "Malla curricular", icon: "map" },
  ],
  docente: [
    { href: "/docente", label: "Inicio", icon: "home" },
    { href: "/docente/grupos", label: "Mis grupos", icon: "groups" },
    { href: "/docente/horario", label: "Horario", icon: "calendar" },
  ],
  admin: [
    { href: "/admin", label: "Inicio", icon: "home" },
    { href: "/admin/facultades", label: "Facultades", icon: "building", section: "Catálogo" },
    { href: "/admin/programas", label: "Programas", icon: "layers", section: "Catálogo" },
    { href: "/admin/materias", label: "Materias", icon: "book", section: "Catálogo" },
    { href: "/admin/salones", label: "Salones", icon: "door", section: "Catálogo" },
    { href: "/admin/periodos", label: "Periodos", icon: "calendar", section: "Operación" },
    { href: "/admin/grupos", label: "Grupos", icon: "groups", section: "Operación" },
    { href: "/admin/matriculas", label: "Matrículas", icon: "book", section: "Operación" },
    { href: "/admin/avisos", label: "Avisos", icon: "megaphone", section: "Operación" },
    { href: "/admin/reportes", label: "Reportes", icon: "chart", section: "Operación" },
    { href: "/admin/usuarios", label: "Usuarios", icon: "shield", section: "Personas" },
    { href: "/admin/estudiantes", label: "Estudiantes", icon: "cap", section: "Personas" },
    { href: "/admin/docentes", label: "Docentes", icon: "teacher", section: "Personas" },
  ],
};

// Pantallas comunes a todos los roles
export const COMMON_NAV: NavItem[] = [
  { href: "/notificaciones", label: "Notificaciones", icon: "bell" },
  { href: "/cuenta", label: "Mi cuenta", icon: "user" },
];
