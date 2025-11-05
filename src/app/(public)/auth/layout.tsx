import { AuroraBackground } from "@/app/_components/home/background-beams";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <AuroraBackground>
      <div className="min-h-screen py-6">
        <div className="relative mx-auto flex min-h-screen w-screen flex-col items-center justify-center">
          <div className="w-full px-6 py-12 lg:max-w-4xl">{children}</div>
          <div className="mb-8">
            <Link
              prefetch
              href="/"
              className="flex items-center justify-center rounded-lg border p-2"
            >
              <ArrowLeftIcon className="mr-2 size-4" />
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
