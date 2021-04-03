import mongoose, { Schema, Document } from 'mongoose';
import CategoryModel, { Category, CategorySchema } from './Category';

const taskSchema: Schema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    category: { type: CategorySchema, required: true },
    dueDate: String,
    createdAt: { type: Date, default: new Date() },
    done: { type: Boolean, default: false },
    userID: { type: String, required: true },
    listSort: Number
});

export interface Task extends Document {
    name: string;
    categoryID: mongoose.Schema.Types.ObjectId;
    category: Category;
    dueDate: string;
    createdAt: Date;
    done: boolean;
    userID: string;
    listSort: number;
}

export default mongoose.model<Task>('Task', taskSchema);