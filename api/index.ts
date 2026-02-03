import express from 'express';
import cors from 'cors';
import { PORT } from '../src/config.js'
import { saveToNotion, getFromNotion } from '../src/notion/data.js';
import { logIn, signUp, authJwt, modifyUser } from '../src/notion/auth.js';

const app = express();

app.use(cors()); // 모든 도메인 허용 (개발 시 편리)
app.use(express.json());

app.post('/notion/data', saveToNotion);
app.get('/notion/data', getFromNotion);

app.post('/notion/login',logIn);
app.post('/notion/signup',signUp);
app.post('/notion/jwt',authJwt);
app.put('/notion/name',modifyUser);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`로컬 서버 실행 중: http://localhost:${PORT}`);
  });
}
export default app;
