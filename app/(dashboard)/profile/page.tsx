import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ProfileForm } from "@/components/profile/profile-form";
import { prisma } from "@/lib/prisma";

function createInitials(name: string) {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return "US";
  }

  const firstInitial = nameParts[0]?.[0] ?? "";
  const lastInitial =
    nameParts.length > 1 ? (nameParts[nameParts.length - 1]?.[0] ?? "") : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

function formatAccountDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const taskCount = await prisma.task.count({
    where: {
      project: {
        ownerId: session.user.id,
      },
    },
  });

  const initials = createInitials(user.name);

  return (
    <main className="mx-auto max-w-5xl space-y-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          Conta
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Perfil
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Consulte e atualize suas informações pessoais.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section
          aria-labelledby="profile-information-title"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2
            id="profile-information-title"
            className="text-xl font-semibold text-slate-950 dark:text-white"
          >
            Informações pessoais
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Os dados serão utilizados na identificação da sua conta.
          </p>

          <ProfileForm name={user.name} email={user.email} />
        </section>

        <aside className="space-y-6">
          <section
            aria-labelledby="account-summary-title"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h2
              id="account-summary-title"
              className="text-xl font-semibold text-slate-950 dark:text-white"
            >
              Resumo da conta
            </h2>

            <div className="mt-6 flex flex-col items-center text-center">
              <div
                aria-hidden="true"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              >
                {initials}
              </div>

              <p className="mt-4 font-semibold text-slate-950 dark:text-white">
                {user.name}
              </p>

              <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
            </div>

            <dl className="mt-6 divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-slate-500 dark:text-slate-400">
                  Projetos
                </dt>

                <dd className="font-semibold text-slate-950 dark:text-white">
                  {user._count.projects}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-sm text-slate-500 dark:text-slate-400">
                  Tarefas
                </dt>

                <dd className="font-semibold text-slate-950 dark:text-white">
                  {taskCount}
                </dd>
              </div>

              <div className="py-4">
                <dt className="text-sm text-slate-500 dark:text-slate-400">
                  Conta criada em
                </dt>

                <dd className="mt-1 text-sm font-medium text-slate-950 dark:text-white">
                  <time dateTime={user.createdAt.toISOString()}>
                    {formatAccountDate(user.createdAt)}
                  </time>
                </dd>
              </div>
            </dl>
          </section>

          <section
            aria-labelledby="account-security-title"
            className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/40"
          >
            <h2
              id="account-security-title"
              className="font-semibold text-blue-950 dark:text-blue-200"
            >
              Segurança da conta
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-800 dark:text-blue-300">
              Nunca compartilhe sua senha. A alteração de senha será adicionada
              em uma etapa futura específica de segurança.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
