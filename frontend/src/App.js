import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Navbar from "./scenes/global/Navbar";
import Dashboard from "./scenes/dashboard";
import Buy from "./scenes/buy";
import Test from "./scenes/test";
import Auctions from "./scenes/auctions"
import ProtectedRoute from "./ProtectedRoute";
import Signup from "./Signup";
import Login from "./Login";
import { useAuthContext } from './hooks/useAuthContext.js';
import { Navigate } from 'react-router-dom';
import History from "./scenes/history";
//import Profile from "./Profile"
import ParentComponent from "./scenes/calendar/ParentComponent.jsx";

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
  const { user } = useAuthContext()
  if (user)
  {console.log(user.token)}
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className="app">
          <Navbar/>
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={
            // user ? <Dashboard /> : <Navigate to="/login" />
              <ProtectedRoute> <Dashboard/> </ProtectedRoute>  
               
              }/>
              <Route path="/history" element={
               // user ? <History /> : <Navigate to="/login" />
               <ProtectedRoute> <History/> </ProtectedRoute>
              }/>
              <Route path="/buy" element={
             // user ? <Buy /> : <Navigate to="/login" />
             <ProtectedRoute> <Buy/> </ProtectedRoute>
              }/>
              <Route path="/auctions" element= {
              //  user ? <Auctions /> : <Navigate to="/login" />
                 <ProtectedRoute> <Auctions/> </ProtectedRoute>
              }/>
           {/*}   <Route path = "/profile" element = {
                <ProtectedRoute><Profile/></ProtectedRoute>
              }/>*/}
               <Route path="/login" element={ <Login/> }/> 
               <Route path="/signup" element={<Signup/>}/> {/*routes for signup/login*/}
               <Route path="/test" element={<Test/>}/>
               
               
               <Route path="/calendar" element= {
               // user ? <ParentComponent /> : <Navigate to="/login" />
                <ProtectedRoute> <ParentComponent/> </ProtectedRoute>
                }/>
              
            
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
