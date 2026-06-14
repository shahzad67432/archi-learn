export const CERT_WIDTH = 800
export const CERT_HEIGHT = 560

export interface CertData {
  name: string
  conceptTitle: string
  conceptTagline: string
  xp: number
  accentColor: string
}

export function generateCertificatePNG(data: CertData): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = CERT_WIDTH
  canvas.height = CERT_HEIGHT
  const ctx = canvas.getContext('2d')!
  const { name, conceptTitle, conceptTagline, xp, accentColor } = data
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  // ── Background ──
  ctx.fillStyle = '#FFFBF7'
  ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT)

  // ── Outer border ──
  ctx.strokeStyle = '#1C1917'
  ctx.lineWidth = 3
  ctx.strokeRect(28, 28, CERT_WIDTH - 56, CERT_HEIGHT - 56)

  // ── Inner border ──
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 1.5
  ctx.strokeRect(38, 38, CERT_WIDTH - 76, CERT_HEIGHT - 76)

  // ── Decorative corners ──
  const cornerSize = 40
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 2
  // Top-left
  ctx.beginPath(); ctx.moveTo(38, 38 + cornerSize); ctx.lineTo(38, 38); ctx.lineTo(38 + cornerSize, 38); ctx.stroke()
  // Top-right
  ctx.beginPath(); ctx.moveTo(CERT_WIDTH - 38 - cornerSize, 38); ctx.lineTo(CERT_WIDTH - 38, 38); ctx.lineTo(CERT_WIDTH - 38, 38 + cornerSize); ctx.stroke()
  // Bottom-left
  ctx.beginPath(); ctx.moveTo(38, CERT_HEIGHT - 38 - cornerSize); ctx.lineTo(38, CERT_HEIGHT - 38); ctx.lineTo(38 + cornerSize, CERT_HEIGHT - 38); ctx.stroke()
  // Bottom-right
  ctx.beginPath(); ctx.moveTo(CERT_WIDTH - 38 - cornerSize, CERT_HEIGHT - 38); ctx.lineTo(CERT_WIDTH - 38, CERT_HEIGHT - 38); ctx.lineTo(CERT_WIDTH - 38, CERT_HEIGHT - 38 - cornerSize); ctx.stroke()

  // ── Title ──
  ctx.fillStyle = '#1C1917'
  ctx.font = 'bold 30px "Syne", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('ARCHI-LEARN', CERT_WIDTH / 2, 120)

  // ── Accent divider ──
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(CERT_WIDTH / 2 - 120, 138)
  ctx.lineTo(CERT_WIDTH / 2 + 120, 138)
  ctx.stroke()

  // ── Subtitle ──
  ctx.fillStyle = '#78716C'
  ctx.font = '14px "DM Sans", sans-serif'
  ctx.fillText('Certificate of Completion', CERT_WIDTH / 2, 170)

  // ── Star ──
  ctx.fillStyle = accentColor
  ctx.font = '28px sans-serif'
  ctx.fillText('★', CERT_WIDTH / 2, 210)

  // ── Body text ──
  ctx.fillStyle = '#78716C'
  ctx.font = '16px "DM Sans", sans-serif'
  ctx.fillText('This certifies that', CERT_WIDTH / 2, 250)

  // ── Name ──
  ctx.fillStyle = '#1C1917'
  ctx.font = 'bold 36px "Syne", sans-serif'
  ctx.fillText(name, CERT_WIDTH / 2, 305)

  // ── Completed text ──
  ctx.fillStyle = '#78716C'
  ctx.font = '16px "DM Sans", sans-serif'
  ctx.fillText('has successfully completed', CERT_WIDTH / 2, 345)

  // ── Concept title ──
  ctx.fillStyle = accentColor
  ctx.font = 'bold 24px "Syne", sans-serif'
  ctx.fillText(conceptTitle, CERT_WIDTH / 2, 385)

  // ── Tagline ──
  ctx.fillStyle = '#A8A29E'
  ctx.font = '13px "DM Sans", sans-serif'
  ctx.fillText(conceptTagline, CERT_WIDTH / 2, 412)

  // ── Bottom divider ──
  ctx.strokeStyle = '#E7E5E4'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(180, 450)
  ctx.lineTo(CERT_WIDTH - 180, 450)
  ctx.stroke()

  // ── Date ──
  ctx.fillStyle = '#78716C'
  ctx.font = '13px "DM Sans", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(dateStr, 200, 490)

  // ── XP badge ──
  ctx.fillStyle = '#1C1917'
  ctx.font = 'bold 13px "Syne", sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`+${xp} XP`, CERT_WIDTH - 200, 490)

  // ── XP badge background ──
  const xpText = `+${xp} XP`
  const xpMetrics = ctx.measureText(xpText)
  const xpW = xpMetrics.width + 20
  const xpH = 26
  const xpX = CERT_WIDTH - 200 - xpW / 2
  const xpY = 474
  ctx.fillStyle = '#ADFA1D20'
  ctx.beginPath()
  ctx.roundRect(xpX, xpY, xpW, xpH, 6)
  ctx.fill()

  // ── XP text on badge ──
  ctx.fillStyle = '#1C1917'
  ctx.textAlign = 'center'
  ctx.fillText(xpText, CERT_WIDTH - 200, 492)

  // ── Footer ──
  ctx.fillStyle = '#D6D3D1'
  ctx.font = '11px "DM Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('archi-learn — master system design', CERT_WIDTH / 2, 530)

  return new Promise(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'))
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
