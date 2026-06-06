// components/PageLayout.tsx

"use client";

import type { ReactNode } from 'react'
import Menu from './Menu'
import DateDuJour from './DateDuJour'
import '../globals.css';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="hero">
      <Menu />
      <div className="rectangle-wrapper">
        <DateDuJour />
        <div className="rectangle">
          {children}
        </div>
      </div>
    </div>
  )
}