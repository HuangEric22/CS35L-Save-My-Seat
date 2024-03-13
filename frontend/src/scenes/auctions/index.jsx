import { Box, Typography, Button, TextField, InputBase, IconButton } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardActions, Grid } from '@mui/material';
//import { auctions, bids } from "../../data/mockAuctions"
import { styled, keyframes } from '@mui/system';
import '../../animations.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useBidContext } from "../../hooks/useBidContext";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";


const Auctions = () => {
    
    const {user} = useAuthContext();
    const id = user.userID;
    const username = user.name;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [fetchAgain, setFetchAgain] = useState(false);
    const [realAuctions, setAuctions] = useState([]);
    const [highestBidders, setHighestBidders] = useState([]);
    const [bidders, setBidders] = useState([]);
    const [times, setTimes] = useState([]);
    const [mybids, setBids] = useState([]);

    const fetchMyBids = async () => {

    }

    
    const fetchAuctions = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/auction/", {
                method: "GET", 
              headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch auctions');
            }

            const data = await response.json();
            console.log(data);
            const initialFormVisibleMap = data.reduce((acc, auction) => {
                acc[auction._id] = false;
                return acc;
            }, {});
            setAuctions(data);
            fetchHighestBidder();
            fetchTimes();
        } catch (error) {
            console.error(error);
        }
        
try {
    const response = await fetch(`http://localhost:4000/api/user/bids/${id}`, {
        method: "GET", 
      headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch auctions');
    }

    const data = await response.json();
   
    setBids(data);
    //console.log(bids);
  
}
catch (error) {
    console.error(error);
}
    };
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
    };

    useEffect(() => {
        fetchMyBids();
        fetchAuctions();
    }, [fetchAgain]);


    console.log(realAuctions);
    console.log(id);
    

    const auctionsFilteredByOwner = realAuctions.filter(auction => auction.ownerId === user.userID);

   {/* const auctionsFilteredByBidder = realAuctions.filter(auction =>
        auction.bids.some(bidId => user.Bids.includes(bidId)) // Checks if any of auction's bidIds exist in user's bids
   );*/}

      console.log("My bids", mybids)
      console.log(Array.isArray(mybids));
      const innerArray = mybids[0]
      console.log(Array.isArray(innerArray))
     // console.log("Auctions Filtered Bids", auctionsFilteredByOwner)
   
    const filteredIDs = Object.entries(highestBidders)
    .filter(([id, [bidAmount, bidderName]]) => bidderName === username)
    .map(([id]) => id);

    const auctionsFilteredByBids = realAuctions.filter(auction =>
        auction.bids.some(auctionBidRef => mybids.includes(auctionBidRef))
    );
      console.log(auctionsFilteredByOwner)
   //   console.log(auctionsFilteredByBids)
   // console.log(realAuctions);
   // console.log(id);
  // // console.log(highestBidders);
   // console.log(times);
    //console.log(user.userID)


    const cardStyle = {
        width: '100%',
        maxWidth: '345px',
        
        backgroundColor: `${colors.primary[400]}`
    };

    const deleteAuction = async (auctionId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/auction/${auctionId}`, { // Corrected template string syntax
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`, // Corrected template string syntax
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete auction');
            }

            const message = await response.json();
            console.log(message);

            const updatedAuctions = realAuctions.filter(auction => auction._id !== auctionId);
            setAuctions(updatedAuctions);

        } catch (error) {
            console.error(error);
            
        }
    };

    const handleDeleteClick = (auctionId) => {
        deleteAuction(auctionId);
    };

    const [isVisible, setIsVisible] = useState(true);

    return (
        <Box m={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Header title="My Auctions" subtitle="Auctions you've started and ones you bid on will be displayed here" />
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4">Auctions I've Started</Typography>
                    <Grid container spacing={2}>
                        {auctionsFilteredByOwner.map((auction) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={auction._id}>
                                <Card raised style={cardStyle}>
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {auction.courseName}
                                        </Typography>
                                        { highestBidders[auction._id] &&
                                        <Typography color="textSecondary">
                                            Highest Bid: ${highestBidders[auction._id][0]}
                                            <br/>
                                            Bidder: {highestBidders[auction._id][1]} 
                                            <br/>
                                        </Typography> }
                                        { times[auction._id] && 
                                        <Typography color = "#FFD100">
                                            Time Left - {times[auction._id].hours} hours : {times[auction._id].minutes} minutes
                                            </Typography>}
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => handleDeleteClick(auction._id)} size="medium" sx={{ color: `${colors.primary[50]}` }}>Delete</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12} mt={3}>
                    <Typography variant="h4">Auctions I've Bid On</Typography>
                    <Grid container spacing={2}>
                        {auctionsFilteredByBids.map((auction) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={auction._id}>
                                <Card raised className={ highestBidders[auction._id] && username !== highestBidders[auction._id][1] ? 'someoneOutbidYou' : '' } sx={cardStyle}>
                                    <CardContent>
                                        { highestBidders[auction._id] && <Typography variant="h5" component="h2">
                                            {auction.courseName} 
                                        </Typography> }
                                        { highestBidders[auction._id] &&
                                        <Typography color="textSecondary">
                                            Highest Bid: ${highestBidders[auction._id][0]} 
                                        </Typography> }
                                        { highestBidders[auction._id] &&
                                        <Typography color="textSecondary"
                                            sx={{
                                                color: username === highestBidders[auction._id][1] ? 'green' : 'red',
                                            }}>
                                                {username === highestBidders[auction._id][1] ? 'You are the highest bidder!' : 'Highest Bidder: {highestBidders[auction._id][1]}'}
                                        </Typography> }
                                        { times[auction._id] &&
    <Typography color="#FFD100">
        Time Left - {times[auction._id].hours} hours : {times[auction._id].minutes} minutes
    </Typography>}
                                    </CardContent>
                                    <CardActions>
                                        { highestBidders[auction._id] &&
                                        <Button size="medium" className={username != highestBidders[auction._id][1] ? 'fieryGlowingText' : ' '} sx={{ color: username != highestBidders[auction._id][1] ? 'red' : `${colors.primary[50]}` }} >
                                            Increase Bid
                                        </Button> }
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};


export default Auctions;