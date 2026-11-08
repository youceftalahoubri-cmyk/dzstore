import { useState } from "react";
import { login, register } from "../data/auth";

export default function AccountPage({ user, onAuth, onLogout, onBack }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = mode === "login"
        ? await login(email, password)
        : await register(name, email, password);
      onAuth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="account-page">
      <button className="link" onClick={onBack}>← Back to store</button>
      {user ? (
        <div className="account-panel">
          <h2>Your account</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Account type:</strong> {user.role === "admin" ? "Administrator" : "User"}</p>
          <button className="btn" onClick={onLogout}>Log out</button>
        </div>
      ) : (
        <form className="account-panel" onSubmit={submit}>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          {mode === "register" && <label>Name<input required value={name} onChange={e => setName(e.target.value)} /></label>}
          <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label>Password<input type="password" minLength="6" required value={password} onChange={e => setPassword(e.target.value)} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}</button>
          <p className="account-switch">
            {mode === "login" ? "New to DzStore?" : "Already have an account?"}{" "}
            <button type="button" className="link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
              {mode === "login" ? "Create account" : "Log in"}
            </button>
          </p>
        </form>
      )}
    </section>
  );
}
