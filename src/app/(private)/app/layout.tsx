import { Dock } from "@/app/(private)/app/_components/dock";
import { PropsWithChildren } from "react";
import AppHeader from "./_components/header";
import { auth } from "@/services/auth";

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await auth();
  return (
    <div>
      <AppHeader />
      <div className="">{children}</div>
      <Dock user={session?.user} />
    </div>
  );
}
