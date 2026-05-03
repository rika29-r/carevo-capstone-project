import { useState } from "react";
import "./form.css";

import ExperienceForm from "./steps/ExperienceForm";
import ProjectForm from "./steps/ProjectForm";
import LanguageForm from "./steps/LanguageForm";

const steps = [
  { id: "personalInfo", label: "Personal Info", icon: "user" },
  { id: "experience", label: "Experience", icon: "briefcase" },
  { id: "education", label: "Education", icon: "education" },
  { id: "skills", label: "Skills", icon: "skill" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "certifications", label: "Certifications", icon: "shield" },
  { id: "languages", label: "Languages", icon: "language" },
];

const initialFormData = {
  experience: {
    jobTitle: "",
    companyName: "",
    employmentType: "Full-time",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWork: false,
    description: "",
    skillsUsed: [],
    skillInput: "",
  },
  projects: {
    thumbnail: "",
    thumbnailName: "",
    template: "Web App",
    title: "",
    status: "In Progress",
    role: "",
    startDate: "",
    endDate: "",
    demoUrl: "",
    githubUrl: "",
    featured: true,
    techStack: [],
    techInput: "",
  },
  languages: {
    language: "",
    proficiency: "Professional Working",
    yearStarted: "",
    usageFrequency: "Daily",
  },
};

