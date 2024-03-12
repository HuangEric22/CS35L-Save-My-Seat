import { createContext, useReducer } from 'react'

export const AuctionContext = createContext()

export const auctionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUCTIONS': 
      return {
        auction: action.payload
      }
    case 'CREATE_AUCTION':
      return {
        auction: [action.payload, ...state.auction]
      }
    
    default:
      return state
  }
}

export const WorkoutsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(auctionReducer, {
    auction: null
  })

  return (
    <AuctionContext.Provider value={{...state, dispatch}}>
      { children }
    </AuctionContext.Provider>
  )
}