'use client';

type TransactionDetailProps = {
  transaction:
    | {
        id: string;
        statut: string;
        date: string;
        initiales: string;
        nom: string;
        prenom: string;
        cin: string;
        montant: string | number;
        taux: string | number;
        converti: string | number;
      }
    | null;
  onClose: () => void;
};

export default function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  if (!transaction) return null;

  return (
    <div className="td-backdrop" onClick={onClose}>
      <div className="td-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={`td-header ${transaction.statut === "Annulée" ? "td-header-annulee" : ""}`}>
          <div className="td-status">
            <span className="td-dot"></span>
            <span>{transaction.statut}</span>
          </div>
          <button className="td-close" onClick={onClose}>✕</button>
        </div>

        <div className="td-body">

          {/* ID + Date */}
          <div className="td-meta">
            <span className="td-id">{transaction.id}</span>
            <span className="td-date">📅 {transaction.date}</span>
          </div>

          {/* Client */}
          <div className="td-section">
            <div className="td-section-title">
              <div className="td-avatar teal">{transaction.initiales}</div>
              <span>CLIENT</span>
            </div>
            <div className="td-block">
              <div className="td-row"><span>Nom</span><strong>{transaction.nom}</strong></div>
              <div className="td-row"><span>Prénom</span><strong>{transaction.prenom}</strong></div>
              <hr className="td-hr" />
              <div className="td-row"><span>N° CIN</span><strong>{transaction.cin}</strong></div>
            </div>
          </div>

          {/* Détails */}
          <div className="td-section">
            <div className="td-section-title">
              <div className="td-avatar yellow">⇄</div>
              <span>DÉTAILS</span>
            </div>
            <div className="td-block">
              <div className="td-row"><span>Montant</span><strong>{transaction.montant} → MGA</strong></div>
              <div className="td-row"><span>Taux</span><strong>{transaction.taux}</strong></div>
              <hr className="td-hr" />
              <div className="td-row">
                <span>Montant converti</span>
                <strong className="td-converted">{transaction.converti} MGA</strong>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="td-actions">
            <button className="td-btn-cancel">✕ Annuler</button>
            <button className="td-btn-back" onClick={onClose}>Revenir</button>
          </div>

        </div>
      </div>
    </div>
  );
}