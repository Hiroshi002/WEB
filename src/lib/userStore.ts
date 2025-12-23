// src/lib/userStore.ts
import members from "@/data/members.json";

export type User = {
  id: string;
  name: string;
  role: string;
  title: string;
  status: "ACTIVE" | "INACTIVE";
  joined: string;
};

export function loadUsers(): User[] {
  return members as User[];
}
