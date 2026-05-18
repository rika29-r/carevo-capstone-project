import { useEffect, useState } from 'react';
import './dashboard.css';

import Overview from './pages/Overview';
import ProfileInfo from './pages/ProfileInfo';
import Education from './pages/Education';
import Skill from './pages/Skill';
import Language from './pages/Language';
import Certification from './pages/Certification';
import Experience from './pages/Experience';
import Project from './pages/Project';
import GenerateCV from './pages/GenerateCV';

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
  { id: 'profile', label: 'Personal Info', icon: 'user' },
  { id: 'experience', label: 'Experience', icon: 'briefcase' },
  { id: 'education', label: 'Education', icon: 'education' },
  { id: 'skill', label: 'Skills', icon: 'skill' },
  { id: 'project', label: 'Projects', icon: 'folder' },
  { id: 'certification', label: 'Certifications', icon: 'shield' },
  { id: 'language', label: 'Languages', icon: 'language' },
  { id: 'generate', label: 'Generate CV', icon: 'sparkle', group: 'AI TOOLS' },
];

function Icon({ name }) {
  if (name === 'dashboard') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10Z" />
        <path d="M13 21h8V11h-8v10Z" />
        <path d="M13 3v6h8V3h-8Z" />
        <path d="M3 21h8v-6H3v6Z" />
      </svg>
    );
  }

  if (name === 'user') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </svg>
    );
  }

  if (name === 'briefcase') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4c1 0 1.8.8 1.8 1.8V7" />
        <path d="M4 7h16v12H4V7Z" />
        <path d="M4 12h16" />
      </svg>
    );
  }

  if (name === 'education') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
        <path d="M7 11v5c1.3 1.4 3 2 5 2s3.7-.6 5-2v-5" />
      </svg>
    );
  }

  if (name === 'skill') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 3 14.2 8.4 20 9l-4.4 3.7 1.3 5.7L12 15.3 7.1 18.4l1.3-5.7L4 9l5.8-.6L12 3Z" />
      </svg>
    );
  }

  if (name === 'folder') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M3.5 6.5h6l2 2h9v9.5h-17V6.5Z" />
      </svg>
    );
  }

  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 3.5 18.5 6v5.4c0 4-2.6 7.5-6.5 8.8-3.9-1.3-6.5-4.8-6.5-8.8V6L12 3.5Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (name === 'language') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 5h10" />
        <path d="M9 5c-.3 4.6-2.1 7.9-5 10" />
        <path d="M6.5 9.5c1.2 2.1 3.1 4 5.5 5.5" />
        <path d="M14 20l4-9 4 9" />
        <path d="M15.5 17h5" />
      </svg>
    );
  }

  if (name === 'sparkle') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
        <path d="M5 15l.8 2.8L8.5 19l-2.7.8L5 22l-.8-2.2L1.5 19l2.7-1.2L5 15Z" />
      </svg>
    );
  }

  if (name === 'logout') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M10 5H5v14h5" />
        <path d="M14 8l4 4-4 4" />
        <path d="M18 12H9" />
      </svg>
    );
  }

  if (name === 'menu') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>
    );
  }

  if (name === 'bell') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    );
  }

  if (name === 'refresh') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M20 11a8 8 0 0 0-14.6-4.5L4 8" />
        <path d="M4 4v4h4" />
        <path d="M4 13a8 8 0 0 0 14.6 4.5L20 16" />
        <path d="M20 20v-4h-4" />
      </svg>
    );
  }

  if (name === 'trash') {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </svg>
    );
  }

  return null;
}

