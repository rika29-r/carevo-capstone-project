import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import AuthPage from "./auth/AuthPage";

const instagramIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBzdHJva2UtZGFzaGFycmF5PSI2NiIgZD0iTTE2IDNjMi43NiAwIDUgMi4yNCA1IDV2OGMwIDIuNzYgLTIuMjQgNSAtNSA1aC04Yy0yLjc2IDAgLTUgLTIuMjQgLTUgLTV2LThjMCAtMi43NiAyLjI0IC01IDUgLTVoNFoiPjxhbmltYXRlIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGR1cj0iMC42cyIgdmFsdWVzPSI2NjswIi8+PC9wYXRoPjxwYXRoIHN0cm9rZS1kYXNoYXJyYXk9IjI4IiBzdHJva2UtZGFzaG9mZnNldD0iMjgiIGQ9Ik0xMiA4YzIuMjEgMCA0IDEuNzkgNCA0YzAgMi4yMSAtMS43OSA0IC00IDRjLTIuMjEgMCAtNCAtMS43OSAtNCAtNGMwIC0yLjIxIDEuNzkgLTQgNCAtNCI+PGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgYmVnaW49IjAuN3MiIGR1cj0iMC42cyIgdG89IjAiLz48L3BhdGg+PC9nPjxjaXJjbGUgY3g9IjE3IiBjeT0iNyIgcj0iMS41IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwIj48YW5pbWF0ZSBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGJlZ2luPSIxLjNzIiBkdXI9IjAuMnMiIHRvPSIxIi8+PC9jaXJjbGU+PC9zdmc+";

const futureJobIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05Ljg4MiAxOS42MzhhNi41OCA2LjU4IDAgMSAwIDAtMTMuMTYyYTYuNTggNi41OCAwIDAgMCAwIDEzLjE2Mm0wIC4zMDFhNi44ODIgNi44ODIgMCAxIDAgMC0xMy43NjRhNi44ODIgNi44ODIgMCAwIDAgMCAxMy43NjQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZT0iI2ZmZiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik00LjM3NiAxMS42M2MuMTU5LS4xMzMuNDA4LS4yMjMuNzItLjA3Yy4xOTYuMTA2LjQ2Ni4zMDIuNzMuNTAzYy41My4zOTcgMS4wNi43OTUgMS4wNi4zOTdjMC0uNTk4LjktLjU5OCAxLjIgMGMuMTI4LjI1NC4wOS40NS4wNTQuNjY3Yy0uMDQ4LjI5Mi0uMS42MS4yNDMgMS4xMjhjLjM1LjUxOS4zOTIgMS41MzUuNDMgMi4zMDNjLjAyNi41NjEuMDQ3Ljk5LjE2OS45OWMuMzAxIDAgMS4yMDEtMS40OTggMS40OTgtMi4wOTZjLjMwMS0uNTk5LjMwMS0xLjE5NyAwLTEuNDkzYTggOCAwIDAgMS0uMzQ0LS4zOTJjLS40MDgtLjQ3Ny0xLjAwNi0xLjE4Ni0xLjQ1LTEuNDA4Yy0uNi0uMjk3LS42LTEuMTk3IDAtMS40OTNjLjE0Mi0uMDc0LjMzMy0uMTQzLjUyOS0uMjEyYy42NTYtLjI0OSAxLjQyNC0uNTMuOTY4LS45ODVjLS4zMTctLjMxNy0uOTY4LS40NjUtMS40NjYtLjU4MmMtLjQ0NS0uMTA2LS43NzMtLjE3NS0uNjM1LS4zMTdjLjE2NC0uMTYuMjQzLS41OTkuMjgtLjk5YTUuNyA1LjcgMCAwIDAtMy45ODYgNC4wNTV6bTkuNDY1LTIuNjQ4YTUuNjY0IDUuNjY0IDAgMCAxLS4zOCA4LjQ5MmMtLjEzOS0uMTgtLjE1LS41MDMuMDEtLjgyNmMuMzAyLS41OTggMC0yLjA5MS0uMjk3LTIuOTkxYy0uMTg1LS41NTYtLjQ4Ny0uNTQtLjgzNi0uNTE0Yy0uMjEyLjAxMS0uNDM0LjAyNy0uNjYyLS4wODRjLS41OTgtLjMwMiAwLTEuMTk3LjU5OC0xLjhjLjQ0LS40MzQuNTU2LS43MS43MDQtMS4wNTljLjE3Ny0uNDc0LjQ3NS0uODk0Ljg2My0xLjIxOCIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZT0iI2ZmZiIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTkuODgyIDE4LjU3NGE1LjUxNyA1LjUxNyAwIDEgMCAwLTExLjAzM2E1LjUxNyA1LjUxNyAwIDAgMCAwIDExLjAzM20wIC4zMDdhNS44MjMgNS44MjMgMCAxIDAgMC0xMS42NDZhNS44MjMgNS44MjMgMCAwIDAgMCAxMS42NDciIGNsaXAtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZT0iI2ZmZiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik00LjYwNCAxOC4xNzdjMS42OTQgMS42MjUgMy41MiAxLjg0MiA0LjIzIDEuNzQ3Yy0zLjYyNy02LjA1NiAyLjcxNi0xMC4wODUgNi4zNDItMTEuMzQ1di0uMjg2Yy04Ljk0Ny43LTEwLjc3MyA2Ljg4Mi0xMC41NzIgOS44ODQiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2U9IiNmZmYiLz48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNi42MTYgNS44MzZoLS43NDJhLjEyLjEyIDAgMCAwLS4wODQuMDM3bC0xLjExMiAxLjMwOGMtLjA4LjA5LjAxNi4yMjIuMTI3LjE4bC44NTgtLjMzOWEuMTMuMTMgMCAwIDEgLjE2OS4xMDZjLjA3NC42NTYuNTk4Ljg5NS45NzQuOTQ4Yy4wOC4wMS4xMzguMDk1LjEwNi4xNjlsLS4zOTIuOTUzYy0uMDM3LjA5NS4wNzQuMTkuMTY0LjEzOGwxLjY3My0uOTMyYS4xMS4xMSAwIDAgMCAuMDU4LS4xdi0uN2MwLS4wNTIuMDMyLS4wOS4wOC0uMTA1YzEuNzEtLjY3MyAyLjM3MS0yLjM4MyAyLjUwNC0zLjI1YS4xMS4xMSAwIDAgMC0uMDU0LS4xMWEuMS4xIDAgMCAwLS4wNDItLjAxM2MtMi40MDMtLjM4LTMuNzU4LjktNC4xODIgMS42NDdhLjEyLjEyIDAgMCAxLS4xMDUuMDYzbTIuNzk1LS4xOWEuNTMuNTMgMCAxIDAgMC0xLjA2YS41My41MyAwIDAgMCAwIDEuMDYiIGNsaXAtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZT0iI2ZmZiIvPjwvc3ZnPg==";

const skillIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48ZGVmcz48bWFzayBpZD0iU1ZHR1N1SXdlTnkiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iNCI+PHBhdGggZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNDQgNUg0djEyaDQweiIvPjxwYXRoIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJtNCA0MS4wM2wxMi4xNzYtMTIuM2w2LjU3OSA2LjNMMzAuNzk4IDI3bDQuNDggNC4zNjgiLz48cGF0aCBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTQ0IDE2LjE3MnYyNm0tNDAtMjZ2MTRNMTMuMDE2IDQzSDQ0Ii8+PHBhdGggc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0xNyAxMWgyMW0tMjgtLjAwM2gxIi8+PC9nPjwvbWFzaz48L2RlZnM+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGg0OHY0OEgweiIgbWFzaz0idXJsKCNTVkdHU3VJd2VOeSkiLz48L3N2Zz4=";

const aiCareerIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJtMjAuNzEzIDcuMTI4bC0uMjQ2LjU2NmEuNTA2LjUwNiAwIDAgMS0uOTM0IDBsLS4yNDYtLjU2NmE0LjM2IDQuMzYgMCAwIDAtMi4yMi0yLjI1bC0uNzU5LS4zMzlhLjUzLjUzIDAgMCAxIDAtLjk2M2wuNzE3LS4zMTlBNC4zNyA0LjM3IDAgMCAwIDE5LjI3Ni45MzFMMTkuNTMuMzJhLjUwNi41MDYgMCAwIDEgLjk0MiAwbC4yNTMuNjFhNC4zNyA0LjM3IDAgMCAwIDIuMjUgMi4zMjdsLjcxOC4zMmEuNTMuNTMgMCAwIDEgMCAuOTYybC0uNzYuMzM4YTQuMzYgNC4zNiAwIDAgMC0yLjIxOSAyLjI1MU05IDJhOCA4IDAgMCAxIDcuOTM0IDYuOTY1bDIuMjUgMy41MzljLjE0OC4yMzMuMTE4LjU4LS4yMjUuNzI4TDE3IDE0LjA3VjE3YTIgMiAwIDAgMS0yIDJoLTEuOTk5TDEzIDIySDR2LTMuNjk0YzAtMS4xOC0uNDM2LTIuMjk3LTEuMjQ0LTMuMzA1QTggOCAwIDAgMSA5IDJtMCAyYTYgNiAwIDAgMC00LjY4NCA5Ljc1QzUuNDEgMTUuMTE0IDYgMTYuNjY3IDYgMTguMzA2VjIwaDVsLjAwMi0zSDE1di00LjI0OGwxLjU1LS42NjRsLTEuNTQzLTIuNDI1bC0uMDU3LS40NDJBNiA2IDAgMCAwIDkgNG0xMC40OSAxMi45OTNsMS42NjQgMS4xMUExMC45NSAxMC45NSAwIDAgMCAyMyAxMnEtLjAwMS0xLjAyNS0uMTgxLTJsLTEuOTQzLjVxLjEyMy43MzMuMTI0IDEuNWE4Ljk2IDguOTYgMCAwIDEtMS41MSA0Ljk5MyIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZT0iI2ZmZiIvPjwvc3ZnPg==";

