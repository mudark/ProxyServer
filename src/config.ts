import dotenv from 'dotenv';

dotenv.config();

export const NOTION_DB_ID = process.env.NOTION_DB_ID || "";
export const NOTION_TOKEN = process.env.NOTION_TOKEN || "";
export const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';