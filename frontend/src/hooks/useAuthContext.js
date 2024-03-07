import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

export const useAuthContext = () => {
  console.log(AuthContext)
  const context = useContext(AuthContext)
  console.log(context)
  
  if(!context) {
    console.log("Hi there!")
    throw Error('useAuthContext must be used inside an AuthContextProvider')
  }

  return context
}