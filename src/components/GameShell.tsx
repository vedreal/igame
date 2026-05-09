import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";
import { PixiBackground } from "./PixiBackground";

export function GameShell({ children, title, back }: { children: ReactNode; title?: string; back?: boolean }) {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden">
      <PixiBackground />
      {title && (
        <header className="relative z-10 flex items-center gap-3 px-5 pt-5 pb-3">
          {back && (
            <Link
              to="/"
              className="grid h-10 w-10 place-items-center rounded-full bg-card-magic glass-border text-foreground active:scale-95 transition"
              aria-label="Back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </Link>
          )}
          <h1 className="text-xl font-bold text-magic-gradient">{title}</h1>
        </header>
      )}
      {children}
    </main>
  );
}
