// Script audit sementara: cek tabel Supabase via anon key (read-only)
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jwksanqlflwsnupqyeep.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function main() {
  const checks = ["applications", "profiles", "verifications", "documents", "disbursements", "notifications"];
  for (const table of checks) {
    const { data, error } = await supabase.from(table).select("*").limit(2);
    console.log(`--- ${table} ---`);
    if (error) {
      console.log("ERROR:", error.message, "| code:", error.code);
    } else {
      console.log("OK rows:", data.length, JSON.stringify(data).slice(0, 300));
    }
  }
}

main().catch((e) => console.error("FATAL", e.message));
