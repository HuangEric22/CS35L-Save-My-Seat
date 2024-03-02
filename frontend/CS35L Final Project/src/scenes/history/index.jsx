import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { transactions } from "../../data/mockData"
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";



const History = () => {
    const theme =useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "name", headerName: "From" },
        { 
            field: "type", 
            headerName: "Purchase/Sale", 
            flex: 1, 
            renderCell: (params) => (
                <Typography
                    style={{
                        color: params.value === "Sale" ? "green" : params.value === "Purchase" ? "red" : "inherit",
                    }}
                >
                    {params.value}
                </Typography>
            )
        },
        { 
            field: "class", 
            headerName: "Class", 
            flex: 1,
        },
        { 
            field: "amount", 
            headerName: "For", 
            type: "number", 
            headerAlign: "left",
            align: "left",
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', color: params.row.type === "Purchase" ? "red" : "green" }}>
                    {params.row.type === "Purchase" ? <FaCaretDown style={{ marginRight: 4, color: 'red' }} /> : null}
                    {params.row.type === "Sale" ? <FaCaretUp style={{ marginRight: 4, color: 'green' }} /> : null}
                    <Typography>
                        {params.value}
                    </Typography>
                </div>
            )
        }
        
    ];

    return (
        <>
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Transaction History" subtitle="All financial interactions"/>
            </Box>
            <Box m="40px 0 0 0" 
                 height="75vh" 
                 sx= {{
                 "& .MuiDataGrid-root": {
                    border: "none",
                 },
                 "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                 },
                 "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none"
                 },
                 "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                 },
                 "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700]
                 }
            
            }}>
                <DataGrid rows={transactions} columns = {columns}/>
            </Box>

        </Box>
        </>
    )
}

export default History;