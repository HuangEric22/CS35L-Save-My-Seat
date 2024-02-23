import React from 'react';
import './ScheduleGrid.css'; // Make sure to create a corresponding CSS file




//takes in parsed times not in format x:xx
const ScheduleGrid = ({earliestTime, latestTime, latestDuration}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = createHoursArray(earliestTime, latestTime, latestDuration);
  console.log(hours);
  return (
    <div className="schedule-grid">
      {/* Top row for days of the week */}
      <div className="grid-row days-header">
        {/* Empty cell for alignment */}
        <div className="grid-cell time-label"></div>
        {days.map(day => (
          <div key={day} className="grid-cell day-label">{day}</div>
        ))}
      </div>

      {/* Time slots and day columns */}
      {hours.map(hour => (
        <div key={hour} className="grid-row">
          <div className="grid-cell time-label">{hour}:00</div>
          {days.map(day => (
            <div key={`${day}-${hour}`} className="grid-cell hour-cell"></div>
          ))}
        </div>
      ))}
    </div>
  );
};


const createHoursArray = (earliestTime, latestTime, latestDuration) => {
  // Ensure that you account for the duration in the latest time slot
  const startTime = Math.floor(earliestTime);
  const endTime = Math.ceil(latestTime + latestDuration);
  // Calculate the number of hours to display
  const length = endTime - startTime + 1;
  // Create an array starting at the earliestTime and ending at the endTime
  return Array.from({ length }, (_, i) => startTime + i);
};

export default ScheduleGrid;
