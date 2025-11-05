"use client";

import { useState } from "react"; // 1. Importar o useState
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Lightbulb, User, LogOutIcon } from "lucide-react";
import { cn } from "@/app/_lib/utils";

// 2. Importar os componentes do Drawer (e Button para o fechar)
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { Button } from "@/app/_components/ui/button";
import { signOut } from "next-auth/react";

const navLinks = [
  { href: "/app", label: "Início", icon: Home },
  { href: "/questionario", label: "Questionário", icon: ClipboardList },
  { href: "/dicas", label: "Dicas", icon: Lightbulb },
];

const profileItem = { label: "Perfil", icon: User };
const signOutItem = { label: "Sair", icon: LogOutIcon };

export function Dock() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="bg-card/80 border-border mx-auto w-full rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-lg">
        <div className="flex w-full max-w-4xl items-center gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 transition-all duration-200",
                  "hover:bg-primary/10 hover:scale-110",
                  isActive && "bg-primary/20 scale-105",
                )}
                title={item.label}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isActive
                      ? "text-primary fill-primary"
                      : "text-muted-foreground group-hover:text-primary",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary",
                  )}
                >
                  {item.label}
                </span>

                <span className="bg-popover text-popover-foreground pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <Drawer open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DrawerTrigger asChild>
              <button
                className={cn(
                  "group relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 transition-all duration-200",
                  "hover:bg-primary/10 hover:scale-110",
                  // Usar o estado do drawer para o estilo "ativo"
                  isProfileOpen && "bg-primary/20 scale-105",
                )}
                title={profileItem.label}
              >
                <profileItem.icon
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isProfileOpen
                      ? "text-primary fill-primary"
                      : "text-muted-foreground group-hover:text-primary",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    isProfileOpen
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary",
                  )}
                >
                  {profileItem.label}
                </span>

                {/* Tooltip on hover */}
                <span className="bg-popover text-popover-foreground pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                  {profileItem.label}
                </span>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-md">
                <DrawerHeader>
                  <DrawerTitle>Seu Perfil</DrawerTitle>
                  <DrawerDescription>
                    Gerencie as informações da sua conta.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <p>Informações do perfil...</p>
                  <p>Configurações...</p>
                  <p>Sair...</p>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Fechar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
          <button
            onClick={() => signOut()}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 transition-all duration-200",
              "hover:bg-destructive/10 hover:scale-110",
            )}
            title={signOutItem.label}
          >
            <signOutItem.icon
              className={cn(
                "h-6 w-6 transition-colors",
                "text-muted-foreground group-hover:text-destructive",
              )}
            />
            <span
              className={cn(
                "text-[10px] font-medium transition-colors",
                "text-muted-foreground group-hover:text-destructive",
              )}
            >
              {signOutItem.label}
            </span>
            <span className="bg-popover text-popover-foreground pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
              {signOutItem.label}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
