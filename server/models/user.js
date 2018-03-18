import mongoose from 'mongoose';

export const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
});
