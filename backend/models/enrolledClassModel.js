const mongoose = require('mongoose');

const enrolledClassSchema = new mongoose.Schema({
    hash_id: {type: String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: String, required: true },
    courseAbbrv: { type: String, required: true },
    courseTitle: { type: String, required: true },
    catNum: {type: String},
    
    lectures: [{ // Example of embedded document for MongoDB

        capacity: {type: String}, 
        days: {type: String}, 
        final_date: {type: String},
        final_location: {type: String},
        final_time: {type: String},
        instructors: [{type: String}],
        location: {type: String},
        num: {type: String},
        status: {type: String},
        time: {type: String},
        title: {type: String},
        units: {type: String},
        waitlist: {type: String},
        _id: { type: String}

    }],
    prereqs: [{type: String}],
    coreqs: [{type: String}],
    coursePage: {type: String},
    term: {type:String}
});

const EnrolledClass = mongoose.model('EnrolledClass', enrolledClassSchema);

module.exports = EnrolledClass;