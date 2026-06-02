import { useEffect, useMemo, useRef, useState } from "react";
import { getLanguageList } from "./helpers";

const languageOptions = [
  { name: "English", countryCode: "us", aliases: ["en", "eng"] },
  { name: "Indonesian", countryCode: "id", aliases: ["id", "indonesia", "bahasa indonesia"] },
  { name: "Mandarin Chinese", countryCode: "cn", aliases: ["cn", "zh", "chinese", "mandarin"] },
  { name: "Japanese", countryCode: "jp", aliases: ["jp", "ja"] },
  { name: "Korean", countryCode: "kr", aliases: ["kr", "ko"] },
  { name: "Spanish", countryCode: "es", aliases: ["es", "esp"] },
  { name: "French", countryCode: "fr", aliases: ["fr"] },
  { name: "Arabic", countryCode: "sa", aliases: ["ar", "arab"] },
  { name: "German", countryCode: "de", aliases: ["de"] },
  { name: "Dutch", countryCode: "nl" },
  { name: "Portuguese", countryCode: "pt" },
  { name: "Italian", countryCode: "it", aliases: ["it"] },
  { name: "Russian", countryCode: "ru", aliases: ["ru"] },
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
  { name: "Norwegian", countryCode: "no", aliases: ["no", "nb", "nn"] },
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

const proficiencyOptions = [
  "Native",
  "Professional",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Basic",
];

const usageOptions = ["Daily", "Weekly", "Monthly", "Recently"];

const emptyLanguage = {
  language: "",
  proficiency: "Professional",
  yearStarted: "",
  usageFrequency: "Daily",
};

function normalizeProficiency(value) {
  if (value === "Native Speaker") return "Native";
  if (value === "Professional Working") return "Professional";
  return value || "Professional";
}

function denormalizeProficiency(value) {
  if (value === "Native") return "Native Speaker";
  if (value === "Professional") return "Professional Working";
  return value || "Professional Working";
}

function normalizeLanguageItem(item = {}) {
  return {
    id: item.id || Date.now(),
    language: item.language || "",
    proficiency: normalizeProficiency(item.proficiency),
    yearStarted: item.yearStarted || "",
    usageFrequency: item.usageFrequency || "Daily",
  };
}

function getLanguageOption(value) {
  const keyword = String(value || "").trim().toLowerCase();
  if (!keyword) return null;

  return languageOptions.find((item) => {
    const aliases = item.aliases || [];
    return (
      item.name.toLowerCase() === keyword ||
      item.countryCode.toLowerCase() === keyword ||
      aliases.some((alias) => alias.toLowerCase() === keyword)
    );
  }) || null;
}

function getFlagUrl(languageName) {
  const selectedLanguage = getLanguageOption(languageName) || languageOptions.find(
    (item) => item.name.toLowerCase().includes(String(languageName || "").trim().toLowerCase())
  );

  if (!selectedLanguage?.countryCode) {
    return "https://cdn-icons-png.flaticon.com/512/841/841364.png";
  }

  return `https://flagcdn.com/w80/${selectedLanguage.countryCode}.png`;
}

function getCanonicalLanguageName(value) {
  return getLanguageOption(value)?.name || String(value || "").trim();
}

function getPercent(proficiency) {
  if (proficiency === "Native") return 100;
  if (proficiency === "Professional") return 95;
  if (proficiency === "Fluent") return 80;
  if (proficiency === "Advanced") return 65;
  if (proficiency === "Intermediate") return 50;
  return 35;
}

function getProficiencyClass(proficiency) {
  if (proficiency === "Native") return "language-native";
  if (proficiency === "Professional") return "language-professional";
  if (proficiency === "Fluent") return "language-fluent";
  if (proficiency === "Advanced") return "language-advanced";
  if (proficiency === "Intermediate") return "language-intermediate";
  return "language-basic";
}

function getLanguageDescription(language) {
  if (language.proficiency === "Native") {
    return "Native language. Used in all forms of communication.";
  }

  if (language.proficiency === "Professional") {
    return "Used in professional and daily communication, reading, writing, and presentations.";
  }

  if (language.proficiency === "Fluent") {
    return "Used in conversations, reading, and workplace communication.";
  }

  if (language.proficiency === "Advanced") {
    return "Used in general conversations and understanding written content.";
  }

  if (language.proficiency === "Intermediate") {
    return "Able to communicate in common situations and understand basic context.";
  }

  return "Basic understanding for simple communication.";
}

function sortLanguages(list, sortMode) {
  const copied = [...list];

  if (sortMode === "name") {
    return copied.sort((a, b) => a.language.localeCompare(b.language));
  }

  if (sortMode === "recent") {
    return copied.sort(
      (a, b) => Number(b.yearStarted || 0) - Number(a.yearStarted || 0)
    );
  }

  return copied.sort(
    (a, b) => getPercent(b.proficiency) - getPercent(a.proficiency)
  );
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
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-3" />
      </svg>
    );
  }

  if (name === "trophy") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
        <path d="M8 6H5a3 3 0 0 0 3 3" />
        <path d="M16 6h3a3 3 0 0 1-3 3" />
        <path d="M12 12v5" />
        <path d="M9 21h6" />
        <path d="M10 17h4" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4 8h16" />
        <path d="M5 5h14v15H5V5Z" />
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

  if (name === "chevron") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  }

  return null;
}

