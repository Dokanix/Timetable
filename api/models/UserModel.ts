import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'User must have username'],
    unique: true,
    match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
  },
  password: {
    type: String,
    required: [true, 'An user must have a password'],
    select: false,
  },
  selectedStops: {
    type: [Number],
    default: [],
  },
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);

export default User;
