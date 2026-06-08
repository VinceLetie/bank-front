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

const RATES: Record<string, Record<string, number>> = {
  USD: { MGA: 4400, EUR: 0.92, GBP: 0.79 },
  EUR: { MGA: 4800, USD: 1.09, GBP: 0.86 },
  GBP: { MGA: 5600, USD: 1.27, EUR: 1.16 },
}

function icon(val: string) {
  return val.trim().length >= 2 ? '✅' : '⚠️'
}

function parseNumber(val: string): number {
  return parseFloat(val.replace(/\s/g, '').replace(/,/g, '')) || 0
}

export default function ExchangePage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [rate, setRate] = useState(0)

  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [cin, setCin] = useState('')
  const [montant, setMontant] = useState('')
  const [montantConverti, setMontantConverti] = useState('')

  // Mise à jour du taux quand la paire change
  useEffect(() => {
    setRate(RATES[from]?.[to] ?? 0)
  }, [from, to])

  // Recalcul uniquement quand le taux change (nouvelle paire)
  useEffect(() => {
    if (rate && montant) {
      setMontantConverti((parseNumber(montant) * rate).toLocaleString('fr'))
    } else {
      setMontantConverti('')
    }
  }, [rate])

  // Frappe dans le 1er input → calcule le 2ème
  const handleMontantChange = (val: string) => {
    setMontant(val)
    const n = parseNumber(val)
    setMontantConverti(n && rate ? (n * rate).toLocaleString('fr') : '')
  }

  // Frappe dans le 2ème input → calcule le 1er
  const handleMontantConvertiChange = (val: string) => {
    setMontantConverti(val)
    const n = parseNumber(val)
    setMontant(n && rate ? (n / rate).toLocaleString('fr') : '')
  }

  const resetForm = () => {
    setFrom('')
    setTo('')
    setNom('')
    setPrenom('')
    setCin('')
    setMontant('')
    setMontantConverti('')
    setRate(0)
  }

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
              <button className={s.btnClear} onClick={resetForm}>Reinitialiser</button>
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
                <input
                  type="text"
                  value={montant}
                  onChange={e => handleMontantChange(e.target.value)}
                />
                <span className={s.amtTag}>{from || 'USD'}</span>
                <span style={{ marginLeft: "1.25rem", marginRight: "1.25rem", fontSize: "1rem", fontWeight: 500 }}>EN</span>
                <input
                  type="text"
                  value={montantConverti}
                  onChange={e => handleMontantConvertiChange(e.target.value)}
                />
                <span className={s.amtTag}>{to || 'MGA'}</span>
              </div>
            </div>

            <button className={s.btnFull}>
              CONTINUER <Image src="/images/fleche-droite.png" alt="Suivant" width={50} height={50} />
            </button>
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
            <div className={s.giveBox}>{montantConverti ? `${montantConverti} ${to}` : ''}</div>
            <span style={{ fontSize: '.82rem', color: '#555' }}>Cliquer ci-dessous pour enregistrer la transaction</span>
            {/* TODO: POST /api/transactions */}
            <button className={s.btnYellow}>CONFIRMER</button>
          </div>

        </div>
      </div>
    </PageLayout>
  )
}