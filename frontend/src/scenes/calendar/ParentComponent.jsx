import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, CardActions, Button, useTheme } from '@mui/material';import Header from '../../components/Header';
import ResourceCalendar from './ResourceCalendar';
import ClassPlanner from './ClassPlanner';
import { tokens } from "../../theme";
//add localizer for calendar
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
//import MyClasses from '../../components/fetchClasses'
import { useClasses } from '../../hooks/useClasses' 
import { ClassesProvider } from '../../context/ClassesContext'
const localizer = momentLocalizer(moment);

const today = new Date();

//events: initial classes (can import later????)
//the event ids are for removing classes from plan
const blankInitialClasses=[]; //test for blank initial schedule
const initialClasses = [
    {
        id: 1,
        title: "MATH 100 Lec 1",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
        location: "Mathematical Sciences 4000",
        resourceId: [1,3,5],
    },
    {
        id: 2,
        title: "CHEM 20L Lab 1A",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 50),
        location: "Young Hall Room 1379",
        resourceId: 3,
    },
    {
        id: 3,
        title: "COM SCI 100 Lec 2",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 50),
        location: "Haines Hall 39",
        resourceId: [2,4],
    },
    {
        id: 4,  
        title: "MATH 200 Lec 2",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 50),
        location: "Young Hall CS50",
        resourceId: [1,3,5],
    },

]

const ParentComponent = () => {
    //lifting state up
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [myClasses, setMyClasses] = useState(blankInitialClasses);

    const addClass = (newClass) => {
      // Check if the class and specific lecture are already in the plan
      const isClassAndLectureAlreadyAdded = myClasses.some(classInPlan => 
          classInPlan.id === newClass.id && 
          classInPlan.lectures.some(lecture => lecture.num === newClass.lectures[0].num)
      );
  
      if (!isClassAndLectureAlreadyAdded) {
          setMyClasses(prevClasses => [...prevClasses, newClass]);
      } else {
          console.log("This lecture has already been added to the plan.");
      }

      //test
      console.log("Added new class:", newClass);
      console.log("Contents of myClasses:", myClasses);
    };
  

    //function- remove a class from the planner
    const removeClass = (classId) => {
        setMyClasses(myClasses.filter((c) => c.id !== classId));
    };


    //display list of user's current classes in planner
    const renderMyClassesCard = (myClass) => {
      return (
          <Card key={myClass.id} variant="outlined" sx={{ maxWidth: 800, margin: 1, backgroundColor: colors.primary[400]}}>
              <CardContent>
                  <Typography variant="h5" component="div">
                      {myClass.course_abbrv} {myClass.course_title}
                  </Typography>
                  <hr style={{margin: "8px 0", borderColor: "white"}} /> 
                  <Typography variant="body1" component="div">
                      Time: {myClass.lectures[0].time}
                  </Typography>
                  <Typography variant="body1" component="div">
                      Instructor: {myClass.lectures[0].instructors.join(', ')}
                  </Typography>
                  <Typography variant="body1" component="div">
                      Location: {myClass.lectures[0].location}
                  </Typography>
                  <Typography variant="body1" component="div">
                      Final Exam: {myClass.lectures[0].final_date} at {myClass.lectures[0].final_time}, {myClass.lectures[0].final_location}
                  </Typography>
              </CardContent>
              <CardActions>
                  <Button 
                      size="small" 
                      color="secondary" 
                      onClick={() => removeClass(myClass.id)}
                      sx={{ backgroundColor: '#ffc649', color: 'black', '&:hover': { backgroundColor: 'darkgoldenrod' } }}> 
                      Remove Class
                  </Button>
              </CardActions>
          </Card>
      );
    };
  

    return (
    <ClassesProvider>
    <Box m="20px">
        <Header title="Class Planner" subtitle="My Classes for Spring 2024" />
        
        <ResourceCalendar 
            localizer={localizer} 
            myClasses={myClasses} 
            addClass={addClass} 
            removeClass={removeClass}
        />
        <hr />
        <h1>Search & Manage Classes</h1>

        <ClassPlanner 
         backgroundColor={colors.primary[400]}
            myClasses={myClasses}
        addClass={addClass}
        removeClass={removeClass}
        />

        <hr />
        {/* LIST OF CURRENT CLASSES */}
        <h2>My Current Classes</h2>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left' }}>
            {myClasses.map(renderMyClassesCard)}
      </Box>

        {/*<MyClasses/>*/}
        
    </Box>
    </ClassesProvider>
    );
};

export default ParentComponent;
