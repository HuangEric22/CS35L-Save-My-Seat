// ClassesContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";

export const ClassesContext = createContext();


export const ClassesProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [lectures, setLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState("");

    const fetchClasses = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/classes/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data`);
            }
            const classesData = await response.json();
            setClasses(classesData);
            
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []); // user.token Assuming user.token exists and is relevant for fetching classes??

    useEffect(() => {
        if (selectedClass) {
            const classLectures = classes.find(cls => cls.id === selectedClass)?.lectures || [];
            setLectures(classLectures);
            setSelectedLecture(""); // Reset selected lecture when class changes
        }
    }, [selectedClass, classes]);


    return (
        <ClassesContext.Provider value={{ 
            classes, 
            selectedClass, setSelectedClass, 
            selectedLecture, setSelectedLecture, 
            lectures,  
        }}>
            {children}
        </ClassesContext.Provider>
    );
};
