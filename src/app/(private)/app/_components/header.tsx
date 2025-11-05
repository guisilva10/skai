import { auth } from "@/services/auth";

import { redirect } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";

const AppHeader = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <div className="">
      <div className="bg-primary flex h-[180px] w-full items-center justify-between rounded-br-2xl rounded-bl-2xl lg:h-[200px]">
        <div className="flex w-full items-center px-8 py-8">
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarImage
                src={session.user.image as string}
                alt={session.user.name as string}
              />
              <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Olá, {session.user.name || "usuário"}
              </h1>
              <p className="max-w-sm text-sm text-white/70">
                Bem vindo de volta a SKAI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
