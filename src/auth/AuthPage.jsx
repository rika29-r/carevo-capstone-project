import React, { useState } from "react";
import "./auth.css";

const chromeIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCI+PGNpcmNsZSBjeD0iNjQuMTQ5IiBjeT0iNjQuMjM2IiByPSI2MC45OTkiIGZpbGw9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlPSIjZmZmIi8+PHBhdGggZmlsbC1vcGFjaXR5PSIwLjEiIGQ9Ik0xMDIuOTY2IDc1LjMyN2MwLTIxLjQzOS0xNy4zNzktMzguODE5LTM4LjgxNy0zOC44MTlzLTM4LjgxOCAxNy4zOC0zOC44MTggMzguODE5aDExLjA5YzAtMTUuMzE0IDEyLjQxNS0yNy43MjcgMjcuNzI3LTI3LjcyN3MyNy43MjcgMTIuNDEzIDI3LjcyNyAyNy43MjciLz48Y2lyY2xlIGN4PSI2Ni45MjIiIGN5PSI3MS45OTkiIHI9IjIxLjA3MiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48bGluZWFyR3JhZGllbnQgaWQ9IlNWRzYxSDBiakVEIiB4MT0iMzk1LjE5MSIgeDI9IjM5NS4xOTEiIHkxPSI0ODQuMTY4IiB5Mj0iNDg0LjcyMyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCg4MiAwIDAgODIgLTMyMzQxLjUgLTM5NjYwLjMxMykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM4MWI0ZTAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwYzVhOTQiLz48L2xpbmVhckdyYWRpZW50PjxjaXJjbGUgY3g9IjY0LjE0OSIgY3k9IjY0LjIzNSIgcj0iMjIuNzM2IiBmaWxsPSJ1cmwoI1NWRzYxSDBiakVEKSIvPjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHOEJ3N1JiRU0iIHgxPSItNjA4LjkxIiB4Mj0iLTYwOC45MSIgeTE9Ii01OTcuNjQ4IiB5Mj0iLTU0Ny4xODUiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjc1IDU5OS43NzUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZjA2YjU5Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZGYyMjI3Ii8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1NWRzhCdzdSYkVNKSIgZD0iTTExOS42MDIgMzYuNTA4QzEwNC4zMzYgNS43OTIgNjcuMDYtNi43MzIgMzYuMzQzIDguNTM0QTYyLjEgNjIuMSAwIDAgMCAxMi41NzggMjkuM2wyNC45NTUgNDMuMjUzYy00LjU5Ny0xNC42MDYgMy41MjEtMzAuMTc0IDE4LjEyNy0zNC43N2EyNy43IDI3LjcgMCAwIDEgNy45MzUtMS4yNzQiLz48bGluZWFyR3JhZGllbnQgaWQ9IlNWR29PUUh6YmdrIiB4MT0iLTY1Ny44MzUiIHgyPSItNjMyLjMyNyIgeTE9Ii00OTEuMzkzIiB5Mj0iLTUzMy41MzciIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjc1IDU5OS43NzUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMzg4YjQxIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNGNiNzQ5Ii8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1NWR29PUUh6YmdrKSIgZD0iTTEyLjU3OCAyOS4zYy0xOS4xIDI4LjQ5Mi0xMS40ODYgNjcuMDcxIDE3LjAwNSA4Ni4xNzFhNjIuMTMgNjIuMTMgMCAwIDAgMjkuNTc1IDEwLjMxOWwyNi4wNjMtNDQuMzYzYy05Ljc0NSAxMS44MTEtMjcuMjIgMTMuNDg2LTM5LjAzMiAzLjc0YTI3LjcgMjcuNyAwIDAgMS04LjY1Ny0xMi42MTMiLz48bGluZWFyR3JhZGllbnQgaWQ9IlNWR2d5ZVFOU3pxIiB4MT0iLTU3Mi4zODUiIHgyPSItNTk5LjU1NyIgeTE9Ii00ODYuOTEiIHkyPSItNTUyLjM0NSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSg2NzUgNTk5Ljc3NSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNlNGIwMjIiLz48c3RvcCBvZmZzZXQ9Ii4zIiBzdG9wLWNvbG9yPSIjZmNkMjA5Ii8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI1NWR2d5ZVFOU3pxKSIgZD0iTTU5LjE1OCAxMjUuNzkxYzM0LjIwNCAyLjU4NSA2NC4wMjctMjMuMDQ3IDY2LjYxMy01Ny4yNWE2Mi4xIDYyLjEgMCAwIDAtNi4xNy0zMi4wMzFINjMuNTk1YzE1LjMxMi4wNyAyNy42NyAxMi41NDEgMjcuNTk4IDI3Ljg1NGEyNy43MyAyNy43MyAwIDAgMS01Ljk3MiAxNy4wNjQiLz48bGluZWFyR3JhZGllbnQgaWQ9IlNWR3k4R2FiY3N2IiB4MT0iLTY0OS4zOTEiIHgyPSItNjQ5LjM5MSIgeTE9Ii01MjguODg1IiB5Mj0iLTU3My4yNDciIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjc1IDU5OS43NzUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLW9wYWNpdHk9IjAuMTUiLz48c3RvcCBvZmZzZXQ9Ii4zIiBzdG9wLW9wYWNpdHk9IjAuMDYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iMC4wMyIvPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggZmlsbD0idXJsKCNTVkd5OEdhYmNzdikiIGQ9Im0xMi41NzggMjkuM2wyNC45NTUgNDMuMjUzYTI3LjczIDI3LjczIDAgMCAxIDEuMTA3LTE4Ljg1NEwxMy42ODYgMjcuNjM2Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJTVkdad3RRRWJmVyIgeDE9Ii01ODguMTU4IiB4Mj0iLTYxOC42NTciIHkxPSItNTE0LjU1OSIgeTI9Ii00ODMuNTA1IiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDY3NSA1OTkuNzc1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1vcGFjaXR5PSIwLjE1Ii8+PHN0b3Agb2Zmc2V0PSIuMyIgc3RvcC1vcGFjaXR5PSIwLjA2Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAuMDMiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjU1ZHWnd0UUViZlcpIiBkPSJtNTkuMTU4IDEyNS43OTFsMjYuMDYzLTQ0LjM2M2EyNy43MyAyNy43MyAwIDAgMS0xNi4wODIgOS40MjZsLTExLjA5MSAzNC45MzciLz48bGluZWFyR3JhZGllbnQgaWQ9IlNWR0ZaTFJ3elVMIiB4MT0iLTU4OC42IiB4Mj0iLTU4NC4xNjMiIHkxPSItNTA1LjYyMSIgeTI9Ii01NDkuNDMxIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDY3NSA1OTkuNzc1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1vcGFjaXR5PSIwLjE1Ii8+PHN0b3Agb2Zmc2V0PSIuMyIgc3RvcC1vcGFjaXR5PSIwLjA2Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAuMDMiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjU1ZHRlpMUnd6VUwpIiBkPSJNMTE5LjYwMiAzNi41MDhINjMuNTk1YTI3LjczIDI3LjczIDAgMCAxIDIxLjYyNiAxMC41MzdsMzUuNDkxLTguODczIi8+PC9zdmc+";

const facebookIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCI+PHJlY3Qgd2lkdGg9IjExOC4zNSIgaGVpZ2h0PSIxMTguMzUiIHg9IjQuODMiIHk9IjQuODMiIGZpbGw9IiMzZDVhOTgiIHJ4PSI2LjUzIiByeT0iNi41MyIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2U9IiMzZDVhOTgiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNODYuNDggMTIzLjE3Vjc3LjM0aDE1LjM4bDIuMy0xNy44Nkg4Ni40OHYtMTEuNGMwLTUuMTcgMS40NC04LjcgOC44NS04LjdoOS40NnYtMTZBMTI3IDEyNyAwIDAgMCA5MSAyMi43Yy0xMy42MiAwLTIzIDguMy0yMyAyMy42MXYxMy4xN0g1Mi42MnYxNy44Nkg2OHY0NS44M3oiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlPSIjZmZmIi8+PC9zdmc+";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.8 20.2c.8-3.6 3.4-5.5 7.2-5.5s6.4 1.9 7.2 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 10.5h12v9H6v-9Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 14v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M12 3.5 18 6v5.2c0 3.8-2.4 7.2-6 8.5-3.6-1.3-6-4.7-6-8.5V6l6-2.5Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9.4 11.7 1.7 1.7 3.7-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.7 6.2c.4-.1.8-.1 1.3-.1 5.5 0 8.5 5 8.5 5a13 13 0 0 1-2.8 3.2M14.1 14.3A2.5 2.5 0 0 1 9.7 9.9M7.2 7.7C4.7 9.2 3.5 12 3.5 12s3 5 8.5 5c1.2 0 2.3-.2 3.2-.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <path d="M5 12h13M13 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="m5 12 4.2 4.2L19 6.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M12 8v5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 16.8v.1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M10.4 4.7 2.9 17.6A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.4L13.6 4.7a1.85 1.85 0 0 0-3.2 0Z" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function AuthInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  withEye = false,
}) {
  const [show, setShow] = useState(false);
  const realType = withEye ? (show ? "text" : type) : type;

  return (
    <label className="auth-field">
      <span className="auth-label">{label}</span>

      <span className="auth-input-box">
        <span className="auth-input-icon">{icon}</span>

        <input
          name={name}
          value={value}
          onChange={onChange}
          type={realType}
          placeholder={placeholder}
          autoComplete="off"
        />

        {withEye && (
          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setShow((state) => !state)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </span>
    </label>
  );
}

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
  remember: false,
};

export default function AuthPage({ mode = "login", setMode, onBack }) {
  const [form, setForm] = useState(initialForm);
  const [toast, setToast] = useState(null);
  const isRegister = mode === "register";

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  const clearToastLater = () => {
    setTimeout(() => setToast(null), 2200);
  };

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const switchMode = () => {
    setToast(null);
    resetForm();

    if (setMode) {
      setMode(isRegister ? "login" : "register");
    }
  };

  const validateLogin = () => {
    if (!form.email.trim() || !form.password.trim()) {
      showToast("error", "Data Belum Lengkap", "Email dan password wajib diisi.");
      clearToastLater();
      return false;
    }

    if (form.password.length < 6) {
      showToast("error", "Password Salah", "Password minimal 6 karakter.");
      clearToastLater();
      return false;
    }

    return true;
  };

  const validateRegister = () => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      showToast("error", "Data Belum Lengkap", "Semua field wajib diisi terlebih dahulu.");
      clearToastLater();
      return false;
    }

    if (form.password.length < 6) {
      showToast("error", "Password Salah", "Password minimal 6 karakter.");
      clearToastLater();
      return false;
    }

    if (form.password !== form.confirmPassword) {
      showToast("error", "Password Tidak Sesuai", "Password dan confirm password harus sama.");
      clearToastLater();
      return false;
    }

    if (!form.agree) {
      showToast("error", "Persetujuan Wajib", "Centang Terms of Service terlebih dahulu.");
      clearToastLater();
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isRegister) {
      if (!validateRegister()) return;

      showToast("success", "Register Berhasil", "Akun berhasil dibuat. Mengarahkan ke login...");

      setTimeout(() => {
        setToast(null);
        resetForm();

        if (setMode) {
          setMode("login");
        }
      }, 1700);

      return;
    }

    if (!validateLogin()) return;

    showToast("success", "Login Berhasil", "Data login sudah lengkap.");
    clearToastLater();
  };

  return (
    <main className={`auth-page ${isRegister ? "register-page" : "login-page"}`}>
      <div className="auth-orb auth-orb-left" />
      <div className="auth-orb auth-orb-right" />

      {toast && (
        <div className={`auth-toast auth-toast-${toast.type}`}>
          <span className="auth-toast-icon">
            {toast.type === "success" ? <CheckIcon /> : <AlertIcon />}
          </span>

          <div>
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      <section className="auth-shell">
        <button type="button" className="auth-brand" onClick={onBack}>
          CAREVO
        </button>

        <div className="auth-card">
          <div className="auth-heading">
            <h1>{isRegister ? "Get Started Now" : "Welcome Back"}</h1>
            <p>
              {isRegister
                ? "Create your CAREVO account and start curating."
                : "Please enter your details to sign in"}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <AuthInput
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={updateForm}
                placeholder="John Doe"
                icon={<UserIcon />}
              />
            )}

            <AuthInput
              label="Email Address"
              name="email"
              value={form.email}
              onChange={updateForm}
              type="email"
              placeholder={isRegister ? "john@carevo.ai" : "name@company.com"}
              icon={<MailIcon />}
            />

            {isRegister ? (
              <div className="auth-two-cols">
                <AuthInput
                  label="Password"
                  name="password"
                  value={form.password}
                  onChange={updateForm}
                  type="password"
                  placeholder="••••••"
                  icon={<LockIcon />}
                  withEye
                />

                <AuthInput
                  label="Confirm"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={updateForm}
                  type="password"
                  placeholder="••••••"
                  icon={<ShieldIcon />}
                  withEye
                />
              </div>
            ) : (
              <div className="auth-forgot-wrap">
                <AuthInput
                  label="Password"
                  name="password"
                  value={form.password}
                  onChange={updateForm}
                  type="password"
                  placeholder="••••••"
                  icon={<LockIcon />}
                  withEye
                />

                <button type="button" className="forgot-btn">
                  Forgot?
                </button>
              </div>
            )}

            <label className="auth-check">
              <input
                type="checkbox"
                name={isRegister ? "agree" : "remember"}
                checked={isRegister ? form.agree : form.remember}
                onChange={updateForm}
              />
              <span />
              <small>
                {isRegister ? (
                  <>
                    I agree to the <button type="button">Terms of Service</button>
                  </>
                ) : (
                  "Remember for 30 days"
                )}
              </small>
            </label>

            <button type="submit" className="auth-submit">
              {isRegister ? (
                "Register"
              ) : (
                <>
                  Log In <ArrowIcon />
                </>
              )}
            </button>

            {!isRegister && (
              <>
                <div className="auth-divider">
                  <span />
                  <p>OR CONTINUE WITH</p>
                  <span />
                </div>

                <div className="auth-social-grid">
                  <button type="button" className="auth-social-btn">
                    <img src={chromeIcon} alt="Chrome" />
                    Chrome
                  </button>

                  <button type="button" className="auth-social-btn">
                    <img src={facebookIcon} alt="Facebook" />
                    Facebook
                  </button>
                </div>
              </>
            )}

            <p className="auth-switch">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" onClick={switchMode}>
                {isRegister ? "Log In" : "Register"}
              </button>
            </p>
          </form>
        </div>

        <footer className="auth-footer">
          <p>© 2024 CAREVO Digital Curator. All rights reserved.</p>
          <div>
            <span>SECURE AUTHENTICATION</span>
            <span>ENCRYPTED ACCESS</span>
          </div>
        </footer>
      </section>
    </main>
  );
}