import { Box } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardActions, Typography, Button, Grid } from '@mui/material';
import { auctions, bids } from "../../data/mockAuctions"
import { styled, keyframes } from '@mui/system';
import '../../animations.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useState, useEffect } from "react";


const Auctions = () => {
    
    const {user} = useAuthContext();
    const id = user.userID;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [fetchAgain, setFetchAgain] = useState(false);
    const [realAuctions, setAuctions] = useState([]);

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
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, [fetchAgain]);


    console.log(realAuctions);
    console.log(id);
    const auctionsFilteredByOwner = realAuctions.filter(auction => auction.ownerId === id);

    const userAuctions = auctions;
    const userBids = bids;

    const cardStyle = {
        width: '100%',
        maxWidth: '345px',
        
        backgroundColor: `${colors.primary[400]}`
    };

    const flameAnimation = keyframes`
        0% { box-shadow: 0 0 5px 2px rgba(255, 165, 0, 0.7); }
        50% { box-shadow: 0 0 20px 10px rgba(255, 140, 0, 0.9); }
        100% { box-shadow: 0 0 5px 2px rgba(255, 165, 0, 0.7); }
    `;

// Styled Box component with the animation
    const FieryCard = styled(Card)(({ theme }) => ({
        backgroundColor: colors.primary[400],
        animation: `${flameAnimation} 2s infinite ease-in-out`,
    }));

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
                                        <Typography color="textSecondary">
                                            Highest Bid: ${auction.startingBid}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" sx={{ color: `${colors.primary[50]}` }}>View</Button>
                                        <Button size="small" sx={{ color: `${colors.primary[50]}` }}>Edit</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12} mt={3}>
                    <Typography variant="h4">Auctions I've Bid On</Typography>
                    <Grid container spacing={2}>
                        {userBids.map((bid) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={bid.id}>
                                <Card raised className={bid.highestBid > bid.userBid ? 'someoneOutbidYou' : ''} sx={cardStyle}>
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {bid.title}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            My Bid: ${bid.userBid}
                                        </Typography>
                                        <Typography color="textSecondary"
                                            sx={{
                                                color: bid.highestBid > bid.userBid ? 'red' : 'green',
                                            }}>
                                            Highest Bid: ${bid.highestBid}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" sx={{ color: `${colors.primary[50]}` }}>View</Button>
                                        <Button size="small" className={bid.highestBid > bid.userBid ? 'fieryGlowingText' : ' '} sx={{ color: bid.highestBid > bid.userBid ? 'red' : `${colors.primary[50]}` }} >
                                            Increase Bid
                                        </Button>
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