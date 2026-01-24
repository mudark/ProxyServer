import dotenv from 'dotenv';

dotenv.config();

const testGoal = {
  parent: { database_id: process.env.TOKEN},
  properties: {
    // 1. name 속성 (제목 타입)
    "name": { 
      "title": [{ "text": { "content": "goals" } }] 
    },
    // 2. data 속성 (텍스트 타입)
    // 공백일 경우 에러가 날 수 있으니 최소한의 텍스트를 넣어 테스트합니다.
    "data": { 
      "rich_text": [{ "text": { "content": "habits" } }] 
    }
  }
};

fetch('http://localhost:3001/notion/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testGoal),
})
.then(res => res.json())
.then(data => console.log("결과:", data))
.catch(err => console.error("에러:", err));