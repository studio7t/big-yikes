import { Discovery } from '@big-yikes/lib';
import create from 'zustand';

interface DiscoveryState {
  discoveries: Discovery[];
  isDiscovery: boolean;
  error: boolean;
  isLoading: boolean;
  setDiscoveries: (discoveries: Discovery[]) => void;
  setIsDiscovery: (isDiscovery: boolean) => void;
  setError: (error: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  discoveries: [],
  isDiscovery: false,
  isLoading: false,
  error: false,
  setDiscoveries: (discoveries: Discovery[]) => set({ discoveries }),
  setIsDiscovery: (isDiscovery: boolean) => set({ isDiscovery }),
  setError: (error: boolean) => set({ error }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