const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it Works" },
];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState("dark");

  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    document.body.className = theme === "light" ? "theme-light" : "theme-dark";
  }, [theme]);

  useEffect(() => {
    const ids = ["home", "about", "features", "how-it-works"];

    const onScroll = () => {
      if (page !== "home") return;

      const current = ids
        .map((id) => ({
          id,
          top: document.getElementById(id)?.getBoundingClientRect().top ?? 9999,
        }))
        .filter((section) => section.top <= 140)
        .pop();

      if (current) setActive(current.id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  const goTo = (id) => {
    setPage("home");
    setActive(id);
    setIsOpen(false);

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const openLogin = () => {
    setActive("login");
    setAuthMode("login");
    setPage("auth");
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openRegister = () => {
    setActive("start");
    setAuthMode("register");
    setPage("auth");
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToHome = () => {
    setPage("home");
    setActive("home");
    setIsOpen(false);

    setTimeout(() => {
      document.getElementById("home")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  if (page === "auth") {
    return (
      <AuthPage
        mode={authMode}
        setMode={setAuthMode}
        onBack={backToHome}
      />
    );
  }

  return (
    <main className="site-wrapper">
      <Navbar
        active={active}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        goTo={goTo}
        theme={theme}
        setTheme={setTheme}
        openLogin={openLogin}
        openRegister={openRegister}
      />

      <Hero />
      <Stats />
      <WhyCarevo />
      <HowItWorks />
      <CTA openRegister={openRegister} />
      <Footer />
    </main>
  );
}

function Navbar({
  active,
  isOpen,
  setIsOpen,
  goTo,
  theme,
  setTheme,
  openLogin,
  openRegister,
}) {
  return (
    <header className="main-header fixed-top">
      <nav className="navbar py-0">
        <div className="container-fluid nav-inner px-4 px-lg-5">
          <button
            type="button"
            onClick={() => goTo("home")}
            className="navbar-brand brand-btn mb-0"
          >
            CAREVO
          </button>

          <div className="desktop-nav d-none d-lg-flex align-items-center justify-content-center gap-4">
            {navLinks.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => goTo(item.id)}
                className={`nav-btn ${active === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="desktop-actions d-none d-lg-flex align-items-center gap-3">
            <ThemeToggle theme={theme} setTheme={setTheme} />

            <button
              type="button"
              onClick={openLogin}
              className={`login-btn ${active === "login" ? "active-action" : ""}`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={openRegister}
              className={`start-btn ${active === "start" ? "active-action" : ""}`}
            >
              Start Now
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className={`hamburger-btn d-lg-none ${isOpen ? "is-open" : ""}`}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu d-lg-none ${isOpen ? "show" : ""}`}>
        <div className="mobile-menu-card text-center">
          {navLinks.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => goTo(item.id)}
              className={`mobile-nav-btn ${active === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}

          <div className="mobile-divider" />

          <div className="d-flex justify-content-center my-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>

          <button
            type="button"
            onClick={openLogin}
            className={`mobile-nav-btn bordered ${
              active === "login" ? "active" : ""
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={openRegister}
            className={`mobile-nav-btn filled ${
              active === "start" ? "active" : ""
            }`}
          >
            Start Now
          </button>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle({ theme, setTheme }) {
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className={`theme-toggle ${isLight ? "light" : "dark"}`}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <span className="theme-text">{isLight ? "Light" : "Dark"}</span>
      <span className="theme-circle">
        {isLight ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}

function Hero() {
  return (
    <section id="home" className="hero-section position-relative overflow-hidden">
      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />

      <div className="container-fluid px-4 px-lg-5 position-relative">
        <div className="row align-items-center hero-row gy-5">
          <div className="col-lg-6">
            <div className="ai-badge mb-4">
              <SparkleIcon />
              <span>AI-Powered Career Mapping</span>
            </div>

            <h1 className="hero-title">
              Find The Right <br />
              <span className="career-word">Career</span>{" "}
              <span className="path-word">Path</span> With <br />
              AI
            </h1>

            <p className="hero-text mt-4">
              Analyze your skills, interests, and work preferences to discover
              your future-ready career with precision-tuned algorithms.
            </p>

            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 hero-actions mt-4">
              <button type="button" className="primary-hero-btn">
                Start Assessment
              </button>
              <button type="button" className="secondary-hero-btn">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <CareerCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function CareerCard() {
  const bars = [46, 73, 54, 65, 62];
  const darkTops = [22, 26, 16, 28, 0];

  return (
    <div className="career-card-wrap ms-lg-auto mx-auto">
      <article className="career-card">
        <div className="d-flex justify-content-between align-items-start gap-3 career-head">
          <div className="d-flex align-items-center gap-3">
            <div className="profile-icon">
              <UserIcon />
            </div>

            <div>
              <h2 className="career-name mb-1">Product Manager</h2>
              <p className="career-sub mb-0">Strategic &amp; Analytical</p>
            </div>
          </div>

          <div className="score-box text-end">
            <p className="score mb-1">94%</p>
            <p className="score-label mb-0">Match Score</p>
          </div>
        </div>

        <div className="chart-box">
          {bars.map((height, index) => (
            <div key={index} className="bar-track">
              <div className="chart-bar" style={{ height: `${height}%` }}>
                {darkTops[index] > 0 && (
                  <span
                    className="bar-top"
                    style={{ height: `${darkTops[index]}%` }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="card-info-grid mt-4">
          <div className="info-pill">
            <p className="info-label mb-1">Top Skill</p>
            <p className="info-value mb-0">Strategy</p>
          </div>

          <div className="info-pill">
            <p className="info-label mb-1">Growth</p>
            <p className="info-value green mb-0">+24% YoY</p>
          </div>
        </div>
      </article>

      <div className="trend-card">
        <div className="d-flex align-items-center gap-3">
          <div className="trend-icon">
            <TrendIcon />
          </div>

          <div>
            <p className="trend-label mb-1">Future Trend</p>
            <p className="trend-value mb-0">High Demand</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const items = [
    ["500k+", "Active Members"],
    ["92%", "Placement Rate"],
    ["24/7", "AI Mentorship"],
    ["150+", "Fortune 500 Partners"],
  ];

  return (
    <section className="stats-section py-5">
      <div className="container px-4 text-center">
        <div className="row g-4">
          {items.map(([number, label], index) => (
            <div className="col-6 col-lg-3" key={label}>
              <p className={`stats-number tone-${index} mb-2`}>{number}</p>
              <p className="stats-label mb-0">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyCarevo() {
  const cards = [
    [
      aiCareerIcon,
      "AI Career Matching",
      "Deep learning models analyze thousands of data points to match your personality with the perfect role.",
    ],
    [
      skillIcon,
      "Skill Analysis",
      "Identify your core strengths and uncover hidden talents you didn't know were professionally valuable.",
    ],
    [
      futureJobIcon,
      "Future Job Trends",
      "Stay ahead of the curve with real-time labor market data and emerging role projections for the next decade.",
    ],
  ];

  return (
    <section id="about" className="about-section section-space">
      <SectionTitle
        title="Why CAREVO?"
        subtitle="Precision engineering meets human psychology. Our system decodes your professional DNA."
      />

      <div className="container-fluid px-4 px-lg-5 mt-5">
        <div className="row g-4">
          {cards.map(([icon, title, text], index) => (
            <div className="col-md-4" key={title}>
              <article className="feature-card h-100">
                <div className={`feature-icon icon-tone-${index} mb-4`}>
                  <img src={icon} alt="" />
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-text mt-3 mb-0">{text}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    [
      "01",
      "Build Your Profile",
      "Tell us about your background, skills, and career goals. Build your profile from scratch in minutes.",
    ],
    [
      "02",
      "Answer Questions",
      "Complete a short assessment to identify your strengths through questions designed by experts.",
    ],
    [
      "03",
      "AI Analysis",
      "Our AI matches your profile with the best career paths and processes your unique professional signature.",
    ],
    [
      "04",
      "Get Results",
      "Receive a tailored career roadmap with personalized career recommendations instantly.",
    ],
  ];

  return (
    <section id="how-it-works" className="works-section section-space">
      <SectionTitle
        title="How It Works"
        subtitle="Your path to success in four simple steps."
      />

      <div
        id="features"
        className="container-fluid px-4 px-lg-5 mt-5 scroll-anchor"
      >
        <div className="row g-3 g-xl-4 align-items-end">
          {steps.map(([number, title, text], index) => (
            <div className="col-md-6 col-xl-3" key={number}>
              <article className={`step-card h-100 ${index % 2 ? "alt" : ""}`}>
                <span className="step-number">{number}</span>
                <div className="step-content">
                  <h3 className="step-title">{title}</h3>
                  <p className="step-text mb-0">{text}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ openRegister }) {
  return (
    <section className="cta-section text-center px-4">
      <h2 className="cta-title mx-auto">Ready to master your future?</h2>

      <p className="cta-text mx-auto mt-4">
        Join the elite network of professionals using CareVo AI to dictate their
        worth in the modern economy.
      </p>

      <button type="button" onClick={openRegister} className="cta-button mt-4">
        Create Free Account
      </button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer-section py-4">
      <div className="container-fluid px-4 px-lg-5">
        <div className="row g-4 align-items-start">
          <div className="col-lg-5">
            <h3 className="footer-brand">CAREVO</h3>
            <p className="footer-text mb-0">
              AI-powered platform helping people find the right future career
              path.
            </p>
          </div>

          <div className="col-6 col-lg-1">
            <FooterColumn
              title="About"
              items={["About Us", "Our Mission", "Features"]}
            />
          </div>

          <div className="col-6 col-lg-2">
            <FooterColumn
              title="Features"
              items={["Career Match", "Skill Analysis", "Future Jobs"]}
            />
          </div>

          <div className="col-lg-2">
            <h4 className="footer-title">Contact</h4>
            <p className="footer-text mb-0">
              support@carevo.com
              <br />
              +62 812 xxxx xxxx
              <br />
              Indonesia
            </p>
          </div>

          <div className="col-lg-2">
            <div className="socials d-flex gap-3">
              <span>f</span>
              <span>𝕏</span>
              <img src={instagramIcon} alt="Instagram" />
              <span>in</span>
            </div>
            <p className="footer-text mt-4 mb-0">
              © 2025 CAREVO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <h4 className="footer-title">{title}</h4>
      <ul className="list-unstyled footer-text mt-3 mb-0">
        {items.map((item) => (
          <li className="mb-1" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="section-title mx-auto text-center px-4">
      <h2>{title}</h2>
      <p className="mt-3 mb-0">{subtitle}</p>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"
        fill="currentColor"
      />
      <path
        d="M5 15l.8 3 3.2.9-3.2.8L5 23l-.9-3.3L1 19l3.1-1L5 15Z"
        fill="currentColor"
        opacity=".8"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="currentColor" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0H4.5Z" fill="currentColor" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 16.5 9.2 11l3.7 3.3L20 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 7h5v5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 15.4A8.7 8.7 0 0 1 8.6 3a8.8 8.8 0 1 0 12.4 12.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 17.2A5.2 5.2 0 1 0 12 6.8a5.2 5.2 0 0 0 0 10.4Z"
        fill="currentColor"
      />
      <path
        d="M12 2v2.4M12 19.6V22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2 12h2.4M19.6 12H22M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

createRoot(document.getElementById("root")).render(<App />);