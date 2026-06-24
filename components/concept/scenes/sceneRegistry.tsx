'use client'
import type { Concept } from '@/data/concepts'
import type { ComponentType } from 'react'

export interface HowItWorksStep {
  id: number
  title: string
  subtitle: string
  body: string
  tag: string
}

export interface HardPartsChapter {
  id: number
  title: string
  subtitle: string
  explanations: { title: string; body: string }[]
  codeBlock: string
}

export interface TryItMission {
  title: string
  brief: string
  action: string
}

export interface QuizQuestion {
  id: number
  type: 'concept' | 'scenario' | 'system-design'
  question: string
  options: { id: string; text: string }[]
  correct: string
}

export interface ConceptScenes {
  hookParagraph: string
  hookProperties: { label: string; sub: string }[]
  HookVisual: ComponentType<{ accentColor: string }>
  howItWorksSteps: HowItWorksStep[]
  HowItWorksVisual: ComponentType<{ concept: Concept; step: number }>
  hardPartsChapters: HardPartsChapter[]
  HardPartsVisual: ComponentType<{ accentColor: string; chapter: number }>
  TryItContent?: ComponentType<{ concept: Concept; onComplete: () => void; onNext: () => void }>
  quizQuestions: QuizQuestion[]
}

const registry = new Map<string, ConceptScenes>()

export function registerScenes(slug: string, scenes: ConceptScenes) {
  registry.set(slug, scenes)
}

export function getScenes(slug: string): ConceptScenes | undefined {
  return registry.get(slug)
}
