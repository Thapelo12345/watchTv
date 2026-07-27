 import { createContext } from "react"
 
 export const lickedModal = createContext({
    modalOpen: false,
    setModal: (value: boolean)=> {}
  })