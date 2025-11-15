import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';
import Sweet from '../models/Sweet';

let mongoServer: MongoMemoryServer;
let userToken: string;
let adminToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a regular user
  const userResponse = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
  });
  userToken = userResponse.body.token;

  // Create an admin user
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  });
  const adminResponse = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'password123',
  });
  adminToken = adminResponse.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Sweet.deleteMany({});
});

describe('POST /api/sweets', () => {
  it('should create a new sweet with valid data', async () => {
    const sweetData = {
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.5,
      quantity: 100,
      description: 'Delicious chocolate bar',
    };

    const response = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sweetData)
      .expect(201);

    expect(response.body.name).toBe(sweetData.name);
    expect(response.body.category).toBe(sweetData.category);
    expect(response.body.price).toBe(sweetData.price);
    expect(response.body.quantity).toBe(sweetData.quantity);
    expect(response.body).toHaveProperty('_id');
  });

  it('should not create sweet without authentication', async () => {
    const sweetData = {
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.5,
      quantity: 100,
    };

    await request(app).post('/api/sweets').send(sweetData).expect(401);
  });

  it('should not create sweet with invalid data', async () => {
    const sweetData = {
      name: '',
      category: 'Chocolate',
      price: -5,
      quantity: -10,
    };

    const response = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sweetData)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});

describe('GET /api/sweets', () => {
  beforeEach(async () => {
    await Sweet.create([
      { name: 'Chocolate Bar', category: 'Chocolate', price: 2.5, quantity: 100 },
      { name: 'Gummy Bears', category: 'Gummy', price: 1.5, quantity: 50 },
      { name: 'Lollipop', category: 'Candy', price: 0.5, quantity: 200 },
    ]);
  });

  it('should get all sweets', async () => {
    const response = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('category');
    expect(response.body[0]).toHaveProperty('price');
  });

  it('should not get sweets without authentication', async () => {
    await request(app).get('/api/sweets').expect(401);
  });
});

describe('GET /api/sweets/search', () => {
  beforeEach(async () => {
    await Sweet.create([
      { name: 'Dark Chocolate Bar', category: 'Chocolate', price: 3.5, quantity: 100 },
      { name: 'Milk Chocolate Bar', category: 'Chocolate', price: 2.5, quantity: 150 },
      { name: 'Gummy Bears', category: 'Gummy', price: 1.5, quantity: 50 },
      { name: 'Lollipop', category: 'Candy', price: 0.5, quantity: 200 },
    ]);
  });

  it('should search sweets by name', async () => {
    const response = await request(app)
      .get('/api/sweets/search?name=Chocolate')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toContain('Chocolate');
  });

  it('should search sweets by category', async () => {
    const response = await request(app)
      .get('/api/sweets/search?category=Gummy')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].category).toBe('Gummy');
  });

  it('should search sweets by price range', async () => {
    const response = await request(app)
      .get('/api/sweets/search?minPrice=1&maxPrice=3')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((sweet: any) => {
      expect(sweet.price).toBeGreaterThanOrEqual(1);
      expect(sweet.price).toBeLessThanOrEqual(3);
    });
  });

  it('should combine multiple search criteria', async () => {
    const response = await request(app)
      .get('/api/sweets/search?category=Chocolate&minPrice=2&maxPrice=4')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((sweet: any) => {
      expect(sweet.category).toBe('Chocolate');
      expect(sweet.price).toBeGreaterThanOrEqual(2);
      expect(sweet.price).toBeLessThanOrEqual(4);
    });
  });
});

describe('PUT /api/sweets/:id', () => {
  let sweetId: string;

  beforeEach(async () => {
    const sweet = await Sweet.create({
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.5,
      quantity: 100,
    });
    sweetId = (sweet._id as any).toString();
  });

  it('should update sweet with valid data', async () => {
    const updateData = {
      name: 'Premium Chocolate Bar',
      price: 3.5,
    };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.name).toBe(updateData.name);
    expect(response.body.price).toBe(updateData.price);
    expect(response.body.category).toBe('Chocolate');
  });

  it('should not update sweet with invalid id', async () => {
    const invalidId = new mongoose.Types.ObjectId().toString();

    await request(app)
      .put(`/api/sweets/${invalidId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Updated' })
      .expect(404);
  });

  it('should not update sweet without authentication', async () => {
    await request(app)
      .put(`/api/sweets/${sweetId}`)
      .send({ name: 'Updated' })
      .expect(401);
  });
});

describe('DELETE /api/sweets/:id', () => {
  let sweetId: string;

  beforeEach(async () => {
    const sweet = await Sweet.create({
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.5,
      quantity: 100,
    });
    sweetId = (sweet._id as any).toString();
  });

  it('should delete sweet as admin', async () => {
    await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const deletedSweet = await Sweet.findById(sweetId);
    expect(deletedSweet).toBeNull();
  });

  it('should not delete sweet as regular user', async () => {
    await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('should not delete sweet without authentication', async () => {
    await request(app).delete(`/api/sweets/${sweetId}`).expect(401);
  });
});

describe('POST /api/sweets/:id/purchase', () => {
  let sweetId: string;

  beforeEach(async () => {
    const sweet = await Sweet.create({
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.5,
      quantity: 100,
    });
    sweetId = (sweet._id as any).toString();
  });

  it('should purchase sweet and decrease quantity', async () => {
    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 5 })
      .expect(200);

    expect(response.body.quantity).toBe(95);
  });

  it('should not purchase more than available quantity', async () => {
    await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 150 })
      .expect(400);
  });

  it('should not purchase with invalid quantity', async () => {
    await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: -5 })
      .expect(400);
  });
});

describe('POST /api/sweets/:id/restock', () => {
  let sweetId: string;

  beforeEach(async () => {
    const sweet = await Sweet.create({
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.5,
      quantity: 100,
    });
    sweetId = (sweet._id as any).toString();
  });

  it('should restock sweet as admin', async () => {
    const response = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 50 })
      .expect(200);

    expect(response.body.quantity).toBe(150);
  });

  it('should not restock sweet as regular user', async () => {
    await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 50 })
      .expect(403);
  });

  it('should not restock with invalid quantity', async () => {
    await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: -50 })
      .expect(400);
  });
});
