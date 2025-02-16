import React, { Fragment, useMemo, useState, useEffect } from "react";
import { styled } from "@mui/system";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import { useClasses } from "../../hooks/useClasses";
import { v4 as uuidv4 } from "uuid";
import Header from "../../components/Header";

import ReactSelect from "react-select";
import "./planner.css";
//mock data for class list
// const mockData = {
//     "Computer Science": [
//         { id: "COM SCI 35L", name: "35L- Software Construction" },
//         { id: "COM SCI 111", name: "111- Operating Principles" },
//         { id: "COM SCI 180", name: "180- Algorithms" },
//         { id: "COM SCI 143", name: "143- Databases" },

//     ],
//     "Mathematics of Computation": [
//         { id: "MATH 115A", name: "115A- Linear Algebra" },
//         { id: "MATH 131A", name: "131A- Analysis" },
//     ]
// };

const ClassPlanner = ({ myClasses, addClass, removeClass }) => {
  //useClasses hook
  const {
    classes,
    abbreviations,
    selectedClass,
    setSelectedClass,
    selectedLecture,
    lectures,
    setSelectedLecture,
    selectedDiscussion,
    setSelectedDiscussion,
    filteredClasses,
    setFilteredClasses,
    discussions
  } = useClasses();
  //added
  const [deptList, setDeptList] = useState([]);
  const sortedClassesById = useMemo(() => {
    return [...classes].sort((a, b) => {
      // First, compare the course abbreviations
      const abbrvComparison = a.course_abbrv.localeCompare(b.course_abbrv);
      if (abbrvComparison !== 0) {
        return abbrvComparison;
      }
  
      // If the abbreviations are the same, extract and compare the numeric parts
      const matchA = a.id.match(/(\D+)?(\d+)(\D*)?/);
      const matchB = b.id.match(/(\D+)?(\d+)(\D*)?/);
  
      if (!matchA || !matchB) return 0;
  
      const [, , numericA, suffixA = ''] = matchA;
      const [, , numericB, suffixB = ''] = matchB;
  
      const numA = parseInt(numericA, 10);
      const numB = parseInt(numericB, 10);
      if (numA !== numB) {
        return numA - numB;
      }
  
      // If numeric parts are equal, then compare the remaining parts, if any
      return suffixA.localeCompare(suffixB);
    });
  }, [classes]);

  useEffect(() => {
    // This effect will run when 'sortedClassesById' changes, ensuring 'filteredClasses' is updated.
    setFilteredClasses(sortedClassesById.filter((cls) => cls.course_title));
  }, [sortedClassesById]);

  useEffect(() => {
    const deptObjects = abbreviations
      .filter((dept) => dept && dept.name !== undefined)
      .map((dept) => ({
        label: dept.name,
        value: dept.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by label

    setDeptList(deptObjects);
  }, [abbreviations]);

  const getAbbrv = (deptName) => {
    const department = abbreviations.find((dept) => dept.name === deptName);
    return department ? department.abbreviation : "Abbreviation not found";
  };

  //state for major
  const [selectedMajor, setSelectedMajor] = useState(null);
  //state for major classes
  const [majorClasses, setMajorClasses] = useState([]);

  //state for department abbreviation
  const [selectedAbbrv, setAbbrv] = useState("");

  //update selectedMajor, classesForMajor
  //use will's selectedMajor to find the corresponding major object in eric's data (my mock data)
  const handleMajorChange = (selectedOption) => {
    if (selectedOption != null) {
      setSelectedMajor(selectedOption);
      setAbbrv(getAbbrv(selectedOption.label));
      setFilteredClasses(
        sortedClassesById.filter(
          (cls) =>
            cls.course_title &&
            cls.course_abbrv === getAbbrv(selectedOption.label)
        )
      );
    } else {
      setSelectedMajor(null);
      setAbbrv(null);
      setFilteredClasses(sortedClassesById.filter((cls) => cls.course_title));
    }

    // if (selectedOption && majorClasses) {
    //     setMajorClasses(mockData[selectedOption.label]); //set classes to be ones from mock data
    // } else {
    //     setMajorClasses([]); //clear classes if no major is selected
    // }
  };
    const handleClear = () => {
        setSelectedClass("");
        setSelectedLecture("");
        setSelectedDiscussion("");
    };

    const handleEnroll = () => {
        // Find the full class data including lectures from the classes state
        const fullClassData = sortedClassesById.find(c => c.id === selectedClass);
    
        // Find the specific lecture data from the selected class
        let specificLectureData = fullClassData.lectures.find(lecture => lecture.num === selectedLecture);
        const specificDiscussionData = discussions.find(discussion => discussion.alpha === selectedDiscussion);
        specificLectureData.discussions = specificDiscussionData
        
        if (fullClassData && specificLectureData) {
          const newClass = {
              // Construct your new class object with all properties
              hash_id: uuidv4(), // Add unique identifier
              id: fullClassData.id,
              course_abbrv: fullClassData.course_abbrv,
              course_title: fullClassData.course_title,
              cat_num: fullClassData.cat_num,
              lectures: [specificLectureData], // Add the selected lecture
              prereqs: fullClassData.prereqs,
              coreqs: fullClassData.coreqs,
              course_page: fullClassData.course_page,
              term: fullClassData.term,
              // ... any other properties that are needed
          };
  
          addClass(newClass); // Pass this to your addClass function
      } 
        else {
          console.log("Class, lecture, or discussion data not found");
        }

        // if (fullClassData && specificLectureData && selectedDiscussion) {
        //   const newDisc = {
        //       // Construct your new class object with all properties
        //       hash_id: uuidv4(), // Add unique identifier
        //       id: fullClassData.id,
        //       course_abbrv: fullClassData.course_abbrv,
        //       course_title: fullClassData.course_title,
        //       cat_num: selectedDiscussion.alpha,
        //       lectures: [specificLectureData], // Add the selected lecture
        //       prereqs: fullClassData.prereqs,
        //       coreqs: fullClassData.coreqs,
        //       course_page: fullClassData.course_page,
        //       term: fullClassData.term,
        //       // ... any other properties that are needed
        //   };

        //   addClass(newDisc);
        // }
        // else {
        //   console.log("Discussion Data not found");
        // }
    };
    
  const StyledBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.light, // Or use custom theme token colors
    margin: theme.spacing(2),
    borderRadius: theme.spacing(1),
  }));

  //function- render each class as a MUI Card
  // const renderMajorClassCard = (classInfo) => {
  //     return (
  //         <Card key={classInfo.id} variant="outlined" sx={{ marginBottom: 2, maxWidth: 300, backgroundColor: '#679dc6' }}>
  //             <CardContent>
  //                 <Typography variant="h6" component="div">
  //                     {classInfo.name}
  //                 </Typography>
  //                 <Typography sx={{ mb: 1.5 }} color="text.secondary">
  //                     {classInfo.instructor}
  //                 </Typography>
  //                 <Typography variant="body2">
  //                     Time: {classInfo.time}
  //                 </Typography>
  //                 <Typography variant="body2">
  //                     Location: {classInfo.location}
  //                 </Typography>
  //                 <Typography variant="body2">
  //                     Units: {classInfo.units}
  //                 </Typography>
  //             </CardContent>
  //             <CardActions>
  //                 <Button
  //                     size="small"
  //                     onClick={() => addClass(classInfo)}
  //                     sx={{ backgroundColor: '#ffc649', color: 'black', '&:hover': { backgroundColor: 'darkgoldenrod' } }}>
  //                     Add to My Classes
  //                 </Button>
  //             </CardActions>
  //         </Card>
  //     );
  // };

  if (sortedClassesById.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          typography: "h6",
        }}
      >
        <span>Loading classes</span>
        <Box
          component="span"
          className="loadingText"
          sx={{
            marginLeft: "1px",
            animation: "blink 1s infinite", // Apply the blink animation to the ellipsis
          }}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Box className="major-select-container">
        <h2>Select Department</h2>
        <ReactSelect
          value={selectedMajor}
          onChange={handleMajorChange}
          options={deptList}
          className="major-select"
          placeholder="Select a department..."
          isClearable={true}
          isSearchable={true}
          styles={{
            container: (provided) => ({
              ...provided,
              width: 400,
            }),
            option: (provided, state) => ({
              ...provided,
              color: "black",
            }),
          }}
        />
      </Box>

      <StyledBox>
        {" "}
        {/* New content wrapped in a Box */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="class-select-label">Select a Class</InputLabel>
          <Select
            labelId="class-select-label"
            id="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {filteredClasses.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.course_abbrv + " " + cls.course_title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedClass && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="lecture-select-label">Select a Lecture</InputLabel>
            <Select
              labelId="lecture-select-label"
              id="lecture-select"
              value={selectedLecture}
              onChange={(e) => setSelectedLecture(e.target.value)}
            >
              {lectures.map((lecture) => (
                <MenuItem key={lecture.num} value={lecture.num}>
                  {`${lecture.num}: ${lecture.instructors.join(" ")} - ${lecture.title} - ${lecture.days} ${lecture.time} at ${lecture.location}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {selectedLecture && (discussions.length != 0) && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="discussion-select-label">Select a Discussion</InputLabel>
            <Select
              labelId="discussion-select-label"
              id="discussion-select"
              value={selectedDiscussion}
              onChange={(e) => setSelectedDiscussion(e.target.value)}
            >
              {discussions.map((discussion) => (
                <MenuItem key={discussion.alpha} value={discussion.alpha}>
                  {`${discussion.alpha}: ${discussion.instructors.join(" ")} - ${discussion.days} ${discussion.time} at ${discussion.location}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}        
        <Button
          variant="contained"
          color="secondary"
          onClick={handleEnroll}
          sx={{ mt: 2, mr: 2 }}
          disabled={discussions.length === 0 ? !selectedLecture : !selectedDiscussion}
        >
          Add to Plan
        </Button>
        
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClear}
          sx={{ mt: 2}}
          
        >
          Clear Class
        </Button>
      </StyledBox>
    </Box>
  );
};

export default ClassPlanner;
