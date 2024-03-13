import { BidContext } from '../context/BidContext'
import { useContext } from 'react'

export const useBidContext = () => {
  const context = useContext(BidContext)

  if (!context) {
    throw Error('useBidContext must be used inside an AuctionBidProvider')
  }

  return context
}