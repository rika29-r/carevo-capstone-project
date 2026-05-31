
import React, { useState } from 'react';
import './auth.css';
import { authApi, setSession } from '../services/api';

function MailIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.8"/><path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function UserIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8"/><path d="M4.8 20.2c.8-3.6 3.4-5.5 7.2-5.5s6.4 1.9 7.2 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function LockIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M6 10.5h12v9H6v-9Z" stroke="currentColor" strokeWidth="1.8"/><path d="M12 14v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function ShieldIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M12 3.5 18 6v5.2c0 3.8-2.4 7.2-6 8.5-3.6-1.3-6-4.7-6-8.5V6l6-2.5Z" stroke="currentColor" strokeWidth="1.8"/><path d="m9.4 11.7 1.7 1.7 3.7-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function EyeIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" stroke="currentColor" strokeWidth="1.8"/><path d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.8"/></svg>;
}
function EyeOffIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M10.7 6.2c.4-.1.8-.1 1.3-.1 5.5 0 8.5 5 8.5 5a13 13 0 0 1-2.8 3.2M14.1 14.3A2.5 2.5 0 0 1 9.7 9.9M7.2 7.7C4.7 9.2 3.5 12 3.5 12s3 5 8.5 5c1.2 0 2.3-.2 3.2-.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function ArrowIcon() {
  return <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function AlertIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="M12 8v5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/><path d="M12 16.8v.1" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M10.4 4.7 2.9 17.6A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.4L13.6 4.7a1.85 1.85 0 0 0-3.2 0Z" stroke="currentColor" strokeWidth="1.9"/></svg>;
}

function AuthInput({ label, name, value, onChange, type = 'text', placeholder, icon, withEye = false }) {
  const [show, setShow] = useState(false);
  const realType = withEye ? (show ? 'text' : type) : type;
  return (
    <label className="auth-field">
      <span className="auth-label">{label}</span>
      <span className="auth-input-box">
        <span className="auth-input-icon">{icon}</span>
        <input name={name} value={value} onChange={onChange} type={realType} placeholder={placeholder} autoComplete="off" />
        {withEye && <button type="button" className="auth-eye-btn" onClick={() => setShow((state) => !state)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeIcon /> : <EyeOffIcon />}</button>}
      </span>
    </label>
  );
}

const initialForm = { fullName: '', email: '', password: '', confirmPassword: '', agree: false, remember: false };

export default function AuthPage({ mode = 'login', setMode, onBack, onAuthSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  const showToast = (type, title, message) => setToast({ type, title, message });
  const clearToastLater = () => setTimeout(() => setToast(null), 2300);

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => setForm(initialForm);
  const switchMode = () => {
    setToast(null);
    resetForm();
    setMode?.(isRegister ? 'login' : 'register');
  };

  const validateLogin = () => {
    if (!form.email.trim() || !form.password.trim()) {
      showToast('error', 'Data Belum Lengkap', 'Email dan password wajib diisi.');
      clearToastLater();
      return false;
    }
    if (form.password.length < 6) {
      showToast('error', 'Password Salah', 'Password minimal 6 karakter.');
      clearToastLater();
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      showToast('error', 'Data Belum Lengkap', 'Semua field wajib diisi terlebih dahulu.');
      clearToastLater();
      return false;
    }
    if (form.password.length < 6) {
      showToast('error', 'Password Salah', 'Password minimal 6 karakter.');
      clearToastLater();
      return false;
    }
    if (form.password !== form.confirmPassword) {
      showToast('error', 'Password Tidak Sesuai', 'Password dan confirm password harus sama.');
      clearToastLater();
      return false;
    }
    if (!form.agree) {
      showToast('error', 'Persetujuan Wajib', 'Centang Terms of Service terlebih dahulu.');
      clearToastLater();
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (isRegister) {
      if (!validateRegister()) return;
      try {
        setLoading(true);
        await authApi.register({ name: form.fullName, email: form.email, password: form.password });
        showToast('success', 'Register Berhasil', 'Akun berhasil dibuat. Silakan login.');
        setTimeout(() => {
          setToast(null);
          resetForm();
          setMode?.('login');
        }, 900);
      } catch (error) {
        showToast('error', 'Register Gagal', error.message);
        clearToastLater();
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!validateLogin()) return;
    try {
      setLoading(true);
      const result = await authApi.login({ email: form.email, password: form.password });
      setSession(result);
      showToast('success', 'Login Berhasil', 'Mengarahkan...');
      setTimeout(() => {
        setToast(null);
        resetForm();
        onAuthSuccess?.(result.user);
      }, 700);
    } catch (error) {
      showToast('error', 'Login Gagal', error.message);
      clearToastLater();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`auth-page ${isRegister ? 'register-page' : 'login-page'}`}>
      <div className="auth-orb auth-orb-left" />
      <div className="auth-orb auth-orb-right" />

      {toast && <div className={`auth-toast auth-toast-${toast.type}`}><span className="auth-toast-icon">{toast.type === 'success' ? <CheckIcon /> : <AlertIcon />}</span><div><strong>{toast.title}</strong><p>{toast.message}</p></div></div>}

      <section className="auth-shell">
        <button type="button" className="auth-brand" onClick={onBack}>CAREVO</button>
        <div className="auth-card">
          <div className="auth-heading">
            <h1>{isRegister ? 'Get Started Now' : 'Welcome Back'}</h1>
            <p>{isRegister ? 'Create your CAREVO account and start curating.' : 'Please enter your details to sign in'}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister && <AuthInput label="Full Name" name="fullName" value={form.fullName} onChange={updateForm} placeholder="John Doe" icon={<UserIcon />} />}
            <AuthInput label="Email Address" name="email" value={form.email} onChange={updateForm} type="email" placeholder={isRegister ? 'john@carevo.ai' : 'name@company.com'} icon={<MailIcon />} />

            {isRegister ? (
              <div className="auth-two-cols">
                <AuthInput label="Password" name="password" value={form.password} onChange={updateForm} type="password" placeholder="••••••" icon={<LockIcon />} withEye />
                <AuthInput label="Confirm" name="confirmPassword" value={form.confirmPassword} onChange={updateForm} type="password" placeholder="••••••" icon={<ShieldIcon />} withEye />
              </div>
            ) : (
              <div className="auth-forgot-wrap">
                <AuthInput label="Password" name="password" value={form.password} onChange={updateForm} type="password" placeholder="••••••" icon={<LockIcon />} withEye />
                <button type="button" className="forgot-btn">Forgot?</button>
              </div>
            )}

            <label className="auth-check">
              <input type="checkbox" name={isRegister ? 'agree' : 'remember'} checked={isRegister ? form.agree : form.remember} onChange={updateForm} />
              <span />
              <small>{isRegister ? <>I agree to the <button type="button">Terms of Service</button></> : 'Remember for 30 days'}</small>
            </label>

            <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Register' : <>Log In <ArrowIcon /></>}</button>

            <p className="auth-switch">{isRegister ? 'Already have an account?' : "Don't have an account?"} <button type="button" onClick={switchMode}>{isRegister ? 'Log In' : 'Register'}</button></p>
          </form>
        </div>
        <footer className="auth-footer"><p>© 2024 CAREVO Digital Curator. All rights reserved.</p><div><span>SECURE AUTHENTICATION</span><span>ENCRYPTED ACCESS</span></div></footer>
      </section>
    </main>
  );
}
