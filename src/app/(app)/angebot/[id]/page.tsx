import AngebotDetail from './AngebotDetail'
import { getQuoteDetail } from '@/data/quotes'

export default async function AngebotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { quote, company, quoteNumber } = await getQuoteDetail(id)

  return (
    <AngebotDetail
      quote={quote}
      company={company}
      quoteNumber={quoteNumber}
    />
  )
}
