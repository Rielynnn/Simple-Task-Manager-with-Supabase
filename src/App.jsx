import { useState, useEffect } from "react";
import "./app.css";
import { Auth } from "./components/auth";
import { TaskManager } from "./components/taskmanager";
import { supabase } from "./utils/supabase";

function App() {
  const [session, setSession] = useState(null);
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    setSession(null);
  }
  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    setSession(currentSession.data.session);
  };
  useEffect(() => {
    fetchSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  } , []);
  return (
    <div className="App">
      <>{session ? (
        <>
          <button onClick={logout}>Logout</button>
          <TaskManager session={session}/>
        </>
      ) : (
        <Auth />
      )}</>
    </div>
  );
}

export default App;
