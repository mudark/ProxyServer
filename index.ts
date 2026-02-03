import express from 'express';
import cors from 'cors';
import { PORT } from './src/config.ts'
import { saveToNotion, getFromNotion } from './src/notion/data.ts';
import { logIn, signUp, authJwt, modifyUser } from './src/notion/auth.ts';

const app = express();

app.use(cors()); // 모든 도메인 허용 (개발 시 편리)
app.use(express.json());

app.post('/notion/data', saveToNotion);
app.get('/notion/data', getFromNotion);

app.post('/notion/login',logIn);
app.post('/notion/signup',signUp);
app.post('/notion/jwt',authJwt);
app.put('/notion/name',modifyUser);

app.listen(PORT, () => {
  console.log(`Notion Proxy Server running on http://localhost:${PORT}`);
});
