import { useEffect, useMemo, useRef, useState } from 'react';
import { getSkillList, getSkillPercent } from './helpers';

const emptySkill = { name: '', category: 'General', level: 'Basic' };
const categoryOptions = ['General', 'Technical', 'Soft Skill', 'Design', 'Business', 'Data', 'Language'];
const levelOptions = ['Basic', 'Intermediate', 'Advanced', 'Expert'];

const normalizeText = (value = '') => String(value || '').trim();
const normalizeCategory = (value = '') => {
  const current = normalizeText(value).toLowerCase();
  if (current.includes('technical')) return 'Technical';
  if (current.includes('soft')) return 'Soft Skill';
  if (current.includes('design')) return 'Design';
  if (current.includes('business')) return 'Business';
  if (current.includes('data')) return 'Data';
  if (current.includes('language')) return 'Language';
  return 'General';
};

const normalizeSkill = (item = {}, fallback = {}) => {
  const raw = typeof item === 'string' ? { name: item } : item || {};
  return {
    id: raw.id,
    name: normalizeText(raw.name || raw.skillName || raw.title),
    category: normalizeCategory(raw.category || fallback.category || 'General'),
    level: normalizeText(raw.level || raw.proficiencyLevel || fallback.level || 'Basic') || 'Basic',
  };
};

const normalizeSkillList = (formData = {}) => {
  const fallback = {
    category: formData?.skills?.skillCategory || 'General',
    level: formData?.skills?.proficiencyLevel || 'Basic',
  };

  const merged = getSkillList(formData)
    .map((item) => normalizeSkill(item, fallback))
    .filter((item) => item.name);

  const seen = new Set();
  return merged.filter((item) => {
    const key = item.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

function SkillIcon({ type }) {
  if (type === 'Design') return <svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0 0 18h1.2a1.8 1.8 0 0 0 .6-3.5l-.8-.3a1.5 1.5 0 0 1 .5-2.9H15a6 6 0 0 0 0-12h-3Z" /><circle cx="7.5" cy="10" r=".7" /><circle cx="10" cy="7" r=".7" /><circle cx="14" cy="7" r=".7" /></svg>;
  if (type === 'Soft Skill') return <svg viewBox="0 0 24 24"><path d="M7 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M17 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M3 21a6 6 0 0 1 12 0" /><path d="M13 21a6 6 0 0 1 8-5.6" /></svg>;
  if (type === 'Business') return <svg viewBox="0 0 24 24"><path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4c1 0 1.8.8 1.8 1.8V7" /><path d="M4 7h16v12H4V7Z" /><path d="M4 12h16" /></svg>;
  if (type === 'Data') return <svg viewBox="0 0 24 24"><path d="M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2Z" /><path d="M4 6v6c0 1.1 3.6 2 8 2s8-.9 8-2V6" /><path d="M4 12v6c0 1.1 3.6 2 8 2s8-.9 8-2v-6" /></svg>;
  if (type === 'Language') return <svg viewBox="0 0 24 24"><path d="M4 5h10" /><path d="M9 5c-.3 4.6-2.1 7.9-5 10" /><path d="M6.5 9.5c1.2 2.1 3.1 4 5.5 5.5" /><path d="M14 20l4-9 4 9" /><path d="M15.5 17h5" /></svg>;
  if (type === 'save') return <svg viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5V4Z" /><path d="M8 4v6h8V4" /><path d="M8 20v-6h8v6" /></svg>;
  if (type === 'x') return <svg viewBox="0 0 24 24"><path d="M6 6l12 12" /><path d="M18 6 6 18" /></svg>;
  if (type === 'trash') return <svg viewBox="0 0 24 24"><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 14h10l1-14" /><path d="M9 7V4h6v3" /></svg>;
  if (type === 'chevron') return <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>;
  return <svg viewBox="0 0 24 24"><path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 4-4 16" /></svg>;
}

function useClickOutside(ref, callback) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref.current?.contains(event.target)) callback?.();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback]);
}

