import Link from 'next/link'
import { getCustomerDetail } from '@/data/customers'
import { KundeBearbeitenFormular } from './KundeBearbeitenFormular'

// DC-044: Bis hierher gab es keinen Weg, einen einmal angelegten Kunden zu
// ändern. Diese Seite ist die fehlende Oberfläche — kein Datenmodell-Thema.
export default async function KundeBearbeitenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { customer } = await getCustomerDetail(id)

  return (
    <div className="min-h-dvh bg-bg">
      <div className="bg-anthracite px-5 md:px-8 pt-12 pb-6">
        <Link href={`/kunden/${customer.id}`} className="text-white/50 text-sm font-semibold">← {customer.name}</Link>
        <div className="text-white font-syne font-black text-xl mt-1">Kunde bearbeiten</div>
      </div>

      <div className="px-5 md:px-8 pt-5 flex flex-col gap-4 max-w-xl mx-auto">
        <KundeBearbeitenFormular
          kundeId={customer.id}
          name={customer.name}
          address={customer.address ?? null}
          phone={customer.phone ?? null}
          email={customer.email ?? null}
        />
      </div>
    </div>
  )
}
