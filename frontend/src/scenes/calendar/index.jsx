/*
import {Box} from "@mui/material";
import Header from "../../components/Header";
import { useState, useRef, useEffect } from 'react';

//must do: npm install @daypilot/daypilot-lite-react 
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react"; 


//mock data for scheduled classes: array of objects
//this is the INITIAL classes when the user first opens the calendar page
const myClasses = [
    {
        //replace with some way to get the data in this format ???
        id: 1,
        text: "MATH 100",
        resource: "mon",
        start: "2024-03-05T09:30:00",
        end: "2024-03-05T10:45:00",
        //prof:
        //location:
        barColor: "#fcb711",
    },
    {
        id: 2,
        text: "COM SCI 100",
        resource: "wed",
        start: "2024-03-05T14:00:00",
        end: "2024-03-05T16:50:00",
        //prof:
        //location:
        barColor: "#f37021",
    },

];


const Calendar = () => {
    
    // create ref using useRef hook
    const calendarRef = useRef(null);
    console.log("Calendar")
    console.log(calendarRef)
    // define function to access DayPilot.Calendar methods
    // This function acts as a getter for the calendar control
    const getCalendar = () => {
        return calendarRef.current ? calendarRef.current.control : null;
    };
    

    // State for config, set default viewType and hours to display 
    const [config, setConfig] = useState({
        viewType: "Resources",
        
        //businessBeginsHour: 8, //default start at 8 AM
        //businessEndsHour: 21, //default end at 9 PM
        
        dayBeginsHour: 8, //want to display start at 8 AM
        dayEndsHour: 21, //want to end display at 9 PM
    }); 

    // State for startDate
    const [startDate, setStartDate] = useState(DayPilot.Date.today());

    // State for columns (load during initial render)
    const [columns, setColumns] = useState([
        //move columns here
    ]);
    // State for calendar events (selected courses to be displayed)
    const [scheduledCourses, setScheduledCourses] = useState(myClasses);

    //initialize columns and events (classes) with useEffect
    useEffect(() => {
        setColumns([
            { name: "Monday", id: "mon" },
            { name: "Tuesday", id: "tues" },
            { name: "Wednesday", id: "wed" },
            { name: "Thursday", id: "thurs" },
            { name: "Friday", id: "fri" },
        ]);
        //setScheduledCourses();

    }, []);



    return (
        
        <Box>
            <Header title="Class Planner" subtitle="My Classes for Spring 2024"/>
            <DayPilotCalendar 
            
            {...config}
            startDate={startDate}
            columns={columns}
            events={scheduledCourses}
            ref={calendarRef}

            />

            <Header subtitle="Search for Classes and Add to Plan"/>

        </Box>
        

    )
}

export default Calendar;

*/