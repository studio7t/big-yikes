import { MongoClient } from 'mongodb';

const url = process.env.MONGO_URL ?? 'mongodb://localhost:27017';
const client = new MongoClient(url);

export const db = client.db('big_yikes');

export const close = async () => {
  client.close();
};
