import { type Request, type Response } from "express";
import { readFromNotion, updateToNotion } from "../apis/notion.ts";
import { jwtService } from "../utils/jwtService.ts";

const getUsers = async ():Promise<User[]> => {
  const results = await readFromNotion("users");
  if (results && results.length > 0) {
    const jsonString = results[0].properties.data.rich_text[0]?.plain_text;
    try {
      return JSON.parse(jsonString) ?? [];
    } catch (e) {
      console.error("JSON 파싱 에러:", e);
      return [];
    }
  }
  return [];
}
const saveUsers = async (updated_users:User[]): Promise<boolean> => {
  const properties = {
    "name": { 
      "title": [{ "text": { "content": "users" } }] 
    },
    "data": { 
      "rich_text": [{ "text": { "content": JSON.stringify(updated_users) } }] 
    }
  };
  try {
    const response = await updateToNotion(properties);
    return !!response; 
  } catch (error) {
    console.error("노션 저장 중 상세 에러:", error);
    return false;
  };
}

export const logIn = async(req: Request, res: Response) => {
  const users = await getUsers();
  const {id, pw} = req.body;
  const user = users.find(u=>u.id===id);
  if (!user || user.pw !==pw) {
    console.log("아이디나 비밀번호가 유효하지 않습니다.")
    return res.status(400).json("아이디나 비밀번호가 유효하지 않습니다.");
  }
  console.log("login user : ", user);
  const new_token = jwtService.signToken({id: user.id, name: user.name});
  console.log("login token : ", new_token);
  return res.status(200).json({token: new_token});
}
export const signUp = async(req: Request, res: Response) => {
  const users = await getUsers();
  const {user: userDto, pw} = req.body;
  const user: User = {
    id: userDto.id,
    pw: pw,
    name: userDto.name,
  }
  console.log("new user : ", user);
  console.log("_users : ",users);
  if (users.some(u => u.id === user.id)) {
    console.error("이미 존재하는 아이디입니다.");
    return res.status(400).json("이미 존재하는 아이디입니다.");
  }
  const updated_users = [...users, user];
  if (!await saveUsers(updated_users)) {
    console.error("노션 업데이트에 실패했습니다.");
    return res.status(500).json("노션 업데이트에 실패했습니다.");
  }
  //console.log("_users : ",users);
  const new_token = jwtService.signToken(userDto);
  return res.status(200).json({token: new_token});
}
export const authJwt = async(req: Request, res: Response) => {
  const users = await getUsers();
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: "인증 토큰이 없습니다." });
  }
  try {
    const userDto = jwtService.verifyToken(token);
    if (!userDto) {
      return res.status(401).json("유효하지 않은 토큰입니다.");
    }
    const new_token = jwtService.signToken(userDto);
    return res.status(200).json({token: new_token});
  } catch (error: unknown) {
    return res.status(401).json({ error: "토큰 인증에 실패했습니다." });
  }
}
export const modifyUser = async(req: Request, res: Response) => {
  const users = await getUsers();
  const {user: userDto} = req.body;
  if (!users.some(u=>u.id===userDto.id)) {
    return res.status(400).json("존재하지 않는 사용자입니다.");
  }
  const updated_users = users.map(
    u=>u.id===userDto.id?{...u, name: userDto.name}:u
  );
  if (!await saveUsers(updated_users)) {
    return res.status(500).json("노션 업데이트에 실패했습니다.");
  }
  const new_token = jwtService.signToken(userDto);
  return res.status(200).json({token: new_token});
}
