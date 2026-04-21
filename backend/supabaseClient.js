const { createClient } = require("@supabase/supabase-js");

// Use your Supabase project URL and anon/public key
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const createSupabaseClient = (req) => {
    const token = req?.headers?.authorization;
    if (!token) {
        console.warn("No Authorization header provided.")
    }

    return createClient(SUPABASE_URL, SUPABASE_KEY, {
        global: { headers: { Authorization: req.headers.authorization || "" } },
    });
};

module.exports = createSupabaseClient;
