const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createAdmin() {
  const username = "Shiriw";
  const password = "441288";

  const password_hash = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("admins").insert({
    username,
    password_hash,
    role: "HEAD",
  });

  if (error) {
    console.error("❌ Insert failed:", error);
  } else {
    console.log("✅ Admin created");
  }
}

createAdmin();
