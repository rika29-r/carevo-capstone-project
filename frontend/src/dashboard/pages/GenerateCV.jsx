import { useEffect, useMemo, useState } from "react";
import { cvApi } from "../../services/api";

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

  if (name === "education") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="m3 8.5 9-4 9 4-9 4-9-4Z" />
        <path d="M7 11v4.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V11" />
      </svg>
    );
  }

  if (name === "skill") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 3l2.6 5.3 5.9.8-4.2 4.1 1 5.8L12 16.3 6.7 19l1-5.8L3.5 9.1l5.9-.8L12 3Z" />
      </svg>
    );
  }

  if (name === "certificate") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M5 4h14v11H5V4Z" />
        <path d="M8 8h8" />
        <path d="M8 11h5" />
        <path d="m9 15-1 5 4-2 4 2-1-5" />
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

const hasText = (value) => String(value || "").trim().length > 0;

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function getProfile(formData) {
  return (
    formData?.personalInfo ||
    formData?.profile ||
    formData?.profileInfo ||
    {}
  );
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

function getEducation(formData) {
  if (Array.isArray(formData?.educations) && formData.educations.length) {
    return formData.educations;
  }

  if (Array.isArray(formData?.educationList) && formData.educationList.length) {
    return formData.educationList;
  }

  if (
    formData?.education?.schoolName ||
    formData?.education?.institution ||
    formData?.education?.degree ||
    formData?.education?.fieldOfStudy
  ) {
    return [formData.education];
  }

  return [];
}

function getSkills(formData) {
  const skillsData = formData?.skills || formData?.skill || {};
  const raw = [
    ...asArray(formData?.skillList),
    ...asArray(formData?.skillsList),
    ...(Array.isArray(skillsData) ? skillsData : []),
    ...asArray(skillsData?.selectedSkills),
    ...asArray(skillsData?.skills),
    ...asArray(skillsData?.customSkills),
    ...asArray(formData?.selectedSkills),
  ];

  const seen = new Set();
  return raw.map((item) => {
    const name = typeof item === 'string' ? item : (item?.name || item?.skillName || item?.title || '');
    return {
      name,
      category: item?.category || skillsData?.category || skillsData?.skillCategory || 'General',
      proficiency: item?.level || item?.proficiency || skillsData?.proficiency || skillsData?.proficiencyLevel || 'Basic',
    };
  }).filter((item) => {
    const key = String(item.name || '').trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getCertifications(formData) {
  if (Array.isArray(formData?.certifications) && formData.certifications.length) {
    return formData.certifications;
  }

  if (Array.isArray(formData?.certificationList) && formData.certificationList.length) {
    return formData.certificationList;
  }

  if (
    formData?.certification?.name ||
    formData?.certification?.certificationName ||
    formData?.certification?.issuingOrganization
  ) {
    return [formData.certification];
  }

  return [];
}

function getProjects(formData) {
  if (Array.isArray(formData?.projectsList) && formData.projectsList.length) {
    return formData.projectsList;
  }

  if (Array.isArray(formData?.projects) && formData.projects.length) {
    return formData.projects;
  }

  if (formData?.projects?.title) {
    return [formData.projects];
  }

  if (formData?.project?.title) {
    return [formData.project];
  }

  return [];
}

function getLanguages(formData) {
  if (Array.isArray(formData?.languagesList) && formData.languagesList.length) {
    return formData.languagesList;
  }

  if (Array.isArray(formData?.languages) && formData.languages.length) {
    return formData.languages;
  }

  if (formData?.languages?.language) {
    return [formData.languages];
  }

  if (formData?.language?.language) {
    return [formData.language];
  }

  return [];
}


function getDefaultAvatar(name = "CAREVO") {
  const initials = String(name || "CV")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "CV";

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#93c5fd"/>
          <stop offset="1" stop-color="#a78bfa"/>
        </linearGradient>
      </defs>
      <rect width="600" height="600" rx="70" fill="url(#g)"/>
      <circle cx="300" cy="235" r="92" fill="#ffffff" opacity="0.92"/>
      <path d="M130 520c25-105 95-160 170-160s145 55 170 160" fill="#ffffff" opacity="0.92"/>
      <text x="300" y="575" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#1e293b">${initials}</text>
    </svg>
  `)}`;
}

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("id-ID", {
    month: "short",
    year: "numeric",
  });
}

function formatRange(startDate, endDate, currentLabel) {
  const start = formatDate(startDate);
  const end = currentLabel || formatDate(endDate);

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return end;
  return "Periode belum diisi";
}

function skillListText(value) {
  const list = Array.isArray(value) ? value : value ? [value] : [];

  return list
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") return String(item);
      return (
        item?.name ||
        item?.skillName ||
        item?.title ||
        item?.label ||
        item?.value ||
        ""
      );
    })
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .join(", ");
}

function GenerateCV({ formData, notify, aiRecommendation }) {
  const [fileName, setFileName] = useState("CAREVO_CV.pdf");
  const [latestFormData, setLatestFormData] = useState(formData || {});
  const [loadingLatest, setLoadingLatest] = useState(false);

  const loadLatestCvData = async () => {
    try {
      setLoadingLatest(true);
      const data = await cvApi.data();
      setLatestFormData(data);
      notify?.("success", "Data CV diperbarui", "Preview mengambil data terbaru dari backend.");
    } catch (error) {
      setLatestFormData(formData || {});
      notify?.("error", "Gagal mengambil data CV", error.message);
    } finally {
      setLoadingLatest(false);
    }
  };

  useEffect(() => {
    setLatestFormData(formData || {});
    loadLatestCvData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const refresh = () => loadLatestCvData();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formSource = latestFormData || formData || {};

  const profile = useMemo(() => getProfile(formSource), [formSource]);
  const experiences = useMemo(() => getExperiences(formSource), [formSource]);
  const education = useMemo(() => getEducation(formSource), [formSource]);
  const skills = useMemo(() => getSkills(formSource), [formSource]);
  const certifications = useMemo(() => getCertifications(formSource), [formSource]);
  const projects = useMemo(() => getProjects(formSource), [formSource]);
  const languages = useMemo(() => getLanguages(formSource), [formSource]);

  const fullName =
    profile.fullName || profile.name || formSource?.fullName || "CAREVO USER";

  // CV harus mengikuti Headline/Professional Title terbaru dari profile.
  // careerInterest biasanya berisi kategori AI, jadi posisinya dibuat fallback saja.
  const careerInterest =
    profile.professionalTitle ||
    profile.headline ||
    profile.jobTitle ||
    profile.title ||
    profile.careerInterest ||
    experiences[0]?.jobTitle ||
    "CAREER PROFILE";

  const email = profile.email || formSource?.email || "";
  const phone = profile.phone || formSource?.phone || "";
  const location = profile.location || formSource?.location || "Indonesia";
  const summary =
    profile.shortBio ||
    profile.summary ||
    profile.bio ||
    "Saya adalah kandidat profesional yang memiliki pengalaman, pendidikan, kemampuan, portofolio, sertifikasi, dan bahasa yang tersusun melalui CAREVO.";

  const cvStatus = {
    profile: hasText(fullName) || hasText(careerInterest) || hasText(summary),
    experience: experiences.length > 0,
    education: education.length > 0,
    skills: skills.length > 0,
    projects: projects.length > 0,
    certifications: certifications.length > 0,
    languages: languages.length > 0,
  };

  const [include, setInclude] = useState({
    profile: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
  });

  const sectionRows = [
    { key: "profile", label: "Personal Info", icon: "user" },
    { key: "experience", label: "Experience", icon: "briefcase" },
    { key: "education", label: "Education", icon: "education" },
    { key: "skills", label: "Skills", icon: "skill" },
    { key: "projects", label: "Projects", icon: "project" },
    { key: "certifications", label: "Certifications", icon: "certificate" },
    { key: "languages", label: "Languages", icon: "language" },
  ];

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

  const selectedSections = () => ({
    personalInfo: include.profile,
    profile: include.profile,
    experience: include.experience,
    education: include.education,
    skills: include.skills,
    projects: include.projects,
    certifications: include.certifications,
    languages: include.languages,
  });

  const handleDownloadPdf = async () => {
    try {
      await cvApi.generatePdf({ fileName, sections: selectedSections() });
      notify?.("success", "Download PDF", `${fileName} dibuat dari data terbaru backend.`);
    } catch (error) {
      notify?.("error", "Download PDF gagal", error.message);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      await cvApi.generateDocx({ fileName: fileName.replace(/\.pdf$/i, ".docx"), sections: selectedSections() });
      notify?.("success", "Download DOCX", "File DOCX dibuat dari data terbaru backend.");
    } catch (error) {
      notify?.("error", "Download DOCX gagal", error.message);
    }
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
            onClick={loadLatestCvData}
            disabled={loadingLatest}
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
              {sectionRows.map((section) => (
                <button
                  type="button"
                  className={getRowClass(section.key)}
                  onClick={() => toggleInclude(section.key)}
                  key={section.key}
                >
                  <span>
                    <Icon name={section.icon} />
                    {section.label}
                  </span>
                  <strong className={cvStatus[section.key] && include[section.key] ? "check-on" : "check-off"}>
                    <Icon name={cvStatus[section.key] && include[section.key] ? "check" : "x"} />
                  </strong>
                </button>
              ))}
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
            {include.profile && cvStatus.profile && (
              <>
                <div className="cv-header">
                  <div>
                    <h1>{fullName}</h1>
                    <h3>{careerInterest}</h3>
                    {phone ? <p>{phone}</p> : null}
                    {email ? <p>{email}</p> : null}
                    {location ? <p>{location}</p> : null}
                  </div>

                  <div className="cv-photo">
                    <img
                      src={profile.profileImage || getDefaultAvatar(fullName)}
                      alt={fullName}
                      onError={(event) => {
                        event.currentTarget.src = getDefaultAvatar(fullName);
                      }}
                    />
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
                  <div className="cv-item" key={`${item.jobTitle || "experience"}-${index}`}>
                    <h4>
                      {formatRange(
                        item.startDate,
                        item.endDate,
                        item.currentlyWork ? "Sekarang" : ""
                      )}
                    </h4>
                    <strong>{item.jobTitle || "Job Title"}</strong>
                    <p>{item.companyName || item.company || "Company Name"}</p>
                    {item.employmentType && <p>{item.employmentType}</p>}
                    {item.location && <p>{item.location}</p>}
                    <p>{item.description || "Deskripsi pekerjaan belum diisi."}</p>
                    {skillListText(item.skillsUsed) && (
                      <p>Skills: {skillListText(item.skillsUsed)}</p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {include.education && cvStatus.education && (
              <section>
                <h2>PENDIDIKAN</h2>

                {education.map((item, index) => (
                  <div className="cv-item" key={`${item.schoolName || item.institution || "education"}-${index}`}>
                    <h4>
                      {formatRange(
                        item.startDate,
                        item.endDate,
                        item.currentlyStudy ? "Sekarang" : ""
                      )}
                    </h4>
                    <strong>{item.schoolName || item.institutionName || item.institution || "Institution"}</strong>
                    <p>
                      {[item.degreeMajor || item.degree, item.fieldOfStudy || item.major]
                        .filter(hasText)
                        .join(" • ") || "Degree belum diisi"}
                    </p>
                    {item.location && <p>{item.location}</p>}
                    {(item.gpa || item.grade) && <p>GPA / Grade: {item.gpa || item.grade}</p>}
                    {item.description && <p>{item.description}</p>}
                  </div>
                ))}
              </section>
            )}

            {include.skills && cvStatus.skills && (
              <section>
                <h2>SKILLS</h2>

                <ul>
                  {skills.map((item, index) => {
                    const skillName = typeof item === "string" ? item : item.name || item.skillName || item.title;
                    const skillMeta = typeof item === "string" ? "" : [item.category, item.proficiency || item.level].filter(hasText).join(" • ");

                    return (
                      <li key={`${skillName}-${index}`}>
                        {skillName}
                        {skillMeta ? ` — ${skillMeta}` : ""}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {include.projects && cvStatus.projects && (
              <section>
                <h2>PROJECTS</h2>

                {projects.map((item, index) => (
                  <div className="cv-item" key={`${item.title || "project"}-${index}`}>
                    <h4>
                      {formatRange(item.startDate, item.endDate, "")}
                    </h4>
                    <strong>{item.title || "Project Title"}</strong>
                    <p>
                      {[item.role, item.status].filter(hasText).join(" • ") || "Project"}
                    </p>
                    <p>{item.description || "Deskripsi project belum diisi."}</p>
                    {item.demoUrl && <p>Demo: {item.demoUrl}</p>}
                    {item.githubUrl && <p>GitHub: {item.githubUrl}</p>}
                    {item.projectUrl && <p>Project URL: {item.projectUrl}</p>}
                  </div>
                ))}
              </section>
            )}

            {include.certifications && cvStatus.certifications && (
              <section>
                <h2>SERTIFIKASI</h2>

                {certifications.map((item, index) => (
                  <div className="cv-item" key={`${item.name || item.certificationName || "certification"}-${index}`}>
                    <h4>{formatDate(item.issueDate || item.date)}</h4>
                    <strong>{item.certificateName || item.name || item.certificationName || "Certification Name"}</strong>
                    <p>{item.issuer || item.issuingOrganization || item.organization || "Issuing Organization"}</p>
                    {item.credentialId && <p>Credential ID: {item.credentialId}</p>}
                    {item.credentialUrl && <p>Credential URL: {item.credentialUrl}</p>}
                    {item.description && <p>{item.description}</p>}
                  </div>
                ))}
              </section>
            )}

            {include.languages && cvStatus.languages && (
              <section>
                <h2>BAHASA</h2>

                <ul>
                  {languages.map((item, index) => (
                    <li key={`${item.language || "language"}-${index}`}>
                      {item.language || "Language"} — {item.proficiency || "Proficiency"}
                      {item.usageFrequency ? ` • ${item.usageFrequency}` : ""}
                      {item.yearStarted ? ` • Since ${item.yearStarted}` : ""}
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
