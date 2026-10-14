import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';

export default function StatCard({ title, value, icon, index = 0, detail }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisplay(value); return; }
    const start = performance.now();
    let frame;
    const tick = now => {
      const progress = Math.min((now - start) / 650, 1);
      setDisplay(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <article className="metric-card" style={{ animationDelay: `${index * 85}ms` }}><div className="metric-card-top"><span className="metric-icon"><Icon name={icon} size={21} /></span><span className="metric-card-label">{title}</span></div><strong className="metric-value">{display.toLocaleString()}</strong><span className="metric-detail">{detail}</span></article>;
}
