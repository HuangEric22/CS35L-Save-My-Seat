const mongoose = require('mongoose');

const enrolledClassSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: String, required: true },
    courseAbbrv: { type: String, required: true },
    courseTitle: { type: String, required: true },
    catNum: String,
    
    lectures: [{ // Example of embedded document for MongoDB
        num: String,
        title: String,
        instructors: String,
        days: String,
        time: String,
        location: String,
    }],
    prereqs: [{type: String}],
    coreqs: [{type: String}],
    coursePage: {type:String},
    term: {type:String}
});

const EnrolledClass = mongoose.model('EnrolledClass', enrolledClassSchema);

module.exports = EnrolledClass;