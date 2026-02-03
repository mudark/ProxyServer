import { NOTION_TOKEN, NOTION_DB_ID } from '../config.ts';
import axios from 'axios';

const notion_client = axios.create({
  baseURL: "https://api.notion.com/v1",
  headers: {
    "Authorization": `Bearer ${NOTION_TOKEN}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  }
});
export const readFromNotion = async (name: string) => {
  console.log("data name : ", name);
  const response = await notion_client.post(
    `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
    {
      filter: {property: "name", title: {equals: name}},
      sorts: [{timestamp: "created_time", direction: "descending"}],
      page_size: 1
    },
  );
  return response.data.results;
}
export const updateToNotion = async (properties: any) => {
  const notion_payload = {
      parent: { database_id : NOTION_DB_ID },
      properties: properties,
    }
  console.log("notion_payload : ", notion_payload);
  const response = await notion_client.post(
      "https://api.notion.com/v1/pages",
      notion_payload,
  );
  console.log("노션에 성공적으로 데이터 전달됨");
  console.log("res data : ", response.data);
  return response.data;
}
