import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Navbar from "./scenes/global/Navbar";
import Dashboard from "./scenes/dashboard";
import Buy from "./scenes/buy";
import Invoices from "./scenes/invoices";
import History from "./scenes/history";
//added for calendar
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'
import ResourceCalendar from "./scenes/calendar/index2.jsx";


import { useEffect } from 'react';
// import Bar from "./scenes/bar";
// import Form from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
// import Calendar from "./scenes/calendar";
import MyAuctions from './components/fetchAuctions';

//added localizer for calendar
const localizer = momentLocalizer(moment);

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <MyAuctions/>
        <CssBaseline/>
        <div className="app">
          <Navbar/>
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/history" element={<History/>}/>
              <Route path="/buy" element={<Buy/>}/>
              <Route path="/calendar"  element={<ResourceCalendar localizer={localizer}/>}/>         
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
