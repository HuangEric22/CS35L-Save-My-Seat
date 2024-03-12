import { AuctionContext } from '../context/AuctionContext'
import { useContext } from 'react'

export const useAuctionContext = () => {
  const context = useContext(AuctionContext)

  if (!context) {
    throw Error('useAuctionContext must be used inside an AuctionContextProvider')
  }

  return context
}