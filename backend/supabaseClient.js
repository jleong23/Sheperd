const { createClient } = require("@supabase/supabase-js");

// Use your Supabase project URL and anon/public key
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const createSupabaseClient = (req) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    return createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        }
    );
};

module.exports = createSupabaseClient;
