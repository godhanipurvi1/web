import { MongoClient } from "mongodb";

const MONGO_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "biteverse_dev";

const client = new MongoClient(MONGO_URL);
await client.connect();
const db = client.db(DB_NAME);

export const hide = { projection: { _id: 0 } };
export const orders = db.collection("orders");
export const products = db.collection("products");
export const coupons = db.collection("coupons");
export const riders = db.collection("riders");
export const reviews = db.collection("reviews");
export const profile = db.collection("profile");
