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
const events = [
    {
        id: 1,
        title: "MATH 100",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 50),
        resourceId: 1,
    },
    {
        id: 2,
        title: "MATH 200",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 50),
        resourceId: 1,
    },

]


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
    defaultDate: new Date(),
    views: ['day'],
    }), []);

    //user can modify their class list to be displayed
    const [myEvents, setEvents] = useState(events);

    //adapt min and max to the user's earliest/latest classes???
    const min = new Date(today.getFullYear(),today.getMonth(),today.getDate(),8)
    const max= new Date(today.getFullYear(),today.getMonth(),today.getDate(),20, 59, 59)

    //pop up with more info about classes
    const handleSelectEvent = (event) => {
        // Show additional information about the clicked event
        alert(`Title: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}`);
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
            events={myEvents}
            localizer={localizer}
            resourceIdAccessor="resourceId"
            resources={resourceMap}
            resourceTitleAccessor="resourceTitle"
            views={views}
            min={min}
            max={max}
            timeslots={4}
            step={15}
            onSelectEvent={handleSelectEvent} // Call handleSelectEvent when an event is clicked
            />
        </div>
        </Fragment>
    </Box>
    );
};




export default ResourceCalendar;
