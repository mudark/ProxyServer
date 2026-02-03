import { type Request, type Response } from 'express';
import { readFromNotion, updateToNotion } from './notion.js';

export const getFromNotion = async (req: Request, res: Response) => {
  const { name } = req.query;
  console.log("data name : ",name);
  if (!name) {
    return res.status(400).json({ error: "name 파라미터가 반드시 필요합니다." });
  } else if (typeof name !=='string') {
    return res.status(400).json({error: "name 파라미터는 단일 문자열이어야 합니다."})
  }
  try {
    return res.status(200).json(await readFromNotion(name));
  } catch (error: any) {
    console.error("노션 데이터 로드 에러:", error.response?.data || error.message);
    return res.status(500).json({error: "데이터를 가져오지 못했습니다."});
  }
}
export const saveToNotion = async (req: Request, res: Response) => {
  const {properties} = req.body;
  console.log("properties : ", properties);
  if (!properties) {
    return res.status(400).json({ error: "properties 데이터가 누락되었습니다." });
  }
  try {
    return res.status(200).json(await updateToNotion(properties));
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal Server Error";
    console.error("노션 API 에러:", message);
    return res.status(status).json({error: message});
  }
}
