'use client'
import { registerScenes } from '../sceneRegistry'
import {
  REDIS_HOOK_PARAGRAPH,
  REDIS_HOOK_PROPERTIES,
  REDIS_HOW_IT_WORKS_STEPS,
  REDIS_HARD_PARTS_CHAPTERS,
  REDIS_QUIZ_QUESTIONS,
} from './RedisConceptData'
import RedisHookVisual from './RedisHookVisual'
import RedisHowItWorksVisual from './RedisHowItWorksVisual'
import RedisHardPartsVisual from './RedisHardPartsVisual'
import ZoneRedisTryIt from '@/components/concept/zones/ZoneRedisTryIt'

export function registerRedisScenes() {
  registerScenes('redis', {
    hookParagraph: REDIS_HOOK_PARAGRAPH,
    hookProperties: REDIS_HOOK_PROPERTIES,
    HookVisual: RedisHookVisual,
    howItWorksSteps: REDIS_HOW_IT_WORKS_STEPS,
    HowItWorksVisual: RedisHowItWorksVisual,
    hardPartsChapters: REDIS_HARD_PARTS_CHAPTERS,
    HardPartsVisual: RedisHardPartsVisual,
    quizQuestions: REDIS_QUIZ_QUESTIONS,
    TryItContent: ZoneRedisTryIt,
  })
}
