import { db } from './index.js';

// Generate 37 products total (2 original + 35 new)
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
  // 35 additional products
  {
    title: "Quantum Stabilizer",
    description: "Maintains quantum coherence in high-energy environments. Essential for time-travel applications.",
    category: "electronics",
    price: 149.99,
    stock: 15,
    brand: "TechCorp",
    sku: "TC-QS-001",
    weight: 2.5,
    meta: {
      createdAt: "2025-04-28T14:20:00.000Z",
      updatedAt: "2025-04-28T14:20:00.000Z",
    }
  },
  {
    title: "Plasma Converter",
    description: "Converts matter to plasma state for advanced manufacturing processes.",
    category: "industrial",
    price: 2999.99,
    stock: 3,
    brand: "IndustrialMax",
    sku: "IM-PC-001",
    weight: 45.5,
    meta: {
      createdAt: "2025-04-27T10:15:30.000Z",
      updatedAt: "2025-04-27T10:15:30.000Z",
    }
  },
  {
    title: "Nano Fabricator",
    description: "Creates molecular-level structures with precision. Used in advanced material science.",
    category: "electronics",
    price: 4999.99,
    stock: 1,
    brand: "NanoTech",
    sku: "NT-NF-001",
    weight: 12.3,
    meta: {
      createdAt: "2025-04-26T16:45:12.000Z",
      updatedAt: "2025-04-26T16:45:12.000Z",
    }
  },
  {
    title: "Gravity Well Generator",
    description: "Generates localized gravity fields for space station applications.",
    category: "aerospace",
    price: 8999.99,
    stock: 2,
    brand: "SpaceWorks",
    sku: "SW-GW-001",
    weight: 78.9,
    meta: {
      createdAt: "2025-04-25T08:30:45.000Z",
      updatedAt: "2025-04-25T08:30:45.000Z",
    }
  },
  {
    title: "Holographic Display Unit",
    description: "Full-color 3D holographic projection system with 4K resolution.",
    category: "electronics",
    price: 799.99,
    stock: 25,
    brand: "VisionTech",
    sku: "VT-HD-001",
    weight: 5.2,
    meta: {
      createdAt: "2025-04-24T12:00:00.000Z",
      updatedAt: "2025-04-24T12:00:00.000Z",
    }
  },
  {
    title: "Energy Shield Emitter",
    description: "Creates protective energy barriers. Military and civilian applications available.",
    category: "defense",
    price: 12999.99,
    stock: 5,
    brand: "SecureTech",
    sku: "ST-ES-001",
    weight: 34.7,
    meta: {
      createdAt: "2025-04-23T18:22:33.000Z",
      updatedAt: "2025-04-23T18:22:33.000Z",
    }
  },
  {
    title: "Molecular Scanner",
    description: "Analyzes molecular composition in real-time. Portable and accurate.",
    category: "scientific",
    price: 2499.99,
    stock: 8,
    brand: "LabTech",
    sku: "LT-MS-001",
    weight: 3.8,
    meta: {
      createdAt: "2025-04-22T09:15:20.000Z",
      updatedAt: "2025-04-22T09:15:20.000Z",
    }
  },
  {
    title: "Teleportation Pad",
    description: "Short-range matter transportation device. Maximum range: 100km.",
    category: "transportation",
    price: 19999.99,
    stock: 1,
    brand: "TransCorp",
    sku: "TC-TP-001",
    weight: 156.3,
    meta: {
      createdAt: "2025-04-21T14:50:10.000Z",
      updatedAt: "2025-04-21T14:50:10.000Z",
    }
  },
  {
    title: "AI Core Processor",
    description: "Advanced neural network processor for machine learning applications.",
    category: "electronics",
    price: 3499.99,
    stock: 12,
    brand: "AITech",
    sku: "AT-AI-001",
    weight: 1.2,
    meta: {
      createdAt: "2025-04-20T11:30:00.000Z",
      updatedAt: "2025-04-20T11:30:00.000Z",
    }
  },
  {
    title: "Solar Collector Array",
    description: "High-efficiency solar energy collection system for space stations.",
    category: "energy",
    price: 5999.99,
    stock: 6,
    brand: "SolarMax",
    sku: "SM-SC-001",
    weight: 89.4,
    meta: {
      createdAt: "2025-04-19T07:45:55.000Z",
      updatedAt: "2025-04-19T07:45:55.000Z",
    }
  },
  {
    title: "Quantum Entanglement Communicator",
    description: "Instantaneous communication across any distance using quantum entanglement.",
    category: "communications",
    price: 14999.99,
    stock: 2,
    brand: "QuantumCom",
    sku: "QC-QE-001",
    weight: 8.7,
    meta: {
      createdAt: "2025-04-18T13:20:40.000Z",
      updatedAt: "2025-04-18T13:20:40.000Z",
    }
  },
  {
    title: "Matter Replicator",
    description: "Creates objects from stored patterns. Requires energy and raw materials.",
    category: "manufacturing",
    price: 24999.99,
    stock: 1,
    brand: "RepliTech",
    sku: "RT-MR-001",
    weight: 234.5,
    meta: {
      createdAt: "2025-04-17T16:10:25.000Z",
      updatedAt: "2025-04-17T16:10:25.000Z",
    }
  },
  {
    title: "Neural Interface Headset",
    description: "Direct brain-computer interface for immersive virtual experiences.",
    category: "electronics",
    price: 1999.99,
    stock: 20,
    brand: "NeuroLink",
    sku: "NL-NI-001",
    weight: 0.8,
    meta: {
      createdAt: "2025-04-16T10:00:15.000Z",
      updatedAt: "2025-04-16T10:00:15.000Z",
    }
  },
  {
    title: "Antimatter Containment Unit",
    description: "Safely stores and transports antimatter for research and energy production.",
    category: "scientific",
    price: 49999.99,
    stock: 1,
    brand: "SafeTech",
    sku: "ST-AC-001",
    weight: 567.8,
    meta: {
      createdAt: "2025-04-15T08:30:00.000Z",
      updatedAt: "2025-04-15T08:30:00.000Z",
    }
  },
  {
    title: "Time Dilation Field Generator",
    description: "Creates localized time dilation effects. Experimental technology.",
    category: "scientific",
    price: 99999.99,
    stock: 0,
    brand: "TimeTech",
    sku: "TT-TD-001",
    weight: 123.4,
    meta: {
      createdAt: "2025-04-14T15:45:30.000Z",
      updatedAt: "2025-04-14T15:45:30.000Z",
    }
  },
  {
    title: "Force Field Projector",
    description: "Generates repulsive force fields for protection and containment.",
    category: "defense",
    price: 17999.99,
    stock: 4,
    brand: "ForceCorp",
    sku: "FC-FF-001",
    weight: 45.6,
    meta: {
      createdAt: "2025-04-13T12:20:10.000Z",
      updatedAt: "2025-04-13T12:20:10.000Z",
    }
  },
  {
    title: "Bio-Regenerator",
    description: "Accelerates cellular regeneration for medical applications.",
    category: "medical",
    price: 39999.99,
    stock: 3,
    brand: "MedTech",
    sku: "MT-BR-001",
    weight: 78.2,
    meta: {
      createdAt: "2025-04-12T09:15:45.000Z",
      updatedAt: "2025-04-12T09:15:45.000Z",
    }
  },
  {
    title: "Dimensional Portal",
    description: "Creates stable portals between dimensions. Requires massive energy input.",
    category: "transportation",
    price: 999999.99,
    stock: 0,
    brand: "PortalTech",
    sku: "PT-DP-001",
    weight: 1234.5,
    meta: {
      createdAt: "2025-04-11T14:00:20.000Z",
      updatedAt: "2025-04-11T14:00:20.000Z",
    }
  },
  {
    title: "Smart Fabric Roll",
    description: "Self-repairing, color-changing fabric with integrated sensors.",
    category: "textiles",
    price: 299.99,
    stock: 50,
    brand: "FabricTech",
    sku: "FT-SF-001",
    weight: 2.1,
    meta: {
      createdAt: "2025-04-10T11:30:00.000Z",
      updatedAt: "2025-04-10T11:30:00.000Z",
    }
  },
  {
    title: "Liquid Metal Alloy",
    description: "Shape-shifting metal that responds to electrical signals.",
    category: "materials",
    price: 1499.99,
    stock: 18,
    brand: "MetalWorks",
    sku: "MW-LM-001",
    weight: 5.5,
    meta: {
      createdAt: "2025-04-09T16:45:30.000Z",
      updatedAt: "2025-04-09T16:45:30.000Z",
    }
  },
  {
    title: "Zero-Point Energy Extractor",
    description: "Harnesses vacuum energy for unlimited power generation.",
    category: "energy",
    price: 79999.99,
    stock: 1,
    brand: "EnergyCorp",
    sku: "EC-ZP-001",
    weight: 345.6,
    meta: {
      createdAt: "2025-04-08T10:20:15.000Z",
      updatedAt: "2025-04-08T10:20:15.000Z",
    }
  },
  {
    title: "Cloaking Device",
    description: "Renders objects invisible by bending light around them.",
    category: "defense",
    price: 59999.99,
    stock: 2,
    brand: "StealthTech",
    sku: "ST-CD-001",
    weight: 12.8,
    meta: {
      createdAt: "2025-04-07T13:10:40.000Z",
      updatedAt: "2025-04-07T13:10:40.000Z",
    }
  },
  {
    title: "Memory Crystal",
    description: "Stores vast amounts of data in quantum-entangled crystal structure.",
    category: "electronics",
    price: 4999.99,
    stock: 10,
    brand: "DataCorp",
    sku: "DC-MC-001",
    weight: 0.3,
    meta: {
      createdAt: "2025-04-06T08:00:00.000Z",
      updatedAt: "2025-04-06T08:00:00.000Z",
    }
  },
  {
    title: "Weather Control Station",
    description: "Localized weather manipulation system for agricultural use.",
    category: "agricultural",
    price: 89999.99,
    stock: 1,
    brand: "WeatherTech",
    sku: "WT-WC-001",
    weight: 456.7,
    meta: {
      createdAt: "2025-04-05T15:30:25.000Z",
      updatedAt: "2025-04-05T15:30:25.000Z",
    }
  },
  {
    title: "Gravity Boots",
    description: "Allows walking on any surface regardless of orientation.",
    category: "automotive",
    price: 899.99,
    stock: 30,
    brand: "GravityGear",
    sku: "GG-GB-001",
    weight: 1.5,
    meta: {
      createdAt: "2025-04-04T12:15:50.000Z",
      updatedAt: "2025-04-04T12:15:50.000Z",
    }
  },
  {
    title: "Photon Torpedo",
    description: "Directed energy weapon for space combat applications.",
    category: "defense",
    price: 24999.99,
    stock: 5,
    brand: "WeaponTech",
    sku: "WT-PT-001",
    weight: 23.4,
    meta: {
      createdAt: "2025-04-03T09:45:10.000Z",
      updatedAt: "2025-04-03T09:45:10.000Z",
    }
  },
  {
    title: "Universal Translator",
    description: "Real-time translation device supporting all known languages.",
    category: "communications",
    price: 1299.99,
    stock: 25,
    brand: "LangTech",
    sku: "LT-UT-001",
    weight: 0.5,
    meta: {
      createdAt: "2025-04-02T14:20:35.000Z",
      updatedAt: "2025-04-02T14:20:35.000Z",
    }
  },
  {
    title: "Nano Repair Kit",
    description: "Self-replicating nanobots for automated repair of complex systems.",
    category: "tools",
    price: 1999.99,
    stock: 15,
    brand: "NanoTech",
    sku: "NT-NR-001",
    weight: 0.2,
    meta: {
      createdAt: "2025-04-01T11:00:00.000Z",
      updatedAt: "2025-04-01T11:00:00.000Z",
    }
  },
  {
    title: "Phase Shifter",
    description: "Allows matter to pass through solid objects by phase shifting.",
    category: "scientific",
    price: 34999.99,
    stock: 2,
    brand: "PhaseTech",
    sku: "PT-PS-001",
    weight: 15.7,
    meta: {
      createdAt: "2025-03-31T16:30:45.000Z",
      updatedAt: "2025-03-31T16:30:45.000Z",
    }
  },
  {
    title: "Mind Reading Helmet",
    description: "Non-invasive brain activity scanner for research purposes.",
    category: "scientific",
    price: 14999.99,
    stock: 4,
    brand: "NeuroTech",
    sku: "NT-MR-001",
    weight: 1.8,
    meta: {
      createdAt: "2025-03-30T10:15:20.000Z",
      updatedAt: "2025-03-30T10:15:20.000Z",
    }
  },
  {
    title: "Fusion Reactor Core",
    description: "Compact fusion power source for spacecraft and stations.",
    category: "energy",
    price: 199999.99,
    stock: 1,
    brand: "FusionCorp",
    sku: "FC-FR-001",
    weight: 789.2,
    meta: {
      createdAt: "2025-03-29T08:45:00.000Z",
      updatedAt: "2025-03-29T08:45:00.000Z",
    }
  },
  {
    title: "Terraforming Seed",
    description: "Biological agent that rapidly transforms planetary environments.",
    category: "agricultural",
    price: 99999.99,
    stock: 0,
    brand: "BioCorp",
    sku: "BC-TS-001",
    weight: 0.1,
    meta: {
      createdAt: "2025-03-28T13:20:10.000Z",
      updatedAt: "2025-03-28T13:20:10.000Z",
    }
  },
  {
    title: "Wormhole Stabilizer",
    description: "Maintains stable wormhole connections for interstellar travel.",
    category: "transportation",
    price: 499999.99,
    stock: 0,
    brand: "SpaceTech",
    sku: "ST-WS-001",
    weight: 2345.6,
    meta: {
      createdAt: "2025-03-27T15:00:30.000Z",
      updatedAt: "2025-03-27T15:00:30.000Z",
    }
  },
  {
    title: "Reality Anchor",
    description: "Prevents reality distortion in high-energy physics experiments.",
    category: "scientific",
    price: 79999.99,
    stock: 1,
    brand: "RealityCorp",
    sku: "RC-RA-001",
    weight: 123.9,
    meta: {
      createdAt: "2025-03-26T12:10:55.000Z",
      updatedAt: "2025-03-26T12:10:55.000Z",
    }
  },
  {
    title: "Dream Recorder",
    description: "Captures and replays dreams for analysis and entertainment.",
    category: "electronics",
    price: 2999.99,
    stock: 12,
    brand: "DreamTech",
    sku: "DT-DR-001",
    weight: 0.6,
    meta: {
      createdAt: "2025-03-25T09:30:15.000Z",
      updatedAt: "2025-03-25T09:30:15.000Z",
    }
  },
  {
    title: "Matter Compressor",
    description: "Reduces volume of matter while maintaining mass. Storage solution.",
    category: "tools",
    price: 14999.99,
    stock: 6,
    brand: "StorageTech",
    sku: "ST-MC-001",
    weight: 67.8,
    meta: {
      createdAt: "2025-03-24T14:45:40.000Z",
      updatedAt: "2025-03-24T14:45:40.000Z",
    }
  },
  {
    title: "Consciousness Backup Unit",
    description: "Stores complete consciousness patterns for restoration purposes.",
    category: "medical",
    price: 999999.99,
    stock: 0,
    brand: "LifeTech",
    sku: "LT-CB-001",
    weight: 45.3,
    meta: {
      createdAt: "2025-03-23T11:20:25.000Z",
      updatedAt: "2025-03-23T11:20:25.000Z",
    }
  },
  {
    title: "Time Loop Generator",
    description: "Creates localized time loops for testing and research.",
    category: "scientific",
    price: 199999.99,
    stock: 0,
    brand: "TimeCorp",
    sku: "TC-TL-001",
    weight: 234.7,
    meta: {
      createdAt: "2025-03-22T08:00:00.000Z",
      updatedAt: "2025-03-22T08:00:00.000Z",
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
