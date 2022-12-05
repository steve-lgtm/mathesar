import { transliterateToAscii, escapeRegex,toAsciiLowerCase } from '../stringUtils';

test('transliterateToAscii', () => {
  expect(transliterateToAscii('')).toBe('');
  expect(transliterateToAscii('ABC')).toBe('ABC');
  expect(transliterateToAscii('Crème Brulée')).toBe('Creme Brulee');
});

test('escapeRegex', () => {
  expect(escapeRegex('ahoj?')).toBe('ahoj\\?');
});
test('toAsciiLowerCase', () => {
  expect(toAsciiLowerCase('AHOJ')).toBe('ahoj');
});
