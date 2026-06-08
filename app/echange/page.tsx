/**
 * pages/exchange.tsx
 * TODO: GET /api/exchange-rate?from=&to=  → taux
 * TODO: POST /api/transactions            → enregistrer
 */
"use client"

import { useState, useEffect } from 'react'
import s from './page.module.css'
import PageLayout from '../components/PageLayout'
import Image from 'next/image'

const CURRENCIES = ['USD', 'EUR', 'MGA', 'GBP']

// Mock — remplacer par appel API
const RATES: Record<string, Record<string, number>> = {
  USD: { MGA: 4400, EUR: 0.92, GBP: 0.79 },
  EUR: { MGA: 4800, USD: 1.09, GBP: 0.86 },
  GBP: { MGA: 5600, USD: 1.27, EUR: 1.16 },
}

function icon(val: string) {
  return val.trim().length >= 2 ? '✅' : '⚠️'
}

export default function ExchangePage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [rate, setRate] = useState(0)

  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [cin, setCin] = useState('')
  const [montant, setMontant] = useState('')

  const converti = rate && montant ? (parseFloat(montant) * rate).toLocaleString('fr') : ''

  useEffect(() => {
    // TODO: GET /api/exchange-rate?from=from&to=to
    setRate(RATES[from]?.[to] ?? 0)
  }, [from, to])

  return (
    <PageLayout>
      <div className={s.page}>

      {/* Colonne gauche */}
      <div className={s.col}>

        {/* Sélection paire */}
        <div className={s.card}>
          <span>Choisissez le paire de l'argent utiliser pour la transaction</span>
          <div className={s.row}>
            <div className={s.pairRow}>
            <span>Echanger :</span>
            <select className={s.select} value={from} onChange={e => setFrom(e.target.value)}>
              <option value="">ex:USD</option>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <span>Contre :</span>
            <select className={s.select} value={to} onChange={e => setTo(e.target.value)}>
              <option value="">ex:USD</option>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
            </div>
            <button className={s.btnClear}>Reinitialiser</button>
          </div>
        </div>

        {/* Formulaire client */}
        <div className={s.card}>
          <span>Veuiller remplir les informations du client en dessous !</span>

          <div>
            <label>Nom :</label>
            <input className={s.input} value={nom} onChange={e => setNom(e.target.value)} />
          </div>
          <div>
            <label>Prénom :</label>
            <input className={s.input} value={prenom} onChange={e => setPrenom(e.target.value)} />
          </div>
          <div>
            <label>Numéro de la CIN :</label>
            <input className={s.input} value={cin} onChange={e => setCin(e.target.value)} />
          </div>

          <div>
            <label>Montant a échanger :</label>
            <div className={s.amtRow}>
              <input type="number" value={montant} onChange={e => setMontant(e.target.value)} />
              <span className={s.amtTag}>{from || 'USD'}</span>
              <span style={{marginLeft:"1.25rem",marginRight:"1.25rem",fontSize:"1rem",fontWeight:500}}>EN</span>
              <input readOnly value={converti} />
              <span className={s.amtTag}>{to || 'MGA'}</span>
            </div>
          </div>

          <button className={s.btnFull}>CONTINUER <Image src="/images/fleche-droite.png" alt="Suivant" width={50} height={50} /></button>
        </div>
      </div>

      {/* Colonne droite */}
      <div className={s.card}>

        {/* Taux */}
        <div className={s.cardTeal}>
          <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#0ea5a0', textTransform: 'uppercase', letterSpacing: '.07em' }}>
            LE COURS DU TAUX D'ECHANGE EST
          </span>
          <div className={s.rateBox}>
            {/* TODO: valeur live via API */}
            {rate ? `100 ${from} = ${(100 * rate).toLocaleString('fr')} ${to}` : '— = —'}
          </div>
        </div>

        {/* Résumé */}
        <div className={s.cardTeal}>
          <ul className={s.sumList}>
            <li><span>Nom</span><span>{icon(nom)}</span></li>
            <li><span>Prénom</span><span>{icon(prenom)}</span></li>
            <li><span>Numéro de la CIN</span><span>{icon(cin)}</span></li>
          </ul>
          <span>Montant a donner au client :</span>
          <div className={s.giveBox}>{converti ? `${converti} ${to}` : ''}</div>
          <span style={{ fontSize: '.82rem', color: '#555' }}>Cliquer ci-dessous pour enregistrer la transaction</span>
          {/* TODO: POST /api/transactions */}
          <button className={s.btnYellow}>CONFIRMER</button>
        </div>

      </div>
    </div>
  </PageLayout>
  )
}