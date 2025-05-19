import { create } from 'zustand'

type StatusType = 'start' | 'players' | 'game' | 'end';

type StoreType = {
    status: StatusType
    players: string[]
    addPlayer: (player: string) => void
    removePlayer: (index: number) => void
    setStatus: (status: StatusType) => void
}

export const useStore = create<StoreType>((set) => ({
    status: 'start',
    players: [],
    removePlayer: (index) => set((state) => ({ players: state.players.filter((_, i) => i !== index) })),
    addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
    setStatus: (status) => set(() => ({ status })),
}));