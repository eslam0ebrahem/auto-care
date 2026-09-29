import { Response } from 'express';
import db from '../models/index';

export async function getVehicles(req: any, res: Response) {
  try {
    const vehicles = await db.Vehicle.findAll({
      where: {
        userId: req.userId,
      },
      include: {
        model: db.Service,
      },
    });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
}

export async function getVehicleById(req: any, res: Response) {
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
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
}

export async function addVehicle(req: any, res: Response) {
  const { make, model, year, licensePlate } = req.body;
  try {
    const vehicle = await db.Vehicle.create({
      make,
      model,
      year,
      licensePlate,
      userId: req.userId,
    });
    res.status(201).json({ msg: 'Vehicle Added Successfully!', vehicle });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
}

export async function deleteVehicle(req: any, res: Response) {
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
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
}

export async function updateVehicle(req: any, res: Response) {
  try {
    const [updated] = await db.Vehicle.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!updated) {
      return res.status(404).json({ msg: 'Vehicle Not Found.' });
    }

    res.status(200).json({ msg: 'Vehicle Updated Successfully!' });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
}
