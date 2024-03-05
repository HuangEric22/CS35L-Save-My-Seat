import {Box} from "@mui/material";
import Header from "../../components/Header";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { useState, useRef, useEffect } from 'react';


const Calendar = () => {
    
    // create ref using useRef hook
    const calendarRef = useRef();
    // define function to access DayPilot.Calendar methods
    const getCalendar = () => {
        return calendarRef.current.control;
    }
    


    // State for viewType
    const [config, setConfig] = useState({
        viewType: "Resources",
        
        columns: [
            { name: "Monday", id: "mon" },
            { name: "Tuesday", id: "tues" },
            { name: "Wednesday", id: "wed" },
            { name: "Thursday", id: "thurs" },
            { name: "Friday", id: "fri" },
        ],

        //businessBeginsHour: 8, //default start at 8 AM
        //businessEndsHour: 21, //default end at 9 PM
        
        dayBeginsHour: 8, //want to display start at 8 AM
        dayEndsHour: 21, //want to end display at 9 PM
    }); 

    // State for startDate
    const [startDate, setStartDate] = useState(DayPilot.Date.today());

    return (
        
        <Box>
            <Header title="Class Planner" subtitle="My Classes for Spring 2024"/>
            <DayPilotCalendar 
            
            {...config}
            startDate={startDate}
            ref={calendarRef}

            />
        </Box>
        

    )
}

export default Calendar;