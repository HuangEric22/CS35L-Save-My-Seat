import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { tokens } from "../../theme";
import { useTheme } from '@mui/material/styles';

// Define the keyframes for the pulsing effect
const flameAnimation = keyframes`
  0% { box-shadow: 0 0 5px 2px rgba(255, 165, 0, 0.7); }
  50% { box-shadow: 0 0 20px 10px rgba(255, 140, 0, 0.9); }
  100% { box-shadow: 0 0 5px 2px rgba(255, 165, 0, 0.7); }
`;

const Test = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

// Styled Box component with the animation
    const FieryBox = styled(Box)(({ theme }) => ({
        width: '100px',
        height: '100px',
        backgroundColor: colors.primary[400],
        animation: `${flameAnimation} 2s infinite ease-in-out`,
        }));
    return (
        <FieryBox />
    );
};

export default Test;