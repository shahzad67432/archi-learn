import { concepts } from '@/data/concepts'
import { notFound } from 'next/navigation'
import ConceptPage from '@/components/concept/ConceptPage'
import type { Concept } from '@/data/concepts'

export async function generateStaticParams() {
  return concepts.map(c => ({ slug: c.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const concept = concepts.find(c => c.slug === slug) as Concept | undefined
  if (!concept) notFound()
  return <ConceptPage concept={concept} />
}
