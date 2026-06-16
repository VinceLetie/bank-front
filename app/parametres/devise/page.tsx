"use client";

import { useState, useEffect } from "react";
import styles from "./devise.module.css";

interface Devise {
  id: number;
  nom: string;
  code: string;
  valeur: number;
  actif: boolean;
}

// GET /api/devises?search=&filter=tous|actif|non-actif
async function fetchDevises(search: string, filter: string): Promise<Devise[]> {
  // const res = await fetch(`/api/devises?${new URLSearchParams({ search, filter })}`);
  // return res.json();
  const mock: Devise[] = [
    { id: 1, nom: "Ariary Malagasy", code: "MGA", valeur: 4500, actif: true },
    { id: 2, nom: "Euro", code: "EUR", valeur: 4800, actif: false },
    { id: 3, nom: "Dollar Américain", code: "USD", valeur: 1, actif: false },
    { id: 4, nom: "Livre Sterling", code: "GBP", valeur: 5200, actif: true },
    { id: 5, nom: "Franc CFA", code: "XOF", valeur: 3100, actif: true },
    { id: 6, nom: "Yen Japonais", code: "JPY", valeur: 30, actif: true },
    { id: 7, nom: "Yuan Chinois", code: "CNY", valeur: 620, actif: false },
    { id: 8, nom: "Rand Sud-Africain", code: "ZAR", valeur: 240, actif: false },
  ];
  let result = mock;
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter((d) => d.nom.toLowerCase().includes(q) || d.code.toLowerCase().includes(q));
  }
  if (filter === "actif") result = result.filter((d) => d.actif);
  if (filter === "non-actif") result = result.filter((d) => !d.actif);
  return result;
}

// PATCH /api/devises/:id/toggle  — body: { actif }
async function toggleDeviseStatus(id: number, actif: boolean): Promise<void> {
  // await fetch(`/api/devises/${id}/toggle`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ actif }) });
}

// POST /api/devises  — body: { nom, code, statut: "inactif" }
async function createDevise(nom: string, code: string): Promise<void> {
  // await fetch("/api/devises", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nom, code, statut: "inactif" }) });
}

// PUT /api/devises/:id  — body: { nom, code }
async function updateDevise(id: number, nom: string, code: string): Promise<void> {
  // await fetch(`/api/devises/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nom, code }) });
}

// DELETE /api/devises/:id
async function deleteDevise(id: number): Promise<void> {
  // await fetch(`/api/devises/${id}`, { method: "DELETE" });
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Filter = "tous" | "actif" | "non-actif";

// ─── Barre recherche + filtres ────────────────────────────────────────────────

function SearchFilterBar({ search, filter, onSearch, onFilter }: {
  search: string; filter: Filter;
  onSearch: (v: string) => void; onFilter: (v: Filter) => void;
}) {
  return (
    <div className={styles.bar}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Faire une recherche..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className={styles.filterButtons}>
        {(["tous", "actif", "non-actif"] as Filter[]).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            onClick={() => onFilter(f)}
          >
            {f === "tous" ? "Tous" : f === "actif" ? "Actif" : "Non actif"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

function DeviseTable({ devises, selected, onSelect, onToggle }: {
  devises: Devise[]; selected: Devise | null;
  onSelect: (d: Devise) => void; onToggle: (id: number, actif: boolean) => void;
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Code devise</th>
          <th>Valeur / 1 USD</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {devises.length === 0 ? (
          <tr><td colSpan={4} className={styles.empty}>Aucune devise trouvée.</td></tr>
        ) : (
          devises.map((d) => (
            <tr
              key={d.id}
              className={selected?.id === d.id ? styles.rowSelected : styles.row}
              onClick={() => onSelect(d)}
            >
              <td>{d.nom}</td>
              <td>{d.code}</td>
              <td>{d.valeur}</td>
              <td>
                <button
                  className={`${styles.toggle} ${d.actif ? styles.toggleOn : ""}`}
                  onClick={(e) => { e.stopPropagation(); onToggle(d.id, !d.actif); }}
                  aria-label={d.actif ? "Désactiver" : "Activer"}
                >
                  <span className={styles.toggleThumb} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

// ─── Formulaire Devise ────────────────────────────────────────────────────────

function FormulaireDevise({ selected, onClear, onRefresh }: {
  selected: Devise | null; onClear: () => void; onRefresh: () => void;
}) {
  const [nom, setNom] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (selected) { setNom(selected.nom); setCode(selected.code); }
    else { setNom(""); setCode(""); }
  }, [selected]);

  const hasSelection = selected !== null;

  const handleAjouter = async () => {
    if (!nom.trim() || !code.trim()) return;
    await createDevise(nom, code);
    setNom(""); setCode("");
    onRefresh();
  };

  const handleModifier = async () => {
    if (!selected || !nom.trim() || !code.trim()) return;
    await updateDevise(selected.id, nom, code);
    onClear(); onRefresh();
  };

  const handleSupprimer = async () => {
    if (!selected) return;
    await deleteDevise(selected.id);
    onClear(); onRefresh();
  };

  return (
    <div className={styles.formulaire}>
      <div className={styles.formCard}>
        <p className={styles.formTitle}>{hasSelection ? "Modifier un devise" : "Ajouter un devise"}</p>
        <div className={styles.formGroup}>
          <label htmlFor="nom">Nom :</label>
          <input id="nom" type="text" placeholder="Nom de la devise...." value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="code">Code devise :</label>
          <input id="code" type="text" placeholder="Code de la devise...." value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
      </div>
      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnAjouter} ${hasSelection ? styles.btnDisabled : ""}`} onClick={handleAjouter} disabled={hasSelection}>
          AJOUTER
        </button>
        <button className={`${styles.btn} ${styles.btnModifier} ${!hasSelection ? styles.btnDisabled : ""}`} onClick={handleModifier} disabled={!hasSelection}>
          MODIFIER
        </button>
        <button className={`${styles.btn} ${styles.btnSupprimer} ${!hasSelection ? styles.btnDisabled : ""}`} onClick={handleSupprimer} disabled={!hasSelection}>
          SUPPRIMER
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DevisePage() {
  const [devises, setDevises] = useState<Devise[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("tous");
  const [selected, setSelected] = useState<Devise | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDevises(search, filter).then(setDevises);
  }, [search, filter, refreshKey]);

  const handleToggle = async (id: number, newActif: boolean) => {
    setDevises((prev) => prev.map((d) => (d.id === id ? { ...d, actif: newActif } : d)));
    await toggleDeviseStatus(id, newActif);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          <SearchFilterBar search={search} filter={filter} onSearch={setSearch} onFilter={setFilter} />
          {selected && (
            <div className={styles.clearRow}>
              <button className={styles.clearBtn} onClick={() => setSelected(null)}>
                ✕ Annuler la sélection
              </button>
            </div>
          )}
          <div className={styles.tableWrapper}>
            <DeviseTable
              devises={devises}
              selected={selected}
              onSelect={setSelected}
              onToggle={handleToggle}
            />
          </div>
        </div>
        <FormulaireDevise
          selected={selected}
          onClear={() => setSelected(null)}
          onRefresh={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </div>
  );
}