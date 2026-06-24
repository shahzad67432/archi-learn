'use client'
import { registerScenes } from '../sceneRegistry'
import {
  WS_HOOK_PARAGRAPH,
  WS_HOOK_PROPERTIES,
  WS_HOW_IT_WORKS_STEPS,
  WS_HARD_PARTS_CHAPTERS,
  WS_QUIZ_QUESTIONS,
} from './WSConceptData'
import WSHookVisual from './WSHookVisual'
import WSHowItWorksVisual from './WSHowItWorksVisual'
import WSHardPartsVisual from './WSHardPartsVisual'
import ZoneTryIt from '@/components/concept/zones/ZoneTryIt'

export function registerWebSocketScenes() {
  registerScenes('websockets', {
    hookParagraph: WS_HOOK_PARAGRAPH,
    hookProperties: WS_HOOK_PROPERTIES,
    HookVisual: WSHookVisual,
    howItWorksSteps: WS_HOW_IT_WORKS_STEPS,
    HowItWorksVisual: WSHowItWorksVisual,
    hardPartsChapters: WS_HARD_PARTS_CHAPTERS,
    HardPartsVisual: WSHardPartsVisual,
    quizQuestions: WS_QUIZ_QUESTIONS,
    TryItContent: ZoneTryIt,
  })
}
