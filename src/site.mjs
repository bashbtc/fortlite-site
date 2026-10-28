export const site = Object.freeze({
  name: 'FortLite Capital',
  domain: 'fortlitecapital.ru',
  origin: 'https://fortlitecapital.ru',
  phone: '+79373090632',
  phoneDisplay: '+7 937 309-06-32',
  telegram: 'Bashbtc',
  email: 'info@fortlitecapital.ru',
  address: 'Уфа, ул. Бакалинская, 33/2, офис 5',
  launchMode: 'pre-admission',
});

export const phoneUrl = `tel:${site.phone}`;
export const telegramUrl = `https://t.me/${site.telegram}`;
export const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(site.address)}`;
export const telegramDraftUrl = text => `${telegramUrl}?text=${encodeURIComponent(text)}`;

export const cbrAdmissionUrl = "https://www.cbr.ru/admissionfinmarket/navigator/ooocv/";
