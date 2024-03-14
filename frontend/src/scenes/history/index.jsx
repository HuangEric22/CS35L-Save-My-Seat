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
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';



const History = () => {
    
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
    const [formVisibleMap, setFormVisibleMap] = useState({});
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
            const initialFormVisibleMap = data.reduce((acc, auction) => {
                acc[auction._id] = false;
                return acc;
            }, {});
            setAuctions(data);
            console.log(realAuctions);
            fetchHighestBidder();
            setFormVisibleMap(initialFormVisibleMap);
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

    const lighterBoxStyle = {
        backgroundColor: colors.primary[500],
    }


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

    const handleDeleteClick = (auctionId) => {
        deleteAuction(auctionId);
    };

    const handleSubmit = (event, auctionId) => {
        event.preventDefault();
        const bidAmountInput = document.getElementById(`bidAmount_${auctionId}`).value;
        const bidAmount = parseFloat(bidAmountInput);
        // Ensure bidAmount is a valid number
        if (isNaN(bidAmount)) {
            alert("Please enter a valid bid amount.");
            return;
        }
        // Find the auction being bid on
        const auction = realAuctions.find(a => a._id === auctionId);
        if (!auction) {
            alert("Auction not found.");
            return;
        }
        // Prevent bidding on own auction
        if (auction.ownerId === user.userID) {
            alert("You cannot bid on your own auction.");
            return;
        }
        // Check if the auction has been bid on before
        if (highestBidders[auctionId]) {
            const highestBid = parseFloat(highestBidders[auctionId][0]);
            // New bid must be higher than the current highest bid
            if (bidAmount > highestBid) {
                createBids(auctionId, bidAmount); 
                setFetchAgain(!fetchAgain); 
            } else {
                alert("Your bid must be higher than the current highest bid.");
            }
        } else {
            // No existing bids for this auction, any bid amount is acceptable
            createBids(auctionId, bidAmount);
            setFetchAgain(!fetchAgain); 
        }
    };

    const handleToggleForm = (auctionId) => {
        setFormVisibleMap(prevState => ({
            ...prevState,
            [auctionId]: !prevState[auctionId],
        }));
    };

    const [isVisible, setIsVisible] = useState(true);

    console.log(realAuctions);

    const columns = [
        {
          field: "name",
          headerName: "Name",
          flex: 1,
        },
        {
          field: "class",
          headerName: "Class Name",
          flex: 1,
        },
        {
          field: "price",
          headerName: "Amount",
          flex: 1,
        },
      ];

      useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const filteredAuctions = realAuctions.filter(auction => auction.ownerId == id);
            console.log(filteredAuctions);
            console.log(highestBidders);
      
            const newRows = filteredAuctions.flatMap(auction => {
              const auctionId = auction._id;
              const courseName = auction.courseName;
      
              if (auctionId && highestBidders[auctionId] && highestBidders[auctionId].length > 0) {
                const bids = highestBidders[auctionId] || [];
                console.log(bids);
                return bids.map((bid, index) => ({
                  id: `${auctionId}-${index}`,
                  name: bid.name,
                  class: courseName,
                  price: `$${bid.amount}`,
                }));
              } else {
                return [];
              }
            }).reverse();
      
            setRows(newRows); 
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setIsLoading(false); 
          }
        };
      
        fetchData();
      }, [id, realAuctions, highestBidders]);
    

    if (isLoading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress /> 
          </div>
        );
      }


    return (
        <>
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Transaction History" subtitle="All financial interactions"/>
            </Box>
            <Box m="40px 0 0 0" 
                 height="75vh" 
                 sx= {{
                 "& .MuiDataGrid-root": {
                    border: "none",
                 },
                 "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                 },
                 "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none"
                 },
                 "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                 },
                 "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700]
                 }
            
            }}>
               <DataGrid rows={rows} columns = {columns}/> 
            </Box>

        </Box>
        </>
    )
}

export default History;