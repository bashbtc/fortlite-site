import test from 'node:test';
import assert from 'node:assert/strict';
import { validContact, parseAmount, validateInquiry, visitSummary } from '../src/inquiry.mjs';

test('contact rejects alphabetic phone garbage but accepts formatted numbers', () => {
  assert.equal(validContact('abc1234567890'), false);
  assert.equal(validContact('+7 (900) 123-45-67'), true);
  assert.equal(validContact('  @fortlite_demo  '), true);
  assert.equal(validContact('@12345'), false);
  assert.equal(validContact('@ab'), false);
});
test('amount handles Russian separators and rejects malformed or unsafe values', () => {
  assert.deepEqual(parseAmount('50\u00a0000,50'), { value: 50000.5 });
  assert.deepEqual(parseAmount(''), { value: null });
  assert.match(parseAmount('49 999,99').error, /50 000/);
  assert.ok(parseAmount('50000abc').error);
  assert.ok(parseAmount('50000,123').error);
  assert.ok(parseAmount('999999999999999999999').error);
});
test('validation points to the first invalid field without losing entered values', () => {
  assert.equal(validateInquiry({amount:'49000',contact:'bad',consent:false}).field,'amount');
  assert.equal(validateInquiry({amount:'50000',contact:'bad',consent:false}).field,'contact');
  assert.equal(validateInquiry({amount:'50000',contact:'@fortlite_demo',consent:false}).field,'consent');
  assert.equal(validateInquiry({amount:'',contact:'@fortlite_demo',consent:true}),null);
});
test('visit summary preserves customer name, contact and requested time without a booking claim', () => {
  const text=visitSummary({name:'  Анна  ',contact:' @fortlite_demo ',time:'Во второй половине дня'});
  assert.match(text,/Имя: Анна/);
  assert.match(text,/Контакт: @fortlite_demo/);
  assert.match(text,/Во второй половине дня/);
  assert.match(text,/требуют подтверждения/);
});
