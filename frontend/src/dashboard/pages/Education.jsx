import { useState } from 'react';
import { getEducationList, formatYear } from './helpers';

const emptyEducation = {
  institutionName: '',
  degreeMajor: '',
  startDate: '',
  endDate: '',
  currentlyStudy: false,
  location: '',
  gpa: '',
  description: '',
};

function Icon({ name }) {
  if (name === 'education') return <svg viewBox="0 0 24 24"><path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z"/><path d="M7 11v5c1.3 1.4 3 2 5 2s3.7-.6 5-2v-5"/></svg>;
  if (name === 'calendar') return <svg viewBox="0 0 24 24"><path d="M7 3v4"/><path d="M17 3v4"/><path d="M4 8h16"/><path d="M5 5h14v16H5V5Z"/></svg>;
  if (name === 'star') return <svg viewBox="0 0 24 24"><path d="M12 3 14.2 8.4 20 9l-4.4 3.7 1.3 5.7L12 15.3 7.1 18.4l1.3-5.7L4 9l5.8-.6L12 3Z"/></svg>;
  if (name === 'save') return <svg viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5V4Z"/><path d="M8 4v6h8V4"/><path d="M8 20v-6h8v6"/></svg>;
  if (name === 'x') return <svg viewBox="0 0 24 24"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>;
  if (name === 'edit') return <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"/></svg>;
  if (name === 'trash') return <svg viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/></svg>;
  return null;
}

function Education({ formData = {}, setFormData, notify }) {
  const [items, setItems] = useState(() => getEducationList(formData));
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(emptyEducation);
  const [editingIndex, setEditingIndex] = useState(null);

  const latest = items[0] || {};
  const update = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => {
    setDraft(emptyEducation);
    setEditingIndex(null);
    setShowForm(true);
  };

  const openEdit = (item, index) => {
    setDraft({ ...emptyEducation, ...item });
    setEditingIndex(index);
    setShowForm(true);
  };

  const closeForm = () => {
    setDraft(emptyEducation);
    setEditingIndex(null);
    setShowForm(false);
  };

  const saveEducation = () => {
    if (!draft.institutionName.trim() || !draft.degreeMajor.trim()) {
      notify?.('error', 'Data Belum Lengkap', 'Institution Name dan Degree / Major wajib diisi.');
      return;
    }

    const saved = { ...draft };
    const nextItems = editingIndex === null
      ? [saved, ...items]
      : items.map((item, index) => (index === editingIndex ? saved : item));

    setItems(nextItems);
    setFormData?.((prev) => ({
      ...prev,
      education: nextItems[0] || emptyEducation,
      educations: nextItems,
    }));
    notify?.('success', 'Education Saved', 'Data education berhasil disimpan.');
    closeForm();
  };

  const deleteEducation = (index) => {
    const nextItems = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(nextItems);
    setFormData?.((prev) => ({
      ...prev,
      education: nextItems[0] || emptyEducation,
      educations: nextItems,
    }));
    notify?.('success', 'Education Deleted', 'Data education berhasil dihapus.');
  };

  return (
    <div className="education-display-page">
      <div className="display-header">
        <div>
          <h1>Education Information</h1>
          <p>Manage your academic background and qualifications.</p>
        </div>
        <button type="button" onClick={openAdd}>+ Add Education</button>
      </div>

      {showForm && (
        <div className="dash-edit-card dashboard-form-box simple-add-form">
          <div className="dashboard-form-head">
            <div>
              <h2>{editingIndex === null ? 'Add Education' : 'Edit Education'}</h2>
              <p>Isi data pendidikan sesuai form Education.</p>
            </div>
            <button type="button" className="form-close-btn" onClick={closeForm}><Icon name="x" /></button>
          </div>

          <div className="dashboard-two-col-form">
            <label className="dash-field"><span>Institution Name</span><input value={draft.institutionName} onChange={(e) => update('institutionName', e.target.value)} placeholder="University / School name" /></label>
            <label className="dash-field"><span>Degree / Major</span><input value={draft.degreeMajor} onChange={(e) => update('degreeMajor', e.target.value)} placeholder="S1 Agribusiness" /></label>
            <label className="dash-field"><span>Start Date</span><input type="date" value={draft.startDate} onChange={(e) => update('startDate', e.target.value)} /></label>
            <label className="dash-field"><span>End Date</span><input type="date" disabled={draft.currentlyStudy} value={draft.endDate} onChange={(e) => update('endDate', e.target.value)} /></label>
            <label className="dash-field"><span>Location</span><input value={draft.location} onChange={(e) => update('location', e.target.value)} placeholder="City, Country" /></label>
            <label className="dash-field"><span>GPA</span><input value={draft.gpa} onChange={(e) => update('gpa', e.target.value)} placeholder="3.80" /></label>
            <label className="dashboard-check-row"><input type="checkbox" checked={draft.currentlyStudy} onChange={(e) => update('currentlyStudy', e.target.checked)} /> Currently studying here</label>
            <label className="dash-field form-full"><span>Description</span><textarea value={draft.description} onChange={(e) => update('description', e.target.value)} placeholder="Activities, achievements, relevant coursework..." /></label>
          </div>

          <div className="dashboard-form-actions">
            <button type="button" className="dash-outline-btn" onClick={closeForm}>Cancel</button>
            <button type="button" className="dash-primary-btn" onClick={saveEducation}><Icon name="save" /> Save Education</button>
          </div>
        </div>
      )}

      <div className="education-stat-grid">
        <div className="edu-stat"><Icon name="education"/><span>INSTITUTIONS</span><strong>{items.length}</strong><p>Total Education</p></div>
        <div className="edu-stat purple"><Icon name="star"/><span>HIGHEST DEGREE</span><strong>{latest.degreeMajor ? latest.degreeMajor.split(' ')[0] : '-'}</strong><p>{latest.degreeMajor || 'Belum diisi'}</p></div>
        <div className="edu-stat green"><Icon name="calendar"/><span>GRADUATION</span><strong>{formatYear(latest.endDate)}</strong><p>Latest Graduation</p></div>
        <div className="edu-stat orange"><Icon name="star"/><span>GPA</span><strong>{latest.gpa || '-'}</strong><p>GPA Average</p></div>
      </div>

      <div className="education-list-display">
        {items.length ? items.map((item, index) => (
          <div className="education-display-card" key={`${item.institutionName}-${index}`}>
            <Icon name="education" />
            <div>
              <h2>{item.degreeMajor}</h2>
              <h3>{item.institutionName}</h3>
              <p>{item.location || 'Location belum diisi'} • {formatYear(item.startDate)} — {item.currentlyStudy ? 'Present' : formatYear(item.endDate)}</p>
              <span>{item.description || 'Description belum diisi.'}</span>
            </div>
            <div className="dashboard-row-actions">
              <button type="button" onClick={() => openEdit(item, index)}><Icon name="edit" /></button>
              <button type="button" onClick={() => deleteEducation(index)}><Icon name="trash" /></button>
            </div>
          </div>
        )) : <div className="empty-dashboard-card"><h3>Education belum diisi</h3><p>Data akan muncul setelah form Education selesai diisi.</p></div>}
      </div>
    </div>
  );
}

export default Education;
