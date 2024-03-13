import {Box} from "@mui/material";
import Header from "../../components/Header";

//added
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./index.css"
import React, { Fragment, useMemo, useState, useEffect, useRef } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import { useClasses } from '../../hooks/useClasses' 
import { v4 as uuidv4 } from 'uuid';


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
    const defaultMinTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0, 0);
    const defaultMaxTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 59, 59);

    const [minTime, setMinTime] = useState(defaultMinTime);
    const [maxTime, setMaxTime] = useState(defaultMaxTime);

    //once 
    const initialMinTime = useRef(minTime);
    const initialMaxTime = useRef(maxTime);

    const updateCalendarBounds = (classes) => {
        let newMinTime = initialMinTime.current;
        let newMaxTime = initialMaxTime.current;

        classes.forEach(classEvent => {
        const { start, end } = parseTime(classEvent.lectures[0].time);
        if (start < newMinTime) newMinTime = start;
        if (end > newMaxTime) newMaxTime = end;
    });

    setMinTime(newMinTime);
    setMaxTime(newMaxTime);
  };

  useEffect(() => {
    updateCalendarBounds(myClasses);
    initialMinTime.current = minTime;
    initialMaxTime.current = maxTime;
  }, []);

  //fix bug of out of bounds classes
  useEffect(() => {
    let classesOutsideBounds = myClasses.filter(classEvent => {
      const { start, end } = parseTime(classEvent.lectures[0].time);
      return start < initialMinTime.current || end > initialMaxTime.current;
    });

    if (classesOutsideBounds.length > 0) {
      updateCalendarBounds(classesOutsideBounds);
    }
  }, [myClasses]);


    //DISPLAYING MYCLASSES CORRECTLY ON CALENDAR
    //TIMES
    const parseTime = (timeString) => {
        const [startTime, endTime] = timeString.split('-');
        let [startHour, startMinute] = startTime.trim().split(':').map(part => parseInt(part, 10));
        let [endHour, endMinute] = endTime.trim().split(':').map(part => parseInt(part, 10));
    
        // If minutes are undefined, default them to 0
        startMinute = isNaN(startMinute) ? 0 : startMinute;
        endMinute = isNaN(endMinute) ? 0 : endMinute;
    
        const isStartPM = startTime.includes('pm');
        const isEndPM = endTime.includes('pm');
    
        // Adjust for AM/PM
        if (isStartPM && startHour !== 12) {
            startHour += 12;
        } else if (!isStartPM && startHour === 12) {
            // Adjust if it's 12 AM
            startHour = 0;
        }
    
        if (isEndPM && endHour !== 12) {
            endHour += 12;
        } else if (!isEndPM && endHour === 12) {
            // Adjust if it's 12 AM
            endHour = 0;
        }
    
        const startDate = new Date();
        startDate.setHours(startHour, startMinute, 0, 0);
    
        const endDate = new Date();
        endDate.setHours(endHour, endMinute, 0, 0);
    
        //test
        //console.log(`Start: ${startDate}, End: ${endDate}`);
        return { start: startDate, end: endDate };
    };
    
    //DAYS
    const parseDays = (daysString) => {
        const dayMap = { 'M': 1, 'T': 2, 'W': 3, 'R': 4, 'F': 5 };
        const parsedDays = daysString.split('').map(dayChar => dayMap[dayChar]);
        
        //test
        //console.log(`Days: ${parsedDays}`);
        return parsedDays;
    };
    
    //new variable with the right times and days
    const parsedClasses = myClasses.flatMap(classData => {
        const title = `${classData.course_abbrv} ${classData.cat_num} ${classData.lectures[0].num}`;
      
        const { start, end } = parseTime(classData.lectures[0].time);
      
        const resourceIds = parseDays(classData.lectures[0].days);
      
        start.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
        end.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
      
        return {
          title: title,
          location: classData.lectures[0].location,
          resourceId: resourceIds,
          start: start,
          end: end
        };
      });

     //test
     //console.log("Contents of parsedClasses:", parsedClasses);

    //when class clicked, popup with additinal info
    const handleSelectClass = (event) => {
        const startTime = event.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const endTime = event.end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
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
            events={parsedClasses}
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
