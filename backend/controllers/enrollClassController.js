const EnrolledClass = require('../models/enrolledClassModel')
const mongoose = require('mongoose');

const enrollClass = async (req,res) => {
    const {userid} = req.params;
    try {
const {userId, classId,courseAbbrv, courseTitle,catNum, lectures,  prereqs, coreqs, coursePage, term } = req.body;
const enrolledClass = new EnrolledClass({

userId,
classId, courseAbbrv, courseTitle,catNum,lectures,prereqs, coreqs,coursePage, term
})
await enrolledClass.save();
res.status(201).json(enrolledClass);

}
catch (error){
    console.log(error)
    res.status(500).json({ error: error.message });
}}


const getClasses = async (req,res) => {

    try {
        const classes = await EnrolledClass.find({});
        res.status(200).json(classes); //return the acutinos array to the user 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSpecificClass = async (req,res) => {
    const { classId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(404).send(`No class with id: ${classId}`);
    }
    try {
        const enrolledClass = await EnrolledClass.findById(classId);
        if (!enrolledClass) {
            return res.status(404).send(`No class with id: ${classId}`);
        }
        res.status(200).json(enrolledClass)
    }
    catch (error) {
        console.error("Error fetching class:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteClass = async (req,res) => {
    const { classId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(404).send(`No class with id: ${classId}`);
    }

    try {
     
       
        
        const delClass = await EnrolledClass.findOneAndDelete({ _id: classId });
        
        if (!delClass) {
            return res.status(404).send(`No auction with id: ${classId}`);
        }
        
       
        
        res.status(404).json({ message: "Class deleted successfully" });
    } catch (error) {
        console.error("Error deleting class:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}





module.exports= {
enrollClass, getClasses, getSpecificClass, deleteClass
}