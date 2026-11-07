import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Alert, EmptyState, PageHeader } from "@/components/ui/feedback";
import { cn } from "@/lib/cn";
import { grade, STATUS_LABEL, STATUS_TONE } from "@/lib/format";
import { ApiError, apiGet } from "@/lib/server";
import type { Roster, TeacherGroup } from "@/lib/types";
import { EvaluationsPanel } from "./evaluations-panel";
import { GradeSheetPanel } from "./grade-sheet-panel";

export const metadata: Metadata = { title: "Grupo" };

const TABS = [
  { key: "estudiantes", label: "Estudiantes" },
  { key: "evaluaciones", label: "Evaluaciones" },
  { key: "notas", label: "Notas" },
] as const;

export default async function GroupPage({ params, searchParams }: PageProps<"/docente/grupos/[id]">) {
  const { id } = await params;
  const { tab: rawTab } = await searchParams;
  const tab = TABS.find((t) => t.key === rawTab)?.key ?? "estudiantes";

  let group: TeacherGroup;
  let roster: Roster;
  try {
    [group, roster] = await Promise.all([apiGet<TeacherGroup>(`/groups/${id}`), apiGet<Roster>(`/groups/${id}/roster`)]);
  } catch (error) {
    if (error instanceof ApiError && [400, 403, 404].includes(error.status)) {
      return <EmptyState title="No puedes ver este grupo" text="No existe o no está a tu cargo." />;
    }
    throw error;
  }

  const readOnly = group.period.status === "cerrado";

  return (
    <>
      <Link href="/docente/grupos" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Mis grupos
      </Link>
      <PageHeader
        title={group.subject.name}
        subtitle={`${group.subject.code} · Grupo ${group.number} · Periodo ${group.period.code}`}
        action={
          <div className="flex gap-2">
            <Badge tone="primary">
              {group.enrolled} / {group.capacity} estudiantes
            </Badge>
            {readOnly && <Badge tone="neutral">Periodo cerrado</Badge>}
          </div>
        }
      />

      <nav aria-label="Secciones del grupo" className="mb-6 inline-flex rounded-xl border border-line bg-surface p-1">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/docente/grupos/${id}?tab=${t.key}`}
            aria-current={tab === t.key ? "page" : undefined}
            className={cn(
              "flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors sm:px-6",
              tab === t.key ? "bg-primary-600 text-white" : "text-muted hover:text-ink",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {readOnly && tab !== "estudiantes" && (
        <div className="mb-5">
          <Alert tone="danger">El periodo está cerrado: solo puedes consultar.</Alert>
        </div>
      )}

      {tab === "estudiantes" &&
        (roster.students.length === 0 ? (
          <EmptyState title="Aún no hay estudiantes matriculados" text="Aparecerán aquí cuando se matriculen en este grupo." />
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-sm">
                <caption className="sr-only">Estudiantes del grupo</caption>
                <thead>
                  <tr className="border-b border-line text-left text-xs text-muted">
                    <th scope="col" className="px-5 py-3 font-semibold">Estudiante</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Código</th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold">Nota final</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.students.map((s) => (
                    <tr key={s.enrollment} className="border-b border-line/60 last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.student.name} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{s.student.name}</p>
                            <p className="truncate text-xs text-muted">{s.student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted">{s.student.code}</td>
                      <td className="px-3 py-3 text-right font-bold">{grade(s.finalGrade)}</td>
                      <td className="px-5 py-3 text-right">
                        <Badge tone={STATUS_TONE[s.status]}>{STATUS_LABEL[s.status]}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}

      {tab === "evaluaciones" && <EvaluationsPanel groupId={id} readOnly={readOnly} />}
      {tab === "notas" && <GradeSheetPanel groupId={id} readOnly={readOnly} />}
    </>
  );
}
