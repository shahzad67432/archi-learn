import { create } from 'zustand'
import type { MascotState, MascotStore } from '@/lib/types'

interface MascotStoreState extends MascotStore {
  _timeoutId: ReturnType<typeof setTimeout> | null
}

export const useMascotStore = create<MascotStoreState>()((set, get) => ({
  state: 'idle',
  tipText: '',
  visible: true,
  _timeoutId: null,

  setState: (newState: MascotState) => {
    const current = get()

    if (current._timeoutId) clearTimeout(current._timeoutId)

    set({ state: newState, _timeoutId: null })

    if (newState === 'cheer' || newState === 'sad') {
      const id = setTimeout(() => {
        set({ state: 'idle', _timeoutId: null })
      }, 3000)
      set({ _timeoutId: id })
    }
  },

  setTip: (text: string) => {
    const current = get()
    if (current._timeoutId) clearTimeout(current._timeoutId)

    set({ state: 'tip', tipText: text, _timeoutId: null })

    const id = setTimeout(() => {
      set({ state: 'idle', tipText: '', _timeoutId: null })
    }, 4000)
    set({ _timeoutId: id })
  },

  setVisible: (visible: boolean) => set({ visible }),
}))
