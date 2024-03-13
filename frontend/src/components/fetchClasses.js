// import React, { useState, useEffect } from 'react';
// import {styled} from '@mui/system'
// import { Box, FormControl, InputLabel, Select, MenuItem, Button, Typography, useTheme } from "@mui/material";
// import { useAuthContext } from "../hooks/useAuthContext";

// const MyClasses = () => {
//     const { user } = useAuthContext();
//     const [classes, setClasses] = useState([]);
//     const [selectedClass, setSelectedClass] = useState("");
//     const [selectedLecture, setSelectedLecture] = useState(null);
//     const [lectures, setLectures] = useState([]);
//     const theme = useTheme();
//     const filteredClasses = classes.filter((cls) => cls.course_title);

//     const StyledBox = styled(Box)(({ theme }) => ({
//         padding: theme.spacing(2),
//         backgroundColor: theme.palette.primary.light, // Or use custom theme token colors
//         margin: theme.spacing(2),
//         borderRadius: theme.spacing(1)
//     }));

//     const fetchClasses = async () => {
//         // Replace URL with your actual endpoint
//         try {
//             const response = await fetch("http://localhost:4000/api/classes/", {
//                 method: "GET",
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${user.token}`
//                 }
//             });
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch data`);
//             }
//             const classesData = await response.json();
//             setClasses(classesData);
            
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         fetchClasses();
//     }, []);

//     useEffect(() => {
//         if (selectedClass) {
//             const classLectures = classes.find(cls => cls.id === selectedClass)?.lectures || [];
//             setLectures(classLectures);
//             setSelectedLecture(""); // Reset selected lecture when class changes
//         }
//     }, [selectedClass, classes]);
    
//     const handleEnroll = () => {
//         console.log("Enrolled in class:", selectedClass);
//         // Enrollment logic goes here
//     };


//     return (
//         <StyledBox>
//         <FormControl fullWidth margin="normal">
//             <InputLabel id="class-select-label">Select a Class</InputLabel>
//             <Select
//                 labelId="class-select-label"
//                 id="class-select"
//                 value={selectedClass}
//                 label="Select a Class"
//                 onChange={(e) => setSelectedClass(e.target.value)}
//             >
//                 {filteredClasses.map((cls) => (
//                     <MenuItem key={cls.id} value={cls.id}>{cls.course_abbrv + ' ' + cls.course_title}</MenuItem>
//                 ))}
//             </Select>
//         </FormControl>
        
//         {selectedClass && ( // Only show this Select if a class is selected
//             <FormControl fullWidth margin="normal">
//                 <InputLabel id="lecture-select-label">Select a Lecture</InputLabel>
//                 <Select
//     labelId="lecture-select-label"
//     id="lecture-select"
//     value={selectedLecture}
//     label="Select a Lecture"
//     onChange={(e) => setSelectedLecture(e.target.value)}
// >
//     {lectures.map((lecture) => (
//         <MenuItem key={lecture.num} value={lecture.num}>
//             {`${lecture.instructors}: ${lecture.title} - ${lecture.days} ${lecture.time} at ${lecture.location}`}
//         </MenuItem>
//     ))}
// </Select>
//             </FormControl>
//         )}

//         <Button 
//             variant="contained" 
//             color="secondary" 
//             onClick={handleEnroll} 
//             sx={{ mt: 2, backgroundColor: '#ffc649', '&:hover': { backgroundColor: 'darkgoldenrod' } }}
//             disabled={!selectedLecture} // Disable enroll button if no lecture is selected
//         >
//             Add to Plan
//         </Button>
//     </StyledBox>
//     );
// };

// export default MyClasses;