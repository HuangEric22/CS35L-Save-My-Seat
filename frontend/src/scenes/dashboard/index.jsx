import { Box, Typography, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import MyAuctions from "../../components/fetchAuctions";
import { useState } from "react";

const Dashboard = () => {
    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Overview" subtitle="Welcome back"/>
            </Box>
            <MyAuctions/>
           
        </Box>
    );
};

export default Dashboard;

