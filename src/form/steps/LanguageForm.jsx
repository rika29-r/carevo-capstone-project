import { useEffect, useMemo, useRef, useState } from "react";

const languageCodes = [
  "aa", "ab", "af", "ak", "am", "ar", "as", "av", "ay", "az",
  "ba", "be", "bg", "bh", "bi", "bm", "bn", "bo", "br", "bs",
  "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy", "da",
  "de", "dv", "dz", "ee", "el", "en", "eo", "es", "et", "eu",
  "fa", "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd", "gl",
  "gn", "gu", "gv", "ha", "he", "hi", "ho", "hr", "ht", "hu",
  "hy", "hz", "ia", "id", "ie", "ig", "ii", "ik", "io", "is",
  "it", "iu", "ja", "jv", "ka", "kg", "ki", "kj", "kk", "kl",
  "km", "kn", "ko", "kr", "ks", "ku", "kv", "kw", "ky", "la",
  "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "mg", "mh",
  "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "na", "nb",
  "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny", "oc",
  "oj", "om", "or", "os", "pa", "pi", "pl", "ps", "pt", "qu",
  "rm", "rn", "ro", "ru", "rw", "sa", "sc", "sd", "se", "sg",
  "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st",
  "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "tl",
  "tn", "to", "tr", "ts", "tt", "tw", "ty", "ug", "uk", "ur",
  "uz", "ve", "vi", "vo", "wa", "wo", "xh", "yi", "yo", "za",
  "zh", "zu",
];

const extraLanguages = [
  "Acehnese",
  "Acholi",
  "Adangme",
  "Adyghe",
  "Balinese",
  "Banjar",
  "Batak",
  "Betawi",
  "Buginese",
  "Madurese",
  "Minangkabau",
  "Sasak",
  "Tetum",
];

const languageNameFormatter =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "language" })
    : null;

const languagesList = [
  ...languageCodes.map((code) => ({
    code,
    name: languageNameFormatter?.of(code) || code.toUpperCase(),
  })),
  ...extraLanguages.map((name) => ({
    code: name.toLowerCase().replace(/\s+/g, "-"),
    name,
  })),
]
  .filter((language) => language.name && language.name !== language.code)
  .filter(
    (language, index, self) =>
      index === self.findIndex((item) => item.name === language.name)
  )
  .sort((a, b) => a.name.localeCompare(b.name));

function SearchableLanguageSelect({ value, onChange }) {
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLanguages = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return languagesList.slice(0, 80);

    return languagesList
      .filter((item) => item.name.toLowerCase().includes(keyword))
      .slice(0, 80);
  }, [query]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, isOpen]);

  const selectLanguage = (name) => {
    setQuery(name);
    onChange(name);
    setIsOpen(false);
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleKeyDown = (event) => {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    if (!filteredLanguages.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredLanguages.length - 1 ? prev + 1 : prev
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = filteredLanguages[highlightedIndex];
      if (selected) selectLanguage(selected.name);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="searchable-select" ref={wrapperRef}>
      <div className={`searchable-select-box ${isOpen ? "open" : ""}`}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Type or select a language..."
          autoComplete="off"
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className="searchable-select-toggle"
          onClick={() => {
            setIsOpen((prev) => !prev);
            inputRef.current?.focus();
          }}
          aria-label="Toggle language list"
        >
          <svg viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="searchable-dropdown">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((item, index) => (
              <button
                key={item.code}
                type="button"
                className={`searchable-option ${
                  index === highlightedIndex ? "active" : ""
                } ${value === item.name ? "selected" : ""}`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectLanguage(item.name)}
              >
                {item.name}
              </button>
            ))
          ) : (
            <div className="searchable-empty">Language not found.</div>
          )}
        </div>
      )}
    </div>
  );
}

function LanguageForm({ formData, setFormData, onNext, onPrevious }) {
  const languages = formData.languages;

  const updateLanguage = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      languages: {
        ...prev.languages,
        [field]: value,
      },
    }));
  };

  const proficiencyOptions = [
    "Native Speaker",
    "Professional Working",
    "Fluent",
    "Advanced",
    "Intermediate",
    "Basic",
  ];

  const usageOptions = ["Daily", "Weekly", "Monthly", "Recently"];

  const openDatePicker = (event) => {
    event.currentTarget.showPicker?.();
  };

  return (
    <div className="language-wrapper">
      <div className="form-card language-card">
        <div className="card-body">
          <div className="field-group">
            <label>Select Language</label>

            <SearchableLanguageSelect
              value={languages.language}
              onChange={(value) => updateLanguage("language", value)}
            />

            <small className="field-note">
              Contoh: English, Indonesian, Japanese, Arabic, Korean.
            </small>
          </div>

          <div className="field-group">
            <label>Proficiency Level</label>

            <div className="radio-grid">
              {proficiencyOptions.map((option) => (
                <label
                  key={option}
                  className={`radio-option ${
                    languages.proficiency === option ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="proficiency"
                    checked={languages.proficiency === option}
                    onChange={() => updateLanguage("proficiency", option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label>Year Started</label>
            <input
              type="date"
              value={languages.yearStarted}
              onClick={openDatePicker}
              onFocus={openDatePicker}
              onKeyDown={(event) => event.preventDefault()}
              onChange={(event) =>
                updateLanguage("yearStarted", event.target.value)
              }
            />
          </div>

          <div className="field-group">
            <label>Usage Frequency</label>

            <div className="usage-tabs">
              {usageOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={languages.usageFrequency === option ? "active" : ""}
                  onClick={() => updateLanguage("usageFrequency", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-bottom-actions">
          <button type="button" className="btn-secondary" onClick={onPrevious}>
            Previous
          </button>

          <button type="button" className="btn-primary" onClick={onNext}>
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}

export default LanguageForm;