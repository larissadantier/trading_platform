import express, { type Request, type Response } from 'express';
import pg from 'pg-promise';
import {randomUUID} from 'node:crypto';
import { validateCpf } from './validateCpf';
import { validatePassword } from './validatePassword';
import { validateEmail } from './validateEmail';
import { validateName } from './validateName';

const app = express(); 
app.use(express.json());

const connection = pg()('postgres://postgres:123456@db:5432/app');

app.post('/signup', async (req: Request, res: Response) => {
  const account = req.body;
  const accountId = randomUUID();

  if (!validateName(account.name)) {
    res.status(422).json({message: 'Invalid name'});
    return;
  }

  if(!validateEmail(account.email)) { 
    res.status(422).json({message: 'Invalid email'});
    return;
  }

  if(!validateCpf(account.document)) { 
    res.status(422).json({message: 'Invalid document'});
    return;
  }

  if(!validatePassword(account.password)) {
    res.status(422).json({ message: 'Invalid password'});
    return;
  }
  
  await connection.query(`
    INSERT INTO ccca.account (account_id, name, email, document, password) VALUES ($1, $2, $3, $4, $5)`, 
    [accountId, account.name, account.email, account.document, account.password]);

  res.json({ accountId });
});

app.get("/accounts/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const [account] = await connection.query(`SELECT * FROM ccca.account WHERE account_id = $1`, [id])

  res.json(account);
});

app.listen(3000);