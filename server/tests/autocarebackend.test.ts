import request from 'supertest';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import app from '../app';
import db from '../models';

type UserResponse = {
  token: string;
};

type VehicleResponse = {
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
};

const api = request(app);
const uniqueEmail = `vehicle-test-${Date.now()}@example.com`;
let authorization = '';
let createdVehicleId = 0;

describe('Vehicle endpoints', () => {
  beforeAll(async () => {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ alter: true });

    const response = await api.post('/auth/register').send({
      name: 'Vehicle Test User',
      email: uniqueEmail,
      password: 'TestPassword123!',
    });

    const body = response.body as UserResponse;
    authorization = `Bearer ${body.token}`;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it('rejects requests without authentication', async () => {
    const response = await api.get('/vehicles');

    expect(response.status).toBe(401);
  });

  it('creates and lists a vehicle for the authenticated user', async () => {
    const createResponse = await api
      .post('/vehicles')
      .set('Authorization', authorization)
      .send({
        make: 'Test',
        model: 'Vehicle',
        year: 2024,
        licensePlate: `TEST-${Date.now()}`,
      });

    expect(createResponse.status).toBe(201);

    const createBody = createResponse.body as VehicleResponse;
    createdVehicleId = createBody.vehicle.id;

    const listResponse = await api
      .get('/vehicles')
      .set('Authorization', authorization);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: createdVehicleId }),
      ]),
    );
  });

  it('updates the authenticated user vehicle', async () => {
    const response = await api
      .patch(`/vehicles/${createdVehicleId}`)
      .set('Authorization', authorization)
      .send({ make: 'Updated Make' });

    expect(response.status).toBe(200);

    const getResponse = await api
      .get(`/vehicles/${createdVehicleId}`)
      .set('Authorization', authorization);

    expect(getResponse.body.make).toBe('Updated Make');
  });

  it('deletes the authenticated user vehicle', async () => {
    const deleteResponse = await api
      .delete(`/vehicles/${createdVehicleId}`)
      .set('Authorization', authorization);

    expect(deleteResponse.status).toBe(200);

    const listResponse = await api
      .get('/vehicles')
      .set('Authorization', authorization);

    expect(listResponse.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: createdVehicleId }),
      ]),
    );
  });
});
