import type { User } from "../Entity/User.js";

export const users = new Map<string, User>();
export const findByEmail = (email: string) =>
  [...users.values()].find(u => u.email === email);
