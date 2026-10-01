import { Response } from 'express';
import db from '../models/index';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function getVehicles(req: AuthenticatedRequest, res: Response) {
  try {
    const vehicles = await db.Vehicle.findAll({
      where: {
        userId: req.userId,
      },
      include: {
        model: db.Service,
      },
      order: [['id', 'ASC']],
    });
    res.status(200).json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
}

export async function getVehicleById(req: AuthenticatedRequest, res: Response) {
  try {
    const vehicle = await db.Vehicle.findOne({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        model: db.Service,
      },
      order: [[db.Service, 'date', 'DESC']],
    });
    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle Not Found.' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
}

export async function addVehicle(req: AuthenticatedRequest, res: Response) {
  const { make, model, year, licensePlate } = req.body;

  if (!make || !model || !year || !licensePlate) {
    return res.status(400).json({ msg: 'Please provide make, model, year, and license plate.' });
  }

  const parsedYear = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > currentYear + 1) {
    return res.status(400).json({ msg: `Year must be between 1900 and ${currentYear + 1}.` });
  }

  try {
    const vehicle = await db.Vehicle.create({
      make: String(make).trim(),
      model: String(model).trim(),
      year: parsedYear,
      licensePlate: String(licensePlate).trim().toUpperCase(),
      userId: req.userId,
    });
    res.status(201).json({ msg: 'Vehicle Added Successfully!', vehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
}

export async function deleteVehicle(req: AuthenticatedRequest, res: Response) {
  try {
    const removed = await db.Vehicle.destroy({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });
    if (!removed) {
      return res.status(404).json({ msg: 'Vehicle Not Found.' });
    }
    res.status(200).json({ msg: 'Vehicle Deleted Successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
}

export async function updateVehicle(req: AuthenticatedRequest, res: Response) {
  const { make, model, year, licensePlate } = req.body;
  const updates: Record<string, any> = {};

  if (make !== undefined) updates.make = String(make).trim();
  if (model !== undefined) updates.model = String(model).trim();
  if (year !== undefined) {
    const parsedYear = parseInt(year, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > currentYear + 1) {
      return res.status(400).json({ msg: `Year must be between 1900 and ${currentYear + 1}.` });
    }
    updates.year = parsedYear;
  }
  if (licensePlate !== undefined) updates.licensePlate = String(licensePlate).trim().toUpperCase();

  try {
    const vehicle = await db.Vehicle.findOne({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle Not Found.' });
    }

    await vehicle.update(updates);

    res.status(200).json({ msg: 'Vehicle Updated Successfully!', vehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
}
