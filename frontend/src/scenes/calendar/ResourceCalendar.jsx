import {Box} from "@mui/material";
import Header from "../../components/Header";

//added
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./index.css"
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import { Calendar, Views } from 'react-big-calendar';

const today = new Date()



// custom component definition for class title display
const EventComponent = ({ event }) => {
    // split the displayed title
    const titleParts = event.title.split(/\s+(?=Lec|Dis|Lab)/);

    return (
        <div>
            {titleParts.map((part, index) => (
                <div key={index}>{part}</div>
            ))}
            <div>{event.location}</div>
        </div>
    );
};


const ResourceCalendar = ({ localizer, myClasses, addClass, removeClass }) => {

    //set the columns
    const resourceMap = [
    { resourceId: 1, resourceTitle: 'Monday' },
    { resourceId: 2, resourceTitle: 'Tuesday' },
    { resourceId: 3, resourceTitle: 'Wednesday' },
    { resourceId: 4, resourceTitle: 'Thursday' },
    { resourceId: 5, resourceTitle: 'Friday' },
    ];

    //set the props
    const { defaultDate, views } = useMemo(() => ({
    defaultDate: today,
    views: ['day'],
    }), []);

    
    //time display stuff

    // find earliest and latest class to adapt the calendar hours flexibly
    //if no classes, then set to default hours 8 AM - 5 PM
    //ONLY ONCE ON INITIAL RENDER, use useEffect to do this

    const defaultMinTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8); 
    const defaultMaxTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 59, 59);
    
    // states
    const [minTime, setMinTime] = useState();
    const [maxTime, setMaxTime] = useState();

    useEffect(() => {
        const computedMinClass = myClasses.length > 0
            ? myClasses.reduce((min, classEvent) => (classEvent.start < min ? classEvent.start : min), myClasses[0].start)
            : new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8);

        const computedMaxClass = myClasses.length > 0
            ? myClasses.reduce((max, classEvent) => (classEvent.end > max ? classEvent.end : max), myClasses[0].end)
            : new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 59, 59);

        setMinTime(new Date(computedMinClass.getFullYear(), computedMinClass.getMonth(), computedMinClass.getDate(), computedMinClass.getHours(), computedMinClass.getMinutes()));
        setMaxTime(new Date(computedMaxClass.getFullYear(), computedMaxClass.getMonth(), computedMaxClass.getDate(), computedMaxClass.getHours(), computedMaxClass.getMinutes(), computedMaxClass.getSeconds()));
    }, []);


    //when class clicked, popup with additinal info
    const handleSelectClass = (event) => {
        const startTime = event.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const endTime = event.end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        //const finalExamInfo
        alert(`Class: ${event.title}\nLocation: ${event.location}\nStart Time: ${startTime}\nEnd Time: ${endTime}`);
    }

    

    return (

    <Box> 
        <Fragment>
        <div className="height600">
            
            <Calendar 
            defaultDate={defaultDate}
            defaultView={Views.DAY}
            toolbar={false}
            events={myClasses}
            localizer={localizer}
            resourceIdAccessor="resourceId"
            resources={resourceMap}
            resourceTitleAccessor="resourceTitle"
            views={views}
            min={minTime || defaultMinTime}
            max={maxTime || defaultMaxTime}
            timeslots={4}
            step={15}
            onSelectEvent={handleSelectClass} //display popup when clicked

            components={{ event: EventComponent }} //custom event component for the classes displayed
            />
        </div>
        </Fragment>
    </Box>
    );
};




export default ResourceCalendar;
