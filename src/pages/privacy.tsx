import { Link } from "wouter";
import { PageMeta } from "@/components/primitives/page-meta";

export default function PrivacyPage() {
  return (
    <main className="calculator-entry" id="main-content" tabIndex={-1}>
      <PageMeta
        title="Privacy | India Money Toolkit"
        description="India Money Toolkit does not require an account and does not send your inputs to any server."
      />
      <Link className="back-link" href="/">Back to calculators</Link>
      <section className="calculator-entry__panel">
        <div className="calculator-entry__hero">
          <p className="landing-badge">Privacy</p>
          <h1>Privacy Policy</h1>
          <p className="hero-copy">Short version: no account, no server, no data collection.</p>
        </div>
      </section>
      <section className="calculator-entry__panel">
        <div style={{ maxWidth: "640px", lineHeight: 1.8 }}>
          <h2 style={{ marginBottom: "0.75rem" }}>No account required</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            India Money Toolkit does not require you to create an account, sign in, or provide any personal information to use any calculator.
          </p>
          <h2 style={{ marginBottom: "0.75rem" }}>Your inputs stay on your device</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Calculator inputs are processed entirely in your browser. They are not sent to any server owned or operated by this project. No financial data you enter is transmitted, stored remotely, or shared with third parties.
          </p>
          <h2 style={{ marginBottom: "0.75rem" }}>Local browser storage</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Your recent calculator inputs and preferences (such as theme choice) may be saved in your browser's local storage to improve convenience on return visits. This data never leaves your device. You can clear it at any time by clearing your browser's site data or local storage for this site.
          </p>
          <h2 style={{ marginBottom: "0.75rem" }}>Analytics</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            This site does not currently use any analytics or tracking scripts.
          </p>
          <p>
            <Link href="/about" style={{ color: "var(--accent, #4f8ef7)" }}>About</Link>
            {" · "}
            <Link href="/disclaimer" style={{ color: "var(--accent, #4f8ef7)" }}>Disclaimer</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
