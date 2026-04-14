import { useState } from "react";
import { supabase } from "../utils/supabase";
import "./auth.css";
export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        alert(error.message);
      }
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert(error.message);
      }
      setLoading(false);
    }
  };
  return (
  <div className="auth-container">
    <div className="auth-card">
      <h2 className="auth-title">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="auth-btn primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <button
          className="auth-btn secondary"
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  </div>
);
}
export { Auth };
