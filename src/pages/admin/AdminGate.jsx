import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { f } from "../../components/formHelpers";
import { supabase } from "../../lib/supabase";

export default function AdminGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(Boolean(session));
      setChecking(false);
    });
  }, []);

  const login = async () => {
    setLoginErr("");
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoggingIn(false);
    if (error) {
      setLoginErr("Invalid email or password.");
      return;
    }
    setAuthed(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    setEmail("");
    setPw("");
  };

  if (checking) return <p style={f.empty}>Loading admin...</p>;

  if (!authed) {
    return (
      <div style={{ maxWidth:400, margin:"4rem auto", padding:"0 1.5rem" }}>
        <Link to="/" style={{ color:"var(--orange)", fontSize:13, fontWeight:600 }}>Back to home</Link>
        <h1 style={{ fontSize:28, fontWeight:800, margin:"1rem 0" }}>Admin Login</h1>
        <div style={f.group}>
          <label style={f.label}>Email</label>
          <input style={f.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" />
        </div>
        <div style={{ ...f.group, marginTop:12 }}>
          <label style={f.label}>Password</label>
          <input
            style={f.input}
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
        </div>
        {loginErr && <p style={{ color:"#ef4444", fontSize:13, marginTop:8 }}>{loginErr}</p>}
        <button style={{ ...f.btn, marginTop:12 }} onClick={login} disabled={loggingIn}>
          {loggingIn ? "Signing in..." : "Login"}
        </button>
      </div>
    );
  }

  return children({ logout });
}
