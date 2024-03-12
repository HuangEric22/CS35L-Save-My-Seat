import { Box, Typography, Button, TextField, CircularProgress, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { tokens } from "../theme";
import { useTheme } from '@mui/material/styles';
import { styled, keyframes } from '@mui/system';
import { light } from "@mui/material/styles/createPalette";
import { useAuctionContext } from "../hooks/useAuctionContext";
import '../animations.css';


const FetchMyAuctions = () => {
    const {auction, dispatch} = useAuctionContext()
const{user} = useAuthContext()

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/auction/?user=my', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Assuming you have an authentication method that uses tokens
                        'Authorization': `Bearer ${user.token}`
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch auctions');
                }
                
                const data = await response.json();
                if (response.ok) {
                    dispatch({type: 'SET_AUCTIONS', payload: data})
                  }
            } catch (error) {
                console.error(error);
            }
        
        /*
        const fetchBids = async () => {
            try {
                const response = await fetch('/api/auctions/my-bids', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch bids');
                }
                
                const data = await response.json();
                setUserBids(data);
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchAuctions();
        fetchBids();*/
    } // Depend on user.token to refetch if the user's token changes

if (user) {

fetchAuctions();
}

}, [dispatch, user])
return (
    <div className="home">
      <div className="workouts">
        {workouts && workouts.map((workout) => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      </div>
      <WorkoutForm />
    </div>
  )
}

export default FetchMyAuctions;