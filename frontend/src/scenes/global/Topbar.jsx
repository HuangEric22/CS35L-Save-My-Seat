import { Box, IconButton, useTheme, InputBase } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutLinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutLinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutLinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutLinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutLinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { GiPolarBear, GiTrojanHorse } from "react-icons/gi";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useLogout } from '../../hooks/useLogout'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext'

const Topbar = () => {
    const navigate = useNavigate()
    const { logout } = useLogout()
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const { user } = useAuthContext()
    const handleLogout = () => {
        logout();
        navigate('/login');
      }
     if (!user) return null;
    return (
    <>
    
    <Box display="flex" justifyContent="space-between" p={2}>
        
        <Box display="flex" marginLeft="auto">
       
            <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                    <GiPolarBear />
                ) : (
                    <GiTrojanHorse />
                )}
            </IconButton>
            <IconButton onClick={handleLogout}>
            
                <LogoutOutlinedIcon />
            </IconButton>
        </Box>
    </Box>
    </>);
};

export default Topbar;