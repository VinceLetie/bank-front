"use client";

import { useState, useMemo } from "react";
import styles from "./page.module.css";
import PageLayout from "../components/PageLayout";
import DateFilter from "../components/DateFilter";
import TransactionDetail from "../components/TransactionDetail";

const MOCK = Array.from({ length: 40 }, (_, i) => ({
  id:       `TX-${1001 - i}`,
  date:     "01 Janvier 2026",
  time:     "15:06",
  client:   "Rafalimanana Voarintsoa Vinciano",
  cin:      "0...00000",
  montant:  "1 000,00 USD",
  statut:   i === 1 ? "Annulée" : "Validée",
  // champs pour TransactionDetail
  nom:      "Rafalimanana Voarintsoa",
  prenom:   "Vinciano",
  initiales:"RV",
  taux:     4500,
  converti: "4 500 000",
}));

const STATS    = { effectuees: 1257, clients: 800, annulees: 51 };
const PER_PAGE = 6;
const STATUTS  = ["Tous", "Validée", "Annulée"];

export default function TransactionsPage() {
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("Tous");
  const [page,     setPage]     = useState(1);
  const [selected, setSelected] = useState<typeof MOCK[number] | null>(null); // ← transaction ouverte

  const filtered = useMemo(() =>
    MOCK.filter(tx => {
      const okStatus = status === "Tous" || tx.statut === status;
      const okSearch = !search
        || tx.id.toLowerCase().includes(search.toLowerCase())
        || tx.client.toLowerCase().includes(search.toLowerCase());
      return okStatus && okSearch;
    }),
    [search, status]
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const rows       = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function goPage(n: number) { setPage(Math.min(Math.max(1, n), totalPages)); }

  return (
    <PageLayout>
      <div className={styles["page-wrapper"]}>
        <div className={styles["main-panel"]}>

          {/* Stats */}
          <div className={styles["stats-row"]}>
            <div className={`${styles["stat-card"]} ${styles["teal-fill"]}`}>
              <div className={styles["label"]}>Transactions effectuées</div>
              <div className={styles["value"]}>{STATS.effectuees.toLocaleString("fr")}</div>
            </div>
            <div className={`${styles["stat-card"]} ${styles["teal-line"]}`}>
              <div className={styles["label"]}>Clients</div>
              <div className={styles["value"]}>{STATS.clients}</div>
            </div>
            <div className={`${styles["stat-card"]} ${styles["yellow-line"]}`}>
              <div className={styles["label"]}>Transactions annulée</div>
              <div className={styles["value"]}>{STATS.annulees}</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className={styles["toolbar"]}>
            <input
              className={styles["search-input"]}
              type="text"
              placeholder="Faire une recherche..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {STATUTS.map(s => (
              <button
                key={s}
                className={`${styles["filter-btn"]} ${status === s ? styles["active"] : ""}`}
                onClick={() => { setStatus(s); setPage(1); }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Tableau */}
          <table className={styles["tx-table"]}>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Client</th>
                <th>CIN</th>
                <th>Montant</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((tx, i) => (
                <tr key={i}>
                  <td>{tx.id}</td>
                  <td>
                    {tx.date}
                    <div className={styles["time-sub"]}>({tx.time})</div>
                  </td>
                  <td>{tx.client}</td>
                  <td>{tx.cin}</td>
                  <td>{tx.montant}</td>
                  <td>
                    <span className={`${styles["badge"]} ${tx.statut === "Validée" ? styles["validee"] : styles["annulee"]}`}>
                      {tx.statut}
                    </span>
                  </td>
                  <td>
                    {/* ← un seul ajout : onClick */}
                    <button className={styles["btn-voir"]} onClick={() => setSelected(tx)}>
                      Voir plus...
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles["pagination"]}>
            <button className={styles["page-btn"]} onClick={() => goPage(page - 1)} disabled={page === 1}>←</button>

            {/* Toujours page 1 */}
            <button className={`${styles["page-btn"]} ${page === 1 ? styles["active"] : ""}`} onClick={() => goPage(1)}>1</button>

            {/* "..." gauche si page > 3 */}
            {page > 3 && <span className={styles["page-btn"]}>…</span>}

            {/* Pages autour de la page courante */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n !== 1 && n !== totalPages && n >= page - 1 && n <= page + 1)
              .map(n => (
                <button
                  key={n}
                  className={`${styles["page-btn"]} ${page === n ? styles["active"] : ""}`}
                  onClick={() => goPage(n)}
                >
                  {n}
                </button>
              ))
            }

            {/* "..." droite si page < totalPages - 2 */}
            {page < totalPages - 2 && <span className={styles["page-btn"]}>…</span>}

            {/* Toujours dernière page */}
            {totalPages > 1 && (
              <button className={`${styles["page-btn"]} ${page === totalPages ? styles["active"] : ""}`} onClick={() => goPage(totalPages)}>{totalPages}</button>
            )}

            <button className={styles["page-btn"]} onClick={() => goPage(page + 1)} disabled={page === totalPages}>→</button>
          </div>

        </div>

        <div>
          <DateFilter
            transactionCount={filtered.length}
            onApply={({ startDate, endDate }) => console.log(startDate, endDate)}
            onReset={() => console.log("reset")}
          />
        </div>
      </div>

      {/* Popup — s'affiche si selected n'est pas null */}
      <TransactionDetail
        transaction={selected}
        onClose={() => setSelected(null)}
      />

    </PageLayout>
  );
}