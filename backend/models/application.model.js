import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    Job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
},{timeseries: true})

export const Application = mongoose.model("Application", applicationSchema)