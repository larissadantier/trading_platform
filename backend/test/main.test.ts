import axios from "axios";

axios.defaults.validateStatus = () => true;
test('should be create a account', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const response = await axios.post("http://localhost:3000/signup", input);
  const output = response.data;

  const responseAccount = await axios.get(`http://localhost:3000/accounts/${output.accountId}`);
  const outputAccount = responseAccount.data;

  expect(output.accountId).toBeDefined();
  expect(outputAccount.name).toBe(input.name);
  expect(outputAccount.email).toBe(input.email);
  expect(outputAccount.document).toBe(input.document);
  expect(outputAccount.password).toBe(input.password);
});

test('should be not create an account if the name is invalid', async () => {  
  const input = {
    name: "John",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;

  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe("Invalid name")
});

test('should be not create an account if the email is invalid', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail",
    document: "87748248800",
    password: "asdQWE123"
  };

  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;

  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe("Invalid email")
});

test('should be not create an account if the document is invalid', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "877",
    password: "asdQWE123"
  };

  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;

  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe("Invalid document")
});

test('should be not create an account if the password is invalid', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE"
  };

  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;

  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe("Invalid password")
});