import SkincareQuestionnaire from "../_components/questions-form";

export default function Page() {
  return (
    <main className="relative flex min-h-svh flex-col items-center px-4 pt-12 pb-32 sm:px-8">
      <div className="flex w-full flex-col items-center lg:max-w-7xl">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          Análise Personalizada
        </h1>
        <p className="text-muted-foreground mt-2 text-center text-lg">
          Descubra o protocolo ideal para sua pele respondendo algumas
          perguntas.
        </p>

        <div className="mt-8 w-full">
          <SkincareQuestionnaire />
        </div>
      </div>
    </main>
  );
}
