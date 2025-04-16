import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoa254Ymx5ZXVmcGljd2pzaW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDA5NjIsImV4cCI6MjA1ODQ3Njk2Mn0.JWNSMbjjFoExJNs0Dj9mmk_NAFRw-5kPNhofWJBuiv0";
//import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("supabaseUrl: " + supabaseUrl);
  console.warn("supabaseAnonKey: " + supabaseAnonKey);
  // You can use console.error or any other logging method you prefer
  console.error("Missing Supabase environment variables: PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
  // Optionally, you can throw an error or handle it in a way that suits your application
  throw new Error("Missing Supabase environment variables: PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY");
}
export const supabase = createClient<Database>(supabaseUrl,supabaseAnonKey);