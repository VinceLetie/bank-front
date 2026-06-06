"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Veuillez entrer votre email.");
      return;
    }

    if (!password.trim()) {
      setError("Veuillez entrer votre mot de passe.");
      return;
    }

    if (!email.includes("@")) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    try {
      setLoading(true);

      // Emplacement prévu pour l’API plus tard
      /*
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Email ou mot de passe incorrect.");
        return;
      }
      */

      // Simulation temporaire sans backend
      if (email === "admin@gmail.com" && password === "admin123") {
        setSuccess("Connexion réussie.");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <Link href="/inscription" className="auth-top-button">
        Créer un compte
      </Link>

      <section className="auth-container">
        <h1>Bienvenue !</h1>
        <p>Remplissez les champs pour vous connecter</p>

        <form className="auth-form" onSubmit={handleLogin}>
          {error && <div className="auth-message auth-error">{error}</div>}
          {success && (
            <div className="auth-message auth-success">{success}</div>
          )}

          <label>Email :</label>
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Mot de passe :</label>
          <div className="auth-password-box">
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input auth-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="auth-eye-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? "Connexion..." : "SE CONNECTER"}
          </button>
        </form>
      </section>
    </main>
  );
}
