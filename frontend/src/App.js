import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Navbar from "./scenes/global/Navbar";
import Dashboard from "./scenes/dashboard";
import Buy from "./scenes/buy";
import Auctions from "./scenes/auctions"
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
<<<<<<< HEAD
              <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
              <Route path="/history" element={<ProtectedRoute><History/> </ProtectedRoute>}/>
              <Route path="/buy" element={<ProtectedRoute><Buy/></ProtectedRoute>}/>
               <Route path="/login" element={<Login/>}/> 
               <Route path="/signup" element={<Signup/>}/> {/*routes for signup/login*/}
=======
              <Route path="/" element={
                //<ProtectedRoute>
                  <Dashboard/>
                //</ProtectedRoute>
              }/>
              <Route path="/history" element={
                //<ProtectedRoute>
                  <History/>
                //</ProtectedRoute>
              }/>
              <Route path="/buy" element={
                //<ProtectedRoute>
                  <Buy/>
                //</ProtectedRoute>
              }/>
              <Route path="/auctions" element={<Auctions/>}/>
              <Route path="/login" element={<Login/>}/> 
              <Route path="/" element={<Signup/>}/> {/*routes for signup/login*/}
>>>>>>> 6faecaa9dca35133100525fe55fbc34c80a0e7c7
               
              
            
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
