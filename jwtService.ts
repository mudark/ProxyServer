import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import type { UserDto } from "./types.js";

function isUserDto(payload: any): payload is UserDto {
  return payload && typeof payload.id === 'string' && typeof payload.name === 'string';
}
export const jwtService = {
  signToken: (payload: UserDto): string => {
    return jwt.sign(
      { id: payload.id, name: payload.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  },
  verifyToken: (token: string): UserDto | null => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return isUserDto(decoded) ? decoded:null;
    } catch (error:unknown) {
      return null;
    }
  }
}