import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'
 
interface GeneralState { 
  backdrop:boolean;  
  setBackdrop:  (newValueBackdrop:boolean) => Promise<void>; 
}


const generalStore:StateCreator<GeneralState,[["zustand/devtools", never], ["zustand/immer", never]]>=(set,get)=>({  
    backdrop:true, 
    setBackdrop: async (newValueBackdrop:boolean) => { 
      set((state)=>{ state.backdrop= newValueBackdrop}  ); 
    },
   
});


export const useGeneralStore=create<GeneralState>()(
  devtools(
    persist(
      immer(
        generalStore
      )
       ,{
          name:'general-store',
        }
     )
  )
);