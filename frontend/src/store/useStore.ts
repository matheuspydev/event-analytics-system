import { create } from 'zustand';
import { Project } from '../types';

interface AppState {
  selectedProject: Project | null;
  apiKey: string | null;
  setSelectedProject: (project: Project | null) => void;
  setApiKey: (key: string | null) => void;
  loadApiKey: () => void;
}

export const useStore = create<AppState>((set) => ({
  selectedProject: null,
  apiKey: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
  setApiKey: (key) => {
    if (key) {
      localStorage.setItem('apiKey', key);
    } else {
      localStorage.removeItem('apiKey');
    }
    set({ apiKey: key });
  },
  loadApiKey: () => {
    const key = localStorage.getItem('apiKey');
    set({ apiKey: key });
  },
}));
