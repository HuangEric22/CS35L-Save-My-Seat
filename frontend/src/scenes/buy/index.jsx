import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import Header from "../../components/Header";
import React, { useState } from 'react';
import { tokens } from "../../theme";
import { useTheme } from '@mui/material/styles';
import { classesList, auctionDurations } from '../../data/mockClassData';

const Buy = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [startingBid, setStartingBid] = useState('');
    const [duration, setDuration] = useState('');
    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleBidChange = (event) => {
        setStartingBid(event.target.value);
    };

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    };

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const cardStyle = {
        backgroundColor: colors.primary[400],
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let userString = localStorage.getItem('user'); 
            let { userID } = JSON.parse(userString);
            
            const auctionData = {
                courseName: selectedClass,
                startingBid,
                expDays: duration,
                completed: false, 
                ownerId: userID,
            };
    
            const response = await fetch("http://localhost:4000/api/auction/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(auctionData)
            });
    
            if (!response.ok) {
                throw new Error(`Failed to create auction`);
            }
    
            console.log("Auction created successfully!");
    
            // Reset form fields after successful submission if needed
            setSelectedClass('');
            setStartingBid('');
            setDuration('');
    
        } catch (error) {
            console.error(error);
        }
    };
    

  return (
    <Box>
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Start an Auction"/>
            </Box>
        </Box>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, mx: '20px' }}>
          <FormControl fullWidth margin="normal">
              <InputLabel id="class-select-label">Class</InputLabel>
              <Select
                  labelId="class-select-label"
                  id="class-select"
                  value={selectedClass}
                  label="Class" 
                  onChange={handleClassChange}
                  sx={cardStyle}
              >
                  {classesList.map((className, index) => (
                      <MenuItem key={index} value={className}>
                          {className}
                      </MenuItem>
                  ))}
              </Select>
          </FormControl>
          <TextField
              margin="normal"
              required
              fullWidth
              id="startingBid"
              label="Starting Bid"
              name="startingBid"
              autoComplete="off"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={startingBid}
              onChange={handleBidChange}
              sx={cardStyle}
          />
          <FormControl fullWidth margin="normal">
              <InputLabel id="duration-select-label">Duration</InputLabel>
              <Select
                  labelId="duration-select-label"
                  id="duration-select"
                  value={duration}
                  label="Duration"
                  onChange={handleDurationChange}
                  sx={cardStyle}
              >
                  {auctionDurations.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                          {option.label}
                      </MenuItem>
                  ))}
              </Select>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: colors.primary[800], color:'white' }} onClick={handleSubmit}>
              Start Auction
          </Button>
      </Box>
    </Box>
  );
}

export default Buy;