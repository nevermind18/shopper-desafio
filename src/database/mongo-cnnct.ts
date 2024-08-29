import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI || ''

export const runMongo = () => {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err: Error) => console.error('Error connecting to MongoDB', err))
}