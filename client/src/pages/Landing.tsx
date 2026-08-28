import { Link } from "react-router-dom";
import "./landing.css";

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M8.5 8.5l-2-2M17.5 17.5l-2-2M8.5 15.5l-2 2M17.5 6.5l-2 2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: <UploadIcon />,
    title: "Upload anything",
    body: "Drop in lecture PDFs, Word docs, or CSV data sets straight from class — no reformatting required.",
  },
  {
    icon: <SparkleIcon />,
    title: "AI auto-organizes",
    body: "Claude reads every note, sorts it into the right course or category, tags it, and writes a quick summary.",
  },
  {
    icon: <SearchIcon />,
    title: "Study, don't sort",
    body: "Search across every class and reading in seconds, so exam week goes to studying — not filing.",
  },
];

export default function Landing() {
  return (
    <div className="landing">
      <header className="lp-nav">
        <div className="lp-nav__inner">
          <span className="lp-logo">🧠 AI Note Organizer</span>
          <nav className="lp-nav__links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </nav>
          <Link to="/app" className="btn-primary btn-sm">
            Get Started
          </Link>
        </div>
      </header>

      <main>
        <section className="lp-hero">
          <h1>Your class notes, organized by AI — not by you.</h1>
          <p className="lp-hero__sub">
            Upload lecture PDFs, docs, and spreadsheets. Claude sorts, tags, and
            summarizes everything automatically, so you can find what you need
            before the next exam, not after.
          </p>
          <div className="lp-hero__actions">
            <Link to="/app" className="btn-primary btn-lg">
              Get Started Free
            </Link>
            <a href="#features" className="btn-secondary btn-lg">
              Learn More
            </a>
          </div>
        </section>

        <section id="features" className="lp-features">
          <h2>Everything stays organized, automatically</h2>
          <div className="lp-features__grid">
            {FEATURES.map((f) => (
              <div className="lp-card" key={f.title}>
                <div className="lp-card__icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="lp-pricing">
          <h2>Simple pricing</h2>
          <p className="lp-section-sub">Free to use. Bring your own Claude API key.</p>
          <div className="lp-pricing__card">
            <span className="lp-pricing__tier">Student</span>
            <div className="lp-pricing__price">
              $0<span>/month</span>
            </div>
            <ul className="lp-pricing__list">
              <li>Unlimited notes, stored in your browser</li>
              <li>AI categorizing, tagging &amp; summaries</li>
              <li>Upload PDFs, docs &amp; CSVs</li>
              <li>Your data never leaves your control</li>
            </ul>
            <Link to="/app" className="btn-primary btn-block">
              Start Organizing
            </Link>
          </div>
        </section>

        <section id="about" className="lp-about">
          <h2>Built for how students actually take notes</h2>
          <p>
            Between lecture slides, reading PDFs, and scattered to-do lists,
            staying organized shouldn't be its own class. AI Note Organizer
            uses Claude to do the sorting for you — notes stay private in your
            browser, and nothing is shared beyond what you ask it to organize.
          </p>
        </section>

        <section className="lp-cta">
          <h2>Ready to get organized?</h2>
          <Link to="/app" className="btn-primary btn-lg">
            Get Started Free
          </Link>
        </section>
      </main>

      <footer className="lp-footer">
        <span>🧠 AI Note Organizer</span>
        <span className="lp-footer__muted">Notes stay in your browser. Organizing is powered by Claude.</span>
      </footer>
    </div>
  );
}
