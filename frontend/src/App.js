import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Navbar from "./scenes/global/Navbar";
import Dashboard from "./scenes/dashboard";
import Buy from "./scenes/buy";
import Invoices from "./scenes/invoices";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "./Signup";
import Login from "./Login";

import History from "./scenes/history";
import { useEffect } from 'react';
// import Bar from "./scenes/bar";
// import Form from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
// import Calendar from "./scenes/calendar";



function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className="app">
          <Navbar/>
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
              <Route path="/history" element={<ProtectedRoute><History/> *</ProtectedRoute>}/>
              <Route path="/buy" element={<ProtectedRoute><Buy/></ProtectedRoute>}/>
               <Route path="/login" element={<Login/>}/> 
               <Route path="/" element={<Signup/>}/> {/*routes for signup/login*/}
               
              
            
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
