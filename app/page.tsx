

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <p className="text-9xl mb-10">
        👋
      </p>
      <h1 className="text-5xl font-bold mb-25">
        Jorge Alberto Pires Junior
      </h1>
      <h2 className="text-5xl text-gray-500 font-bold">
        Desenvolvedor Full Stack
      </h2>
      <button className="mt-10 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-300 transition duration-300">
        Entrar
      </button>
    </main>
  );
}