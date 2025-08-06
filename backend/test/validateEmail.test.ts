import { validateEmail } from "../src/validateEmail"

test.each(["john.doe@hotmail.com"])('email should be valid: %s', (email: string) => { 
  const isValid = validateEmail(email);
  expect(isValid).toBe(true);
})

test.each([
  null, 
  undefined,
  "john@",
  "john@.com",
  "john@gmail"
])('email should be not valid: %s', (email: string | any) => { 
  const isValid = validateEmail(email);
  expect(isValid).toBe(false);
})