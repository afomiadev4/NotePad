import { supabase } from "./supabaseClient";

export default function TestSupabase() {
  const test = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: "test999@gmail.com",
      password: "password123",
    });

    console.log("DATA:", data);
    console.log("ERROR:", error);
  };

  return (
    <button
      onClick={test}
      style={{
        padding: "12px 20px",
        fontSize: "16px",
        cursor: "pointer",
      }}
    >
      Test Supabase Signup
    </button>
  );
}

