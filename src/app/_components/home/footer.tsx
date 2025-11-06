import Link from "next/link";
import { Sparkles, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto w-full px-4 py-12 md:py-16 lg:max-w-7xl lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="lex items-center">
              <img src="/logo.svg" alt="LOGO SKAI" className="size-30" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Recomendações personalizadas de skincare impulsionadas por
              inteligência artificial.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Produtos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/produtos/serum-hialuronico"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sérum Hidratante
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos/gel-limpeza"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Gel de Limpeza
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos/protetor-solar"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Protetor Solar
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos/creme-retinol"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Creme Anti-idade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/termos"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Redes Sociais</h3>
            <div className="flex gap-3">
              <Link
                href="https://instagram.com"
                className="bg-muted hover:bg-accent flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://facebook.com"
                className="bg-muted hover:bg-accent flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="bg-muted hover:bg-accent flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
          <p>© 2025 SKAI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
