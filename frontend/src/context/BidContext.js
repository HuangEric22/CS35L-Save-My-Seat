import { createContext, useReducer } from 'react'

export const BidsContext = createContext()

export const bidsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BIDS': 
      return {
        bids: action.payload
      }
    case 'CREATE_BIDS':
      return {
        bids: [action.payload, ...state.bids]
      }
    
    default:
      return state
  }
}

export const BidsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bidsReducer, {
    workouts: null
  })

  return (
    <BidsContext.Provider value={{...state, dispatch}}>
      { children }
    </BidsContext.Provider>
  )
}