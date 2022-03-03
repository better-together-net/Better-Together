// Grab our credentials from a .env file or environment variables
require("dotenv").config();
const { DATABASE_URL, SUPABASE_SERVICE_API_KEY } = process.env;

// Connect to our database
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);
// Insert a row
const { data, error } = await supabase
  .from("User_Accounts")
  .insert([{ display_name: "Isztof", id: "123" }]);