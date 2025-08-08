import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { AccountDAODatabase } from './AccountDAO';
import AccountService from './AccountService';

const app = express(); 
app.use(express.json());
app.use(cors());

const accountDAO = new AccountDAODatabase();
const accountService = new AccountService(accountDAO);

app.post('/signup', async (req: Request, res: Response) => {
  const account = req.body;

  try {
    const output = await accountService.signup(account);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({
      message: error.message,
    })
  }
});

app.get("/accounts/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const output = await accountService.getAccount(id);
  res.json(output);
});

app.listen(3000);