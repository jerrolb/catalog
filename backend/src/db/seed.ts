import { db } from './index.js';

const seedData = [
  {
    id: 1,
    title: "Large Flux Capacitor",
    description: "The Large Flux Capacitor provides the maximum motive force for your inter-dimensional aluminum automobile.",
    category: "automotive",
    price: 9.99,
    stock: 42,
    brand: "ACME",
    sku: "ACM-FC-001",
    weight: 4,
    meta: {
      createdAt: "2025-04-30T09:41:02.053Z",
      updatedAt: "2025-04-30T09:41:02.053Z",
    }
  },
  {
    id: 2,
    title: "Medium Flux Capacitor",
    description: "The Medium Flux Capacitor is a great budget option if you don't need to travel far in your inter-dimensional aluminum automobile.",
    category: "automotive",
    price: 5.99,
    stock: 42,
    brand: "ACME",
    sku: "ACM-FC-002",
    weight: 3.25,
    meta: {
      createdAt: "2025-04-29T19:36:02.053Z",
      updatedAt: "2025-04-30T09:41:02.053Z",
    }
  },
];

export function seedDatabase() {
  // Clear existing data
  db.exec('DELETE FROM products');

  const stmt = db.prepare(`
    INSERT INTO products (title, description, category, price, stock, brand, sku, weight, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((products) => {
    for (const product of products) {
      stmt.run(
        product.title,
        product.description,
        product.category,
        product.price,
        product.stock,
        product.brand,
        product.sku,
        product.weight,
        product.meta.createdAt,
        product.meta.updatedAt
      );
    }
  });

  insertMany(seedData);
  console.log(`Seeded ${seedData.length} products`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

