import { useState } from 'react';
import { getCertificationList, formatDate } from './helpers';

const emptyCertification = {
  certificateName: '',
  issuer: '',
  issueDate: '',
  expirationDate: '',
  credentialId: '',
  description: '',
};

function Icon({ name }) {
  if (name === 'cert') return <svg viewBox="0 0 24 24"><path d="M7 3h10v18H7V3Z"/><path d="M9.5 7h5"/><path d="M9.5 11h5"/><path d="M9.5 15h3"/></svg>;
  if (name === 'shield') return <svg viewBox="0 0 24 24"><path d="M12 3.5 18.5 6v5.4c0 4-2.6 7.5-6.5 8.8-3.9-1.3-6.5-4.8-6.5-8.8V6L12 3.5Z"/><path d="m9 12 2 2 4-4"/></svg>;
  if (name === 'calendar') return <svg viewBox="0 0 24 24"><path d="M7 3v4"/><path d="M17 3v4"/><path d="M4 8h16"/><path d="M5 5h14v16H5V5Z"/></svg>;
  if (name === 'trophy') return <svg viewBox="0 0 24 24"><path d="M8 4h8v3a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4c0 3 1.5 5 4 5"/><path d="M16 6h4c0 3-1.5 5-4 5"/><path d="M12 11v5"/><path d="M9 20h6"/></svg>;
  if (name === 'download') return <svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg>;
  if (name === 'external') return <svg viewBox="0 0 24 24"><path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M20 14v6H4V4h6"/></svg>;
  if (name === 'save') return <svg viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5V4Z"/><path d="M8 4v6h8V4"/><path d="M8 20v-6h8v6"/></svg>;
  if (name === 'x') return <svg viewBox="0 0 24 24"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>;
  if (name === 'edit') return <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"/></svg>;
  if (name === 'trash') return <svg viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/></svg>;
  return null;
}

