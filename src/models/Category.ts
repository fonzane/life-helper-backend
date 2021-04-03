import mongoose, { Schema, Document } from 'mongoose';

export const CategorySchema: Schema = new mongoose.Schema({
    name: { type: String, required: true },
    userID: { type: String, required: true }
});

export interface Category extends Document {
    name: string;
    userID: string;
}

export default mongoose.model<Category>('Category', CategorySchema);