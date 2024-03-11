import {Box} from "@mui/material";
import Header from "../../components/Header";

//added
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./index2.css"
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar';
//import moment from 'moment'

const today = new Date()

//initial classes
const initialClasses = [
    {
        //id: 1,
        title: "MATH 100 Lec 1",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
        location: "Mathematical Sciences 4000",
        resourceId: [1,3,5],
    },
    {
        //id: 2,
        title: "CHEM 20L Lab 1A",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 50),
        location: "Young Hall Room 1379",
        resourceId: 3,
    },
    {
        //id: 3,
        title: "COM SCI 100 Lec 2",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 50),
        location: "Haines Hall 39",
        resourceId: [2,4],
    },
    {
        //id: 4, test overlap
        title: "MATH 200 Lec 2",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 50),
        location: "Young Hall CS50",
        resourceId: [1,3,5],
    },

]

// custom component definition for class title display
const EventComponent = ({ event }) => {
    // Split the title by a space followed by "Lec" or a space followed by a digit
    const titleParts = event.title.split(/\s+(?=Lec|Dis|Lab)/);

    return (
        <div>
            {/* Map over the title parts and render each part in a separate div */}
            {titleParts.map((part, index) => (
                <div key={index}>{part}</div>
            ))}
            <div>{event.location}</div>
        </div>
    );
};


const ResourceCalendar = ({localizer}) => {

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

    //state variable for user's classes
    //think about implementation for setClasses
    const [myClasses, setClasses] = useState(initialClasses);

    // find earliest and latest class to adapt the calendar hours flexibly
    const minClass = myClasses.reduce((min, classEvent) => (
        classEvent.start < min ? classEvent.start : min
    ), myClasses[0].start);

    const maxClass = myClasses.reduce((max, classEvent) => (
        classEvent.end > max ? classEvent.end : max
    ), myClasses[0].end);

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

    return (

    <Box>
        <Header title="Class Planner" subtitle="My Classes for Spring 2024"/>
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
