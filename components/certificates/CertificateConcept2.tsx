'use client'

import React from 'react'
import { Award } from 'lucide-react'

interface CertificateProps {
  studentName?: string
  courseName?: string
  completionDate?: string
  certificateId?: string
}

export default function CertificateConcept2({
  studentName = "Muhammad Shahzad Ali",
  courseName = "Distributed Systems & System Design Architecture",
  completionDate = "June 18, 2026",
  certificateId = "AL-9983-XF24"
}: CertificateProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Outer Certificate Shell */}
      <div className="bg-surface border-[12px] border-surface-raised p-8 sm:p-12 relative text-ink font-dm-sans" style={{ boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}>

        {/* Inner Graphic Accent Frame */}
        <div className="p-6 sm:p-10 flex flex-col justify-between min-h-[500px] relative" style={{ border: '1px solid rgba(13,13,13,0.1)' }}>

          {/* Subtle Corner Markers */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-flame" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-flame" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-flame" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-flame" />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-surface-raised pb-2">
            <div className="flex items-center gap-2">
              <span className="font-syne font-extrabold text-xl tracking-tight pb-4">
                Archi<span className="text-flame">.Learn</span>
              </span>
            </div>
            <div className="text-center sm:text-right font-mono text-[11px] text-ink-muted tracking-widest uppercase">
              Verification ID: <span className="text-ink font-bold">{certificateId}</span>
            </div>
          </div>

          {/* Main Body content */}
          <div className="text-center py-8 flex-1 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.25em] text-ink-muted font-bold block mb-4">
              Certificate of Completion
            </span>

            <h2 className="font-syne font-bold uppercase tracking-[0.25em] text-xs text-ink leading-tight mx-auto">
              This is proudly presented to
            </h2>

            {/* Recipient Name */}
            <div className="my-6 relative inline-block">
              <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-flame px-4 pb-6">
                {studentName}
              </h1>
              <div className="w-full mt-2" style={{ height: 2, background: 'rgba(255,77,0,0.6)' }} />
            </div>

            <p className="text-ink-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed py-2">
              for successfully fulfilling all training requirements and mastering the core architectural challenges within the interactive sandbox module:
            </p>

            {/* Course Title */}
            <h3 className="font-syne pb-6 font-extrabold text-xl sm:text-2xl text-ink mt-4 max-w-2xl mx-auto px-4 bg-canvas rounded-md border border-surface-raised">
              {courseName}
            </h3>
          </div>

          {/* Footer Metadata & Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-3 items-end gap-8 border-t border-surface-raised pt-8 mt-4">

            {/* Issue Date */}
            <div className="text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-wider text-ink-muted block font-medium">Date of Issuance</span>
              <span className="font-syne font-bold text-sm text-ink">{completionDate}</span>
            </div>

            {/* Emblem/Badge */}
            <div className="flex justify-center order-first sm:order-none">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-canvas" style={{ border: '1px solid rgba(13,13,13,0.05)', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)' }}>
                <Award className="w-8 h-8 text-xp-gold" />
                <div className="absolute inset-0 border border-dashed rounded-full animate-[spin_20s_linear_infinite]" style={{ borderColor: 'rgba(255,179,0,0.3)' }} />
              </div>
            </div>

            {/* Authorized Signature */}
            <div className="text-center sm:text-right">
              <div className="inline-block text-center ">
                <span className="font-mono italic text-sm text-ink block pb-4 px-4 tracking-tight" style={{ borderBottom: '1px solid rgba(13,13,13,0.2)' }}>
                  M. Shahzad Ali
                </span>
                <span className="text-[11px] uppercase tracking-wider text-ink-muted block font-medium">
                  Course Instructor, Archi.Learn
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
