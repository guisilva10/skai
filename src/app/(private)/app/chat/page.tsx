"use client";

import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { IconSparkles, IconArrowLeft } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="mx-auto flex h-[calc(100vh-100px)] max-w-3xl flex-col items-center justify-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="flex flex-col items-center p-8 text-center sm:p-12">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
            <IconSparkles size={40} />
          </div>

          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Em Breve
          </h1>

          <p className="text-muted-foreground mb-8 max-w-md text-lg">
            Estamos preparando uma experiência incrível! Em breve, você terá uma
            assistente virtual exclusiva para tirar todas as suas dúvidas e
            acompanhar sua jornada de skincare.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" size="lg">
              <Link href="/app">
                <IconArrowLeft className="mr-2 size-5" />
                Voltar ao Início
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Link href="/app/catalog">Ver Catálogo</Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
