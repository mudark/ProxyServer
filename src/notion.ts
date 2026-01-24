import dotenv from 'dotenv';
import axios from 'axios';
import { type Request, type Response } from 'express';

dotenv.config();

const NOTION_DB_ID = process.env.NOTION_DB_ID || "";
const NOTION_TOKEN = process.env.NOTION_TOKEN || "";

export const getFromNotion = async (req: Request, res: Response) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "name 파라미터가 반드시 필요합니다." });
  }
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
      {
        filter: {property: "name", title: {equals: name}},
        sorts: [{timestamp: "created_time", direction: "descending"}],
        page_size: 1
      },
      {
        headers: {
          "Authorization": `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
        },
      }
    );
    res.status(200).json(response.data.results);
  } catch (error: any) {
    console.error("노션 데이터 로드 에러:", error.response?.data || error.message);
    res.status(500).json({error: "데이터를 가져오지 못했습니다."});
  }
}
export const saveToNotion = async (req: Request, res: Response) => {
  const notion_payload = {
      parent: { database_id : NOTION_DB_ID },
      properties: req.body.properties,
    }
  try {
    const response = await axios.post(
      "https://api.notion.com/v1/pages",
      notion_payload,
      {headers: {
          "Authorization" : `Bearer ${NOTION_TOKEN}`,
          "Content-Type" : "application/json",
          "Notion-Version" : "2022-06-28",
        },
      }
    );
    console.log("노션에 성공적으로 데이터 전달됨");
    res.status(200).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal Server Error";
    console.error("노션 API 에러:", message);
    res.status(status).json({error: message});
  }
}