function Language({ formData, setFormData, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(emptyLanguage);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const languageSelectRef = useRef(null);
  const [sortMode, setSortMode] = useState("proficiency");
  const [languages, setLanguages] = useState(() =>
    getLanguageList(formData).map(normalizeLanguageItem)
  );

  useEffect(() => {
    setLanguages(getLanguageList(formData).map(normalizeLanguageItem));
  }, [formData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!languageSelectRef.current?.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLanguages = useMemo(() => {
    const keyword = currentLanguage.language.trim().toLowerCase();

    if (!keyword) return languageOptions;

    return languageOptions.filter((item) => {
      const aliases = item.aliases || [];
      return (
        item.name.toLowerCase().includes(keyword) ||
        item.countryCode.toLowerCase().includes(keyword) ||
        aliases.some((alias) => alias.toLowerCase().includes(keyword))
      );
    });
  }, [currentLanguage.language]);

  const sortedLanguages = useMemo(
    () => sortLanguages(languages, sortMode),
    [languages, sortMode]
  );

  const topLanguage = languages.reduce((best, item) => {
    if (!best) return item;
    return getPercent(item.proficiency) > getPercent(best.proficiency)
      ? item
      : best;
  }, null);

  const averageProficiency =
    languages.length > 0
      ? Math.round(
        languages.reduce(
          (total, item) => total + getPercent(item.proficiency),
          0
        ) / languages.length
      )
      : 0;

  const fluentLanguages = languages.filter(
    (item) =>
      item.proficiency === "Native" ||
      item.proficiency === "Professional" ||
      item.proficiency === "Fluent"
  ).length;

  const updateLanguage = (field, value) => {
    setCurrentLanguage((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setCurrentLanguage(emptyLanguage);
    setShowForm(false);
    setIsDropdownOpen(false);
  };

  const addLanguage = () => {
    if (!currentLanguage.language.trim()) {
      notify?.("error", "Data Belum Lengkap", "Language wajib diisi.");
      return;
    }

    if (!currentLanguage.yearStarted) {
      notify?.("error", "Data Belum Lengkap", "Tahun mulai wajib diisi.");
      return;
    }

    const canonicalLanguage = getCanonicalLanguageName(currentLanguage.language);

    const newLanguage = normalizeLanguageItem({
      ...currentLanguage,
      id: Date.now(),
      language: canonicalLanguage,
    });

    const nextLanguages = [newLanguage, ...languages.filter(
      (item) => item.language.toLowerCase() !== newLanguage.language.toLowerCase()
    )];

    setLanguages(nextLanguages);
    setFormData?.((prev) => ({
      ...prev,
      languages: {
        ...newLanguage,
        proficiency: denormalizeProficiency(newLanguage.proficiency),
      },
      languageList: nextLanguages,
      languagesList: nextLanguages,
    }));

    notify?.("success", "Language Ditambahkan", "Data bahasa berhasil disimpan.");
    resetForm();
  };

  const deleteLanguage = (id) => {
    const nextLanguages = languages.filter((item) => item.id !== id);

    setLanguages(nextLanguages);
    setFormData?.((prev) => ({
      ...prev,
      languages: nextLanguages[0]
        ? {
          ...nextLanguages[0],
          proficiency: denormalizeProficiency(nextLanguages[0].proficiency),
        }
        : emptyLanguage,
      languageList: nextLanguages,
      languagesList: nextLanguages,
    }));

    notify?.("success", "Language Dihapus", "Data bahasa berhasil dihapus.");
  };

  return (
    <div className="language-page">
      <div className="language-header">
        <div>
          <h1>My Languages</h1>
          <p>Manage your linguistic proficiency and cultural certifications.</p>
        </div>

        <div className="language-header-actions">
          <button
            type="button"
            className="dash-primary-btn"
            onClick={() => setShowForm(true)}
          >
            <Icon name="plus" />
            Add Languages
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
            <h2>{topLanguage?.proficiency || "-"}</h2>
            <p>{topLanguage ? "1 Language" : "No language yet"}</p>
          </div>
        </div>

        <div className="language-stat-card">
          <div className="language-stat-icon green">
            <Icon name="chart" />
          </div>

          <div>
            <span>Average Proficiency</span>
            <h2>{averageProficiency}%</h2>
            <p>Across All Languages</p>
          </div>
        </div>

        <div className="language-stat-card">
          <div className="language-stat-icon orange">
            <Icon name="trophy" />
          </div>

          <div>
            <span>Fluency Languages</span>
            <h2>{fluentLanguages}</h2>
            <p>Pro or Native</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="dash-card language-form-box">
          <div className="dashboard-form-head">
            <div>
              <h2>Add Language</h2>
              <p>Tambahkan bahasa yang kamu kuasai untuk ditampilkan di dashboard dan CV.</p>
            </div>

            <button type="button" className="form-close-btn" onClick={resetForm}>
              ×
            </button>
          </div>

          <div className="language-editor-grid">
            <div className="dash-field">
              <label>Language</label>

              <div className="language-custom-select fixed-language-select" ref={languageSelectRef}>
                <div
                  className={`language-input-with-flag ${isDropdownOpen ? "open" : ""}`}
                  onMouseDown={() => setIsDropdownOpen(true)}
                >
                  <span>
                    <img
                      src={getFlagUrl(currentLanguage.language)}
                      alt={currentLanguage.language || "language flag"}
                      className="language-flag-img"
                    />
                  </span>

                  <input
                    type="text"
                    placeholder="Type or select language..."
                    value={currentLanguage.language}
                    onChange={(event) => {
                      updateLanguage("language", event.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />

                  <button
                    type="button"
                    className="language-dropdown-arrow"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    aria-label="Open language options"
                  >
                    <Icon name="chevron" />
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="language-custom-menu">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((language) => (
                        <button
                          type="button"
                          key={language.name}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
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
                        Language not found. You can still type it manually.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="dash-field">
              <label>Proficiency</label>
              <select
                value={currentLanguage.proficiency}
                onChange={(event) =>
                  updateLanguage("proficiency", event.target.value)
                }
              >
                {proficiencyOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="dash-field">
              <label>Year Started</label>
              <input
                type="number"
                min="1900"
                max="2100"
                step="1"
                placeholder="e.g. 2020"
                value={currentLanguage.yearStarted}
                onChange={(event) =>
                  updateLanguage("yearStarted", event.target.value)
                }
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
                {usageOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="dashboard-form-actions">
            <button type="button" className="dash-outline-btn" onClick={resetForm}>
              Cancel
            </button>

            <button type="button" className="dash-primary-btn" onClick={addLanguage}>
              Save Language
            </button>
          </div>
        </div>
      )}

      <div className="language-list-section">
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
            <option value="proficiency">Sort by: Proficiency High to Low</option>
            <option value="name">Sort by: Name A to Z</option>
            <option value="recent">Sort by: Year Started</option>
          </select>
        </div>

        {sortedLanguages.length === 0 ? (
          <div className="empty-state">
            <h3>No languages added yet</h3>
            <p>Click Add Languages to start adding your language skills.</p>
          </div>
        ) : (
          <div className="language-list">
            {sortedLanguages.map((item, index) => {
              const percent = getPercent(item.proficiency);
              const className = getProficiencyClass(item.proficiency);

              return (
                <div className="language-row" key={item.id || `${item.language}-${index}`}>
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

                    <p>{getLanguageDescription(item)}</p>

                    <p className="language-used">
                      <Icon name="calendar" />
                      Last Used: {item.usageFrequency}
                    </p>
                  </div>

                  <div className={`language-progress ${className}`}>
                    <div className="language-progress-top">
                      <div>
                        <span>Proficiency Level</span>
                        <strong>{item.proficiency}</strong>
                      </div>

                      <small>{percent}%</small>
                    </div>

                    <div className="progress-bar">
                      <span style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <div className="language-row-actions">
                    <button
                      type="button"
                      onClick={() => deleteLanguage(item.id)}
                      aria-label="Delete language"
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Language;