import mongoose, { Schema, Document } from 'mongoose';

const messageSchema: Schema = new mongoose.Schema({
    content: String,
    username: String,
    submittedAt: Date,
    userID: String
});

export interface Message extends Document {
    content: string;
    username: string;
    submittedAt: Date;
    userID: string;
}

export default mongoose.model<Message>('Message', messageSchema);