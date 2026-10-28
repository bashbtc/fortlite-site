import { useEffect, useState } from 'react';
import { ArrowUpRight, MapPin, List, X } from '@phosphor-icons/react';
import { telegramUrl } from './site.mjs';

// One header for the home page and every document page.
export function SiteHeader({ home = '', onVisit }) {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 36);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const close = () => setMenu(false);
  return <header className={scrolled ? 'header is-scrolled' : 'header'}>
    <a href={home || '#'} className="brand" aria-label="FortLite Capital — главная"><img src="/assets/logo.webp" alt="FortLite Capital"/></a>
    <nav id="main-navigation" aria-label="Главное меню" className={menu ? 'navigation is-open' : 'navigation'}>
      <a href={`${home}#process`} onClick={close}>Как работаем</a>
      <a href={`${home}#useful-for`} onClick={close}>Кому подходит</a>
      <a href={`${home}#status`} onClick={close}>О компании</a>
      <a href={`${home}#office`} onClick={close}>Контакты</a>
      {onVisit
        ? <button className="mobile-visit" onClick={() => { close(); onVisit(); }}>Записаться в офис</button>
        : <a className="mobile-visit" href={`${home}#office`} onClick={close}>Записаться в офис</a>}
    </nav>
    <a className="header-cta" href={telegramUrl} target="_blank" rel="noopener noreferrer">Узнать о запуске<ArrowUpRight size={17}/></a>
    <a href={`${home}#office`} className="location"><MapPin size={22} weight="light"/><span>Уфа</span></a>
    <button className="menu-toggle" aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menu} aria-controls="main-navigation" onClick={() => setMenu(!menu)}>{menu ? <X size={26}/> : <List size={26}/>}</button>
  </header>;
}
