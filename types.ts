export interface Habit {
  name: string;
  start_day: string;
  date: string[];
}
export interface Goal {
  name: string;
  content: string;
  expired_day: string;
}
export interface User {
  id: string;
  pw: string;
  name: string;
}
export interface UserDto {
  id: string;
  name: string;
}
