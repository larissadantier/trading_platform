import { validatePassword } from "../../src/domain/validatePassword";

test.each(['asdQWE123'])('password should be valid', (password: string) => {
  const isValid = validatePassword(password);
  expect(isValid).toBe(true);
});

test.each([
  null,
  undefined,
  'asdQWE',
  'asdqwe123',
  'asdqwerty',
  'asdQWERtY',
  'ASDQWE123',
])('password should be invalid: %s', (password: string | any) => {
  const isValid = validatePassword(password);
  expect(isValid).toBe(false);
})