function Certification({ formData = {}, setFormData, notify }) {
  const [certs, setCerts] = useState(() => getCertificationList(formData));
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(emptyCertification);
  const [editingIndex, setEditingIndex] = useState(null);
  const latest = certs[0] || {};

  const update = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const openAdd = () => {
    setDraft(emptyCertification);
    setEditingIndex(null);
    setShowForm(true);
  };

  const openEdit = (cert, index) => {
    setDraft({ ...emptyCertification, ...cert });
    setEditingIndex(index);
    setShowForm(true);
  };

  const closeForm = () => {
    setDraft(emptyCertification);
    setEditingIndex(null);
    setShowForm(false);
  };

  const saveCertification = () => {
    if (!draft.certificateName.trim() || !draft.issuer.trim()) {
      notify?.('error', 'Data Belum Lengkap', 'Certification name dan issuer wajib diisi.');
      return;
    }

    const saved = { ...draft };
    const nextCerts = editingIndex === null
      ? [saved, ...certs]
      : certs.map((cert, index) => (index === editingIndex ? saved : cert));

    setCerts(nextCerts);
    setFormData?.((prev) => ({
      ...prev,
      certifications: nextCerts[0] || emptyCertification,
      certificationList: nextCerts,
      certificationsList: nextCerts,
    }));
    notify?.('success', 'Certification Saved', 'Data certification berhasil disimpan.');
    closeForm();
  };

  const deleteCertification = (index) => {
    const nextCerts = certs.filter((_, itemIndex) => itemIndex !== index);
    setCerts(nextCerts);
    setFormData?.((prev) => ({
      ...prev,
      certifications: nextCerts[0] || emptyCertification,
      certificationList: nextCerts,
      certificationsList: nextCerts,
    }));
    notify?.('success', 'Certification Deleted', 'Data certification berhasil dihapus.');
  };

  return (
    <div className="cert-display-page">
      <div className="display-header">
        <div><h1>My Certifications</h1><p>Highlight your professional certifications and achievements.</p></div>
        <button type="button" onClick={openAdd}>+ Add Certification</button>
      </div>

      {showForm && (
        <div className="dash-edit-card dashboard-form-box simple-add-form">
          <div className="dashboard-form-head">
            <div><h2>{editingIndex === null ? 'Add Certification' : 'Edit Certification'}</h2><p>Isi data sertifikasi sesuai form Certification.</p></div>
            <button type="button" className="form-close-btn" onClick={closeForm}><Icon name="x" /></button>
          </div>

          <div className="dashboard-two-col-form">
            <label className="dash-field"><span>Certification Name</span><input value={draft.certificateName} onChange={(e) => update('certificateName', e.target.value)} placeholder="Google Data Analytics" /></label>
            <label className="dash-field"><span>Issuer</span><input value={draft.issuer} onChange={(e) => update('issuer', e.target.value)} placeholder="Google / Coursera" /></label>
            <label className="dash-field"><span>Issue Date</span><input type="date" value={draft.issueDate} onChange={(e) => update('issueDate', e.target.value)} /></label>
            <label className="dash-field"><span>Expiration Date</span><input type="date" value={draft.expirationDate} onChange={(e) => update('expirationDate', e.target.value)} /></label>
            <label className="dash-field form-full"><span>Credential ID</span><input value={draft.credentialId} onChange={(e) => update('credentialId', e.target.value)} placeholder="Credential ID" /></label>
            <label className="dash-field form-full"><span>Description</span><textarea value={draft.description} onChange={(e) => update('description', e.target.value)} placeholder="Describe what you learned or achieved..." /></label>
          </div>

          <div className="dashboard-form-actions">
            <button type="button" className="dash-outline-btn" onClick={closeForm}>Cancel</button>
            <button type="button" className="dash-primary-btn" onClick={saveCertification}><Icon name="save" /> Save Certification</button>
          </div>
        </div>
      )}

      <div className="cert-stat-grid"><div><Icon name="cert"/><span>TOTAL CERTIFICATIONS</span><strong>{certs.length}</strong><p>All time</p></div><div><Icon name="shield"/><span>VERIFIED</span><strong>{certs.length}</strong><p>{certs.length ? '100% Verified' : '0% Verified'}</p></div><div><Icon name="calendar"/><span>LATEST CERTIFICATION</span><strong>{latest.issueDate ? formatDate(latest.issueDate).split(' ').slice(1).join(' ') : '-'}</strong><p>{latest.issueDate ? 'Latest issue' : 'Belum diisi'}</p></div><div><Icon name="trophy"/><span>CERTIFICATE SCORE</span><strong>{certs.length ? Math.min(1000, 700 + certs.length * 90) : 0}</strong><p>{certs.length ? 'Outstanding' : 'Empty'}</p></div></div>

      <div className="cert-list-display">
        {certs.length ? certs.map((cert, index) => (
          <div className="cert-display-card" key={`${cert.certificateName}-${index}`}>
            <div className="cert-logo-box">{cert.certificateName?.slice(0, 3)?.toUpperCase() || 'CV'}</div>
            <div className="cert-info-box"><h2>{cert.certificateName}</h2><h3>{cert.issuer || 'Issuer belum diisi'}</h3><p>{cert.description || 'Description belum diisi.'}</p><div><span>Issued {formatDate(cert.issueDate)}</span><span>Credential ID: {cert.credentialId || '-'}</span></div></div>
            <span className="verified-badge">Verified</span>
            <div className="cert-actions"><button type="button" onClick={() => openEdit(cert, index)}><Icon name="edit" /></button><button type="button" onClick={() => deleteCertification(index)}><Icon name="trash" /></button></div>
          </div>
        )) : <div className="empty-dashboard-card"><h3>Certification belum diisi</h3><p>Certification termasuk data utama. Isi form Certification agar score dashboard meningkat.</p></div>}
      </div>
      <button type="button" className="add-cert-wide" onClick={openAdd}>+ Add Certification</button>
    </div>
  );
}

export default Certification;
