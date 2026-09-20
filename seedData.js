const { Product, User, SellerProfile, Village, sequelize } = require('../models');

const vegetableNames = [
  'Country Tomato', 'Red Bellary Onion', 'Small Onion', 'Potato', 'Baby Potato',
  'Carrot', 'Beetroot', 'Radish', 'White Radish', 'French Beans',
  'Cluster Beans', 'Broad Beans', 'Green Peas', 'Drumstick', 'Brinjal',
  'White Brinjal', 'Green Capsicum', 'Red Capsicum', 'Yellow Capsicum', 'Cabbage',
  'Cauliflower', 'Broccoli', 'Ladies Finger', 'Bitter Gourd', 'Bottle Gourd',
  'Ridge Gourd', 'Snake Gourd', 'Ash Gourd', 'Pumpkin', 'Ivy Gourd',
  'Chow Chow', 'Raw Banana', 'Raw Mango', 'Sweet Corn', 'Cucumber',
  'Vellarikka', 'Green Chilli', 'Ginger', 'Garlic', 'Turmeric',
  'Curry Leaves', 'Coriander', 'Mint', 'Lemon', 'Mushroom',
  'Yam', 'Colocasia', 'Elephant Foot Yam', 'Plantain Flower', 'Banana Stem'
];

const fruitNames = [
  'Mango', 'Alphonso Mango', 'Banganapalli Mango', 'Banana', 'Red Banana',
  'Poovan Banana', 'Pomegranate', 'Apple', 'Green Apple', 'Orange',
  'Sweet Lime', 'Mosambi', 'Watermelon', 'Muskmelon', 'Papaya',
  'Guava', 'Pineapple', 'Grapes', 'Black Grapes', 'Green Grapes',
  'Sapota', 'Jackfruit', 'Dragon Fruit', 'Kiwi', 'Pear',
  'Strawberry', 'Custard Apple', 'Chikoo', 'Plum', 'Peach'
];

const greensNames = [
  'Arai Keerai', 'Siru Keerai', 'Mulaikeerai', 'Murungai Keerai', 'Palak Keerai',
  'Vendaya Keerai', 'Ponnanganni Keerai', 'Manathakkali Keerai', 'Agathi Keerai', 'Vallarai Keerai'
];

const comboNames = ['Veg Briyani', 'Veg Salad', 'Veg Soup', 'Fruit Salad', 'Fruit Juices'];

const imageFor = (category, index, name) => {
  const queryName = name
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+/g, ',')
    .toLowerCase();
  const categoryQuery = category === 'greens'
    ? 'fresh,leafy,greens'
    : category === 'organic-combos'
      ? 'fresh,healthy,food'
      : `fresh,${category}`;

  return `https://loremflickr.com/800/600/${queryName},${categoryQuery}?lock=${category}-${index + 1}`;
};

const makeProducts = (names, category, unit, basePrice) => names.map((name, index) => ({
  name: `${name}${category === 'greens' ? ' (கீரை)' : ''}`,
  tamilName: category === 'greens' ? name : '',
  category,
  description: `Fresh ${name.toLowerCase()} sourced from our village farmer network.`,
  price: basePrice + (index % 7) * 5,
  discountPrice: basePrice + (index % 7) * 5 - 3,
  unit,
  image: imageFor(category, index, name),
  stock: 80 + (index % 5) * 20,
  inStock: true,
  isOrganic: index % 3 !== 1,
  isSeasonal: index % 4 === 0,
  isBestSeller: index < 3,
  rating: Number((4.5 + (index % 5) / 10).toFixed(1)),
  numReviews: 12 + index * 3,
  origin: 'Direct from Tamil Nadu Village Farmers'
}));

const products = [
  ...makeProducts(vegetableNames, 'vegetables', '1 kg', 28),
  ...makeProducts(fruitNames, 'fruits', '1 kg', 55),
  ...makeProducts(greensNames, 'greens', '1 bunch', 20),
  ...makeProducts(comboNames, 'organic-combos', '1 box', 99)
];

async function seedDatabase() {
  console.log('🌱 Starting Namm Sandei catalog seed process...');

  try {
    await sequelize.authenticate();
    console.log(`Connected to ${sequelize.getDialect()}. Syncing DB...`);
    await sequelize.sync({ force: true }); // Reset DB for seeding

    // Create Villages
    const village = await Village.create({
      name: 'Pollachi South', nameTamil: 'பொள்ளாச்சி தெற்கு', district: 'Coimbatore', coordinatorName: 'Rajendran'
    });

    // Create Users
    const admin = await User.create({
      name: 'Namm Sandei Admin', email: 'admin@nammsandei.com', password: 'admin123', role: 'admin', phone: '+91 98765 43210'
    });

    const customer = await User.create({
      name: 'Muthuvel K', email: 'customer@nammsandei.com', password: 'customer123', role: 'customer', phone: '+91 98400 12345'
    });

    const seller = await User.create({
      name: 'Krishna Farmer', email: 'seller@nammsandei.com', password: 'seller123', role: 'seller', phone: '+91 99999 11111',
      village: 'Pollachi South', district: 'Coimbatore'
    });

    await SellerProfile.create({
      userId: seller.id,
      farmName: 'Krishna Organic Farm',
      farmNameTamil: 'கிருஷ்ணா இயற்கை பண்ணை',
      farmSize: '5 acres',
      farmLocation: 'Pollachi Outskirts',
      village: 'Pollachi South',
      district: 'Coimbatore',
      isVerified: true
    });

    // Create Products assigned to Seller
    for (const p of products) {
      await Product.create({ ...p, sellerId: seller.id });
    }

    console.log(`✅ ${products.length} catalog products, villages, and demo accounts seeded successfully!`);
  } catch (err) {
    console.log(`ℹ️  MySQL seed skipped (${err.message}).`);
  }
  console.log('🎉 Seeding completed!');
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = { products, seedDatabase };
