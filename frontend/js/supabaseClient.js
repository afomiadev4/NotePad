import { createClient } from 
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://bndrmoszusuvuaibchjp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuZHJtb3N6dXN1dnVhaWJjaGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0Mjk1NjQsImV4cCI6MjA4MjAwNTU2NH0.fp8fN31ZtKA4CrJBf1SDkPDi0JE4U4O_47cbdY0CBn4"
);
