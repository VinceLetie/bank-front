"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import styles from "./page.module.css";
import TauxDevises, { MOCK_RATES } from "../components/TauxDevises";
import TauxClassement, { MOCK_RATES2 } from "../components/TauxClassement";
import PageLayout from "../components/PageLayout";

const CURRENCIES = [
  { code: "MGA", name: "Ariary Malagasy",  rate: 1    },
  { code: "USD", name: "Dollar Américain", rate: 4400 },
  { code: "EUR", name: "Euro",             rate: 4000 },
  { code: "JPY", name: "Yen Japonais",     rate: 31   },
  { code: "GBP", name: "Livre Sterling",   rate: 5500 },
];

export default function TauxEchangePage() {
  const router = useRouter();
  const [amount, setAmount] = useState(109);
  const [fromCurrency, setFromCurrency] = useState("MGA");
  const [toCurrency, setToCurrency] = useState("MGA");

  const getRate = (code: string) => CURRENCIES.find((c) => c.code === code)?.rate ?? 1;

  const convert = () => {
    if (fromCurrency === toCurrency) return amount.toLocaleString("fr-FR");
    const inMGA = fromCurrency === "MGA" ? amount : amount * getRate(fromCurrency);
    const result = toCurrency === "MGA" ? inMGA : inMGA / getRate(toCurrency);
    return parseFloat(result.toFixed(2)).toLocaleString("fr-FR");
  };

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <PageLayout>
      <div className={styles.page}>

        {/* LEFT COLUMN */}
        <div className={styles.left}>
          <div className={styles.titleBlock}>
            TAUX D&apos;ECHANGE POUR AUJOURD&apos;HUI
          </div>
          <TauxDevises  rates={MOCK_RATES} />
          <TauxClassement  rates={MOCK_RATES2} />
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.right}>
          <div className={styles.converterBlock}>
            <h2 className={styles.converterTitle}>Convertisseur de devises</h2>

            <p className={styles.label}>MONTANT À CONVERTIR</p>
            <div className={styles.row}>
              <select
                className={styles.select}
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
              <input
                className={styles.amountInput}
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className={styles.swapRow}>
              <button className={styles.swapBtn} onClick={swap}>⇄</button>
            </div>

            <p className={styles.label}>CONVERTI EN</p>
            <div className={styles.row}>
              <select
                className={styles.select}
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.resultBox}>
              <span className={styles.result}>{convert()}</span>
            </div>
          </div>

          <button className={styles.ctaBtn} onClick={() => router.push("/echange")}>
            <Image src="/images/plus.png" alt="Nouvelle transaction" width={20} height={20} /> Nouvelle transaction
          </button>
        </div>

      </div>
    </PageLayout>
  );
}