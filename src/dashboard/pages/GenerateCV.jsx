import { useMemo, useState } from "react";

function Icon({ name }) {
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

  if (name === "check") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </svg>
    );
  }

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

  if (name === "project") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M3.5 6.5h6l2 2h9v9.5h-17V6.5Z" />
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

  if (name === "file") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M6 3h9l3 3v15H6V3Z" />
        <path d="M15 3v4h4" />
      </svg>
    );
  }

  if (name === "sparkle") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
      </svg>
    );
  }

  return null;
}

function getExperiences(formData) {
  if (Array.isArray(formData?.experiences) && formData.experiences.length) {
    return formData.experiences;
  }

  if (formData?.experience?.jobTitle || formData?.experience?.companyName) {
    return [formData.experience];
  }

  return [];
}

function getProjects(formData) {
  if (Array.isArray(formData?.projectsList) && formData.projectsList.length) {
    return formData.projectsList;
  }

  if (formData?.projects?.title) {
    return [formData.projects];
  }

  return [];
}

function getLanguages(formData) {
  if (Array.isArray(formData?.languagesList) && formData.languagesList.length) {
    return formData.languagesList;
  }

  if (formData?.languages?.language) {
    return [formData.languages];
  }

  return [];
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("id-ID", {
    month: "short",
    year: "numeric",
  });
}

