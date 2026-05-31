import "../form.css";

function DateInput({ value, onChange, disabled = false }) {
    return (
        <input
            type="date"
            value={value || ""}
            disabled={disabled}
            onChange={onChange}
        />
    );
}

function EducationForm({ formData, setFormData, onNext, onPrevious }) {
    const education = formData.education || {
        institutionName: "",
        degreeMajor: "",
        startDate: "",
        endDate: "",
        currentlyStudy: false,
        location: "",
        gpa: "",
        description: "",
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            education: {
                ...prev.education,
                [field]: value,
            },
        }));
    };

    const handleCurrentlyStudy = (checked) => {
        setFormData((prev) => ({
            ...prev,
            education: {
                ...prev.education,
                currentlyStudy: checked,
                endDate: checked ? "" : prev.education?.endDate || "",
            },
        }));
    };

    return (
        <div className="education-wrapper">
            <div className="form-card education-card">
                <div className="card-header education-header-card">
                    <div>
                        <h2>Add Education</h2>
                        <p className="card-subtitle">
                            Fill in your education details accurately.
                        </p>
                    </div>
                </div>

                <div className="card-body">
                    <div className="education-info-box">
                        <strong>Education Information</strong>
                        <p>
                            Masukkan riwayat pendidikan kamu. Education akan menjadi data
                            pendukung untuk CV dan rekomendasi career path.
                        </p>
                    </div>

                    <div className="input-grid education-grid">
                        <div className="field-group">
                            <label>Institution Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Stanford University"
                                value={education.institutionName || ""}
                                onChange={(event) =>
                                    handleChange("institutionName", event.target.value)
                                }
                            />
                        </div>

                        <div className="field-group">
                            <label>Degree / Major</label>
                            <input
                                type="text"
                                placeholder="e.g. Agribusiness, Information System"
                                value={education.degreeMajor || ""}
                                onChange={(event) =>
                                    handleChange("degreeMajor", event.target.value)
                                }
                            />
                        </div>

                        <div className="field-group">
                            <label>Start Date</label>
                            <DateInput
                                value={education.startDate || ""}
                                onChange={(event) =>
                                    handleChange("startDate", event.target.value)
                                }
                            />
                        </div>

                        <div className="field-group">
                            <label>End Date</label>
                            <DateInput
                                value={education.endDate || ""}
                                disabled={education.currentlyStudy}
                                onChange={(event) =>
                                    handleChange("endDate", event.target.value)
                                }
                            />

                            <label className="education-check">
                                <input
                                    type="checkbox"
                                    checked={Boolean(education.currentlyStudy)}
                                    onChange={(event) =>
                                        handleCurrentlyStudy(event.target.checked)
                                    }
                                />
                                <span>I currently study here</span>
                            </label>
                        </div>

                        <div className="field-group">
                            <label>Location</label>
                            <input
                                type="text"
                                placeholder="e.g. Depok, Indonesia"
                                value={education.location || ""}
                                onChange={(event) =>
                                    handleChange("location", event.target.value)
                                }
                            />
                        </div>

                        <div className="field-group">
                            <label>GPA / Grade</label>
                            <input
                                type="text"
                                placeholder="e.g. 3.8 / 4.0"
                                value={education.gpa || ""}
                                onChange={(event) => handleChange("gpa", event.target.value)}
                            />
                        </div>

                        <div className="field-group education-full">
                            <label>Description / Achievements</label>
                            <textarea
                                placeholder="Mention your honors, key courses, achievements, or extracurricular activities..."
                                value={education.description || ""}
                                onChange={(event) =>
                                    handleChange("description", event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="form-bottom-actions">
                    <button type="button" className="btn-secondary" onClick={onPrevious}>
                        Previous
                    </button>

                    <button type="button" className="btn-primary" onClick={onNext}>
                        Next Step
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EducationForm;