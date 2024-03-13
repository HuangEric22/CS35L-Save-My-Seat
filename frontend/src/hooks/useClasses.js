import { ClassesContext } from "../context/ClassesContext"
import { useContext } from "react"

export const useClasses = () => {
    const context = useContext(ClassesContext);
    
    if (!context) {
        throw Error('useClasses must be used inside a ClassesProvider')
      }
    return context
} 
