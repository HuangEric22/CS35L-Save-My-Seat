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

    const handleSubmit = (event) => {
        event.preventDefault();
        const auctionData = {
            class: selectedClass,
            startingBid,
            duration,
    };
    //SEND THIS TO BACKEND
    console.log(auctionData);
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
          />
          <FormControl fullWidth margin="normal">
              <InputLabel id="duration-select-label">Duration</InputLabel>
              <Select
                  labelId="duration-select-label"
                  id="duration-select"
                  value={duration}
                  label="Duration"
                  onChange={handleDurationChange}
              >
                  {auctionDurations.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                          {option.label}
                      </MenuItem>
                  ))}
              </Select>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Start Auction
          </Button>
      </Box>
    </Box>
  );
}

export default Buy;