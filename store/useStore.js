// store/useStore.js
import { create } from 'zustand';

const useStore = create((set) => ({
    searchparam: null,
    setSearchparam: (value) => {
        set({ searchparam: value })
    },


}));
export default useStore;
