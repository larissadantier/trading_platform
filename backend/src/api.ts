import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { AccountDAODatabase } from './AccountDAO';
import { AccountAssetDAODatabase } from './AccountAssetDAO';
import Registry from './Registry';
import AccountService from './AccountService';

const app = express(); 
app.use(express.json());
app.use(cors());

Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
const accountService = new AccountService();

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