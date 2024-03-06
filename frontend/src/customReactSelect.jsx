import React from 'react';
import Select from 'react-select';
import { useTheme } from '@mui/material/styles';

const CustomReactSelect = (props) => {
  const theme = useTheme();

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
      boxShadow: theme.shadows[1],
      ':hover': {
        borderColor: theme.palette.text.primary,
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme.palette.background.paper,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme.palette.text.primary,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme.palette.text.secondary,
    }),
    
  };

  return (
    <Select
      styles={customStyles}
      isClearable={true} 
      isSearchable={true} 
      {...props} 
    />
  );
};

export default CustomReactSelect;