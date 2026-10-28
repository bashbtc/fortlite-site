import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react';
import { cbrAdmissionUrl } from './site.mjs';
import { legalPages } from './legal-content.mjs';
import { SiteFooter } from './SiteFooter.jsx';
import { SiteHeader } from './SiteHeader.jsx';

const otherDocs = ['status', 'company', 'privacy', 'consent', 'risks', 'aml', 'terms', 'cookies', 'sitemap'];
const anchor = i => `section-${i + 1}`;

function DocShell({ eyebrow, title, children, aside, current }) {
  return <><a className="skip-link" href="#main">К содержимому</a><div className="page-shell bridge-theme doc-theme">
    <SiteHeader home="/"/>
    <main id="main">
      <section className="doc-hero">
        <a className="doc-back" href="/"><ArrowLeft size={16}/>На главную</a>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </section>
      <div className="band band-light doc-band">
        <div className={aside ? 'doc-layout' : 'doc-layout doc-layout-single'}>
          {aside}
          <article className="doc-body">{children}</article>
        </div>
        <nav className="doc-others" aria-label="Другие документы">
          <p className="eyebrow">Другие документы</p>
          <div>{otherDocs.filter(key => key !== current && legalPages[key]).map(key =>
            <a key={key} href={`/documents/${key}`}>{legalPages[key].title}<ArrowUpRight size={18}/></a>)}</div>
        </nav>
      </div>
    </main>
    <SiteFooter/>
  </div></>;
}

export function NotFoundPage() {
  return <DocShell eyebrow="Ошибка 404" title="Страница не найдена">
    <p className="legal-intro">Такой страницы на сайте нет. Возможно, адрес набран с ошибкой или страница была перемещена.</p>
    <div className="doc-actions"><a className="button gold" href="/">На главную</a><a className="text-button" href="/documents/sitemap">Карта сайта<ArrowUpRight size={18}/></a></div>
  </DocShell>;
}

export function DocumentPage({ type }) {
  const doc = legalPages[type];
  if (!doc) return <NotFoundPage/>;
  const toc = doc.sections.length > 2 && <nav className="doc-toc" aria-label="Содержание">
    <p>Содержание</p>
    <ol>{doc.sections.map(([title], i) => <li key={title}><a href={`#${anchor(i)}`}>{title}</a></li>)}</ol>
  </nav>;
  return <DocShell eyebrow="Документы компании" title={doc.title} aside={toc} current={type}>
    {doc.edition && <p className="document-edition">{doc.edition}</p>}
    {doc.draft && <p className="document-state" role="note">{doc.draftNote || 'Проект раздела. Реквизиты и фактические условия обработки должны быть подтверждены до публичного запуска.'}</p>}
    <p className="legal-intro">{doc.intro}</p>
    {doc.links && <nav className="document-page-links" aria-label={doc.title}>{doc.links.map(([href, label]) => <a href={href} key={href}>{label}<ArrowUpRight size={17}/></a>)}</nav>}
    {doc.sections.map(([title, text], i) => <section key={title} id={anchor(i)}><h2>{title}</h2><p>{text}</p></section>)}
    {type === 'status' && <a className="text-button doc-external" href={cbrAdmissionUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Порядок допуска на сайте Банка России<ArrowUpRight size={18}/></a>}
  </DocShell>;
}
