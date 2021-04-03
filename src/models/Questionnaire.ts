import mongoose, { Schema, Document } from 'mongoose';

const questionnaireSchema: Schema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    createdAt: { type: Date, default: Date.now() },
    lastModified: { type: Date, default: Date.now() },
    questions: [{ phrase: String, open: Boolean }],
    weekdays: [{ type: String, required: true }],
    schedule: {type: Object, required: true},
    userID: String
});

export interface Questionnaire extends Document {
    name: string;
    createdAt: Date;
    lastModified?: Date;
    questions: Array<{phrase: string, open: boolean}>;
    weekdays: Array<string>;
    userID: string;
    schedule: {[key: string]: string}[];
}

export default mongoose.model<Questionnaire>('Questionnaire', questionnaireSchema);