function Icon({ name }) {
  if (name === "user") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </svg>
    );
  }

  if (name === "briefcase") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4c1 0 1.8.8 1.8 1.8V7" />
        <path d="M4 7h16v12H4V7Z" />
        <path d="M4 12h16" />
      </svg>
    );
  }

  if (name === "education") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
        <path d="M7 11v5c1.3 1.4 3 2 5 2s3.7-.6 5-2v-5" />
      </svg>
    );
  }

  if (name === "skill") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 3 14.2 8.4 20 9l-4.4 3.7 1.3 5.7L12 15.3 7.1 18.4l1.3-5.7L4 9l5.8-.6L12 3Z" />
      </svg>
    );
  }

  if (name === "folder") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M3.5 6.5h6l2 2h9v9.5h-17V6.5Z" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 3.5 18.5 6v5.4c0 4-2.6 7.5-6.5 8.8-3.9-1.3-6.5-4.8-6.5-8.8V6L12 3.5Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (name === "language") {
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

  if (name === "logout") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M10 5H5v14h5" />
        <path d="M14 8l4 4-4 4" />
        <path d="M18 12H9" />
      </svg>
    );
  }

  if (name === "menu") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>
    );
  }

  if (name === "refresh") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M20 11a8 8 0 0 0-14.6-4.5L4 8" />
        <path d="M4 4v4h4" />
        <path d="M4 13a8 8 0 0 0 14.6 4.5L20 16" />
        <path d="M20 20v-4h-4" />
      </svg>
    );
  }

  if (name === "bell") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    );
  }

  if (name === "trash") {
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

function Notice({ notice, onClose }) {
  if (!notice) return null;

  return (
    <div className="custom-notice-layer">
      <div className={`custom-notice custom-notice-${notice.type}`}>
        <div className="notice-icon">{notice.type === "success" ? "✓" : "!"}</div>

        <div className="notice-content">
          <h3>{notice.title}</h3>
          <p>{notice.message}</p>
        </div>

        <button type="button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

function FormPage({ onLogout, onFinish }) {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: Date.now(),
      type: "info",
      title: "Form CAREVO Dibuka",
      message: "Mulai lengkapi data kamu dari step Experience.",
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    },
  ]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const currentStep = steps[activeStep];

  const unreadCount = notifications.filter((item) => !item.read).length;

  const addNotification = (type, title, message) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const showNotice = (type, title, message) => {
    setNotice({ type, title, message });
    addNotification(type, title, message);
  };

  const openNotificationPanel = () => {
    setNotificationOpen((prev) => !prev);

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationOpen(false);
  };

  const validateExperience = () => {
    const data = formData.experience;

    if (!data.jobTitle.trim()) {
      showNotice("error", "Data Belum Lengkap", "Job Title wajib diisi.");
      return false;
    }

    if (!data.companyName.trim()) {
      showNotice("error", "Data Belum Lengkap", "Company Name wajib diisi.");
      return false;
    }

    if (!data.location.trim()) {
      showNotice("error", "Data Belum Lengkap", "Location wajib diisi.");
      return false;
    }

    if (!data.startDate) {
      showNotice("error", "Data Belum Lengkap", "Start Date wajib dipilih.");
      return false;
    }

    if (!data.currentlyWork && !data.endDate) {
      showNotice("error", "Data Belum Lengkap", "End Date wajib dipilih.");
      return false;
    }

    if (!data.description.trim()) {
      showNotice("error", "Data Belum Lengkap", "Description wajib diisi.");
      return false;
    }

    return true;
  };

  const validateProject = () => {
    const data = formData.projects;

    if (!data.thumbnail) {
      showNotice("error", "Data Belum Lengkap", "Project thumbnail wajib diupload.");
      return false;
    }

    if (!data.title.trim()) {
      showNotice("error", "Data Belum Lengkap", "Project Title wajib diisi.");
      return false;
    }

    if (!data.role.trim()) {
      showNotice("error", "Data Belum Lengkap", "Team / Role wajib diisi.");
      return false;
    }

    if (!data.startDate) {
      showNotice("error", "Data Belum Lengkap", "Start Date project wajib dipilih.");
      return false;
    }

    if (!data.endDate) {
      showNotice("error", "Data Belum Lengkap", "End Date project wajib dipilih.");
      return false;
    }

    if (!data.demoUrl.trim()) {
      showNotice("error", "Data Belum Lengkap", "Demo URL wajib diisi.");
      return false;
    }

    if (!data.githubUrl.trim()) {
      showNotice("error", "Data Belum Lengkap", "Github Repository wajib diisi.");
      return false;
    }

    return true;
  };

  const validateLanguage = () => {
    const data = formData.languages;

    if (!data.language.trim()) {
      showNotice("error", "Data Belum Lengkap", "Language wajib diisi.");
      return false;
    }

    if (!data.yearStarted) {
      showNotice("error", "Data Belum Lengkap", "Year Started wajib dipilih.");
      return false;
    }

    return true;
  };

  const validateCurrentStep = () => {
    if (currentStep.id === "experience") return validateExperience();
    if (currentStep.id === "projects") return validateProject();
    if (currentStep.id === "languages") return validateLanguage();

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (
      currentStep.id === "experience" ||
      currentStep.id === "projects" ||
      currentStep.id === "languages"
    ) {
      addNotification(
        "success",
        `${currentStep.label} Tersimpan`,
        `Data ${currentStep.label} berhasil diisi dan disimpan sementara.`
      );
    }

    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      setSidebarOpen(false);
      setNotificationOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    showNotice(
      "success",
      "Form Selesai",
      "Data berhasil disimpan dan siap dipakai untuk generate CV."
    );

    onFinish?.(formData);
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setSidebarOpen(false);
      setNotificationOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (index) => {
    setActiveStep(index);
    setSidebarOpen(false);
    setNotificationOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    addNotification(
      "info",
      "Halaman Disegarkan",
      `Kamu masih berada di step ${currentStep.label}.`
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setFormData(initialFormData);
    setActiveStep(1);
    setNotice(null);
    setSidebarOpen(false);
    setNotificationOpen(false);
    onLogout?.();
  };

  const renderStepContent = () => {
    if (currentStep.id === "experience") {
      return (
        <ExperienceForm
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      );
    }

    if (currentStep.id === "projects") {
      return (
        <ProjectForm
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      );
    }

    if (currentStep.id === "languages") {
      return (
        <LanguageForm
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      );
    }

    return (
      <div className="form-card empty-step-card">
        <h2>{currentStep.label}</h2>
        <p>
          Bagian ini dibuat oleh anggota tim lain. Untuk sementara, kamu bisa
          lanjut ke step berikutnya.
        </p>

        <div className="form-bottom-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePrevious}
            disabled={activeStep === 0}
          >
            Previous
          </button>

          <button type="button" className="btn-primary" onClick={handleNext}>
            Next Step
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`carevo-form ${darkMode ? "dark" : "light"}`}>
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <button
        className={`mobile-menu-btn ${sidebarOpen ? "hide-mobile-menu-btn" : ""}`}
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside className={`form-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="brand">CAREVO</div>

        <nav className="side-nav">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              className={`side-link ${activeStep === index ? "active" : ""}`}
              onClick={() => goToStep(index)}
            >
              <span className="side-icon">
                <Icon name={step.icon} />
              </span>
              <span>{step.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="dark-toggle-row">
            <span>Dark Mode</span>

            <button
              type="button"
              className={`toggle ${darkMode ? "active" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              <span />
            </button>
          </div>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            <Icon name="logout" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="form-main">
        <header className="form-topbar">
          <div />

          <div className="topbar-icons">
            <button
              type="button"
              className="topbar-icon-btn"
              aria-label="Refresh"
              onClick={handleRefresh}
            >
              <Icon name="refresh" />
            </button>

            <div className="notification-wrap">
              <button
                type="button"
                className={`topbar-icon-btn notification-btn ${
                  notificationOpen ? "active" : ""
                }`}
                aria-label="Notification"
                onClick={openNotificationPanel}
              >
                <Icon name="bell" />

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="notification-panel">
                  <div className="notification-header">
                    <div>
                      <h3>Notifications</h3>
                      <p>Riwayat aktivitas form kamu</p>
                    </div>

                    {notifications.length > 0 && (
                      <button
                        type="button"
                        className="clear-notification-btn"
                        onClick={clearNotifications}
                        aria-label="Clear notifications"
                      >
                        <Icon name="trash" />
                      </button>
                    )}
                  </div>

                  <div className="notification-list">
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div
                          className={`notification-item notification-${item.type}`}
                          key={item.id}
                        >
                          <span className="notification-dot" />

                          <div className="notification-text">
                            <div className="notification-title-row">
                              <strong>{item.title}</strong>
                              <small>{item.time}</small>
                            </div>

                            <p>{item.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="notification-empty">
                        <strong>Belum ada notifikasi</strong>
                        <p>Riwayat pemberitahuan akan muncul di sini.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="form-content">
          <div className="page-heading">
            <div>
              <h1>{currentStep.label} Information</h1>
              <p>
                Lengkapi data kamu step by step untuk membantu proses pembuatan CV.
              </p>
            </div>
          </div>

          <div className="step-progress">
            {steps.map((step, index) => (
              <div className="step-item" key={step.id}>
                <button
                  type="button"
                  className={`step-circle ${index < activeStep ? "done" : ""} ${
                    index === activeStep ? "active" : ""
                  }`}
                  onClick={() => goToStep(index)}
                >
                  {index < activeStep ? "✓" : index + 1}
                </button>

                <span className={`step-label ${index <= activeStep ? "active" : ""}`}>
                  {step.label}
                </span>

                {index !== steps.length - 1 && <span className="step-line" />}
              </div>
            ))}
          </div>

          {renderStepContent()}
        </section>
      </main>
    </div>
  );
}

export default FormPage;