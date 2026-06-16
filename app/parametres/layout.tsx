import TabLayout from "../components/TabLayout";
import PageLayout from "../components/PageLayout";

const tabs = [
  { label: "Gestion de Devise", href: "/parametres/devise" },
  { label: "Gestion de Taux", href: "/parametres/taux" },
];

export default function GestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <TabLayout tabs={tabs}>{children}</TabLayout>
    </PageLayout>
  );
}