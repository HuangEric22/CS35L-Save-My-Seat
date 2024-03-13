const {Class, abbrvDict} = require('../models/classModel');
const mongoose = require('mongoose');



const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({});
        res.status(201).json(classes); //return the acutinos array to the user 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDict = async (req, res) => {
    try {
        const abbreviations = await abbrvDict.find({});
        res.status(201).json(abbreviations); //return the acutinos array to the user 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports ={
getClasses,
getDict
};