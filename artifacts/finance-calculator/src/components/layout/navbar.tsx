import { Link } from "wouter";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Navbar() {
  return (
    <header className="site-navbar">
      <div className="site-navbar__inner">
        <Link className="site-navbar__brand" href="/">
          India Money Toolkit
        </Link>
        <nav className="site-navbar__nav" aria-label="Primary">
          <Link className="site-navbar__link" href="/">
            Calculators
          </Link>
          <Link className="site-navbar__link" href="/about">
            About
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
