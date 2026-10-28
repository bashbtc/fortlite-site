import { useId, useState } from 'react';
import { Plus } from '@phosphor-icons/react';

// A card whose description opens as a popover: hover or focus on desktop, tap on touch screens.
export function TipCard({ className = '', head, tip, after, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const toggle = () => setOpen(value => !value);
  return <article
    className={`tip-card tip-${align} ${open ? 'is-open' : ''} ${className}`.trim()}
    tabIndex={0}
    aria-describedby={id}
    onClick={toggle}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      if (e.key === 'Escape') setOpen(false);
    }}
    onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
  >
    {head}
    <span className="tip-cue" aria-hidden="true">Подробнее<Plus size={13}/></span>
    {after}
    <div className="tip-pop" id={id} role="tooltip">{tip}</div>
  </article>;
}
