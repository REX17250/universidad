import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { EmptyState, PageHeader } from "@/components/ui/feedback";
import { WeekSchedule } from "@/components/week-schedule";
import { plural } from "@/lib/format";
import { apiGetOrNull } from "@/lib/server";
import type { TeacherSchedule } from "@/lib/types";

export const metadata: Metadata = { title: "Horario" };

export default async function TeacherSchedulePage() {
  const schedule = await apiGetOrNull<TeacherSchedule>("/teachers/me/schedule");

  if (!schedule) {
    return (
      <>
        <PageHeader title="Mi horario" />
        <EmptyState title="No hay un periodo abierto" text="Cuando haya un periodo abierto verás aquí tus clases de la semana." />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Mi horario"
        subtitle={`Periodo ${schedule.period.code}`}
        action={
          <div className="flex gap-2">
            <Badge tone="primary">{plural(schedule.groups, "grupo", "grupos")}</Badge>
            <Badge tone="primary">{plural(schedule.students, "estudiante", "estudiantes")}</Badge>
          </div>
        }
      />
      {schedule.slots.length === 0 ? (
        <EmptyState title="No tienes clases asignadas" text="Cuando la administración te asigne grupos, aparecerán aquí." />
      ) : (
        <WeekSchedule byDay={schedule.byDay} />
      )}
    </>
  );
}
