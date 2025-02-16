import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";

export const ClassesContext = createContext();

export const ClassesProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [classes, setClasses] = useState([]);
    const [abbreviations, setAbbreviations] = useState([]); // State to hold abbreviations
    const [selectedClass, setSelectedClass] = useState("");
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState("");
    const [discussions, setDiscussions] = useState([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState("");


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
                throw new Error(`Failed to fetch classes`);
            }
            const classesData = await response.json();
            setClasses(classesData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAbbreviations = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/dict/", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch abbreviations`);
            }
            const abbreviationsData = await response.json();
            setAbbreviations(abbreviationsData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchClasses();
        fetchAbbreviations(); // Also fetch abbreviations when component mounts
    }, [user.token]); // Assuming user.token is needed and relevant for both fetches

    useEffect(() => {
        setSelectedClass("");
        setSelectedLecture("");
        setSelectedDiscussion("");
    },[filteredClasses])

    useEffect(() => {
        if (selectedClass) {
            const classLectures = classes.find(cls => cls.id === selectedClass)?.lectures || [];
            setLectures(classLectures);
            setSelectedLecture(""); // Reset selected lecture when class changes
            setSelectedDiscussion(""); // Reset selected discussion when class changes
        }
    }, [selectedClass, classes]);

    useEffect(() => {
        if(selectedLecture) {
            const lecDiscussions = lectures.find(lec => lec.num === selectedLecture)?.discussions || [];
            setDiscussions(lecDiscussions);
            setSelectedDiscussion(""); // Reset selected lecture when lecture changes
        }
    }, [selectedClass, classes, selectedLecture, lectures]);

    return (
        <ClassesContext.Provider value={{
            classes, 
            abbreviations, // Provide abbreviations to the context consumers
            selectedClass, setSelectedClass, 
            selectedLecture, setSelectedLecture, 
            selectedDiscussion, setSelectedDiscussion,
            filteredClasses, setFilteredClasses,
            lectures,
            discussions
        }}>
            {children}
        </ClassesContext.Provider>
    );
};