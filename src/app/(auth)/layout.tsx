import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import "./auth.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-layout">
      <section className="auth-brand">
        <div className="auth-brand-inner">
          <Logo light />
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
          <Logo />
        </div>
        <div className="auth-card">{children}</div>
      </section>
    </main>
  );
}
