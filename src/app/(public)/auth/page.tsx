import { AuroraBackground } from "@/app/_components/home/background-beams";
import { LoginForm } from "./_components/login-form";

export default function Page() {
  return (
    <AuroraBackground className="w-screen">
      <div className="relative mx-auto flex min-h-svh w-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <LoginForm />
        </div>
      </div>
    </AuroraBackground>
  );
}
