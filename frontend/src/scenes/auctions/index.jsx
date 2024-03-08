import { Box } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardActions, Typography, Button, Grid } from '@mui/material';
import { auctions, bids } from "../../data/mockAuctions"
import { styled, keyframes } from '@mui/system';
import '../../animations.css';


const Auctions = () => {
    const userAuctions = auctions;
    const userBids = bids;

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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
                        {userAuctions.map((auction) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={auction.id}>
                                <Card raised style={cardStyle}>
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {auction.title}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Highest Bid: ${auction.highestBid}
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
                                        <Button size="small" sx={{ color: `${colors.primary[50]}` }}>
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