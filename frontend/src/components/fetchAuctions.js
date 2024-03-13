import { Box, Typography, Button, TextField, CircularProgress, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { tokens } from "../theme";
import { useTheme } from '@mui/material/styles';
import { styled, keyframes } from '@mui/system';
import { light } from "@mui/material/styles/createPalette";
import '../animations.css';

const MyAuctions = () => {

    const {user} = useAuthContext();
    const [auctions, setAuctions] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [times, setTimes] = useState([]);
    const [highestBidders, setHighestBidders] = useState([]);
    const [error, setError] = useState(null);
    const [fetchAgain, setFetchAgain] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formVisibleMap, setFormVisibleMap] = useState({});
    const fetchHighestBidder = async () => {
       
        try {
            const response = await fetch("http://localhost:4000/api/user/highestBidder", {
                method: "GET", 
                
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data`);
            }
            const bidders = await response.json();
            console.log(bidders);
            setHighestBidders(bidders);
        } catch (error) {
            console.error(error);
        }
    }
    const createBids = async (auctionId, bidAmount) => {
     //   let userString = localStorage.getItem('user');
      //  let { userID, name } = JSON.parse(userString);
      //from now on, use the const {user} = useAuthContext(); syntax to get items from local storage. 
      //user.name now provides the name; it is more stable this way
        try {   
            const response = await fetch(`http://localhost:4000/api/auction/${auctionId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization token if needed
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ auctionId, amount: bidAmount, bidderId : user.userID, name: user.name })
            });
    
            if (!response.ok) {
                throw new Error(`Failed to place bid for auction ${auctionId}`);
            }
    
            const data = await response.json();
            
            // Check if the current bid is higher than the existing highest bid
            if (!highestBidders[auctionId] || bidAmount > parseFloat(highestBidders[auctionId][0])) {
                // Update the highestBidders state only if the current bid is higher
                const updatedBidder = [bidAmount.toString(), user.name];
                setHighestBidders(prevHighestBidders => ({
                    ...prevHighestBidders,
                    [auctionId]: updatedBidder
                }));
            }
            
            // Update state or perform any other necessary actions upon successful bid placement
            console.log(data);
        } catch (error) {
            console.error(error);
            // Handle errors appropriately
        }
    };
    
    const fetchSellers = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/user/", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                      }
                   /*headers: {
                    // Added Authorization header with Bearer token
                    'Authorization': `Bearer ${user.token}`
                }
*/
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch data`);
                }
                const sellerData = await response.json(); // Await the response.json() call
                setSellers(sellerData);

            } catch (error) {
                console.error(error);
            }
    };
    const fetchTimes = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/auction/times", {
                method:"GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  }
                /*headers: {
                    // Added Authorization header with Bearer token
                    'Authorization': `Bearer ${user.token}`
                }
*/
            });
            if(!res.ok){
                throw new Error(`Failed to Fetch Times`)
            }
            const auctiontimes = await res.json(); 
            setTimes(auctiontimes);
            console.log(auctiontimes)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchAuctions = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/auction/", {
                method: "GET", 
              headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  }
                /*headers: {
                    // Added Authorization header with Bearer token
                    'Authorization': `Bearer ${user.token}`
                }
*/
            });

            if (!response.ok) {
                throw new Error('Failed to fetch auctions');
            }

            const data = await response.json();
            const initialFormVisibleMap = data.reduce((acc, auction) => {
                acc[auction._id] = false;
                return acc;
            }, {});
            setAuctions(data);
            console.log(data);
            fetchSellers();
            fetchHighestBidder();
            fetchTimes();
            setFormVisibleMap(initialFormVisibleMap);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch auctions. Please try again later.');
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, [fetchAgain]);

    console.log(auctions);
    const handleSubmit = (event, auctionId) => {
        event.preventDefault();
        const bidAmountInput = document.getElementById(`bidAmount_${auctionId}`).value;
        const bidAmount = parseFloat(bidAmountInput);
    
        // Ensure bidAmount is a valid number
        if (isNaN(bidAmount)) {
            alert("Please enter a valid bid amount.");
            return;
        }
    
        // Check if the auction has been bid on before
        if (highestBidders[auctionId]) {
            const highestBid = parseFloat(highestBidders[auctionId][0]);
            // New bid must be higher than the current highest bid
            if (bidAmount > highestBid) {
                createBids(auctionId, bidAmount); // Proceed with creating the bid
                setFetchAgain(!fetchAgain); // Trigger any needed re-fetch or UI update
            } else {
                alert("Your bid must be higher than the current highest bid.");
            }
        } else {
            // No existing bids for this auction, any bid amount is acceptable
            createBids(auctionId, bidAmount); // Proceed with creating the bid
            setFetchAgain(!fetchAgain); // Trigger any needed re-fetch or UI update
        }
    };
    

       const handleToggleForm = (auctionId) => {
        setFormVisibleMap(prevState => ({
            ...prevState,
            [auctionId]: !prevState[auctionId],
        }));
    };

    const theme =useTheme();
    const colors = tokens(theme.palette.mode);

    const boxStyle = {
        backgroundColor: colors.primary[600],
    }

    const lighterBoxStyle = {
        backgroundColor: colors.primary[500],
    }

    return (
        <Box m="20px">
            {[...auctions].reverse().map((auction) => 
            <Box key={auction._id} className={times[auction._id] && times[auction._id].hours < 2 ? 'fieryBox' : ''} sx={boxStyle} width='65%' p={2} color='white' borderRadius='10px' mb={3}>
                <Grid container justifyContent="space-between" alignItems="center">
                    {times[auction._id] ? (
                <>
                    <Grid item>
                        <Typography variant="h3" gutterBottom>
                            {auction.courseName}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h3" display="inline" ml={1}>
                            Time Left - {times[auction._id].hours} hours : {times[auction._id].minutes} minutes
                        </Typography>
                    </Grid>
                </>
                
                ) : null}
                </Grid>
                {highestBidders[auction._id] && <Typography variant="body1" gutterBottom>
                    Seller: {sellers[auction._id]} | {highestBidders[auction._id] && highestBidders[auction._id][1] !== "No Bids" ? `Highest Bid: $${highestBidders[auction._id][0]} (${highestBidders[auction._id][1]})` : `Starting Price: $${auction.startingBid}`}
                </Typography>}
                {auction.message && // Check if there is a message
            <Typography variant="body1" gutterBottom>
                Message from {sellers[auction._id]}: {auction.message}
            </Typography>
        }
                <Box display="flex" alignItems="center">
                    {times[auction._id] && !times[auction._id].completed && 
                    <Button sx={lighterBoxStyle} variant="contained" color="primary" onClick={() => handleToggleForm(auction._id)}>
                        {formVisibleMap[auction._id] ? "Cancel" : "Place Bid"}
                    </Button>}
                    {formVisibleMap[auction._id] && (!times[auction._id].completed)&& (
                        <Box ml={1}>
                            <form onSubmit={(event) => handleSubmit(event, auction._id)} style={{ display: 'flex', alignItems: 'center' }}>
                                <Button type="button" variant="contained" color="secondary" onClick={(event) => handleSubmit(event, auction._id)} >
                                    Submit
                                </Button>
                                <Box ml={1} flexGrow={1}>
                                <TextField
                                    sx={lighterBoxStyle}
                                    variant="outlined"
                                    label="Bid Amount"
                                    name={`bid_${auction._id}`} // Using auction ID to make the name unique
                                    margin="normal"
                                    fullWidth
                                    id={`bidAmount_${auction._id}`} // Using auction ID to make the ID unique
                                />
                                </Box>
                            </form>
                        </Box>
                    )}
                </Box>
            </Box>)}
            {loading && (
                <Box mt={2} display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            )}
            {error && (
                <Box mt={2} bgcolor="error.main" p={2} color="white" borderRadius="5px">
                    {error}
                </Box>
            )}
        </Box>
    );
};

export default MyAuctions;
