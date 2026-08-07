export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <section>
        <p className="text-sm font-medium text-blue-600">Conta</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
          Perfil
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Consulte suas informações pessoais e as configurações da sua conta.
        </p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section
          aria-labelledby="profile-information-title"
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2
            id="profile-information-title"
            className="text-lg font-semibold text-gray-950"
          >
            Informações pessoais
          </h2>

          <div className="mt-6 flex items-center gap-4 border-b pb-6">
            <div
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700"
            >
              JP
            </div>

            <div>
              <p className="font-semibold text-gray-950">Jorge</p>

              <p className="text-sm text-gray-500">Desenvolvedor Frontend</p>
            </div>
          </div>

          <dl className="divide-y">
            <div className="grid gap-1 py-5 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Nome</dt>

              <dd className="text-sm text-gray-900 sm:col-span-2">Jorge</dd>
            </div>

            <div className="grid gap-1 py-5 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Função</dt>

              <dd className="text-sm text-gray-900 sm:col-span-2">
                Desenvolvedor Frontend
              </dd>
            </div>

            <div className="grid gap-1 py-5 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">E-mail</dt>

              <dd className="break-all text-sm text-gray-900 sm:col-span-2">
                usuario@exemplo.com
              </dd>
            </div>
          </dl>
        </section>

        <section
          aria-labelledby="account-settings-title"
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2
            id="account-settings-title"
            className="text-lg font-semibold text-gray-950"
          >
            Configurações da conta
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            As opções para editar perfil, alterar senha e gerenciar sua conta
            serão adicionadas quando conectarmos a autenticação.
          </p>

          <div className="mt-6 rounded-xl border border-dashed bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-700">
              Configurações em breve
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Esta área será conectada aos dados do usuário autenticado.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
