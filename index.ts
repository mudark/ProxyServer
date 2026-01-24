import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { saveToNotion, getFromNotion } from './src/notion.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // 모든 도메인 허용 (개발 시 편리)
app.use(express.json());

app.post('/notion/data', saveToNotion);
app.get('/notion/data', getFromNotion);

app.listen(PORT, () => {
  console.log(`Notion Proxy Server running on http://localhost:${PORT}`);
});
