import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import Header from "../../components/Header";
import React, { useState , useEffect} from 'react';
import { tokens } from "../../theme";
import { useTheme } from '@mui/material/styles';
import { classesList, auctionDurations } from '../../data/mockClassData';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useBidContext } from "../../hooks/useBidContext";
const Buy = () => {
    const {user} = useAuthContext();
    const [errors, setErrors] = useState({});
    const {getBidderUserIdByBidId} = useBidContext();
    //console.log(bid.bidderID)
    const [selectedClass, setSelectedClass] = useState('');
    const [startingBid, setStartingBid] = useState('');
    const [duration, setDuration] = useState('');
    const [message, setMessage] = useState('');
    const [classes, setClasses] = useState([]);
    const [selectedCourseAbbrev, setSelectedCourseAbbrev] = useState('');
    const courseAbbrevs = [...new Set(classes.map(cls => cls.course_abbrv))];
    const filteredClasses = classes.filter((cls) => cls.course_title && cls.course_abbrv === selectedCourseAbbrev);
    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleBidChange = (event) => {
        setStartingBid(event.target.value);
    };

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    };
    const validateForm = () => {
        let tempErrors = {};
        tempErrors.startingBid = startingBid ? "" : "Starting bid is required";
        tempErrors.class = selectedClass ? "" : "Class is required";
        tempErrors.duration = duration ? "" : "Duration is required";
        // Add more validations as needed
    
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    }
    const fetchClasses = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/classes/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data`);
            }
            const classesData = await response.json();
            setClasses(classesData);
            
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []); 
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const cardStyle = {
        backgroundColor: colors.primary[400],
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!validateForm()) {
            console.error("Validation failed");
            return;
        }
        try {
            let userString = localStorage.getItem('user'); 
            let { userID } = JSON.parse(userString);
        
            const auctionData = {
                message,
                courseName: selectedClass,
                startingBid,
                expDays: duration,
                completed: false, 
                ownerId: user.userID,
            };
    
            const response = await fetch("http://localhost:4000/api/auction/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
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
            setMessage('')
    setSelectedCourseAbbrev('');
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
                    <InputLabel id="course-abbrev-select-label">Department*</InputLabel>
                    <Select
                        labelId="course-abbrev-select-label"
                        id="course-abbrev-select"
                        value={selectedCourseAbbrev}
                        label="Course Abbreviation"
                        onChange={(e) => {
                            setSelectedCourseAbbrev(e.target.value);
                            setSelectedClass(''); // Reset selected class when changing abbreviation
                        }}
                        sx={cardStyle}
                    >
                        {courseAbbrevs.map((abbrev) => (
                            <MenuItem key={abbrev} value={abbrev}>{abbrev}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedCourseAbbrev && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="class-select-label">Class*</InputLabel>
                        <Select
                            labelId="class-select-label"
                            id="class-select"
                            value={selectedClass}
                            label="Select a Class"
                            onChange={(e) => setSelectedClass(e.target.value)}
                            sx={cardStyle}
                        >
                            {filteredClasses.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>{cls.course_abbrv + ' ' + cls.course_title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
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
          <TextField
              margin="normal"
             // required
              fullWidth
              id="message"
              label="Message"
              name="message"
              autoComplete="off"
              type="text"
              InputProps={{ inputProps: { min: 0 } }}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              sx={cardStyle}
          />
       {/*}    <TextField
              margin="normal"
              required
              fullWidth
              id="duration"
              label="Duration (days)"
              name="startingBid"
              autoComplete="off"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={duration}
              onChange={handleDurationChange}
              sx={cardStyle}
                            />*/}
         { <FormControl fullWidth margin="normal">
              <InputLabel id="duration-select-label">Duration*</InputLabel>
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
                  </FormControl>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: colors.primary[800], color:'white' }} onClick={handleSubmit}>
              Start Auction
          </Button>
      </Box>
    </Box>
  );
}

export default Buy;