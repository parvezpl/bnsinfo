// store/useStore.js
import { create } from 'zustand';

const useStore = create((set, get) => ({
    languages: 'hi',
    setLanguages: (value) => {
        set({ languages: value })
    },
    searchparam: null,
    searchdata: [],
    setSearchbtn: async (value) => {
        const lang = get().languages;
        const res = await fetch(`/api/bns/search?search=${encodeURIComponent(value)}&lang=${lang}`)
        const data = await res.json();
        set({ searchparam: value, searchdata: data.bns || data });
    },

    bnshindi: [],
    setBnshindi: async (value) => {
        const lang = get().languages;
        // if (bnshindi.length > 0) return;
        const res = await fetch(`/api/bns/bnshindi/bnshi`)
        const data = await res.json();
        set({ bnshindi: data.bns || data });
    }
}));
export default useStore;



