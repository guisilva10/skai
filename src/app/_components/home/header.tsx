"use client";

import { RocketIcon, Menu, SparklesIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button"; // Ajustei o caminho
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/app/_components/ui/sheet"; // Ajustei o caminho
import { useEffect, useState } from "react";
import { LuWorkflow } from "react-icons/lu";
import Link from "next/link";

// 1. Definição dos links de navegação
const navLinks = [
  { name: "Início", href: "#hero" },
  { name: "Como Funciona", href: "#howitworks" },
  { name: "Produtos", href: "#products" },
  { name: "Feedbacks", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
];

const Logo = ({ scrolled }: { scrolled: boolean }) => (
  <div className="flex items-center space-x-2">
    <div
      className={`to-primary via-primary/70 from-primary/50 flex size-10 items-center justify-center rounded-lg bg-linear-to-r p-1 transition-all duration-300`}
    >
      <SparklesIcon
        fill="#ffff"
        className={`text-white transition-all duration-300`}
      />
    </div>
    <p className={`text-2xl font-bold uppercase`}>SKAI</p>
  </div>
);

// Componente de CTA reutilizável
const CtaButton = ({
  scrolled,
  inSheet = false,
}: {
  scrolled: boolean;
  inSheet?: boolean;
}) => (
  <Button
    className={`group relative flex items-center overflow-hidden rounded-lg py-6 transition-all duration-300`}
  >
    <Link
      href="#cta"
      className="flex w-full items-center justify-center gap-2 text-white uppercase"
    >
      Quero Começar
      <p
        className={`flex size-8 items-center justify-center rounded-full bg-black p-1 transition-all duration-300 group-hover:translate-x-1`}
      >
        <RocketIcon fill="#fff" />
      </p>
    </Link>
    <div className="absolute inset-0 -translate-x-full skew-x-12 animate-[shimmer_2s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/30 to-transparent" />
  </Button>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Componente de Logo reutilizável

  return (
    <header
      className={`z-50 mx-auto mb-10 flex w-full items-center justify-between bg-transparent px-8 transition-all duration-400 ease-in-out`}
    >
      <Logo scrolled={isScrolled} />

      {/* 2. Navegação Desktop (Centro) */}
      <nav className="hidden items-center space-x-6 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-foreground hover:text-primary text-sm font-medium uppercase transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* 3. CTA Desktop (Direita) */}
      <div className="hidden md:flex">
        <CtaButton scrolled={isScrolled} />
      </div>

      {/* 4. Menu Mobile (Sheet) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={isScrolled ? "h-8 w-8" : ""}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex flex-col overflow-y-auto px-6 py-4"
          >
            {/* Logo no topo do Sheet */}
            <div className="border-b pb-4">
              <Logo scrolled={false} />
            </div>

            {/* Links no Sheet */}
            <nav className="mt-6 flex flex-1 flex-col space-y-4">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.name}>
                  <Link
                    href={link.href}
                    className="text-foreground hover:text-primary text-lg font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            {/* CTA no final do Sheet */}
            <SheetClose asChild>
              <CtaButton scrolled={false} inSheet={true} />
            </SheetClose>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
