"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleAuth(event: FormEvent, mode: "signin" | "signup") {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const result = await signIn("credentials", {
      redirect: false,
      email,
      displayName,
      mode,
    });
    setBusy(false);

    if (result?.ok) {
      router.push("/leagues");
      router.refresh();
      return;
    }

    if (mode === "signin") {
      setMessage("Login failed. Check email or sign up first.");
    } else {
      setMessage("Sign up failed. Email may already exist.");
    }
  }

  return (
    <main className="app-shell">
      <section className="page-view" aria-labelledby="loginTitle">
        <h2 id="loginTitle">Login</h2>
        <p className="muted">Use email to sign in or create an account.</p>
        <form className="card form-grid">
          <label>
            Email
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Display Name (optional)
            <input
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
          <div className="button-row">
            <button type="submit" disabled={busy} onClick={(e) => handleAuth(e, "signin")}>
              Sign In
            </button>
            <button type="button" className="secondary" disabled={busy} onClick={(e) => handleAuth(e, "signup")}>
              Sign Up
            </button>
          </div>
        </form>
        <p className="message">{message}</p>
      </section>
    </main>
  );
}
