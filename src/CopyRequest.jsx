import { useState } from 'react';
import { Check, Copy } from '@phosphor-icons/react';

export function CopyRequest({ text }) {
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFallback(false);
    } catch {
      setCopied(false);
      setFallback(true);
    }
  }
  return <div className="copy-request">
    <button type="button" className="button navy" onClick={copy}>
      {copied ? <Check size={19}/> : <Copy size={19}/>}
      {copied ? 'Запрос скопирован' : 'Скопировать запрос'}
    </button>
    {copied && <p className="small-note" role="status">Текст можно вставить в переписку с менеджером.</p>}
    {fallback && <div className="copy-fallback">
      <p className="small-note" role="status">Браузер не разрешил копирование. Выделите текст ниже и скопируйте вручную.</p>
      <label htmlFor="copy-text">Текст для копирования</label>
      <textarea id="copy-text" readOnly value={text} onFocus={e=>e.target.select()} />
    </div>}
  </div>;
}
