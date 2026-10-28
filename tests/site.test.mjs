import test from 'node:test';
import assert from 'node:assert/strict';
import { site, phoneUrl, mapUrl, telegramDraftUrl } from '../src/site.mjs';
test('configured contact links use the supplied recipient and preserve encoded requests',()=>{
  assert.equal(phoneUrl,'tel:+79373090632');
  assert.equal(new URL(mapUrl).searchParams.get('text'),site.address);
  const text='Запрос: 50 000,50 ₽\nКонтакт: @test_name & details';
  const url=new URL(telegramDraftUrl(text));
  assert.equal(url.origin,'https://t.me');
  assert.equal(url.pathname,'/Bashbtc');
  assert.equal(url.searchParams.get('text'),text);
});
