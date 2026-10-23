import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export type IconName = 'shield' | 'arrow' | 'overview' | 'plus' | 'report' | 'plan' | 'scope' | 'search' | 'close' | 'menu' | 'globe' | 'check' | 'info' | 'external';
const paths: Record<IconName, ReactNode> = {
 shield: <><path d="M12 3 20 6v6c0 5-5 8-8 10-3-2-8-5-8-10V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></>,
 arrow: <><path d="M4 12h15m-5-5 5 5-5 5"/></>,
 overview: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
 plus: <path d="M12 5v14M5 12h14"/>, report: <><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5"/></>,
 plan: <><path d="m3 6 2 2 3-4m3 3h10M3 13l2 2 3-4m3 3h10M4 21h3m4 0h10"/></>,
 scope: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/></>,
 search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>, close: <path d="m6 6 12 12M6 18 18 6"/>, menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
 globe: <><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></>, check: <path d="m5 12 4 4L19 6"/>, info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/></>, external: <path d="M8 5h11v11M19 5 5 19"/>,
};
export function Icon({ name, className = '' }: { name: IconName; className?: string }) { return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>; }
export function Brand() { return <Link to="/" className="brand" aria-label="Sentinel home"><Icon name="shield"/>Sentinel<span className="brand-dot">.</span></Link>; }
export function ActionLink({ to, children, secondary = false }: { to: string; children: ReactNode; secondary?: boolean }) { return <Link className={`button ${secondary ? 'secondary' : ''}`} to={to}>{children}<Icon name="arrow"/></Link>; }
export function PreviewNote({ children }: { children?: ReactNode }) { return <p className="preview-note"><Icon name="info"/>{children || 'Frontend preview. Scanning is not connected.'}</p>; }
export const scopeGroups = [
 { title: 'Public-surface checks', intro: 'Once a scanning service is connected, a public scan could look at what your app makes openly available.', items: ['Public HTML and page structure', 'Client-side scripts and assets', 'HTTP response headers'] },
 { title: 'Checks that need deeper access', intro: 'These protections require appropriate configuration, code access or scoped, authorized testing.', items: ['Authentication behavior', 'Authorization and access controls', 'Database rules and permissions'] },
];
export function ScopeContent() { return <><div className="scope-grid">{scopeGroups.map((g, i) => <section key={g.title} className="scope-group"><Icon name={i === 0 ? 'globe' : 'shield'}/><h3>{g.title}</h3><p>{g.intro}</p><ul>{g.items.map(item => <li key={item}>{item}</li>)}</ul></section>)}</div><div className="scope-foot"><strong>A public URL alone cannot verify these protections.</strong><p>A good grade is never a guarantee.</p></div></>; }
export function Dialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
 const ref = useRef<HTMLDialogElement>(null); const id = useId();
 useEffect(() => { const previous = document.activeElement as HTMLElement; const dialog = ref.current; dialog?.showModal(); return () => { dialog?.close(); previous?.focus(); }; }, []);
 return <dialog ref={ref} aria-labelledby={id} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}><div className="dialog-head"><h2 id={id}>{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><Icon name="close"/></button></div>{children}</dialog>;
}
export function ScopeDialog({ onClose }: { onClose: () => void }) { return <Dialog title="A clearer view. An honest scope." onClose={onClose}><ScopeContent/><PreviewNote/></Dialog>; }
export function validateUrl(value: string) { if (!value.trim()) return ''; try { const url = new URL(value.trim()); if (!['https:', 'http:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) return 'Enter a public http:// or https:// address without credentials.'; return ''; } catch { return 'Enter a complete URL, such as https://your-app.com.'; } }
export interface UrlFormProps { value: string; onChange: (value: string) => void; workspace?: boolean; compact?: boolean }
export function UrlForm({ value, onChange, workspace = false, compact = false }: UrlFormProps) {
 const navigate = useNavigate(); const id = useId(); const [error, setError] = useState('');
 function validate() { const message = validateUrl(value); setError(message); return !message; }
 return <form className={`url-panel ${workspace ? 'workspace-url' : ''}`} noValidate onSubmit={e => { e.preventDefault(); if (validate() && !workspace) navigate('/workspace/new-scan'); }}>{!compact && <div className="url-panel-heading"><span className="small-icon"><Icon name="globe"/></span><div><h2>Start with your app’s URL.</h2><p>A little visibility. A lot less guesswork.</p></div></div>}<label htmlFor={id}>App URL</label><div className="url-input-row"><input id={id} type="url" autoComplete="off" spellCheck={false} placeholder="https://your-app.com" value={value} onChange={e => { onChange(e.target.value); if (error) setError(validateUrl(e.target.value)); }} onBlur={validate} aria-invalid={!!error} aria-describedby={[!compact && `${id}-note`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}/><button className="button" type="submit" disabled={workspace}>{workspace ? 'Run scan' : compact ? 'Open workspace' : 'Open scan workspace'}<Icon name="arrow"/></button></div>{error && <p className="input-error" id={`${id}-error`} role="alert">{error}</p>}{!compact && <p className="preview-note" id={`${id}-note`}><Icon name="info"/>{workspace ? 'Scanning is not connected in this frontend preview.' : 'Frontend preview. Scanning is not connected.'}</p>}</form>;
}
export function EmptyState({ icon = 'report', title, children, action }: { icon?: IconName; title: string; children: ReactNode; action?: ReactNode }) { return <div className="empty-state"><span className="empty-icon"><Icon name={icon}/></span><h3>{title}</h3><p>{children}</p>{action}</div>; }
export function FilterTabs({ items, value, onChange, label }: { items: string[]; value: string; onChange: (value: string) => void; label: string }) { return <div className="filter-tabs" role="group" aria-label={label}>{items.map(item => <button key={item} aria-pressed={value === item} onClick={() => onChange(item)}>{item}</button>)}</div>; }
export const reportSections = ['Summary', 'Findings', 'Evidence', 'Recommended next steps', 'Builder prompts', 'Coverage and limitations'];
export function ReportPreview({ compact = false }: { compact?: boolean }) { const [section, setSection] = useState('Summary'); return <div className={`report-preview ${compact ? 'compact' : ''}`}><div className="report-preview-head"><span><Icon name="report"/> {compact ? 'Your security report' : 'Report layout preview'}</span><span className="subtle">Not assessed</span></div><div className="report-preview-body"><nav aria-label="Report sections">{reportSections.map(s => <button key={s} aria-pressed={section === s} onClick={() => setSection(s)}>{s}{section === s && <Icon name="arrow"/>}</button>)}</nav><div className="report-content"><span className="subtle">{section}</span>{section === 'Coverage and limitations' ? <div className="report-scope"><p>A future scan can inspect public HTML, client-side assets and HTTP response headers.</p><p>A public URL alone cannot verify authentication, authorization or database rules.</p><PreviewNote/></div> : <EmptyState title="Your report will appear here after a scan.">{section === 'Builder prompts' ? 'Guidance to take back to your builder will live here.' : section === 'Evidence' ? 'Observations and their context will live here.' : section === 'Recommended next steps' ? 'Practical guidance will live here when findings are available.' : 'A place for clear explanations and practical next steps.'}</EmptyState>}</div></div></div>; }



