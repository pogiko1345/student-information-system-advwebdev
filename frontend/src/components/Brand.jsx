export default function Brand({ compact = false }) {
  return <div className={`sis-brand ${compact ? 'sis-brand--compact' : ''}`}>
    <img src="/nu-logo.webp" alt="National University" width="389" height="128" />
    <span className="sis-brand__campus">MOA Campus</span>
  </div>;
}
