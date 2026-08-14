// READ-ONLY RLS verification probe — no data modification. Anon key only.
const { createClient } = require("@supabase/supabase-js");
const path = require("path");
const fs = require("fs");

function loadEnv(p) {
  const txt = fs.readFileSync(p, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
try { loadEnv(path.join(__dirname, ".env.local")); } catch {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) { console.error("FATAL: env keys missing"); process.exit(1); }
const supabase = createClient(url, key, { auth: { persistSession: false } });

async function probe(table, opts = {}) {
  let q = supabase.from(table).select(opts.columns || "*").limit(2);
  if (opts.maybeSingle) q = q.maybeSingle();
  const { data, error } = await q;
  return { table, columns: opts.columns || "*", data, error };
}

function fmt(code) {
  return {
    "PGRST205": "MISSING TABLE/VIEW (query diasumsikan). Already alias?",
  }[code] || code;
}

async function main() {
  const out = [];
  const tables = ["applications", "profiles", "verifications", "disbursements", "notifications"];
  for (const t of tables) {
    const { data, error } = await probe(t);
    if (error) out.push({ t, error: { code: error.code, message: error.message } });
    else out.push({ t, rows: data.length });
  }

  // Kolom proof_url (Blok 5: ALTER TABLE disbursements ADD proof_url)
  {
    const { data, error } = await probe("disbursements", { columns: "id,proof_url" });
    out.push(error
      ? { kolom_proof_url: { code: error.code, message: error.message } }
      : { kolom_proof_url: "ADA (query sukses)", rows: data.length });
  }

  // Views
  for (const v of ["verifier_application_summary", "public_transparency_stats"]) {
    const { data, error } = await probe(v);
    out.push(error
      ? { view: v, error: { code: error.code, message: error.message } }
      : { view: v, ok: true, rows: data.length, sample: data.slice(0, 2) });
  }

  console.log(JSON.stringify(out, null, 2));
}
main().catch((e) => { console.error("FATAL", e); process.exit(1); });
