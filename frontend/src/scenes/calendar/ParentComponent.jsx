import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import ResourceCalendar from './ResourceCalendar';
import ClassPlanner from './ClassPlanner';

//add localizer for calendar
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
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
    const [myClasses, setMyClasses] = useState(initialClasses);

    //function- add a class to the planner
    const addClass = (newClass) => {
        setMyClasses([...myClasses, newClass]);
    };

    //function- remove a class from the planner
    const removeClass = (classId) => {
        setMyClasses(myClasses.filter((c) => c.id !== classId));
    };

    return (
    <Box>
        <Header title="Class Planner" subtitle="My Classes for Spring 2024" />
        
        <ResourceCalendar 
            localizer={localizer} 
            myClasses={myClasses} 
            addClass={addClass} 
            removeClass={removeClass}
        />
        <hr />
        
        <ClassPlanner 
            myClasses={myClasses}
        addClass={addClass}
        removeClass={removeClass}
        />
    </Box>
    );
};

export default ParentComponent;
