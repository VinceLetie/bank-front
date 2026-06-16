"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./taux.module.css";

interface Devise {
  id: number;
  nom: string;
  code: string;
}

interface Taux {
  id: number;
  deviseCode: string;
  deviseNom: string;
  valeur: number;
  updatedAt: string; // ISO date
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockDevises: Devise[] = [
  { id: 1, nom: "Ariary Malagasy", code: "MGA" },
  { id: 2, nom: "Euro", code: "EUR" },
  { id: 3, nom: "Dollar Américain", code: "USD" },
  { id: 4, nom: "Livre Sterling", code: "GBP" },
  { id: 5, nom: "Franc CFA", code: "XOF" },
  { id: 6, nom: "Yen Japonais", code: "JPY" },
  { id: 7, nom: "Yuan Chinois", code: "CNY" },
  { id: 8, nom: "Rand Sud-Africain", code: "ZAR" },
];

// Historique complet — plusieurs entrées par devise
const mockTaux: Taux[] = [
  // MGA
  { id: 1,  deviseCode: "MGA", deviseNom: "Ariary Malagasy",    valeur: 4500, updatedAt: "2025-06-15T10:30:00Z" },
  { id: 9,  deviseCode: "MGA", deviseNom: "Ariary Malagasy",    valeur: 4450, updatedAt: "2025-06-10T08:00:00Z" },
  { id: 10, deviseCode: "MGA", deviseNom: "Ariary Malagasy",    valeur: 4400, updatedAt: "2025-05-28T09:00:00Z" },
  // EUR
  { id: 2,  deviseCode: "EUR", deviseNom: "Euro",               valeur: 4800, updatedAt: "2025-06-14T08:00:00Z" },
  { id: 11, deviseCode: "EUR", deviseNom: "Euro",               valeur: 4750, updatedAt: "2025-06-05T11:00:00Z" },
  // USD
  { id: 3,  deviseCode: "USD", deviseNom: "Dollar Américain",   valeur: 1,    updatedAt: "2025-06-13T12:00:00Z" },
  // GBP
  { id: 4,  deviseCode: "GBP", deviseNom: "Livre Sterling",     valeur: 5200, updatedAt: "2025-06-12T09:15:00Z" },
  { id: 12, deviseCode: "GBP", deviseNom: "Livre Sterling",     valeur: 5100, updatedAt: "2025-05-30T14:00:00Z" },
  // XOF
  { id: 5,  deviseCode: "XOF", deviseNom: "Franc CFA",          valeur: 3100, updatedAt: "2025-06-11T14:00:00Z" },
  // JPY
  { id: 6,  deviseCode: "JPY", deviseNom: "Yen Japonais",       valeur: 30,   updatedAt: "2025-06-10T11:00:00Z" },
  { id: 13, deviseCode: "JPY", deviseNom: "Yen Japonais",       valeur: 28,   updatedAt: "2025-05-20T10:00:00Z" },
  // CNY
  { id: 7,  deviseCode: "CNY", deviseNom: "Yuan Chinois",       valeur: 620,  updatedAt: "2025-06-09T16:45:00Z" },
  // ZAR
  { id: 8,  deviseCode: "ZAR", deviseNom: "Rand Sud-Africain",  valeur: 240,  updatedAt: "2025-06-08T07:30:00Z" },
];

// ─── API stubs ────────────────────────────────────────────────────────────────

async function fetchTaux(filter: Filter, search: string): Promise<Taux[]> {
  // Tri décroissant par date
  let result = [...mockTaux].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Filtre "Taux récents" : garder uniquement le dernier enregistrement par devise
  if (filter === "recents") {
    const seen = new Set<string>();
    result = result.filter((t) => {
      if (seen.has(t.deviseCode)) return false;
      seen.add(t.deviseCode);
      return true;
    });
  }

  // Recherche par code ou nom de devise
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t.deviseCode.toLowerCase().includes(q) ||
        t.deviseNom.toLowerCase().includes(q)
    );
  }

  return result;
}

