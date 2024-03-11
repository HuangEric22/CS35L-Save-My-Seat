import {Box} from "@mui/material";
import Header from "../../components/Header";

//added
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./index2.css"
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


    // find earliest and latest class to adapt the calendar hours flexibly
    //if no classes, then set to default hours 8 AM - 5 PM
    const minClass = myClasses.length > 0
        ? myClasses.reduce((min, classEvent) => (
            classEvent.start < min ? classEvent.start : min
        ), myClasses[0].start)
        : new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8); 

    const maxClass = myClasses.length > 0
        ? myClasses.reduce((max, classEvent) => (
            classEvent.end > max ? classEvent.end : max
        ), myClasses[0].end)
        : new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 59, 59); 

    // set min and max prop for hours flexibility
    const min = new Date(minClass.getFullYear(), minClass.getMonth(), minClass.getDate(), minClass.getHours(), minClass.getMinutes());
    const max = new Date(maxClass.getFullYear(), maxClass.getMonth(), maxClass.getDate(), maxClass.getHours(), maxClass.getMinutes(), maxClass.getSeconds());


    //when class clicked, popup with additinal info
    const handleSelectClass = (event) => {
        const startTime = event.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const endTime = event.end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        //const finalExamInfo
        alert(`Class: ${event.title}\nLocation: ${event.location}\nStart Time: ${startTime}\nEnd Time: ${endTime}`);
    }

    /*
    //IN PROGRESS, MOVED TO PARENT COMPONENT
    //FOR ADDING OR DELETING CLASSES TO PLAN AND HAVING IT SHOW UP ON THE CALENDAR
    
    //test for button ADDING CLASS
    const handleAddTestClass = () => {
        const testClass = {
            title: "TESTING Lec 1",
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 50),
            location: "MS 4000",
            resourceId: 4,
        };
    
        //update myClasses state for
        setClasses(prevClasses => [...prevClasses, testClass]);
    };

    //TEST FOR DELETING CLASS
    const handleRemoveClass = (eventId) => {
        const updatedClasses = myClasses.filter(event => event.id !== eventId);
        setClasses(updatedClasses);
    };

    */
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
            min={min}
            max={max}
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
