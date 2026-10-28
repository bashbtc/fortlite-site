import { entity } from './entity.mjs';
import { site } from './site.mjs';

const footerLinks = [
  ['/documents/sitemap', 'Карта сайта'],
  ['/documents/company', 'Сведения о компании'],
  ['/documents/aml', 'Проверка клиента и ПОД/ФТ'],
  ['/documents/privacy', `Оператор ПД № ${entity.rknRegistryNumber}`],
  ['/documents/privacy', 'Политика обработки персональных данных'],
  ['/documents/consent', 'Согласие на обработку персональных данных'],
  ['/documents/cookies', 'Файлы cookie и внешние сервисы'],
  ['/documents/terms', 'Условия использования'],
];

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-footer-company">
      <p><strong>{entity.shortName}</strong> (ИНН {entity.inn}) — правообладатель бренда FortLite Capital, владелец сайта {site.domain} и оператор персональных данных.</p>
      <p>ОГРН {entity.ogrn} · КПП {entity.kpp} · {entity.legalAddress}</p>
      <p>Сайт носит информационный характер и не является публичной офертой. Компания готовит документы для включения в реестр организаций, осуществляющих обмен цифровых валют (ОООЦВ), Банка России; до включения в реестр операции обмена не проводятся. По вопросам персональных данных: {site.email}.</p>
    </div>
    <nav className="site-footer-links" aria-label="Правовая информация и разделы сайта">
      <span className="site-footer-copyright">2026 © Все права защищены</span>
      {footerLinks.map(([href,label])=><a href={href} key={label}>{label}</a>)}
    </nav>
    <div className="site-footer-bottom">
      <span>FortLite Capital · Уфа</span>
      <span>Официальный домен: {site.domain}</span>
    </div>
  </footer>;
}
