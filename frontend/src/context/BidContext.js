import React, { createContext, useContext, useReducer } from 'react';

export const BidContext = createContext();

export const bidsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BIDS':
      return {
        ...state,
        bids: action.payload,
      };
    case 'CREATE_BID':
      return {
        ...state,
        bids: [action.payload, ...state.bids],
      };
    default:
      return state;
  }
};

export const BidContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bidsReducer, {
    bids: [],
  });

  // Function to get a bidder's user ID based on bid ID
  const getBidderUserIdByBidId = (bidId) => {
    const bid = state.bids.find(b => b.bidId === bidId);
    return bid ? bid.userId : null;
  };

  return (
    <BidContext.Provider value={{ ...state, dispatch, getBidderUserIdByBidId }}>
      {children}
    </BidContext.Provider>
  );
};

// Custom hook to use the BidContext
export const useBids = () => useContext(BidContext);