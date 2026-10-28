import { useEffect, useRef, useState } from 'react';
import { useRevealMotion } from './useRevealMotion.mjs';
import { GoldDust } from './GoldDust.jsx';
import { entity } from './entity.mjs';
import { DocumentPage, NotFoundPage } from './DocumentPage.jsx';
import { formatAmount, validateInquiry } from './inquiry.mjs';
import { site, phoneUrl, telegramUrl, mapUrl } from './site.mjs';
import { DealResult, VisitContent } from './RequestDialogs.jsx';
import { SiteFooter } from './SiteFooter.jsx';
import { SiteHeader } from './SiteHeader.jsx';
import { TipCard } from './TipCard.jsx';
import { ArrowUpRight, ArrowRight, MapPin, User, List, X, Plus, CalendarBlank, Phone, TelegramLogo, Buildings, CaretDown, EnvelopeSimple } from '@phosphor-icons/react';
const services={personal:[['Покупка и продажа','Обсудим покупку или продажу криптовалюты за рубли. Менеджер уточнит актив, сумму, способ расчёта и адрес кошелька.'],['Обмен криптовалют','Согласуем направление обмена, сеть перевода, адрес получения и порядок подтверждения операции.'],['Крупные сделки','Персонально обсудим объём, подготовку, проверку реквизитов и последовательность расчётов.']],business:[['Покупка с расчётного счёта','Разберём задачу ООО или ИП, предполагаемый объём, основание операции и комплект документов.'],['Расчёты для бизнеса','Предварительно оценим задачу, контрагента и допустимость планируемого расчёта. Конкретный формат определяется после проверки.'],['Персональное сопровождение','Один менеджер координирует условия, документы, встречу и вопросы по проведению операции.']]};
const dealControls=[
 ['Условия','Фиксация до расчёта','Заранее согласуем актив, объём, итоговую стоимость, способ расчёта и срок действия предложения.'],
 ['Проверка','Клиент и цель операции','До начала уточняем сведения о клиенте, происхождении средств и экономическом смысле операции в необходимом объёме.'],
 ['Кошелёк','Сеть и адрес','Перед переводом отдельно сверяем сеть, полный адрес кошелька и дополнительные реквизиты, если они требуются.'],
 ['Передача','Подтверждение операции','После отправки цифрового актива фиксируем идентификатор транзакции и сведения, позволяющие проверить её в блокчейне.'],
 ['Документы','Состав под задачу','Комплект определяется видом клиента, способом расчёта и условиями конкретной операции.'],
 ['Сопровождение','Один менеджер','Менеджер ведёт коммуникацию от первичного запроса до согласования итоговых подтверждений.'],
];
const documentPack=['Договор или документ-основание','Заявка или спецификация','Документ по расчётам','Акт или подтверждение передачи','Согласованные сеть и адрес','TxID блокчейн-транзакции'];
const clientScenarios=[
 ['Частный клиент','Покупка или продажа цифрового актива за рубли с предварительным согласованием полной стоимости.'],
 ['Владелец портфеля','Обмен одного цифрового актива на другой с проверкой сети и реквизитов получения.'],
 ['Крупная операция','Заранее выстроенная последовательность расчётов, переводов и подтверждений.'],
 ['Индивидуальный предприниматель','Разбор деловой цели, способа расчёта и документов, необходимых для конкретной задачи.'],
 ['Юридическое лицо','Предварительная оценка покупки цифрового актива с расчётного счёта и состава подтверждений.'],
 ['Бизнес-задача','Проверка допустимости планируемого расчёта до обсуждения конкретной схемы и условий.'],
];
const usefulFor=[
 'Ритейл, дистрибьюторы и селлеры',
 'Импортёры и экспортёры',
 'Торговые дома',
 'Строительные компании',
 'Производственные предприятия',
 'Автомобильный бизнес',
 'Образование и EdTech',
 'Туризм и деловые поездки',
 'IT и аутсорсинг',
 'Игры и медиа',
 'Финансовые компании',
 'Юридические лица и ИП',
];
const cashlessBenefits=[
 ['Без перевозки наличных','Не требуется передавать, пересчитывать или перевозить крупную сумму наличными. Это снижает риски утраты и ошибок при расчёте.'],
 ['Прозрачный платёжный след','Банковские документы позволяют подтвердить плательщика, получателя, сумму и дату перечисления.'],
 ['Работа по договору','Условия операции, порядок расчёта и обязанности сторон фиксируются в согласованных документах до оплаты.'],
 ['Оплата со счёта клиента','Платёж поступает с расчётного счёта проверенного ООО или ИП, участвующего в операции.'],
 ['Понятное назначение платежа','В платёжном поручении указываются основание и назначение, связанные с договором и деловой целью операции.'],
 ['Сверка реквизитов','До перечисления стороны повторно проверяют получателя, банковские реквизиты, сумму и основание платежа.'],
 ['Документы для учёта','Платёжное поручение и согласованный комплект документов формируют проверяемую основу для бухгалтерского и налогового учёта.'],
 ['Контроль суммы и срока','Точная сумма, срок действия условий и последовательность исполнения согласуются до отправки средств.'],
];
const trustReasons=[
 ['Условия до начала','Актив, сумма, стоимость, способ расчёта и последовательность действий согласуются заранее.'],
 ['Личный контакт','На первом этапе работа строится вокруг встречи в офисе FortLite Capital в Уфе.'],
 ['Проверка реквизитов','Перед переводом повторно сверяются сеть, адрес кошелька и параметры операции.'],
 ['Подтверждения по сделке','Состав документов и итоговых подтверждений определяется до начала операции.'],
];
const faq=[
 ['Можно ли провести сделку сейчас?','Нет. До включения FortLite Capital в реестр организаций, осуществляющих обмен цифровых валют, операции обмена не проводятся, а денежные средства и цифровые валюты не принимаются. Оставьте контакт — мы сообщим о запуске.'],
 ['Как юридическому лицу начать подготовку сделки?','Представитель компании сообщает предполагаемую сумму, цифровую валюту, цель приобретения и реквизиты организации. После первичного рассмотрения менеджер направляет перечень сведений для проверки и согласования условий. Проведение операции возможно после подтверждения её правовой допустимости и необходимого статуса FortLite Capital.'],
 ['Как индивидуальному предпринимателю оформить обращение?','ИП указывает деловую цель, предполагаемую сумму и способ дальнейшего использования цифровой валюты. Оплата обсуждается с предпринимательского расчётного счёта после проверки и согласования документов.'],
 ['Кто может обратиться в FortLite Capital?','Корпоративное направление рассчитано на российские юридические лица и индивидуальных предпринимателей. Обращения частных клиентов рассматриваются отдельно с учётом характера операции и применимых требований.'],
 ['Какие сведения потребуются для первичной проверки?','Обычно запрашиваются карточка организации или ИП, ИНН, ОГРН либо ОГРНИП, адреса, банковские реквизиты, сведения о представителе и бенефициарных владельцах, а также описание цели операции. Точный перечень зависит от клиента и задачи.'],
 ['Как проходит проверка клиента и операции?','Проверяются регистрационные сведения, полномочия представителя, структура владения, деловая цель, источник средств и факторы риска. При необходимости могут быть запрошены дополнительные документы и пояснения.'],
 ['Когда согласуются договор и условия?','После предварительной проверки стороны согласуют цифровую валюту, объём, стоимость, сеть, адрес кошелька, порядок расчёта и передачи. Применимый комплект документов определяется для конкретной операции.'],
 ['Как определяется стоимость цифровой валюты?','Итоговая стоимость рассчитывается индивидуально с учётом актива, объёма и условий исполнения. До оплаты клиент получает согласованные сведения о рублёвой сумме и количестве цифровой валюты.'],
 ['Какая минимальная сумма обращения?','FortLite Capital рассматривает обращения от 50 000 ₽. Минимальная сумма будет действовать после допуска; возможность, параметры и итоговые условия конкретной операции подтверждаются после проверки.'],
 ['Как проходит оплата по безналичному расчёту?','Юридическое лицо или ИП перечисляет рубли со своего расчётного счёта по согласованным реквизитам и назначению платежа. Основание, сумма и порядок исполнения фиксируются в документах до оплаты.'],
 ['Сколько времени занимает исполнение?','Срок согласуется до оплаты и зависит от банковского перевода, проверки документов, выбранной сети и числа подтверждений в блокчейне. Менеджер сообщает ориентир и условия начала отсчёта для конкретной операции.'],
 ['Куда поступает цифровая валюта?','На адрес кошелька, заранее указанный клиентом и согласованный в документах. Перед переводом повторно проверяются сеть, полный адрес и дополнительные реквизиты, если они требуются.'],
 ['Как выбирается сеть перевода?','Сеть определяется для конкретной цифровой валюты и кошелька клиента. До исполнения клиент подтверждает совместимость сети и корректность адреса; перевод в неподдерживаемую сеть может привести к утрате актива.'],
 ['Что такое TxID и зачем он нужен?','TxID — идентификатор блокчейн-транзакции. По нему можно проверить статус, время и основные параметры перевода в публичном обозревателе соответствующей сети.'],
 ['Какие документы получает клиент?','Предполагаемый комплект может включать договор или иной документ-основание, счёт, заявку или спецификацию, подтверждение расчёта, акт передачи и сведения о TxID. Окончательный состав определяется условиями операции.'],
 ['Что фиксируется в подтверждении передачи?','В документе могут быть указаны стороны, цифровая валюта, количество, согласованная стоимость, сеть, адрес кошелька, дата передачи и TxID. Конкретная форма согласуется до начала операции.'],
 ['Возможен ли электронный документооборот?','Формат обмена и подписания документов согласуется с клиентом заранее. Возможность использования ЭДО зависит от готовности сторон и комплекта документов по операции.'],
 ['Как учитывать цифровую валюту и налоги?','Бухгалтерский и налоговый порядок зависит от цели приобретения, последующего использования и обстоятельств операции. Клиенту следует подтвердить учётную модель и налоговую позицию со своим бухгалтером или налоговым консультантом.'],
 ['Можно ли использовать цифровую валюту во внешнеэкономической деятельности?','Только когда это допускается применимым законодательством и условиями конкретного внешнеторгового договора. До операции необходимо отдельно проверить договор, валютный контроль, документы по поставке и требования обслуживающего банка.'],
 ['Кто отвечает за дальнейшее использование цифровой валюты?','Клиент самостоятельно определяет дальнейшее использование полученного актива и отвечает за соблюдение законодательства, условий договора и требований своих контрагентов и банков.'],
 ['На каком этапе находится FortLite Capital?','Компания готовит документы для получения права на осуществление деятельности ОООЦВ и включения в реестр Банка России. Подготовка документов сама по себе не означает наличие такого права; подтверждённые изменения статуса будут опубликованы на сайте.'],
];
const faqGroups=[
 ['Начало работы',faq.slice(0,6)],
 ['Условия и оплата',faq.slice(6,11)],
 ['Передача и документы',faq.slice(11,17)],
 ['Учёт и компания',faq.slice(17)],
];
const legalDocuments=[
 ['status','Статус подготовки','Этап допуска, границы текущей деятельности и ссылка на порядок Банка России.','Открытая информация'],
 ['privacy','Персональные данные','Какие данные используются в обращениях, где они находятся и как реализуются права субъекта.','Проект к запуску'],
 ['risks','Сообщение о рисках','Рыночные, технологические, правовые и операционные риски цифровых валют.','Открытая информация'],
 ['aml','Проверка клиента и ПОД/ФТ','Сведения о клиенте, деловой цели, источнике средств и основаниях для приостановки проверки.','Проект процедуры'],
 ['terms','Правила использования сайта','Назначение материалов, границы консультации и порядок подготовки обращения.','Действует для сайта'],
 ['company','Реквизиты компании','Наименование, ИНН, ОГРН, юридический адрес, офис и официальный домен.','По карточке компании'],
];
const businessDealSteps=[
 ['Заявка и проверка компании','ООО или ИП сообщает предполагаемую сумму, цифровой актив, сеть, адрес кошелька и деловую цель. Уточняем сведения о компании, полномочиях, источнике средств и допустимости задачи.','Предварительное решение и перечень сведений'],
 ['Условия, договор и счёт','После положительной проверки согласуем актив, итоговую стоимость, объём, сеть, адрес кошелька, порядок расчёта и передачи. Параметры фиксируются в документах.','Согласованный комплект и счёт на оплату'],
 ['Оплата с расчётного счёта','После подписания документов юридическое лицо или ИП перечисляет рубли со своего расчётного счёта по указанным реквизитам и назначению платежа.','Подтверждение поступления оплаты'],
 ['Передача и подтверждения','После выполнения согласованных условий цифровой актив направляется по подтверждённым реквизитам. Клиент получает предусмотренные документы и TxID транзакции.','Цифровой актив и подтверждения по операции'],
];
const heroRoute=[
 ['01','Проверка','задачи'],
 ['02','Условия','и договор'],
 ['03','Оплата','со счёта'],
 ['04','Передача','и TxID'],
];

