// Tipos de las respuestas del backend (solo los campos que la interfaz usa)

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface Period {
  _id: string;
  code: string;
  startDate: string;
  endDate: string;
  status: "planificado" | "abierto" | "cerrado";
}

export interface Notification {
  _id: string;
  type: "matricula_confirmada" | "matricula_cancelada" | "nota_final" | "grupo_asignado" | "aviso";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Me {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "docente" | "estudiante";
  active: boolean;
}

export interface Dashboard {
  users: Record<string, number>;
  active: { students: number; teachers: number; programs: number; subjects: number; classrooms: number; groups: number };
  faculties: number;
  currentPeriod: {
    code: string;
    groups: number;
    capacity: number;
    enrolled: number;
    occupancyPercent: number;
    enrollmentsByStatus: Record<string, number>;
  } | null;
}

export type EnrollmentStatus = "activa" | "cancelada" | "aprobada" | "reprobada";
export type Day = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado";

export interface Enrollment {
  _id: string;
  status: EnrollmentStatus;
  finalGrade?: number;
  subject: { _id: string; code: string; name: string; credits: number };
  group: { _id: string; number: number };
  period: { _id: string; code: string; status: Period["status"] };
}

export interface AvailableGroup {
  group: string;
  number: number;
  subject: { id: string; code: string; name: string; credits: number };
  teacher: string | null;
  capacity: number;
  availableSeats: number;
  schedule: { day: Day; startTime: string; endTime: string; classroom: string | null }[];
}

export interface AvailableGroups {
  period: { id: string; code: string };
  total: number;
  groups: AvailableGroup[];
}

export interface ScheduleSlot {
  day: Day;
  startTime: string;
  endTime: string;
  classroom: string | null;
  building: string | null;
  subject: { code: string; name: string };
  group: number;
  teacher: string | null;
}

export interface StudentSchedule {
  period: { id: string; code: string; status: string };
  subjects: number;
  credits: number;
  slots: ScheduleSlot[];
  byDay: Partial<Record<Day, ScheduleSlot[]>>;
}

export interface Evaluation {
  _id: string;
  name: string;
  weight: number;
  group: string;
}

export interface MyGrade {
  _id: string;
  value: number;
  evaluation: { _id: string; name: string; weight: number; group: string };
  enrollment: { _id: string };
}

export interface History {
  student: { code: string; name: string };
  program: { code: string; name: string; totalCredits: number };
  summary: {
    creditsApproved: number;
    creditsRemaining: number;
    progressPercent: number;
    gpa: number | null;
    subjectsPassed: number;
    subjectsFailed: number;
    inProgress: number;
  };
  periods: {
    period: { id: string; code: string; status: string };
    credits: number;
    gpa: number | null;
    courses: {
      enrollment: string;
      subject: { code: string; name: string; credits: number };
      group: number;
      status: EnrollmentStatus;
      finalGrade: number | null;
    }[];
  }[];
}

export interface Progress {
  program: { code: string; name: string };
  summary: {
    subjects: number;
    passed: number;
    inProgress: number;
    failed: number;
    pending: number;
    creditsApproved: number;
    creditsTotal: number;
  };
  subjects: {
    id: string;
    code: string;
    name: string;
    credits: number;
    semester: number | null;
    status: "aprobada" | "cursando" | "reprobada" | "pendiente";
    missingPrerequisites: string[];
    canEnroll: boolean;
  }[];
}

export interface TeacherGroup {
  _id: string;
  number: number;
  capacity: number;
  enrolled: number;
  availableSeats: number;
  active: boolean;
  subject: { _id: string; code: string; name: string; credits: number };
  period: { _id: string; code: string; status: Period["status"] };
  schedule: { day: Day; startTime: string; endTime: string; classroom: { code: string; building: string } | null }[];
}

export interface GroupHeader {
  id: string;
  number: number;
  subject: { code: string; name: string; credits: number };
  period: { code: string; status: string };
  teacher: string | null;
  capacity: number;
  enrolled: number;
  availableSeats: number;
}

export interface RosterStudent {
  enrollment: string;
  status: EnrollmentStatus;
  finalGrade: number | null;
  student: { id: string; code: string; name: string; email: string };
}

export interface Roster {
  group: GroupHeader;
  total: number;
  students: RosterStudent[];
}

export interface GradeSheet {
  group: GroupHeader;
  evaluations: { id: string; name: string; weight: number }[];
  summary: { totalWeight: number; planComplete: boolean; students: number; readyToFinalize: number };
  rows: {
    enrollment: string;
    status: EnrollmentStatus;
    student: { id: string; code: string; name: string };
    grades: Record<string, number | null>;
    evaluatedWeight: number;
    accumulated: number;
    average: number | null;
    pendingEvaluations: number;
    finalGrade: number | null;
    readyToFinalize: boolean;
  }[];
}

export interface BulkResult {
  total: number;
  saved: number;
  failed: { index: number; reason: string }[];
}

export interface FinalizeResult {
  finalized: number;
  passed: number;
  failed: number;
  skipped: number;
  details: { skipped: { student: string; reason: string }[] };
}

export interface TeacherSchedule {
  period: { id: string; code: string; status: string };
  groups: number;
  students: number;
  slots: (ScheduleSlot & { enrolled?: number; groupId?: string })[];
  byDay: Partial<Record<Day, (ScheduleSlot & { enrolled?: number })[]>>;
}

// Reportes del admin
export interface ReportPeriod {
  id: string;
  code: string;
}
export interface OccupancyRow {
  group: string;
  subject: { code: string; name: string };
  number: number;
  capacity: number;
  enrolled: number;
  availableSeats: number;
  occupancyPercent: number;
}
export interface ByProgramRow {
  program: { id: string; code: string; name: string };
  enrollments: number;
  students: number;
}
export interface SubjectPerformanceRow {
  subject: { id: string; code: string; name: string };
  finalized: number;
  passed: number;
  failed: number;
  passRate: number;
  averageGrade: number;
}
export interface StudentRankRow {
  student: { id: string; code: string; name: string };
  gpa: number;
  credits: number;
  passed: number;
  failed: number;
}
export interface TeacherLoadRow {
  teacher: { id: string; code: string; name: string };
  groups: number;
  students: number;
  credits: number;
}
export interface FacultyRow {
  faculty: { id: string; code: string; name: string };
  programs: number;
  teachers: number;
  students: number;
}
export interface Report<T> {
  period: ReportPeriod;
  rows: T[];
}
