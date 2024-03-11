
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CardActions, Button} from '@mui/material';
import Header from '../../components/Header';


import Select from "react-select";
import sortedMajorsList from "../../majorsData"; 

//mock data for class list
const mockData = {
    "Computer Science": [
        { id: "COM SCI 35L", name: "35L- Software Construction" },
        { id: "COM SCI 111", name: "111- Operating Principles" },
        { id: "COM SCI 180", name: "180- Algorithms" },
        { id: "COM SCI 143", name: "143- Databases" },


    ],
    "Mathematics of Computation": [
        { id: "MATH 115A", name: "115A- Linear Algebra" },
        { id: "MATH 131A", name: "131A- Analysis" },
    ]
};


const ClassPlanner = ({ myClasses, addClass, removeClass }) => {

    //state for major
    const [selectedMajor, setSelectedMajor] = useState(null);
    //state for major classes
    const [majorClasses, setMajorClasses] = useState([]);

    //update selectedMajor, classesForMajor
    //use will's selectedMajor to find the corresponding major object in eric's data (my mock data)
    const handleMajorChange = (selectedOption) => {
        setSelectedMajor(selectedOption);
        
        if (selectedOption && majorClasses) {
            setMajorClasses(mockData[selectedOption.label]); //set classes to be ones from mock data
        } else {
            setMajorClasses([]); //clear classes if no major is selected 
        }
    };

    //function- render each class as a MUI Card
    const renderClassCard = (classInfo) => {
        return (
            <Card key={classInfo.id} variant="outlined" sx={{ marginBottom: 2, maxWidth: 300, }}>
                <CardContent>
                    <Typography variant="h6" component="div">
                        {classInfo.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {classInfo.instructor}
                    </Typography>
                    <Typography variant="body2">
                        Time: {classInfo.time}
                    </Typography>
                    <Typography variant="body2">
                        Location: {classInfo.location}
                    </Typography>
                    <Typography variant="body2">
                        Units: {classInfo.units}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button 
                        size="small" 
                        onClick={() => addClass(classInfo)}
                        sx={{ backgroundColor: 'gold', color: 'black', '&:hover': { backgroundColor: 'darkgoldenrod' } }}> 
                        Add to My Classes
                    </Button>
                </CardActions>
            </Card>
        );
    };




    return (
        <Box>
            <h1>Search for Classes</h1>
            <div className="major-select-container">
                <h2>Select Your Major</h2>
                <Select
                    value={selectedMajor}
                    onChange={handleMajorChange}
                    options={sortedMajorsList}
                    className="major-select"
                    placeholder="Select a major..."
                    isClearable={true} // Allows the user to clear their selection
                    isSearchable={true} // Allows the user to search through the options
                    //changed width of dropdown menu
                    styles={{
                        container: (provided) => ({
                            ...provided,
                            width: 400, // Set your desired width here
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            color: 'black', // Set your desired text color here
                        }),
                    }}

                />
            </div>
          
            {/*display courses if major selected */}
            {selectedMajor && majorClasses && (
            <div className="major-recommended-classes">
                <h2>List of Courses for "{selectedMajor.label}"</h2>
                {/*
                {majorClasses.map((classObj) => (
                    <p key={classObj.id}>{classObj.name}</p> //test for CS and Math of Comp, working
                ))}
                */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'left' }}>
                    {majorClasses.map(renderClassCard)}
                </Box>

            </div>
        )}
            
            
            


      
        </Box>
    );
};

export default ClassPlanner;
