const Class = require('../models/classModel');
const mongoose = require('mongoose');

const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({});
        const abbreviations = await abbrvDict.find({});
        res.status(201).json(classes); //return the auctions array to the user 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports ={

getClasses
}