function GenerateCV({ formData, notify }) {
  const [fileName, setFileName] = useState("CAREVO_CV.pdf");

  const experiences = useMemo(() => getExperiences(formData), [formData]);
  const projects = useMemo(() => getProjects(formData), [formData]);
  const languages = useMemo(() => getLanguages(formData), [formData]);

  const cvStatus = {
    profile: true,
    experience: experiences.length > 0,
    projects: projects.length > 0,
    languages: languages.length > 0,
  };

  const [include, setInclude] = useState({
    profile: true,
    experience: true,
    projects: true,
    languages: true,
  });

  const profile = formData?.profile || formData?.profileInfo || {};

  const fullName =
    profile.fullName || profile.name || formData?.fullName || "CAREVO USER";

  const jobTitle =
    profile.jobTitle ||
    profile.title ||
    experiences[0]?.jobTitle ||
    "CAREER PROFILE";

  const email = profile.email || formData?.email || "email@example.com";
  const phone = profile.phone || "+62 812 0000 0000";
  const location = profile.location || "Indonesia";
  const summary =
    profile.summary ||
    "Saya adalah kandidat profesional yang memiliki pengalaman dan portofolio yang tersusun melalui CAREVO.";

  const toggleInclude = (key) => {
    if (!cvStatus[key]) return;

    setInclude((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getRowClass = (key) => {
    if (!cvStatus[key]) return "cv-check-row disabled";
    if (include[key]) return "cv-check-row selected";
    return "cv-check-row not-selected";
  };

  const handleDownloadPdf = () => {
    notify?.("success", "Download PDF", `${fileName} siap diproses.`);
    window.print();
  };

  const handleDownloadDocx = () => {
    notify?.("info", "Download DOCX", "Untuk sementara export DOCX masih berupa simulasi.");
  };

  return (
    <div className="generate-page">
      <div className="generate-header">
        <div>
          <h1>Generate CV</h1>
          <p>Preview and download your CV based on completed dashboard data.</p>
        </div>

        <div className="generate-header-actions">
          <button
            type="button"
            className="dash-outline-btn refresh-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Icon name="refresh" />
          </button>

          <button type="button" className="dash-outline-btn" onClick={handleDownloadDocx}>
            Download DOCX
          </button>

          <button type="button" className="dash-primary-btn" onClick={handleDownloadPdf}>
            Download PDF
          </button>
        </div>
      </div>

      <div className="generate-layout">
        <aside className="cv-control-panel">
          <section className="dash-edit-card">
            <h2>CV Content</h2>

            <div className="cv-check-list">
              <button type="button" className={getRowClass("profile")} onClick={() => toggleInclude("profile")}>
                <span>
                  <Icon name="user" />
                  Personal Info
                </span>
                <strong className={include.profile ? "check-on" : "check-off"}>
                  <Icon name={include.profile ? "check" : "x"} />
                </strong>
              </button>

              <button type="button" className={getRowClass("experience")} onClick={() => toggleInclude("experience")}>
                <span>
                  <Icon name="briefcase" />
                  Experience
                </span>
                <strong className={cvStatus.experience && include.experience ? "check-on" : "check-off"}>
                  <Icon name={cvStatus.experience && include.experience ? "check" : "x"} />
                </strong>
              </button>

              <button type="button" className={getRowClass("projects")} onClick={() => toggleInclude("projects")}>
                <span>
                  <Icon name="project" />
                  Projects
                </span>
                <strong className={cvStatus.projects && include.projects ? "check-on" : "check-off"}>
                  <Icon name={cvStatus.projects && include.projects ? "check" : "x"} />
                </strong>
              </button>

              <button type="button" className={getRowClass("languages")} onClick={() => toggleInclude("languages")}>
                <span>
                  <Icon name="language" />
                  Languages
                </span>
                <strong className={cvStatus.languages && include.languages ? "check-on" : "check-off"}>
                  <Icon name={cvStatus.languages && include.languages ? "check" : "x"} />
                </strong>
              </button>
            </div>

            <div className="cv-file-box">
              <label>Export File Name</label>
              <input
                type="text"
                value={fileName}
                placeholder="CAREVO_CV.pdf"
                onChange={(event) => setFileName(event.target.value)}
              />
              <p>Nama file bisa diketik dan disesuaikan sebelum export.</p>
            </div>

            <div className="ats-box">
              <div>
                <Icon name="file" />
              </div>

              <div>
                <strong>ATS Ready</strong>
                <p>This format is optimized for applicant tracking systems.</p>
              </div>
            </div>

            <div className="ats-box">
              <div>
                <Icon name="sparkle" />
              </div>

              <div>
                <strong>Auto-generated</strong>
                <p>Centang berarti muncul di CV. Silang berarti tidak dimasukkan.</p>
              </div>
            </div>
          </section>
        </aside>

        <section className="cv-preview">
          <div className="cv-paper" id="cv-paper">
            {include.profile && (
              <>
                <div className="cv-header">
                  <div>
                    <h1>{fullName}</h1>
                    <h3>{jobTitle}</h3>
                    <p>{phone}</p>
                    <p>{email}</p>
                    <p>{location}</p>
                  </div>

                  <div className="cv-photo">
                    <span>CV</span>
                  </div>
                </div>

                <hr />

                <section>
                  <h2>TENTANG SAYA</h2>
                  <p>{summary}</p>
                </section>
              </>
            )}

            {include.experience && cvStatus.experience && (
              <section>
                <h2>PENGALAMAN</h2>

                {experiences.map((item, index) => (
                  <div className="cv-item" key={`${item.jobTitle}-${index}`}>
                    <h4>
                      {formatDate(item.startDate)} -{" "}
                      {item.currentlyWork ? "Sekarang" : formatDate(item.endDate)}
                    </h4>
                    <strong>{item.jobTitle || "Job Title"}</strong>
                    <p>{item.companyName || item.company || "Company Name"}</p>
                    <p>{item.description || "Deskripsi pekerjaan belum diisi."}</p>
                  </div>
                ))}
              </section>
            )}

            {include.projects && cvStatus.projects && (
              <section>
                <h2>PROJECTS</h2>

                {projects.map((item, index) => (
                  <div className="cv-item" key={`${item.title}-${index}`}>
                    <strong>{item.title || "Project Title"}</strong>
                    <p>
                      {item.template || "Project"} • {item.status || "Status"}
                    </p>
                    <p>{item.role || "Role belum diisi."}</p>

                    {item.techStack?.length > 0 && (
                      <p>Tech Stack: {item.techStack.join(", ")}</p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {include.languages && cvStatus.languages && (
              <section>
                <h2>BAHASA</h2>

                <ul>
                  {languages.map((item, index) => (
                    <li key={`${item.language}-${index}`}>
                      {item.language} — {item.proficiency}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default GenerateCV;