async function updateTaux(deviseCode: string, valeur: number): Promise<void> {
  // Ajoute un nouvel enregistrement dans l'historique
  const devise = mockDevises.find((d) => d.code === deviseCode);
  if (!devise) return;
  const newEntry: Taux = {
    id: mockTaux.length + 1,
    deviseCode,
    deviseNom: devise.nom,
    valeur,
    updatedAt: new Date().toISOString(),
  };
  mockTaux.unshift(newEntry);
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Filter = "tous" | "recents";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Barre recherche + filtres ────────────────────────────────────────────────

function SearchFilterBar({
  filter,
  onFilter,
  search,
  onSearch,
}: {
  filter: Filter;
  onFilter: (v: Filter) => void;
  search: string;
  onSearch: (v: string) => void;
}) {
  return (
    <div className={styles.bar}>
      {/* Champ de recherche */}
      <div className={styles.searchWrapper}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Rechercher une devise…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        {search && (
          <button className={styles.searchClear} onClick={() => onSearch("")}>
            ✕
          </button>
        )}
      </div>

      {/* Séparateur */}
      <span className={styles.barSep} />

      <span className={styles.barLabel}>Afficher :</span>
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterBtn} ${filter === "tous" ? styles.filterBtnActive : ""}`}
          onClick={() => onFilter("tous")}
        >
          Historique complet
        </button>
        <button
          className={`${styles.filterBtn} ${filter === "recents" ? styles.filterBtnActive : ""}`}
          onClick={() => onFilter("recents")}
        >
          Taux récents
        </button>
      </div>
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

function TauxTable({ taux, selected, onSelect }: {
  taux: Taux[]; selected: Taux | null; onSelect: (t: Taux) => void;
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Devise</th>
          <th>Valeur / 1 USD</th>
          <th>Date du changement</th>
        </tr>
      </thead>
      <tbody>
        {taux.length === 0 ? (
          <tr><td colSpan={4} className={styles.empty}>Aucun taux trouvé.</td></tr>
        ) : (
          taux.map((t) => (
            <tr
              key={t.id}
              className={selected?.id === t.id ? styles.rowSelected : styles.row}
              onClick={() => onSelect(t)}
            >
              <td>{t.id}</td>
              <td>
                <span className={styles.codeTag}>{t.deviseCode}</span>
                {" "}{t.deviseNom}
              </td>
              <td>{t.valeur.toLocaleString("fr-FR")}</td>
              <td className={styles.dateCell}>{formatDate(t.updatedAt)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

// ─── Formulaire ───────────────────────────────────────────────────────────────

function FormulaireTaux({ selected, onClear, onRefresh }: {
  selected: Taux | null; onClear: () => void; onRefresh: () => void;
}) {
  const [codeSearch, setCodeSearch] = useState("");
  const [selectedDevise, setSelectedDevise] = useState<Devise | null>(null);
  const [valeur, setValeur] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = mockDevises.filter(
    (d) =>
      d.code.toLowerCase().includes(codeSearch.toLowerCase()) ||
      d.nom.toLowerCase().includes(codeSearch.toLowerCase())
  );

  useEffect(() => {
    if (selected) {
      const dev = mockDevises.find((d) => d.code === selected.deviseCode) || null;
      setSelectedDevise(dev);
      setCodeSearch(selected.deviseCode);
      setValeur(String(selected.valeur));
    } else {
      setSelectedDevise(null);
      setCodeSearch("");
      setValeur("");
    }
    setError("");
  }, [selected]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleModifier = async () => {
    if (!selectedDevise) { setError("Veuillez sélectionner une devise."); return; }
    if (!valeur.trim() || isNaN(Number(valeur)) || Number(valeur) <= 0) {
      setError("Valeur invalide."); return;
    }
    setError("");
    await updateTaux(selectedDevise.code, Number(valeur));
    onClear();
    onRefresh();
  };

  const hasSelection = selectedDevise !== null && valeur.trim() !== "";

  return (
    <div className={styles.formulaire}>
      <div className={styles.formCard}>
        <p className={styles.formTitle}>Modifier un taux</p>

        <div className={styles.formGroup} ref={wrapperRef}>
          <label htmlFor="code">Code devise :</label>
          <div className={styles.comboWrapper}>
            <input
              id="code"
              type="text"
              placeholder="Ex: EUR, MGA..."
              value={codeSearch}
              autoComplete="off"
              onChange={(e) => {
                setCodeSearch(e.target.value);
                setSelectedDevise(null);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && codeSearch.length > 0 && filtered.length > 0 && (
              <ul className={styles.dropdown}>
                {filtered.map((d) => (
                  <li
                    key={d.code}
                    className={styles.dropdownItem}
                    onMouseDown={() => {
                      setSelectedDevise(d);
                      setCodeSearch(d.code);
                      setShowDropdown(false);
                    }}
                  >
                    <span className={styles.codeTag}>{d.code}</span>
                    <span className={styles.dropdownNom}>{d.nom}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedDevise && (
            <p className={styles.deviseNomHint}>{selectedDevise.nom}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="valeur">Valeur / 1 USD :</label>
          <input
            id="valeur"
            type="number"
            min="0"
            placeholder="Ex: 4500"
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
          />
        </div>

        {error && <p className={styles.errorMsg}>{error}</p>}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnModifier} ${!hasSelection ? styles.btnDisabled : ""}`}
          onClick={handleModifier}
          disabled={!hasSelection}
        >
          MODIFIER
        </button>
        {selected && (
          <button className={`${styles.btn} ${styles.btnAnnuler}`} onClick={onClear}>
            ANNULER
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TauxPage() {
  const [taux, setTaux] = useState<Taux[]>([]);
  const [filter, setFilter] = useState<Filter>("recents");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Taux | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchTaux(filter, search).then(setTaux);
  }, [filter, search, refreshKey]);

  return (
    <div className={styles.page}>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          <SearchFilterBar
            filter={filter}
            onFilter={(v) => { setFilter(v); setSelected(null); }}
            search={search}
            onSearch={(v) => { setSearch(v); setSelected(null); }}
          />
          {selected && (
            <div className={styles.clearRow}>
              <button className={styles.clearBtn} onClick={() => setSelected(null)}>
                ✕ Annuler la sélection
              </button>
            </div>
          )}
          <div className={styles.tableWrapper}>
            <TauxTable
              taux={taux}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>
        <FormulaireTaux
          selected={selected}
          onClear={() => setSelected(null)}
          onRefresh={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </div>
  );
}