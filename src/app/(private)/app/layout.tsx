import { Dock } from "@/app/(private)/app/_components/dock";
import { PropsWithChildren } from "react";
import AppHeader from "./_components/header";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <AppHeader />
      <div className="flex flex-1">{children}</div>
      <Dock />
    </div>
  );
}
