import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="calculator-entry" id="main-content" tabIndex={-1}>
      <Link className="back-link" href="/">
        Back to all calculators
      </Link>
      <section className="calculator-entry__panel">
        <div className="calculator-entry__hero">
          <p className="landing-badge">404</p>
          <h1>Page not found</h1>
          <p className="hero-copy">
            This page does not exist. Head back to the homepage to explore the available calculators.
          </p>
          <Link className="button button--primary" href="/">
            Go to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
