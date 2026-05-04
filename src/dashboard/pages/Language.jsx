import { useMemo, useState } from "react";

const languageOptions = [
  { name: "English", countryCode: "us" },
  { name: "Indonesian", countryCode: "id" },
  { name: "Mandarin Chinese", countryCode: "cn" },
  { name: "Japanese", countryCode: "jp" },
  { name: "Korean", countryCode: "kr" },
  { name: "Spanish", countryCode: "es" },
  { name: "French", countryCode: "fr" },
  { name: "Arabic", countryCode: "sa" },
  { name: "German", countryCode: "de" },
  { name: "Dutch", countryCode: "nl" },
  { name: "Portuguese", countryCode: "pt" },
  { name: "Italian", countryCode: "it" },
  { name: "Russian", countryCode: "ru" },
  { name: "Thai", countryCode: "th" },
  { name: "Vietnamese", countryCode: "vn" },
  { name: "Malay", countryCode: "my" },
  { name: "Hindi", countryCode: "in" },
  { name: "Turkish", countryCode: "tr" },
  { name: "Filipino", countryCode: "ph" },
  { name: "Bengali", countryCode: "bd" },
  { name: "Urdu", countryCode: "pk" },
  { name: "Persian", countryCode: "ir" },
  { name: "Swahili", countryCode: "tz" },
  { name: "Polish", countryCode: "pl" },
  { name: "Ukrainian", countryCode: "ua" },
  { name: "Greek", countryCode: "gr" },
  { name: "Hebrew", countryCode: "il" },
  { name: "Czech", countryCode: "cz" },
  { name: "Swedish", countryCode: "se" },
  { name: "Norwegian", countryCode: "no" },
  { name: "Danish", countryCode: "dk" },
  { name: "Finnish", countryCode: "fi" },
  { name: "Acehnese", countryCode: "id" },
  { name: "Balinese", countryCode: "id" },
  { name: "Banjar", countryCode: "id" },
  { name: "Batak", countryCode: "id" },
  { name: "Betawi", countryCode: "id" },
  { name: "Buginese", countryCode: "id" },
  { name: "Madurese", countryCode: "id" },
  { name: "Minangkabau", countryCode: "id" },
  { name: "Sasak", countryCode: "id" },
];

const emptyLanguage = {
  language: "",
  proficiency: "Professional Working",
  yearStarted: "",
  usageFrequency: "Daily",
};

function getFlagUrl(languageName) {
  const selectedLanguage = languageOptions.find(
    (item) => item.name.toLowerCase() === languageName?.trim().toLowerCase()
  );

  const countryCode = selectedLanguage?.countryCode;

  if (!countryCode) {
    return "https://cdn-icons-png.flaticon.com/512/841/841364.png";
  }

  return `https://flagcdn.com/w80/${countryCode}.png`;
}

function Icon({ name }) {
  if (name === "plus") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (name === "save") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M5 4h12l2 2v14H5V4Z" />
        <path d="M8 4v6h8V4" />
        <path d="M8 20v-6h8v6" />
      </svg>
    );
  }

  if (name === "close") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
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

  if (name === "edit") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
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

  if (name === "star") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 3 14.2 8.4 20 9l-4.4 3.7 1.3 5.7L12 15.3 7.1 18.4l1.3-5.7L4 9l5.8-.6L12 3Z" />
      </svg>
    );
  }

  if (name === "chart") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 3 5-7" />
      </svg>
    );
  }

  if (name === "trophy") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M5 6H3v2a4 4 0 0 0 4 4" />
        <path d="M19 6h2v2a4 4 0 0 1-4 4" />
      </svg>
    );
  }

  if (name === "chevron") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  }

  return null;
}