function ServiceSite(){
 const pageRef=useRef(null);
 useRevealMotion(pageRef);
 const [menu,setMenu]=useState(false),[audience,setAudience]=useState('personal'),[kind,setKind]=useState('Покупка криптовалюты'),[amount,setAmount]=useState(''),[contact,setContact]=useState(''),[consent,setConsent]=useState(false),[error,setError]=useState(''),[errorField,setErrorField]=useState(''),[modal,setModal]=useState(null),[appointmentDone,setAppointmentDone]=useState(false),[visit,setVisit]=useState({name:'',contact:'',time:'По договорённости'}),[documentsOpen,setDocumentsOpen]=useState(false),[faqTab,setFaqTab]=useState(0),[stepProgress,setStepProgress]=useState(0);
 const stepsRef=useRef(null);
 useEffect(()=>{
   const el=stepsRef.current;if(!el)return;
   const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if(reduce){setStepProgress(1);return;}
   let raf=0;
   const update=()=>{raf=0;const r=el.getBoundingClientRect(),vh=window.innerHeight;const p=Math.min(1,Math.max(0,(vh*0.78-r.top)/(r.height+vh*0.25)));setStepProgress(Math.round(p*100)/100);};
   const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update);};
   update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
   return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);cancelAnimationFrame(raf);};
 },[]);
 useEffect(()=>{
   const img=document.querySelector('.bridge-backdrop');if(!img)return;
   if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
   let raf=0;
   const update=()=>{raf=0;const y=window.scrollY;if(y<1100)img.style.transform=`translate3d(0,${(y*0.18).toFixed(1)}px,0) scale(${(1+y*0.00006).toFixed(4)})`;};
   const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update);};
   window.addEventListener('scroll',onScroll,{passive:true});
   return()=>{window.removeEventListener('scroll',onScroll);cancelAnimationFrame(raf);};
 },[]);
 const dialog=useRef(null),taskSelect=useRef(null),lastFocus=useRef(null);
 
 function openModal(type){lastFocus.current=document.activeElement;setModal(type);setAppointmentDone(false);dialog.current.showModal();}
 function closeModal(){dialog.current.close();setModal(null);lastFocus.current?.focus();}
 function discuss(selected){if(selected)setKind(selected);document.getElementById('request').scrollIntoView({behavior:'smooth',block:'center'});taskSelect.current?.focus({preventScroll:true});setMenu(false);}
 function submit(e){
   e.preventDefault();
   const issue=validateInquiry({amount,contact,consent});
   if(issue){setError(issue.message);setErrorField(issue.field);document.getElementById(issue.field)?.focus();return;}
   setError('');setErrorField('');openModal('request');
 }
 const summary=`FortLite Capital — обращение по сделке\nЗадача: ${kind}\nСумма: ${formatAmount(amount)}\nКонтакт: ${contact.trim()}\nГород: Уфа`;
 return <><a className="skip-link" href="#main">К содержимому</a><div className="page-shell bridge-theme" ref={pageRef}><GoldDust/><img className="bridge-backdrop" src="/assets/bridge-hero.webp" alt="" aria-hidden="true" fetchPriority="high"/>
 <SiteHeader onVisit={()=>openModal('visit')}/>
 <main id="main">
 <section className="hero bridge-hero" aria-labelledby="hero-heading"><div className="bridge-copy"><p className="hero-kicker">Готовимся к допуску Банка России</p><h1 id="hero-heading">Цифровая валюта <br/>по правилам закона.</h1><div className="hero-rule"/><p className="intro">FortLite Capital готовит документы для включения в реестр организаций, осуществляющих обмен цифровых валют. После допуска — покупка цифровой валюты для ООО, ИП и частных клиентов по договору.</p><div className="bridge-actions"><a className="button gold" href={telegramUrl} target="_blank" rel="noopener noreferrer">Узнать о запуске<ArrowRight size={25}/></a><button className="bridge-visit" onClick={()=>openModal('visit')}>Записаться в офис</button></div><div className="bridge-meta"><span>Сайт носит информационный характер · Офис в Уфе</span><a href="#status">Операции обмена не проводятся до включения в реестр Банка России</a></div></div><div className="hero-route" aria-label="Как будет устроена сделка">{heroRoute.map(([number,title,detail])=><div className="hero-route-step" key={number}><span>{number}</span><strong>{title}<br/>{detail}</strong></div>)}</div></section>

 <div className="band band-light band-first">
 <section className="bridge-audiences" id="audiences" aria-labelledby="audience-title"><h2 id="audience-title">От вашей задачи — к индивидуальному предложению.</h2><div className="audience-rule"/><div className="bridge-audience-grid">{[[Buildings,'business','Для бизнеса · ООО и ИП','После допуска — покупка цифровой валюты с расчётного счёта по договору, с комплектом документов.'],[User,'personal','Для частных клиентов','После допуска — покупка и продажа цифровой валюты по индивидуальному обращению.']].map(([Icon,key,title,description])=><a key={key} href={telegramUrl} target="_blank" rel="noopener noreferrer"><Icon size={45} weight="thin"/><div><h3>{title}</h3><p>{description}</p><span className="audience-link">Узнать о запуске<ArrowRight size={16}/></span></div></a>)}</div></section>
 <section className="business-deal section-pad" id="process" aria-labelledby="business-deal-title"><div className="business-deal-heading"><div><p className="eyebrow">Будущий порядок сделки</p><h2 id="business-deal-title">Четыре шага<br/>от заявки до TxID.</h2></div><div><p>Так будет устроена работа после включения в реестр: от заявки и проверки до перевода цифрового актива и итоговых подтверждений. Каждый шаг заканчивается понятным результатом.</p><p className="business-deal-caveat">Последовательность применяется после подтверждения правовой возможности операции и необходимого статуса компании.</p></div></div><div className="business-deal-steps" ref={stepsRef} style={{'--progress':stepProgress}}><span className="steps-track" aria-hidden="true"><span/></span>{businessDealSteps.map(([title,text,result],i)=><TipCard key={title} align={i>=2?'right':'left'} className={stepProgress>=(i+0.35)/businessDealSteps.length?'is-lit':''} head={<><span className="business-step-number">0{i+1}</span><h3>{title}</h3></>} tip={<p>{text}</p>} after={<div className="business-step-result"><span>Результат</span><strong>{result}</strong></div>}/>)}</div></section>
 <section className="document-flow section-pad" id="documents" aria-labelledby="documents-title"><div className="document-flow-copy"><p className="eyebrow">Документы по сделке</p><h2 id="documents-title">Что вы будете<br/>получать на руки.</h2><p>Каждая операция будет оформляться документами, которые подтверждают условия, расчёт и передачу актива.</p><p className="document-caveat">Окончательный состав комплекта зависит от вида клиента, способа расчёта и условий конкретной операции.</p></div><div className="document-pack">{documentPack.map((item,i)=><div key={item}><span>{String(i+1).padStart(2,'0')}</span><strong>{item}</strong></div>)}</div></section>
 <section id="useful-for" className="useful-for section-pad" aria-labelledby="useful-for-title"><div className="useful-for-heading"><div><p className="eyebrow">Кому подходят услуги</p><h2 id="useful-for-title">Кому мы можем<br/>быть полезны.</h2></div><p>Готовим сервис для компаний из разных отраслей и для частных клиентов. Возможность и формат работы будут определяться после проверки клиента и задачи.</p></div><div id="useful-for-cards" className="useful-for-grid">{usefulFor.map((title,i)=><article className={`useful-card useful-card-${i}`} key={title}><span className="useful-card-art" aria-hidden="true"><img src="/assets/industry-atlas-light.webp" alt="" loading="lazy"/></span><div className="useful-card-label"><span className="useful-card-number">{String(i+1).padStart(2,'0')}</span><h3>{title}</h3></div></article>)}</div></section>
 </div>

 <div className="band band-dark">
 <section id="cashless-benefits" className="cashless-benefits section-pad" aria-labelledby="cashless-title"><div className="cashless-heading"><div><p className="eyebrow">Безналичный расчёт</p><h2 id="cashless-title">Почему безналичный<br/>расчёт надёжнее.</h2></div><div><p>Расчёт через банковский счёт оставляет документальный след и заранее связывает платёж с договором, плательщиком и конкретной операцией.</p><p className="cashless-caveat">Безналичный формат снижает отдельные операционные риски, но не заменяет проверку клиента, правового основания, реквизитов и условий сделки.</p></div></div><div className="cashless-grid">{cashlessBenefits.map(([title,text],i)=><TipCard key={title} align={i%4===3?'right':'left'} head={<><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3></>} tip={<p>{text}</p>}/>)}</div></section>
 <section className="trust-section section-pad" id="trust" aria-labelledby="trust-title"><div className="trust-intro"><p className="eyebrow">Принципы работы</p><h2 id="trust-title">На чём строится<br/>доверие.</h2><p>Всё, что влияет на результат сделки, обсуждается и фиксируется до оплаты — а не после неё.</p></div><div className="trust-grid">{trustReasons.map(([title,text],i)=><TipCard key={title} align={i%2===1?'right':'left'} head={<><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3></>} tip={<p>{text}</p>}/>)}</div></section>
 </div>

 <div className="band band-light">
 <section id="status" className="capital-register section-pad" aria-labelledby="regulatory-title"><div className="capital-register-copy"><p className="eyebrow">Правовой статус</p><h2 id="regulatory-title">Подготовка<br/>к допуску Банка России.</h2><p className="regulatory-lead">Компания готовит документы для включения в реестр организаций, осуществляющих обмен цифровых валют.</p><p>Текущий этап — сбор и подготовка документов. Сведения о направлении заявления, решении Банка России и записи в реестре будут опубликованы после документального подтверждения.</p><a className="text-button" href="/documents/status">Подробнее о подготовке<ArrowUpRight size={18}/></a></div><div className="registry-docket" aria-label="Карточка правового статуса"><span className="registry-stamp">Подготовка</span><p className="registry-kicker">Карточка раскрытия</p><h3>Статус компании</h3><dl><div><dt>Организация</dt><dd>{entity.shortName}</dd></div><div><dt>Текущий этап</dt><dd>Подготовка документов</dd></div><div><dt>Реестр Банка России</dt><dd>Запись не опубликована</dd></div><div><dt>Оператор персональных данных</dt><dd>№ {entity.rknRegistryNumber}</dd></div><div><dt>Официальный домен</dt><dd>{site.domain}</dd></div></dl><p className="registry-note">Подготовка документов сама по себе не предоставляет право на осуществление регулируемой деятельности.</p></div></section>
 <section className={documentsOpen?'legal-documents is-open':'legal-documents'} aria-labelledby="legal-documents-title"><button className="legal-documents-toggle" type="button" aria-expanded={documentsOpen} aria-controls="legal-document-list" onClick={()=>setDocumentsOpen(value=>!value)}><span><span className="legal-register-label">Раскрытие информации</span><h2 id="legal-documents-title">Документы компании</h2></span><span className="legal-documents-action">{documentsOpen?'Свернуть':'Показать все'}</span><Plus size={27}/></button>{documentsOpen&&<div className="legal-document-list" id="legal-document-list">{legalDocuments.map(([slug,title,description,state],index)=><a href={`/documents/${slug}`} key={slug}><span className="legal-document-number">{String(index+1).padStart(2,'0')}</span><span><span className="legal-document-state">{state}</span><h3>{title}</h3><p>{description}</p></span><ArrowUpRight size={22}/></a>)}</div>}</section>
 <section id="faq" className="faq section-pad" aria-labelledby="faq-title"><div className="faq-heading"><div><p className="eyebrow">Вопросы и ответы</p><h2 id="faq-title">Коротко о главном.</h2></div><p className="faq-intro">Проверка, оплата, передача цифровой валюты, учёт и статус компании — выберите тему.</p></div><div className="faq-tabs" role="tablist" aria-label="Темы вопросов">{faqGroups.map(([label],i)=><button key={label} role="tab" type="button" aria-selected={faqTab===i} onClick={()=>setFaqTab(i)}>{label}<span>{faqGroups[i][1].length}</span></button>)}</div><div className="faq-list" role="tabpanel" key={faqTab}>{faqGroups[faqTab][1].map(([q,a])=><details key={q}><summary>{q}<Plus size={22}/></summary><p>{a}</p></details>)}</div></section>
 </div>

 <div className="band band-dark band-last">
 <section id="office" className="office-contacts section-pad" aria-labelledby="office-title"><div className="office-copy"><p className="eyebrow">Офис в Уфе</p><h2 id="office-title">Познакомимся<br/>лично.</h2><p>В офисе можно узнать о подготовке к допуску и будущем порядке работы. Встреча — по предварительной записи. Операции обмена до включения в реестр Банка России не проводятся.</p><div className="office-actions"><button className="button gold" onClick={()=>openModal('visit')}>Записаться на консультацию<CalendarBlank size={22}/></button><a className="text-button" href={telegramUrl} target="_blank" rel="noopener noreferrer">Написать в Telegram<ArrowUpRight size={18}/></a></div></div><dl className="office-details"><div><dt><MapPin size={20} weight="light"/>Адрес</dt><dd><a href={mapUrl} target="_blank" rel="noopener noreferrer">{site.address}<ArrowUpRight size={16}/></a></dd></div><div><dt><Phone size={20} weight="light"/>Телефон</dt><dd><a href={phoneUrl}>{site.phoneDisplay}</a><small>Организационные вопросы</small></dd></div><div><dt><EnvelopeSimple size={20} weight="light"/>Почта</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a><small>В том числе запросы по персональным данным</small></dd></div><div><dt><TelegramLogo size={20} weight="light"/>Telegram</dt><dd><a href={telegramUrl} target="_blank" rel="noopener noreferrer">@{site.telegram}</a><small>Вопросы о запуске</small></dd></div><div><dt><Buildings size={20} weight="light"/>Компания</dt><dd>{entity.shortName}<small>ИНН {entity.inn} · ОГРН {entity.ogrn}</small></dd></div></dl></section>
 </div>
 </main>
 <SiteFooter/></div>
 <dialog ref={dialog} onCancel={()=>{setModal(null);lastFocus.current?.focus();}} onClick={e=>{if(e.target===dialog.current)closeModal();}} aria-labelledby="dialog-title"><div className="dialog-content"><button className="dialog-close icon-button" onClick={closeModal} aria-label="Закрыть окно"><X size={23}/></button>
 {modal==='request'&&<DealResult kind={kind} amount={amount} contact={contact} summary={summary}/>}
 {modal==='visit'&&<VisitContent visit={visit} setVisit={setVisit} done={appointmentDone} setDone={setAppointmentDone}/>}
 {modal==='privacy'&&<><p className="eyebrow">Ваши данные</p><h2 id="dialog-title">Обработка обращения</h2><p>Пока вы заполняете форму, данные находятся только в этой странице и не отправляются на сервер сайта. При выборе «Открыть Telegram» подготовленный текст передаётся в Telegram, чтобы вы могли проверить и отправить его менеджеру @Bashbtc. После перезагрузки страницы поля очищаются.</p><p>Для обсуждения операции предусмотрены контакт, направление и необязательная сумма. Не указывайте паспортные данные, реквизиты карт, ключи доступа или сведения о кошельках в поле контакта.</p><p className="small-note">Перед публикацией будет размещена политика с реквизитами оператора данных, целями, сроками и порядком обработки.</p><button className="button navy" onClick={closeModal}>Понятно</button></>}
 </div></dialog></>;
}

export function App(){
 const path=window.location.pathname.replace(/\/+$/,'')||'/';
 const doc=path.match(/\/documents\/([a-z-]+)$/);
 if(doc)return <DocumentPage type={doc[1]}/>;
 // Previews (artifact link, single-file HTML) live under arbitrary paths: always show the home page there.
 if(path==='/'||/\.html?$/.test(path)||import.meta.env.VITE_PREVIEW==='1')return <ServiceSite/>;
 return <NotFoundPage/>;
}
