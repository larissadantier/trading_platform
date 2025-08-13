import { validateName } from "../../src/domain/validateName";

test.each(['John Doe'])('name should be valid: %s', (name: string) => {
  const isValid = validateName(name);
  expect(isValid).toBe(true);
});

test.each([null, undefined, 'John', ''])('name should be not valid: %s', (name: string | any) => {
  const isValid = validateName(name);
  expect(isValid).toBe(false);
});