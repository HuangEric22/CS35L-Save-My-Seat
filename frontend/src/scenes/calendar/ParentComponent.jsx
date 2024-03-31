import React, { useState, useEffect  } from 'react';
import { Box, Card, CardContent, Typography, CardActions, Button, useTheme } from '@mui/material';import Header from '../../components/Header';
import ResourceCalendar from './ResourceCalendar';
import ClassPlanner from './ClassPlanner';
import { tokens } from "../../theme";
//add localizer for calendar
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { ClassesProvider } from '../../context/ClassesContext'
import  {useAuthContext}  from '../../hooks/useAuthContext';
import { v4 as uuidv4 } from 'uuid';

const localizer = momentLocalizer(moment);

const today = new Date();

const ParentComponent = () => {
    const {user} = useAuthContext();
    console.log("ID HERE",user.userID)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [myClasses, setMyClasses] = useState([]);

    //LOAD INITIAL CLASSES DATA FROM BACKEND UPON MOUNT
    const fetchEnrolledClasses = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/enrolledClasses/${user.userID}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch enrolled classes');
            }

            const enrolledClasses = await response.json();
            setMyClasses(enrolledClasses);
        } catch (error) {
            console.error("Error fetching enrolled classes:", error);
        }
    };
    useEffect(() => {
        fetchEnrolledClasses();
    }, []); 

    //ADDING AND REMOVING ENROLLEDCLASSES

    const addClass = async (newClass) => {
        console.log(myClasses)
        let isClassAndLectureAndDiscussionAlreadyAdded = false;        
        
        if (newClass.lectures[0].discussions) {
            isClassAndLectureAndDiscussionAlreadyAdded = myClasses.some(classInPlan =>
            classInPlan.classId === newClass.id &&
            classInPlan.lectures.some(lecture => 
                lecture.num === newClass.lectures[0].num &&
                lecture.discussions.some(discussion => discussion.alpha === newClass.lectures.discussions[0].alpha)) 
            // classInPlan.lectures[0].discussions.some(discussion => discussion.alpha === newClass.discussions[0].alpha)
        );}
        
        else {
                isClassAndLectureAndDiscussionAlreadyAdded = myClasses.some(classInPlan =>
                classInPlan.classId === newClass.id &&
                classInPlan.lectures.some(lecture => lecture.num === newClass.lectures[0].num)
            );            
        }

    if (!isClassAndLectureAndDiscussionAlreadyAdded) {
        try {
            const classData = {
                hash_id: newClass.hash_id,
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
            
            //UPDATE MYCLASSES WITH ENROLLEDCLASS OBJ
            const savedClass = await response.json(); 
            setMyClasses(prevClasses => [...prevClasses, savedClass]);
            console.log("Class enrolled successfully!");
            //test
            console.log("Contents of myClasses:", myClasses);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log("This lecture has already been added to the plan.");
    }
};
  
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

        //UPDATE MYCLASSES
        const deletedClass = await response.json();
        console.log("Deleted class:", deletedClass);
        setMyClasses(prevClasses => prevClasses.filter(c => c.hash_id !== classes.hash_id));
        //test
        console.log("Contents of myClasses:", myClasses);

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
                      {myClass.courseAbbrv} {myClass.courseTitle}
                  </Typography>
                  <hr style={{margin: "8px 0", borderColor: "white"}} /> 
                  <Typography variant="body1" component="div">
                      Lecture: {myClass.lectures[0].num}
                  </Typography>
                  <Typography variant="body1" component="div">
                      Time: {myClass.lectures[0].time}
                  </Typography>
                  <Typography variant="body1" component="div">
                      Instructor: {myClass.lectures[0].instructors.join(' ')}
                  </Typography>
                  <Typography variant="body1" component="div">
                      Location: {myClass.lectures[0].location}
                  </Typography>
                  <Typography variant="body1" component="div">
                      Status: {myClass.lectures[0].status}
                  </Typography>
                  {myClass.lectures[0].status.toLowerCase() !== 'closed' && (
                    <Typography variant="body1" component="div">
                    Capacity: {myClass.lectures[0].capacity}
                    </Typography>
                    )}
                  <Typography variant="body1" component="div">
                      Units: {myClass.lectures[0].units}
                  </Typography>
                  <Typography variant="body1" component="div">
                      Final Exam: {myClass.lectures[0].final_date} at {myClass.lectures[0].final_time}, {myClass.lectures[0].final_location}
                  </Typography>
              </CardContent>
              <CardActions>
                  <Button 
                      size="small" 
                      color="secondary" 
                      onClick={() => {removeClass(myClass)
                        window.location.reload();}}  
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
