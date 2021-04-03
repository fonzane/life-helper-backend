import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema: Schema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    birthday: { type: Date, required: true },
    createdAt: { type: Date, default: new Date() }
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isValidPassword: (password: string) => boolean;
}

UserSchema.pre<User>(
  'save',
  async function(next) {
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
});

UserSchema.methods.isValidPassword = async function(this: User, password: string) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
}

export default mongoose.model<User>('User', UserSchema);