function DashboardPage({ formData, onLogout }) {
  const [activePage, setActivePage] = useState('overview');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardFormData, setDashboardFormData] = useState({
    personalInfo: {},
    experience: {},
    education: {},
    skills: {
      selectedSkills: [],
    },
    projects: {},
    certifications: {},
    languages: {},
  });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: Date.now(),
      type: 'info',
      title: 'Dashboard Opened',
      message: 'Data dari form sudah masuk ke dashboard CAREVO.',
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
    },
  ]);

  useEffect(() => {
    if (formData) {
      setDashboardFormData(formData);
    }
  }, [formData]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const notify = (type, title, message) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const openNotification = () => {
    setNotificationOpen((prev) => !prev);

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      })),
    );
  };

  const clearNotification = () => {
    setNotifications([]);
    setNotificationOpen(false);
  };

  const sharedProps = {
    formData: dashboardFormData,
    setFormData: setDashboardFormData,
    notify,
    setActivePage,
  };

  const renderPage = () => {
    if (activePage === 'overview') return <Overview {...sharedProps} />;
    if (activePage === 'profile') {
      return <ProfileInfo {...sharedProps} />;
    }
    if (activePage === 'education') return <Education {...sharedProps} />;
    if (activePage === 'skill') return <Skill {...sharedProps} />;
    if (activePage === 'language') return <Language {...sharedProps} />;
    if (activePage === 'certification') return <Certification {...sharedProps} />;
    if (activePage === 'experience') return <Experience {...sharedProps} />;
    if (activePage === 'project') return <Project {...sharedProps} />;
    if (activePage === 'generate') return <GenerateCV {...sharedProps} />;

    return <Overview {...sharedProps} />;
  };

  return (
    <div className={`dashboard-shell ${darkMode ? 'dark' : 'light'}`}>
      <button type="button" className={`dash-menu-btn ${sidebarOpen ? 'hide' : ''}`} onClick={() => setSidebarOpen(true)} aria-label="Open menu">
        <Icon name="menu" />
      </button>

      {sidebarOpen && <button type="button" className="dash-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />}

      <aside className={`dash-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="dash-brand">CAREVO</div>

        <nav className="dash-nav">
          {navItems.map((item, index) => (
            <div key={item.id}>
              {item.group && index > 0 && <p className="dash-nav-group">{item.group}</p>}

              <button
                type="button"
                className={`dash-nav-link ${activePage === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                  setNotificationOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>
                  <Icon name={item.icon} />
                </span>

                {item.label}
              </button>
            </div>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-dark-row">
            <span>Dark Mode</span>

            <button type="button" className={`dash-toggle ${darkMode ? 'active' : ''}`} onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
              <span />
            </button>
          </div>

          <button type="button" className="dash-logout" onClick={onLogout}>
            <Icon name="logout" />
            Log Out
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <div />

          <div className="dash-topbar-icons">
            <div className="dash-notif-wrap">
              <button type="button" aria-label="Notification" className={`dash-notif-btn ${notificationOpen ? 'active' : ''}`} onClick={openNotification}>
                <Icon name="bell" />

                {unreadCount > 0 && <span className="dash-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>

              {notificationOpen && (
                <div className="dash-notif-panel">
                  <div className="dash-notif-header">
                    <div>
                      <h3>Notifications</h3>
                      <p>Riwayat aktivitas dashboard</p>
                    </div>

                    {notifications.length > 0 && (
                      <button type="button" onClick={clearNotification}>
                        <Icon name="trash" />
                      </button>
                    )}
                  </div>

                  <div className="dash-notif-list">
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div className={`dash-notif-item notif-${item.type}`} key={item.id}>
                          <span />
                          <div>
                            <div className="dash-notif-title">
                              <strong>{item.title}</strong>
                              <small>{item.time}</small>
                            </div>

                            <p>{item.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="dash-notif-empty">
                        <strong>Belum ada notifikasi</strong>
                        <p>Riwayat save dan update akan muncul di sini.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button type="button" aria-label="Refresh" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Icon name="refresh" />
            </button>
          </div>
        </header>

        <section className="dash-content">{renderPage()}</section>

        <footer className="dash-footer">
          <p>© 2024 CAREVO. All rights reserved.</p>

          <div>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default DashboardPage;
