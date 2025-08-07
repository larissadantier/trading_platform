import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { getAccountById, signup } from './main';

const app = express(); 
app.use(express.json());
app.use(cors());


app.post('/signup', async (req: Request, res: Response) => {
  const account = req.body;

  try {
    const output = await signup(account);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({
      message: error.message,
    })
  }
});

app.get("/accounts/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const output = await getAccountById(id);
  res.json(output);
});

app.listen(3000);