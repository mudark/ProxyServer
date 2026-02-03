interface Habit {
  name: string;
  start_day: string;
  date: string[];
}
interface Goal {
  name: string;
  content: string;
  expired_day: string;
}
interface User {
  id: string;
  pw: string;
  name: string;
}
interface UserDto {
  id: string;
  name: string;
}
