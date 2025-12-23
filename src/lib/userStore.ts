import { supabase } from "@/lib/supabase";

export type User = {
  id: string;
  name: string;
  role: string;
  title: string;
  status: "ACTIVE" | "INACTIVE";
  joined: string;
};

export async function loadUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("role");

  if (error) {
    console.error(error);
    return [];
  }

  return data as User[];
}
