"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InscriptionPage() {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!nom.trim()) {
      setError("Veuillez entrer votre nom.");
      return;
    }

    if (/\d/.test(nom)) {
      setError("Le nom ne doit pas contenir de chiffre.");
      return;
    }

    if (!prenom.trim()) {
      setError("Veuillez entrer votre prénom.");
      return;
    }

    if (/\d/.test(prenom)) {
      setError("Le prénom ne doit pas contenir de chiffre.");
      return;
    }

    if (!email.trim()) {
      setError("Veuillez entrer votre email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    if (!password.trim()) {
      setError("Veuillez entrer votre mot de passe.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Veuillez confirmer votre mot de passe.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);

      // Emplacement prévu pour l’API plus tard
      /*
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          password,
        }),
      });

      if (!response.ok) {
        setError("Impossible de créer le compte. Veuillez réessayer.");
        return;
      }
      */

      // Simulation temporaire sans backend
      setSuccess("Compte créé avec succès.");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <Link href="/connexion" className="auth-top-button">
        Se connecter
      </Link>

      <section className="auth-container">
        <h1>CREATION DE COMPTE</h1>
        <p>Saisissez vos informations pour créer votre compte</p>

        <form className="auth-form" onSubmit={handleRegister}>
          {error && <div className="auth-message auth-error">{error}</div>}

          {success && (
            <div className="auth-message auth-success">{success}</div>
          )}

          <label>Nom :</label>
          <input
            type="text"
            className="auth-input"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />

          <label>Prénom :</label>
          <input
            type="text"
            className="auth-input"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />

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

          <label>Répéter le mot de passe :</label>
          <div className="auth-password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="auth-input auth-password-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              className="auth-eye-button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? "Création..." : "S’INSCRIRE"}
          </button>
        </form>
      </section>
    </main>
  );
}
