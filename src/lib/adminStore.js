// src/lib/adminStore.js
import fs from "fs/promises";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "src/data/admins.json"
);

export async function getAdmins() {
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file);
}

export async function findAdmin(username, password) {
  const admins = await getAdmins();
  return admins.find(
    (a) =>
      a.username === username &&
      a.password === password
  );
}
