"use client";

// components/TauxClassement.tsx

import { useState } from "react";

export interface CurrencyRateRank {
  code: string;
  name: string;
  rate: number;
}

interface TauxClassementProps {
  defaultBase?: string;
  rates: CurrencyRateRank[];
}

const RANK_COLORS: Record<number, string> = {
  1: "#F59E0B",
  2: "#9ca3af",
  3: "#b45309",
};

export const MOCK_RATES2: CurrencyRateRank[] = [
  { code: "MGA", name: "Ariary Malgache",  rate: 1    },
  { code: "GBP", name: "Livre Sterling",   rate: 5500 },
  { code: "EUR", name: "Euro",             rate: 4000 },
  { code: "JPY", name: "Yen Japonais",     rate: 31   },
  { code: "USD", name: "Dollar Américain", rate: 4400 },
  { code: "CHF", name: "Franc Suisse",     rate: 4850 },
];

export default function TauxClassement({ defaultBase = "MGA", rates }: TauxClassementProps) {
  const [baseCurrency, setBaseCurrency] = useState(defaultBase);

  const baseRate = rates.find((r) => r.code === baseCurrency)?.rate ?? 1;

  const sorted = rates
    .filter((r) => r.code !== baseCurrency)
    .map((r) => ({ ...r, converted: r.rate / baseRate }))
    .sort((a, b) => b.converted - a.converted);

  return (
    <div className="cr-card">
      <p className="cr-title">
        Classement par rapport à{" "}
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
        {sorted.map((item, index) => {
          const rank = index + 1;
          const color = RANK_COLORS[rank] ?? "#d1d5db";
          return (
            <li key={item.code} className="cr-item">
              <span className="crk-rank" style={{ color }}>{rank}</span>
              <div className="cr-info">
                <span className="cr-code">{item.code}</span>
                <span className="cr-name">{item.name}</span>
              </div>
              <span className="cr-rate">
                {item.converted.toLocaleString("fr-MG", { maximumFractionDigits: 2 })} {baseCurrency}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}