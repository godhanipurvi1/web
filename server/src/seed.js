import { orders, products, coupons, riders, reviews, profile } from "./db.js";

const SEEDS = [
  ["products", products, [
    { id: "P-1", name: "Paneer Tikka", category: "Starters", price: 240, available: true },
    { id: "P-2", name: "Veg Biryani", category: "Mains", price: 220, available: true },
    { id: "P-3", name: "Gulab Jamun", category: "Desserts", price: 90, available: false },
  ]],
  ["orders", orders, [
    { id: "ORD-1001", customer: "Asha", status: "preparing", total: 540 },
    { id: "ORD-1002", customer: "Ravi", status: "ready", total: 320 },
  ]],
  ["coupons", coupons, [
    { id: "C-1", code: "WELCOME10", percent: 10, minOrder: 300, active: true },
    { id: "C-2", code: "LUNCH20", percent: 20, minOrder: 500, active: false },
  ]],
  ["riders", riders, [
    { id: "R-1", name: "Amit", onDuty: true },
    { id: "R-2", name: "Kiran", onDuty: false },
    { id: "R-3", name: "Meera", onDuty: true },
  ]],
  ["reviews", reviews, [
    { id: "V-1", customer: "Asha", dish: "Paneer Tikka", rating: 5, comment: "Smoky and perfectly spiced.", visible: true },
    { id: "V-2", customer: "Ravi", dish: "Veg Biryani", rating: 3, comment: "Good flavour, rice was a bit dry.", visible: true },
    { id: "V-3", customer: "Asha", dish: "Gulab Jamun", rating: 4, comment: "Sweet and soft.", visible: false },
  ]],
  ["profile", profile, [
    { id: "restaurant", name: "Practice Kitchen", address: "Example Street, Your City", phone: "+91 90000 00000", open: true },
  ]],
];

export async function seed() {
  for (const [name, collection, docs] of SEEDS) {
    if ((await collection.countDocuments()) === 0) {
      await collection.insertMany(docs.map((d) => ({ ...d })));
      console.log("Seeded " + name);
    }
  }
}
