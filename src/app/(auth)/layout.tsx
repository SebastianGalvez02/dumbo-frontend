import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import "./auth.css";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-layout">
      <section className="auth-brand">
        <div className="auth-brand-inner">
          <Link href="/" className="logo-link" aria-label="Ir al catálogo">
            <Logo light />
          </Link>
          <div className="auth-statement">
            <p className="eyebrow light">Compra simple. Gestión inteligente.</p>
            <h1>Todo lo que necesitas, más cerca.</h1>
            <p>Una experiencia ágil para comprar, administrar y hacer crecer nuestro supermercado.</p>
          </div>
          <div className="auth-metrics">
            <div><strong>24 h</strong><span>disponibilidad</span></div>
            <div><strong>100%</strong><span>compra segura</span></div>
          </div>
        </div>
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />
      </section>

      <section className="auth-panel">
        <div className="mobile-logo">
          <Link href="/" className="logo-link" aria-label="Ir al catálogo">
            <Logo />
          </Link>
        </div>
        <div className="auth-card">{children}</div>
      </section>
    </main>
  );
}
