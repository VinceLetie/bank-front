'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../globals.css';

export default function Menu() {
  const pathname = usePathname();

  const liens = [
    { label: 'ACCUEIL', href: '/accueil' },
    { label: 'ECHANGE', href: '/echange' },
    { label: 'HISTORIQUE', href: '/historique' },
    { label: 'PARAMETRES', href: '/parametres' },
  ];

  return (
    <nav className="menu">
      <Link href="/accueil" className="menu-logo">
        <Image src="/images/logo.png" alt="Bank Logo" width={120} height={50} priority />
      </Link>

      <ul className="menu-liens">
        {liens.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className={`menu-lien ${pathname === href ? 'actif' : ''}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <button className="menu-deconnexion">Déconnecter</button>
    </nav>
  );
}