function CleanSelect({ label, value, options, onChange, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="dash-field clean-select-field" ref={ref}>
      <label>{label}</label>
      <button type="button" className={`clean-select-trigger ${open ? 'open' : ''}`} onClick={() => setOpen((prev) => !prev)}>
        <span>{value || placeholder}</span>
        <em><SkillIcon type="chevron" /></em>
      </button>
      {open && (
        <div className="clean-select-menu">
          {options.map((option) => (
            <button type="button" key={option} className={option === value ? 'active' : ''} onClick={() => { onChange(option); setOpen(false); }}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillGroup({ title, skills, onDelete }) {
  return (
    <div className={`skill-display-card category-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="skill-display-head">
        <h2><SkillIcon type={title} /> <span>{title} ({skills.length})</span></h2>
        <span className="skill-more">•••</span>
      </div>

      <div className="skill-display-list">
        {skills.length ? skills.map((skill, index) => (
          <div className="skill-display-row no-progress" key={`${title}-${skill.name}-${index}`}>
            <div className="skill-display-info">
              <span className="skill-display-name">{skill.name}</span>
              <em className="skill-display-level">{skill.level || 'Basic'}</em>
            </div>
            <button type="button" className="skill-delete-btn" onClick={() => onDelete(skill.name)} aria-label={`Delete ${skill.name}`}><SkillIcon type="trash" /></button>
          </div>
        )) : <p className="empty-skill-text">Belum ada skill di kategori {title}.</p>}
      </div>
    </div>
  );
}

function Skill({ formData = {}, setFormData, notify }) {
  const [skills, setSkills] = useState(() => normalizeSkillList(formData));
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(emptySkill);

  useEffect(() => {
    setSkills(normalizeSkillList(formData));
  }, [formData]);

  const groupedSkills = useMemo(() => categoryOptions.reduce((acc, category) => {
    acc[category] = skills.filter((skill) => normalizeCategory(skill.category) === category);
    return acc;
  }, {}), [skills]);

  const avg = skills.length ? Math.round(skills.reduce((sum, s) => sum + getSkillPercent(s.level), 0) / skills.length) : 0;
  const topCategory = categoryOptions.reduce((best, category) => groupedSkills[category].length > groupedSkills[best].length ? category : best, 'General');
  const strongest = [...skills].sort((a, b) => getSkillPercent(b.level) - getSkillPercent(a.level))[0];

  const resetForm = () => {
    setDraft(emptySkill);
    setShowForm(false);
  };

  const commitSkills = (nextSkills, message = 'Skill berhasil diperbarui.') => {
    setSkills(nextSkills);
    setFormData?.((prev) => ({
      ...prev,
      skills: {
        ...(prev.skills || {}),
        selectedSkills: nextSkills,
        skillCategory: nextSkills[0]?.category || prev.skills?.skillCategory || 'General',
        proficiencyLevel: nextSkills[0]?.level || prev.skills?.proficiencyLevel || 'Basic',
      },
      skillList: nextSkills,
      skillsList: nextSkills,
    }));
    notify?.('success', 'Skills Updated', message);
  };

  const saveSkill = () => {
    const saved = normalizeSkill(draft);
    if (!saved.name) {
      notify?.('error', 'Data Belum Lengkap', 'Skill name wajib diisi.');
      return;
    }
    const nextSkills = [saved, ...skills.filter((item) => item.name.toLowerCase() !== saved.name.toLowerCase())];
    commitSkills(nextSkills, 'Skill berhasil ditambahkan.');
    resetForm();
  };

  const deleteSkill = (skillName) => {
    const nextSkills = skills.filter((item) => item.name !== skillName);
    commitSkills(nextSkills, 'Skill berhasil dihapus.');
  };

  return (
    <div className="skill-display-page">
      <div className="display-header">
        <div><h1>Skills Information</h1><p>Kelola semua skill berdasarkan kategori yang sama dengan form.</p></div>
        <button type="button" onClick={() => setShowForm(true)}>+ Add Skills</button>
      </div>

      {showForm && (
        <div className="dash-edit-card dashboard-form-box simple-add-form">
          <div className="dashboard-form-head">
            <div><h2>Add Skill</h2><p>Tambahkan skill sesuai kategori dashboard dan form.</p></div>
            <button type="button" className="form-close-btn" onClick={resetForm}><SkillIcon type="x" /></button>
          </div>

          <div className="dashboard-two-col-form skill-add-grid-fixed">
            <label className="dash-field">
              <span>Skill Name</span>
              <input value={draft.name} placeholder="e.g. Microsoft Excel" onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))} />
            </label>

            <CleanSelect label="Category" value={draft.category} options={categoryOptions} onChange={(value) => setDraft((prev) => ({ ...prev, category: value }))} />
            <CleanSelect label="Level" value={draft.level} options={levelOptions} onChange={(value) => setDraft((prev) => ({ ...prev, level: value }))} />
          </div>

          <div className="dashboard-form-actions">
            <button type="button" className="dash-outline-btn" onClick={resetForm}>Cancel</button>
            <button type="button" className="dash-primary-btn" onClick={saveSkill}><SkillIcon type="save" /> Save Skill</button>
          </div>
        </div>
      )}

      <div className="skill-stat-grid">
        <div><span>Total Skills</span><strong>{skills.length}</strong><p>Skills Added</p></div>
        <div><span>Top Category</span><strong>{topCategory}</strong><p>{groupedSkills[topCategory]?.length || 0} skills</p></div>
        <div><span>Strongest Skill</span><strong>{strongest?.name || '-'}</strong><p>{strongest?.level || 'No skill yet'}</p></div>
        <div><span>Average Level</span><strong>{avg}%</strong><p>Across all skills</p></div>
      </div>

      <div className="skill-display-grid">
        {categoryOptions.map((category) => <SkillGroup key={category} title={category} skills={groupedSkills[category] || []} onDelete={deleteSkill} />)}
      </div>
    </div>
  );
}

export default Skill;
