"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Card } from "@/app/_components/ui/card";
import { IconSend, IconSparkles, IconUser } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Olá! 👋 Sou sua assistente especializada em skincare. Pode me fazer qualquer pergunta sobre cuidados com a pele, produtos, rotinas ou dúvidas específicas. Como posso te ajudar hoje?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Erro ao obter resposta");

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro no chat:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-250px)] max-w-5xl flex-col px-4 pt-6 pb-20 sm:px-6">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Chat de Skincare
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Tire suas dúvidas sobre cuidados com a pele com nossa IA especializada
        </p>
      </div>

      {/* Messages Container */}
      <Card className="mb-4 flex-1 overflow-hidden">
        <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[85%] gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-primary text-white"
                        : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                    }`}
                  >
                    {message.role === "user" ? (
                      <IconUser size={18} />
                    ) : (
                      <IconSparkles size={18} />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap sm:text-base">
                      {message.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex justify-start"
            >
              <div className="flex max-w-[85%] gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <IconSparkles size={18} />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                    <div className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                    <div className="size-2 animate-bounce rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua pergunta sobre skincare..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          size="icon"
          className="shrink-0"
        >
          <IconSend size={20} />
        </Button>
      </form>
    </div>
  );
}
