"use client";
import { useState } from 'react';

const SHORTCUTS = [
  { label: "Aujourd'hui", key: 'today' },
  { label: 'Hier', key: 'yesterday' },
  { label: 'Cette semaine', key: 'week' },
  { label: 'Ce mois', key: 'month' },
  { label: 'Cette année', key: 'year' },
];

const DAYS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];

function formatDate(date: Date) {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

type DateFilterProps = {
  transactionCount?: number;
  onApply?: (range: { startDate: Date; endDate: Date }) => void;
  onReset?: () => void;
};

export default function DateFilter({ transactionCount = 5, onApply, onReset }: DateFilterProps) {
  const today = new Date();
  const [startDate, setStartDate] = useState(new Date(today));
  const [endDate, setEndDate] = useState(new Date(today));
  const [activeShortcut, setActiveShortcut] = useState<string | null>('today');
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selecting, setSelecting] = useState<'start' | 'end'>('start'); // 'start' | 'end'

  const monthName = new Date(calYear, calMonth, 1).toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  function applyShortcut(key: string) {
    const t = new Date();
    let s, e;
    if (key === 'today') { s = e = new Date(t); }
    else if (key === 'yesterday') { s = e = new Date(t); s.setDate(t.getDate() - 1); e = new Date(s); }
    else if (key === 'week') {
      const dayOfWeek = t.getDay() === 0 ? 7 : t.getDay();
      s = new Date(t);
      s.setDate(t.getDate() - dayOfWeek + 1);
      e = new Date(t);
    } else if (key === 'month') {
      s = new Date(t.getFullYear(), t.getMonth(), 1);
      e = new Date(t);
    } else {
      s = new Date(t.getFullYear(), 0, 1);
      e = new Date(t);
    }
    setStartDate(s); setEndDate(e);
    setActiveShortcut(key);
    setCalMonth(s.getMonth()); setCalYear(s.getFullYear());
  }

  function handleDayClick(day: number) {
    const clicked = new Date(calYear, calMonth, day);
    if (selecting === 'start') {
      setStartDate(clicked);
      if (clicked > endDate) setEndDate(clicked);
      setSelecting('end');
    } else {
      if (clicked < startDate) { setEndDate(startDate); setStartDate(clicked); }
      else setEndDate(clicked);
      setSelecting('start');
    }
    setActiveShortcut(null);
  }

  function resetFilter() {
    const defaultDate = new Date(today);
    setStartDate(new Date(defaultDate));
    setEndDate(new Date(defaultDate));
    setCalMonth(defaultDate.getMonth());
    setCalYear(defaultDate.getFullYear());
    setActiveShortcut('today');
    setSelecting('start');
    onReset?.();
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  function isInRange(day: number) {
    const d = new Date(calYear, calMonth, day);
    return d >= startDate && d <= endDate;
  }
  function isStart(day: number) {
    const d = new Date(calYear, calMonth, day);
    return d.toDateString() === startDate.toDateString();
  }
  function isEnd(day: number) {
    const d = new Date(calYear, calMonth, day);
    return d.toDateString() === endDate.toDateString();
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="df-overlay">
      <div className="df-panel">
        <div className="df-title">Filtrer par date</div>

        {/* Date inputs row */}
        <div className="df-date-row">
          <span className="df-label">Du</span>
          <div className={`df-date-box${selecting === 'start' ? ' active' : ''}`} onClick={() => setSelecting('start')}>
            {formatDate(startDate)}
          </div>
          <span className="df-label">Au</span>
          <div className={`df-date-box${selecting === 'end' ? ' active' : ''}`} onClick={() => setSelecting('end')}>
            {formatDate(endDate)}
          </div>
        </div>

        <div className="df-body">
          {/* Shortcuts */}
          <div className="df-shortcuts">
            <div className="df-shortcuts-label">Raccourcis</div>
            {SHORTCUTS.map(s => (
              <button
                key={s.key}
                className={`df-shortcut${activeShortcut === s.key ? ' active' : ''}`}
                onClick={() => applyShortcut(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <div className="df-calendar">
            <div className="df-cal-header">
              <button className="df-nav" onClick={() => {
                if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                else setCalMonth(m => m - 1);
              }}>←</button>
              <span className="df-month-label">{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</span>
              <button className="df-nav" onClick={() => {
                if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                else setCalMonth(m => m + 1);
              }}>→</button>
            </div>
            <div className="df-cal-grid">
              {DAYS.map(d => <div key={d} className="df-day-name">{d}</div>)}
              {cells.map((day, i) => (
                <div
                  key={i}
                  className={`df-day${day ? ' valid' : ''}${day && isInRange(day) ? ' in-range' : ''}${day && isStart(day) ? ' range-start' : ''}${day && isEnd(day) ? ' range-end' : ''}`}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day || ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="df-footer">
          <span className="df-count">{transactionCount} Transaction(s) trouvée (s)</span>
          <div className="df-actions">
            <button className="df-btn-reset" onClick={resetFilter}>REINITALISER</button>
            <button className="df-btn-apply" onClick={() => onApply?.({ startDate, endDate })}>APPLIQUER</button>
          </div>
        </div>
      </div>
    </div>
  );
}