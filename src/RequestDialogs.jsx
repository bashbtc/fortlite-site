import { ArrowRight, TelegramLogo, Check } from '@phosphor-icons/react';
import { CopyRequest } from './CopyRequest.jsx';
import { formatAmount, validContact, visitSummary } from './inquiry.mjs';
import { site, phoneUrl, telegramDraftUrl } from './site.mjs';

function TelegramAction({ text, children = 'Открыть Telegram' }) {
  return <a className="button navy" href={telegramDraftUrl(text)} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"><TelegramLogo size={21}/>{children}</a>;
}

export function DealResult({ kind, amount, contact, summary }) {
  return <>
    <p className="eyebrow">Проверьте параметры</p>
    <h2 id="dialog-title">Обсудим вашу сделку</h2>
    <p>Проверьте данные и откройте переписку с менеджером. Сообщение нужно отправить в Telegram самостоятельно.</p>
    <dl><dt>Задача</dt><dd>{kind}</dd><dt>Сумма</dt><dd>{formatAmount(amount)}</dd><dt>Контакт</dt><dd>{contact.trim()}</dd></dl>
    <TelegramAction text={summary}/>
    <p className="small-note">После перехода текст обращения передаётся в Telegram. Пока вы не отправите сообщение, менеджер не получит заявку.</p>
    <CopyRequest text={summary}/>
    <p className="small-note">Предпочитаете разговор? <a href={phoneUrl}>{site.phoneDisplay}</a></p>
  </>;
}

export function VisitContent({ visit, setVisit, done, setDone }) {
  function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!visit.name.trim()) {
      form.elements.visitName.setCustomValidity('Укажите имя.');
      form.elements.visitName.reportValidity();
      return;
    }
    if (!validContact(visit.contact)) {
      form.elements.visitContact.setCustomValidity('Укажите телефон без лишних букв или Telegram в формате @username.');
      form.elements.visitContact.reportValidity();
      return;
    }
    setDone(true);
  }
  return <>
    <p className="eyebrow">Личная встреча · Уфа</p><h2 id="dialog-title">Записаться в офис</h2>
    {done ? <div className="visit-result">
      <Check size={38} weight="light"/><h3>Согласуем время встречи</h3>
      <p>Проверьте параметры и отправьте запрос менеджеру. Встреча будет назначена после его подтверждения.</p>
      <dl><dt>Имя</dt><dd>{visit.name.trim()}</dd><dt>Контакт</dt><dd>{visit.contact.trim()}</dd><dt>Когда удобно</dt><dd>{visit.time}</dd><dt>Адрес офиса</dt><dd>{site.address}</dd></dl>
      <TelegramAction text={visitSummary(visit)}>Обсудить встречу в Telegram</TelegramAction>
      <CopyRequest text={visitSummary(visit)}/>
      <button type="button" className="text-button edit-request" onClick={()=>setDone(false)}>Изменить параметры</button>
      <p className="small-note">После перехода текст передаётся в Telegram. Отправьте сообщение самостоятельно или позвоните <a href={phoneUrl}>{site.phoneDisplay}</a>.</p>
    </div> : <form className="visit-form" onSubmit={submit}>
      <p>Оставьте удобный контакт — время и детали визита согласуем индивидуально.</p>
      <label>Как к вам обращаться<input name="visitName" value={visit.name} onChange={e=>{e.target.setCustomValidity('');setVisit({...visit,name:e.target.value});}} autoComplete="given-name" maxLength={80} placeholder="Ваше имя" required/></label>
      <label>Телефон или Telegram<input name="visitContact" value={visit.contact} maxLength={64} onChange={e=>{e.target.setCustomValidity('');setVisit({...visit,contact:e.target.value});}} placeholder="Телефон или @username" autoComplete="tel" required/></label>
      <label>Когда удобно<select value={visit.time} onChange={e=>setVisit({...visit,time:e.target.value})}><option>По договорённости</option><option>В первой половине дня</option><option>Во второй половине дня</option></select></label>
      <label className="visit-consent"><input type="checkbox" required/><span>Согласен на обработку данных для обсуждения встречи. <a href="/documents/consent" target="_blank" rel="noopener noreferrer">Текст согласия</a></span></label>
      <p className="small-note">{site.address}. Перед визитом подтвердите время с менеджером.</p>
      <button className="button navy" type="submit">Проверить запрос<ArrowRight size={19}/></button>
    </form>}
  </>;
}
