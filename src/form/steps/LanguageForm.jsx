import { useEffect, useMemo, useRef, useState } from "react";

const languageFlagMap = {
  English: "us",
  Indonesian: "id",
  Japanese: "jp",
  Arabic: "sa",
  Korean: "kr",
  Chinese: "cn",
  "Mandarin Chinese": "cn",
  German: "de",
  French: "fr",
  Spanish: "es",
  Portuguese: "pt",
  Italian: "it",
  Dutch: "nl",
  Russian: "ru",
  Thai: "th",
  Vietnamese: "vn",
  Malay: "my",
  Hindi: "in",
  Turkish: "tr",
  Filipino: "ph",
  Bengali: "bd",
  Urdu: "pk",
  Persian: "ir",
  Swahili: "tz",
  Polish: "pl",
  Ukrainian: "ua",
  Greek: "gr",
  Hebrew: "il",
  Czech: "cz",
  Swedish: "se",
  Norwegian: "no",
  Danish: "dk",
  Finnish: "fi",
  Acehnese: "id",
  Balinese: "id",
  Banjar: "id",
  Batak: "id",
  Betawi: "id",
  Buginese: "id",
  Madurese: "id",
  Minangkabau: "id",
  Sasak: "id",
};

const languagesList = Object.entries(languageFlagMap)
  .map(([name, countryCode]) => ({
    code: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    countryCode,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

function getFlagUrl(languageName) {
  const selectedLanguage = languagesList.find(
    (item) => item.name.toLowerCase() === languageName?.trim().toLowerCase()
  );

  if (!selectedLanguage?.countryCode) {
    return "";
  }

  return `https://flagcdn.com/w80/${selectedLanguage.countryCode.toLowerCase()}.png`;
}

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

    if (!keyword) return languagesList;

    return languagesList.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
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

  const selectedFlag = getFlagUrl(query);

  return (
    <div className="searchable-select" ref={wrapperRef}>
      <div
        className={`searchable-select-box ${isOpen ? "open" : ""} ${
          selectedFlag ? "" : "no-flag"
        }`}
      >
        {selectedFlag && (
          <div className="language-flag-preview">
            <img
              src={selectedFlag}
              alt={query ? `${query} flag` : "language flag"}
            />
          </div>
        )}

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
            filteredLanguages.map((item, index) => {
              const flagUrl = getFlagUrl(item.name);

              return (
                <button
                  key={item.code}
                  type="button"
                  className={`searchable-option ${
                    index === highlightedIndex ? "active" : ""
                  } ${value === item.name ? "selected" : ""}`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectLanguage(item.name)}
                >
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={`${item.name} flag`}
                      className="language-option-flag"
                    />
                  )}

                  <span>{item.name}</span>
                </button>
              );
            })
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
              type="number"
              min="1900"
              max="2100"
              step="1"
              value={languages.yearStarted}
              placeholder="e.g. 2020"
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