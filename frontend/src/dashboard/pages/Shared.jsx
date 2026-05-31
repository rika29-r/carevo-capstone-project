export function Icon({ name }) {
  if (name === 'dashboard') return <svg viewBox="0 0 24 24"><path d="M4 4h6v6H4V4Z" /><path d="M14 4h6v6h-6V4Z" /><path d="M4 14h6v6H4v-6Z" /><path d="M14 14h6v6h-6v-6Z" /></svg>;
  if (name === 'user') return <svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg>;
  if (name === 'briefcase') return <svg viewBox="0 0 24 24"><path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4c1 0 1.8.8 1.8 1.8V7" /><path d="M4 7h16v12H4V7Z" /><path d="M4 12h16" /></svg>;
  if (name === 'education') return <svg viewBox="0 0 24 24"><path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" /><path d="M7 11v5c1.3 1.4 3 2 5 2s3.7-.6 5-2v-5" /></svg>;
  if (name === 'skill') return <svg viewBox="0 0 24 24"><path d="M12 3 14.2 8.4 20 9l-4.4 3.7 1.3 5.7L12 15.3 7.1 18.4l1.3-5.7L4 9l5.8-.6L12 3Z" /></svg>;
  if (name === 'folder') return <svg viewBox="0 0 24 24"><path d="M3.5 6.5h6l2 2h9v9.5h-17V6.5Z" /></svg>;
  if (name === 'shield') return <svg viewBox="0 0 24 24"><path d="M12 3.5 18.5 6v5.4c0 4-2.6 7.5-6.5 8.8-3.9-1.3-6.5-4.8-6.5-8.8V6L12 3.5Z" /><path d="m9 12 2 2 4-4" /></svg>;
  if (name === 'language') return <svg viewBox="0 0 24 24"><path d="M4 5h10" /><path d="M9 5c-.3 4.6-2.1 7.9-5 10" /><path d="M6.5 9.5c1.2 2.1 3.1 4 5.5 5.5" /><path d="M14 20l4-9 4 9" /><path d="M15.5 17h5" /></svg>;
  if (name === 'sparkle') return <svg viewBox="0 0 24 24"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" /><path d="M5 15l.8 2.8L8.5 19l-2.7.8L5 22l-.8-2.2L1.5 19l2.7-1.2L5 15Z" /></svg>;
  if (name === 'logout') return <svg viewBox="0 0 24 24"><path d="M10 5H5v14h5" /><path d="M14 8l4 4-4 4" /><path d="M18 12H9" /></svg>;
  if (name === 'bell') return <svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>;
  if (name === 'refresh') return <svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14.6-4.5L4 8" /><path d="M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.6 4.5L20 16" /><path d="M20 20v-4h-4" /></svg>;
  if (name === 'check') return <svg viewBox="0 0 24 24"><path d="m5 12 4.2 4.2L19 6.8" /></svg>;
  if (name === 'x') return <svg viewBox="0 0 24 24"><path d="M6 6l12 12" /><path d="M18 6 6 18" /></svg>;
  if (name === 'download') return <svg viewBox="0 0 24 24"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 20h14" /></svg>;
  if (name === 'menu') return <svg viewBox="0 0 24 24"><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></svg>;
  return null;
}

export function PageHeader({ title, subtitle, actionText, onAction }) {
  return (
    <div className="dash-page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actionText && <button type="button" onClick={onAction}>{actionText}</button>}
    </div>
  );
}

export function EmptyState({ title, message }) {
  return <div className="empty-state"><h3>{title}</h3><p>{message}</p></div>;
}

export function StatCard({ title, value, note }) {
  return <div className="stat-card"><p>{title}</p><h2>{value}</h2>{note && <small>{note}</small>}</div>;
}

export function StatusRow({ label, active }) {
  return <div className="status-row"><span>{label}</span><strong className={active ? 'status-complete' : 'status-empty'}>{active ? 'Complete' : 'Empty'}</strong></div>;
}

export function InfoBlock({ label, value }) {
  return <div className="info-block"><label>{label}</label><p>{value || '-'}</p></div>;
}