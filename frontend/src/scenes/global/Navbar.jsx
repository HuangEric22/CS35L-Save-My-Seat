import { useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import { ExitToApp } from '@mui/icons-material';
import { useLogout } from '../../hooks/useLogout'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext'
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Item = ({ title, to, icon, selected, setSelected }) => {

const location = useLocation();
    const isActive = location.pathname === to;


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <MenuItem
        icon={icon}
        style={{
          color: isActive ? colors.primary[700] : colors.grey[100],
        }}
      >
        <Typography>
          <Link to={to} style={{ color: 'inherit', textDecoration: 'none' }}>
            {title}
          </Link>
        </Typography>
      </MenuItem>
    );
  };



  const Navbar = () => {
    const [funds, setFunds] = useState('');
    const Funds = async () => {
      const {user} = useAuthContext();
      try {
  
        const response = await fetch(`http://localhost:4000/api/user/funds/${user.userID}`, { // Corrected template string syntax
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`, // Corrected template string syntax
        }
    });
    if (!response.ok) {
        throw new Error('Failed to retrieve funds');
    }
  
    const message = await response.json();
    setFunds(message);
    
  console.log("funds", message)
      }
      catch (error){}
    }
    Funds();
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const { logout } = useLogout()
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    const isDarkMode = theme.palette.mode === 'dark'; // Determine if the theme is dark

  // Determine the logo URL based on the theme mode
  const logoUrl = isDarkMode
    ? `${process.env.PUBLIC_URL}/assets/bear2.png`
    : `${process.env.PUBLIC_URL}/assets/trojan2.png`;
   if (!user) {return null}
    return (
      <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          position: 'fixed',
          zIndex: 1200,
          height: '100%',
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: `${colors.primary[700]} !important`,
          },
          "& .pro-menu-item.active": {
            color: `${colors.primary[700]} !important`,
          },
        }}
      
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    SAVE MY SEAT
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
  
            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={logoUrl}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {user ? user.name: ''}
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    
                    {user ?  '@'+ user.username: ''} {/* Use user's name or a default */}
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[400]}>
                    
                    {"Funds: $" + funds} {/* Use user's name or a default */}
                  </Typography>
                </Box>
              </Box>
            )}
  
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              
              <Item
                title="Buy and Sell Classes"
                to="/buy"
                icon={<AttachMoneyOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="My Auctions"
                to="/auctions"
                icon={<ShoppingCartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Transaction History"
                to="/history"
                icon={<HistoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Calendar"
                to="/calendar"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
        {/*}      <Item
                title="Profile"
                to="/profile"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
            />*/}
              
  
              {/* <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Pages
              </Typography>
              <Item
                title="Profile"
                to="/form"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              /> */}
              {/* <Item
                title="Test"
                to="/test"
                icon={<ScienceOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              /> */}
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
      <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        marginLeft: isCollapsed ? '80px' : '250px', // Adjust based on the sidebar's width
        transition: 'margin 0.3s ease', // Smooth transition for when the sidebar collapses/expands
        }}
      ></Box>
      </Box>
    );
  };
  
  export default Navbar;