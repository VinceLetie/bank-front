"use client";

// components/TauxDevises.tsx

import { useState } from "react";

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  color: string;
}

interface CurrencyRateListProps {
  defaultBase?: string;
  rates: CurrencyRate[];
}

// TODO: remplacer par fetch('/api/exchange-rates?base=MGA') dans le parent
export const MOCK_RATES: CurrencyRate[] = [
  { code: "MGA", name: "Ariary Malgache",  rate: 1,     color: "#E11D48" },
  { code: "USD", name: "Dollar Américain", rate: 4400,  color: "#1C3FBE" },
  { code: "EUR", name: "Euro",             rate: 4000,  color: "#00CED1" },
  { code: "JPY", name: "Yen Japonais",     rate: 31,    color: "#22C55E" },
  { code: "GBP", name: "Livre Sterling",   rate: 5500,  color: "#DC2626" },
  { code: "CHF", name: "Franc Suisse",     rate: 4850,  color: "#F59E0B" },
  { code: "CNY", name: "Yuan Chinois",     rate: 610,   color: "#A855F7" },
  { code: "CAD", name: "Dollar Canadien",  rate: 3250,  color: "#0EA5E9" },
];

export default function TauxDevises({ defaultBase = "MGA", rates }: CurrencyRateListProps) {
  const [baseCurrency, setBaseCurrency] = useState(defaultBase);

  const baseRate = rates.find((r) => r.code === baseCurrency)?.rate ?? 1;

  return (
    <div className="cr-card">
      <p className="cr-title">
        Taux des devises par rapport à{" "}
        <select
          className="cr-title-base"
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        >
          {rates.map((r) => (
            <option key={r.code} value={r.code}>{r.code}</option>
          ))}
        </select>
      </p>
      <ul className="cr-list">
        {rates
          .filter((item) => item.code !== baseCurrency)
          .map((item) => (
            <li key={item.code} className="cr-item">
              <div className="cr-flag" style={{ backgroundColor: item.color }} aria-hidden="true" />
              <div className="cr-info">
                <span className="cr-code">{item.code}</span>
                <span className="cr-name">{item.name}</span>
              </div>
              <span className="cr-rate">
                {(item.rate / baseRate).toLocaleString("fr-MG", { maximumFractionDigits: 2 })} {baseCurrency}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}