function Notice({ notice, onClose }) {
  if (!notice) return null;

  return (
    <div className="dash-popup-layer">
      <div className={`dash-popup dash-popup-${notice.type}`}>
        <div className="dash-popup-icon">
          {notice.type === "success" ? "✓" : "!"}
        </div>

        <div>
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

function createLanguageList(formData) {
  if (Array.isArray(formData?.languagesList) && formData.languagesList.length > 0) {
    return formData.languagesList;
  }

  if (formData?.languages?.language) {
    return [formData.languages];
  }

  return [];
}

function getPercent(proficiency) {
  if (proficiency === "Native Speaker") return 100;
  if (proficiency === "Professional Working") return 90;
  if (proficiency === "Fluent") return 80;
  if (proficiency === "Advanced") return 65;
  if (proficiency === "Intermediate") return 45;
  return 25;
}

function getProficiencyClass(proficiency) {
  if (proficiency === "Native Speaker") return "language-native";
  if (proficiency === "Professional Working") return "language-professional";
  if (proficiency === "Fluent") return "language-fluent";
  if (proficiency === "Advanced") return "language-advanced";
  if (proficiency === "Intermediate") return "language-intermediate";
  return "language-basic";
}

function sortLanguages(list, sortMode) {
  const copied = [...list];

  if (sortMode === "high") {
    return copied.sort((a, b) => getPercent(b.proficiency) - getPercent(a.proficiency));
  }

  if (sortMode === "low") {
    return copied.sort((a, b) => getPercent(a.proficiency) - getPercent(b.proficiency));
  }

  if (sortMode === "az") {
    return copied.sort((a, b) => a.language.localeCompare(b.language));
  }

  return copied;
}

function Language({ formData, setFormData, notify }) {
  const [notice, setNotice] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sortMode, setSortMode] = useState("high");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [languages, setLanguages] = useState(() => createLanguageList(formData));
  const [currentLanguage, setCurrentLanguage] = useState(emptyLanguage);
  const [editingIndex, setEditingIndex] = useState(null);

  const filteredLanguageOptions = useMemo(() => {
    const keyword = currentLanguage.language.trim().toLowerCase();

    if (!keyword) return languageOptions;

    return languageOptions.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
  }, [currentLanguage.language]);

  const sortedLanguages = useMemo(
    () => sortLanguages(languages, sortMode),
    [languages, sortMode]
  );

  const averageProficiency = useMemo(() => {
    if (!languages.length) return 0;

    const total = languages.reduce(
      (sum, item) => sum + getPercent(item.proficiency),
      0
    );

    return Math.round(total / languages.length);
  }, [languages]);

  const topProficiency = useMemo(() => {
    if (!languages.length) return "Empty";

    return languages
      .map((item) => item.proficiency)
      .sort((a, b) => getPercent(b) - getPercent(a))[0];
  }, [languages]);

  const updateLanguage = (field, value) => {
    setCurrentLanguage((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openAddForm = () => {
    setCurrentLanguage(emptyLanguage);
    setEditingIndex(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = (languageItem) => {
    const originalIndex = languages.findIndex((item) => item === languageItem);
    setCurrentLanguage(languageItem);
    setEditingIndex(originalIndex);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsDropdownOpen(false);
    setCurrentLanguage(emptyLanguage);
    setEditingIndex(null);
  };

  const validateLanguage = () => {
    if (!currentLanguage.language.trim()) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Bahasa wajib dipilih atau diketik.",
      });
      return false;
    }

    if (!currentLanguage.yearStarted) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Tahun mulai wajib diisi.",
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateLanguage()) return;

    let updatedLanguages = [];

    if (editingIndex === null) {
      updatedLanguages = [currentLanguage, ...languages];
    } else {
      updatedLanguages = languages.map((item, index) =>
        index === editingIndex ? currentLanguage : item
      );
    }

    setLanguages(updatedLanguages);

    setFormData?.((prev) => ({
      ...prev,
      languages: updatedLanguages[0] || emptyLanguage,
      languagesList: updatedLanguages,
    }));

    setNotice({
      type: "success",
      title: "Language Saved",
      message: "Data bahasa berhasil disimpan ke list.",
    });

    notify?.("success", "Language Saved", "Data bahasa berhasil disimpan.");
    closeForm();
  };

  const handleDelete = (languageItem) => {
    const updatedLanguages = languages.filter((item) => item !== languageItem);

    setLanguages(updatedLanguages);

    setFormData?.((prev) => ({
      ...prev,
      languages: updatedLanguages[0] || emptyLanguage,
      languagesList: updatedLanguages,
    }));

    notify?.("info", "Language Deleted", "Salah satu bahasa berhasil dihapus.");
  };

  return (
    <div className="language-page">
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="language-header">
        <div>
          <h1>My Languages</h1>
          <p>Manage your linguistic proficiency and cultural certifications.</p>
        </div>

        <div className="language-header-actions">
          <button type="button" className="dash-primary-btn" onClick={openAddForm}>
            <Icon name="plus" />
            Add Language
          </button>
        </div>
      </div>

      <div className="language-stat-grid">
        <div className="language-stat-card">
          <div className="language-stat-icon purple">
            <Icon name="language" />
          </div>
          <div>
            <span>Total Languages</span>
            <h2>{languages.length}</h2>
            <p>Languages Added</p>
          </div>
        </div>

        <div className="language-stat-card">
          <div className="language-stat-icon blue">
            <Icon name="star" />
          </div>
          <div>
            <span>Top Proficiency</span>
            <h2>{topProficiency}</h2>
            <p>Language level</p>
          </div>
        </div>

        <div className="language-stat-card">
          <div className="language-stat-icon green">
            <Icon name="chart" />
          </div>
          <div>
            <span>Average Proficiency</span>
            <h2>{averageProficiency}%</h2>
            <p>Across all languages</p>
          </div>
        </div>

        <div className="language-stat-card">
          <div className="language-stat-icon orange">
            <Icon name="trophy" />
          </div>
          <div>
            <span>Fluency Languages</span>
            <h2>
              {
                languages.filter(
                  (item) =>
                    item.proficiency === "Native Speaker" ||
                    item.proficiency === "Professional Working"
                ).length
              }
            </h2>
            <p>Pro or Native</p>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <section className="dash-edit-card dashboard-form-box language-form-box">
          <div className="dashboard-form-head">
            <div>
              <h2>{editingIndex === null ? "Add New Language" : "Edit Language"}</h2>
              <p>Ketik atau pilih bahasa, lalu isi level kemampuan.</p>
            </div>

            <button type="button" className="form-close-btn" onClick={closeForm}>
              <Icon name="close" />
            </button>
          </div>

          <div className="language-editor-grid">
            <div className="dash-field language-input-wrap">
              <label>Select / Type Language</label>

              <div className="language-custom-select">
                <div className="language-input-with-flag">
                  <span>
                    <img
                      src={getFlagUrl(currentLanguage.language)}
                      alt={currentLanguage.language || "language flag"}
                      className="language-flag-img"
                    />
                  </span>

                  <input
                    type="text"
                    value={currentLanguage.language}
                    placeholder="Type or select a language..."
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(event) => {
                      updateLanguage("language", event.target.value);
                      setIsDropdownOpen(true);
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                  >
                    <Icon name="chevron" />
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="language-custom-menu">
                    {filteredLanguageOptions.length > 0 ? (
                      filteredLanguageOptions.map((language) => (
                        <button
                          type="button"
                          key={language.name}
                          onMouseDown={() => {
                            updateLanguage("language", language.name);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <img
                            src={getFlagUrl(language.name)}
                            alt={`${language.name} flag`}
                            className="language-option-flag"
                          />
                          {language.name}
                        </button>
                      ))
                    ) : (
                      <div className="language-no-result">
                        Bahasa tidak ada di list, tetap bisa disimpan sebagai custom.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="dash-field">
              <label>Proficiency Level</label>
              <select
                value={currentLanguage.proficiency}
                onChange={(event) => updateLanguage("proficiency", event.target.value)}
              >
                <option>Native Speaker</option>
                <option>Professional Working</option>
                <option>Fluent</option>
                <option>Advanced</option>
                <option>Intermediate</option>
                <option>Basic</option>
              </select>
            </div>

            <div className="dash-field">
              <label>Year Started</label>
              <input
                type="number"
                min="1900"
                max="2100"
                step="1"
                value={currentLanguage.yearStarted}
                placeholder="e.g. 2020"
                onChange={(event) => updateLanguage("yearStarted", event.target.value)}
              />
            </div>

            <div className="dash-field">
              <label>Usage Frequency</label>
              <select
                value={currentLanguage.usageFrequency}
                onChange={(event) =>
                  updateLanguage("usageFrequency", event.target.value)
                }
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Recently</option>
              </select>
            </div>
          </div>

          <div className="dashboard-form-actions">
            <button type="button" className="dash-outline-btn" onClick={closeForm}>
              Cancel
            </button>

            <button type="button" className="dash-primary-btn" onClick={handleSave}>
              <Icon name="save" />
              Save Changes
            </button>
          </div>
        </section>
      )}

      <section className="language-list-section">
        <div className="language-list-head">
          <div>
            <h2>All Languages</h2>
            <p>Detailed view of your language skills.</p>
          </div>

          <select
            className="language-sort-select"
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value)}
          >
            <option value="high">Sort: High to Low</option>
            <option value="low">Sort: Low to High</option>
            <option value="az">Sort: A to Z</option>
          </select>
        </div>

        {sortedLanguages.length > 0 ? (
          <div className="language-list">
            {sortedLanguages.map((item, index) => (
              <div className="language-row" key={`${item.language}-${index}`}>
                <div className="language-flag">
                  <img
                    src={getFlagUrl(item.language)}
                    alt={`${item.language} flag`}
                    className="language-flag-img"
                  />
                </div>

                <div className="language-info">
                  <h3>
                    {item.language}
                    {index === 0 && <span>PRIMARY</span>}
                  </h3>

                  <p>
                    Used in {item.usageFrequency?.toLowerCase()} communication.
                    Started in {item.yearStarted || "-"}.
                  </p>
                </div>

                <div className={`language-progress ${getProficiencyClass(item.proficiency)}`}>
                  <div className="language-progress-top">
                    <span>Proficiency Level</span>
                    <small>{getPercent(item.proficiency)}%</small>
                  </div>

                  <strong>{item.proficiency}</strong>

                  <div className="progress-bar">
                    <span style={{ width: `${getPercent(item.proficiency)}%` }} />
                  </div>
                </div>

                <div className="language-row-actions">
                  <button type="button" onClick={() => openEditForm(item)}>
                    <Icon name="edit" />
                  </button>

                  <button type="button" onClick={() => handleDelete(item)}>
                    <Icon name="trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dash-edit-card">
            <div className="empty-state">
              <h3>Belum ada bahasa</h3>
              <p>Klik Add Language untuk menambahkan bahasa baru.</p>
            </div>
          </div>
        )}
      </section>

      <div className="insight-card">
        <h2>Career Insight</h2>
        <p>
          Language proficiency increases your eligibility for international roles and
          remote opportunities.
        </p>
      </div>
    </div>
  );
}

export default Language;