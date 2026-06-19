'use client'

import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import CertificateConcept2 from '@/components/certificates/CertificateConcept2'

export interface CertData {
  name: string
  conceptTitle: string
  conceptTagline: string
  accentColor: string
  certId: string
}

export async function generateCertificatePNG(element: HTMLElement): Promise<Blob> {
  const html2canvas = (await import('html2canvas')).default
  await document.fonts.ready
  return html2canvas(element, {
    scale: 2,
    backgroundColor: '#FFFBF7',
    allowTaint: false,
    useCORS: true,
    logging: false,
  }).then(canvas => new Promise<Blob>(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png')))
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function getStoredCertificate(slug: string): CertData | null {
  try {
    const raw = localStorage.getItem(`certificate-${slug}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function storeCertificate(slug: string, data: CertData) {
  localStorage.setItem(`certificate-${slug}`, JSON.stringify(data))
}

export function generateCertId(slug: string): string {
  const ts = Date.now().toString(36).toUpperCase()
  return `ARCHI-${slug.toUpperCase()}-${ts}`
}

export async function generateStoredCertPNG(data: CertData): Promise<Blob> {
  const div = document.createElement('div')
  Object.assign(div.style, {
    position: 'fixed',
    left: '-9999px',
    top: '0',
    zIndex: '-1',
    width: 'full',
    height: 'full',
  })
  document.body.appendChild(div)

  const root = createRoot(div)
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  flushSync(() => {
    root.render(
      <CertificateConcept2
        studentName={data.name}
        courseName={data.conceptTitle}
        completionDate={dateStr}
        certificateId={data.certId}
      />
    )
  })

  await document.fonts.ready
  div.getBoundingClientRect() // force reflow
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

  const blob = await generateCertificatePNG(div)

  root.unmount()
  document.body.removeChild(div)
  return blob
}
