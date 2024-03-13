import { Box, Typography, Button, TextField, InputBase, IconButton, useTheme } from "@mui/material";
import Header from "../../components/Header";
import MyAuctions from "../../components/fetchAuctions";
import { useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { GiPolarBear, GiTrojanHorse } from "react-icons/gi";
import SearchIcon from "@mui/icons-material/Search";

const Dashboard = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <>
        {/* Empty Box to take up space and push icons to the right */}
        
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Overview" subtitle="Welcome back"/>
            </Box>
            <MyAuctions/>
        </Box>
        </>
    );
};

export default Dashboard;

