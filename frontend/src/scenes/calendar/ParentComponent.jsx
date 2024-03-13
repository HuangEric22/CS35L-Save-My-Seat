import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, CardActions, Button, useTheme } from '@mui/material';import Header from '../../components/Header';
import ResourceCalendar from './ResourceCalendar';
import ClassPlanner from './ClassPlanner';
import { tokens } from "../../theme";
//add localizer for calendar
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { ClassesProvider } from '../../context/ClassesContext'
import  {useAuthContext}  from '../../hooks/useAuthContext';
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
    const {user} = useAuthContext();
    console.log("ID HERE",user.userID)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [myClasses, setMyClasses] = useState(blankInitialClasses);

    const addClass = async (newClass) => {
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



      try {
       
    
        const classData = {
         
            classId: newClass.id,
            courseAbbrv: newClass.course_abbrv,
            courseTitle: newClass.course_title,
            catNum: newClass.cat_num,
            lectures: newClass.lectures, 
           coursePage: newClass.course_page,
            prereqs: newClass.prereqs,
            coreqs: newClass.coreqs,
            term: newClass.term
        };

        const response = await fetch(`http://localhost:4000/api/enrolledClasses/${user.userID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.token}`
            },
           body: JSON.stringify(classData)
        });

        if (!response.ok) {
            throw new Error(`Failed to enroll in class`);
        }

        console.log("Added new class:", newClass);
        console.log(newClass.hash_id)
  
        
        console.log("Contents of myClasses:", myClasses);
        console.log("Class enrolled successfully!");

        // Reset form fields after successful submission if needed
        
    } catch (error) {
        console.error(error);
    }





      //test
    
    };
  

    //function- remove a class from the planner
    const removeClass  = async (classes)  => {

      try {
        const response = await fetch(`http://localhost:4000/api/enrolledClasses/${classes._id}`, { // Corrected template string syntax
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`, // Corrected template string syntax
            }
        });
        if (!response.ok) {
            throw new Error('Failed to delete class');
        }

        const message = await response.json();
        console.log(message);

       
        //setAuctions(updatedAuctions);

    } catch (error) {
        console.error(error);
        
    }
       // setMyClasses(myClasses.filter((c) => c.hash_id !== classHashId));
        
        //test
      //  console.log("Removed classhashid: ", classHashId)
    };

    const showClass = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/enrolledClasses/${user.userID}`, { // Corrected template string syntax
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`, // Corrected template string syntax
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete class');
    }

    const message = await response.json();
    console.log(message);

   
    //setAuctions(updatedA

      }
      catch(error) {}
    }

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
                      onClick={() => removeClass(myClass.hash_id)}
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

        
    </Box>
    </ClassesProvider>
    );
};

export default ParentComponent;
