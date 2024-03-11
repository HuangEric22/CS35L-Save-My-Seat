
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from '../../components/Header';


import Select from "react-select";
import sortedMajorsList from "../../majorsData"; 

//mock data for class list
const mockData = {
    "Computer Science": [
        { id: "COM SCI 35L", name: "35L- Software Construction" },
        { id: "COM SCI 111", name: "111- Operating Principles" },
    ],
    "Mathematics of Computation": [
        { id: "MATH 115A", name: "115A- Linear Algebra" },
        { id: "MATH 131A", name: "131A- Analysis" },
    ]
};


const ClassPlanner = () => {

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


    return (
        <Box>
            <h1>Search for Classes</h1>
            {/* Add your search component or functionality here */}
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
                {majorClasses.map((classObj) => (
                    <p key={classObj.id}>{classObj.name}</p> //test for CS and Math of Comp, working
                ))}
            </div>
        )}
            
            
            


      
        </Box>
    );
};

export default ClassPlanner;
