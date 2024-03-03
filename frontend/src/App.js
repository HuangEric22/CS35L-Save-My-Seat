import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Navbar from "./scenes/global/Navbar";
import Dashboard from "./scenes/dashboard";
import Buy from "./scenes/buy";
import Invoices from "./scenes/invoices";
import History from "./scenes/history";
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
             
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/history" element={<History/>}/>
              <Route path="/buy" element={<Buy/>}/>
              
            
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;