import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getNationalHolidays, type Holiday } from "@/lib/services/holidays";

interface CalendarPageProps {
  searchParams: Promise<{
    year?: string | string[];
  }>;
}

export const metadata: Metadata = {
  title: "Calendário | TaskFlow",
  description:
    "Consulte os feriados nacionais para planejar os prazos dos seus projetos.",
};

function createDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatHolidayDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

function getHolidaySituation(holiday: Holiday, todayKey: string) {
  if (holiday.date === todayKey) {
    return {
      label: "Hoje",
      style: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
    };
  }

  if (holiday.date > todayKey) {
    return {
      label: "Próximo",
      style:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    };
  }

  return {
    label: "Encerrado",
    style: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };
}

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const todayKey = createDateKey(currentDate);

  const supportedYears = [currentYear, currentYear + 1];

  const parameters = await searchParams;

  const receivedYear =
    typeof parameters.year === "string" ? Number(parameters.year) : currentYear;

  const selectedYear = supportedYears.includes(receivedYear)
    ? receivedYear
    : currentYear;

  const result = await getNationalHolidays(selectedYear);

  const nextHoliday =
    result.holidays.find((holiday) => holiday.date >= todayKey) ?? null;

  return (
    <main className="mx-auto max-w-6xl space-y-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          Planejamento
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Calendário de feriados
        </h1>

        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Consulte os feriados nacionais para organizar prazos e entregas dos
          seus projetos.
        </p>
      </header>

      <section
        aria-labelledby="calendar-settings-title"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="calendar-settings-title"
              className="text-xl font-semibold text-slate-950 dark:text-white"
            >
              Período do calendário
            </h2>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Selecione o ano que deseja consultar.
            </p>
          </div>

          <form
            action="/calendar"
            method="get"
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div>
              <label
                htmlFor="calendar-year"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Ano
              </label>

              <select
                id="calendar-year"
                name="year"
                defaultValue={selectedYear}
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:w-36"
              >
                {supportedYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Consultar
            </button>
          </form>
        </div>
      </section>

      {result.error ? (
        <section
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40"
        >
          <h2 className="font-semibold text-red-900 dark:text-red-200">
            Não foi possível carregar o calendário
          </h2>

          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            {result.error}
          </p>

          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            Seus projetos e tarefas continuam disponíveis normalmente.
          </p>
        </section>
      ) : (
        <>
          {nextHoliday ? (
            <section
              aria-labelledby="next-holiday-title"
              className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/40"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Próximo feriado
              </p>

              <h2
                id="next-holiday-title"
                className="mt-2 text-2xl font-bold text-blue-950 dark:text-blue-100"
              >
                {nextHoliday.name}
              </h2>

              <time
                dateTime={nextHoliday.date}
                className="mt-2 block capitalize text-blue-800 dark:text-blue-300"
              >
                {formatHolidayDate(nextHoliday.date)}
              </time>
            </section>
          ) : null}

          <section aria-labelledby="holiday-list-title">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="holiday-list-title"
                  className="text-2xl font-bold text-slate-950 dark:text-white"
                >
                  Feriados de {selectedYear}
                </h2>

                <p
                  className="mt-1 text-sm text-slate-600 dark:text-slate-400"
                  aria-live="polite"
                >
                  {result.holidays.length} feriados encontrados.
                </p>
              </div>

              <Link
                href="/tasks?sort=due-date"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-600 transition hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Conferir prazos →
              </Link>
            </div>

            {result.holidays.length > 0 ? (
              <ol className="grid gap-4 md:grid-cols-2">
                {result.holidays.map((holiday) => {
                  const situation = getHolidaySituation(holiday, todayKey);

                  return (
                    <li
                      key={`${holiday.date}-${holiday.name}`}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <time
                            dateTime={holiday.date}
                            className="text-sm font-semibold capitalize text-blue-600 dark:text-blue-400"
                          >
                            {formatHolidayDate(holiday.date)}
                          </time>

                          <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                            {holiday.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {holiday.type}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${situation.style}`}
                        >
                          {situation.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-950">
                <h3 className="font-semibold text-slate-950 dark:text-white">
                  Nenhum feriado encontrado
                </h3>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  A API não retornou feriados para o ano selecionado.
                </p>
              </div>
            )}
          </section>
        </>
      )}

      <footer className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        Dados fornecidos pela{" "}
        <a
          href="https://brasilapi.com.br/"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
        >
          BrasilAPI
        </a>
        .
      </footer>
    </main>
  );
}
