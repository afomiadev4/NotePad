import { supabase } from "./supabaseClient";
import { login, logout } from "./store/authSlice";

export const initAuthListener = (store) => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      store.dispatch(
        login({
          user: session.user,
          token: session.access_token,
        })
      );
    } else {
      store.dispatch(logout());
    }
  });
};
