import { validateCpf } from "../src/validateCpf";

test.each([
  "97456321558", 
  "71428793860",
  "87748248800"
])('Should be valid cpf: %s', (cpf: string) => {
  const isValid = validateCpf(cpf)
  expect(isValid).toBe(true)
})

test.each([
  null,
  undefined,
  "11111111111",
  "111",
  "1111111111111111",
])('Should be invalid cpf: %s', (cpf: string | any) => {
  const isValid = validateCpf(cpf)
  expect(isValid).toBe(false)
})