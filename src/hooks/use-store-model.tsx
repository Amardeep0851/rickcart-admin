import { create } from 'zustand';

interface useModelStore{
  isOpen:boolean;
  onOpen:() => void;
  onClose:() => void;
}

export const useModel = create<useModelStore>((set) => ({
  isOpen:false,
  onOpen:() => set({isOpen:true}),
  onClose:() => set({isOpen:false})
}))