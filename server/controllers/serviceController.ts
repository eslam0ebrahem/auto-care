import { Response } from 'express';
import db from '../models/index';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function getServices(req: AuthenticatedRequest, res: Response) {
  try {
    const services = await db.Service.findAll({
      include: {
        model: db.Vehicle,
        where: { userId: req.userId },
        required: true,
      },
      order: [['date', 'DESC']],
    });

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
}

export async function addService(req: AuthenticatedRequest, res: Response) {
  const { serviceType, date, mileage, cost, notes, vehicleId } = req.body;

  if (!serviceType || !date || mileage === undefined || cost === undefined || !vehicleId) {
    return res.status(400).json({ msg: 'Please provide serviceType, date, mileage, cost, and vehicleId.' });
  }

  const parsedMileage = parseInt(mileage, 10);
  const parsedCost = parseFloat(cost);
  const parsedDate = new Date(date);

  if (isNaN(parsedMileage) || parsedMileage < 0) {
    return res.status(400).json({ msg: 'Mileage must be a non-negative number.' });
  }

  if (isNaN(parsedCost) || parsedCost < 0) {
    return res.status(400).json({ msg: 'Cost must be a non-negative number.' });
  }

  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ msg: 'Invalid date provided.' });
  }

  try {
    const vehicle = await db.Vehicle.findOne({
      where: { id: vehicleId, userId: req.userId },
    });

    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found or unauthorized.' });
    }

    const service = await db.Service.create({
      serviceType: String(serviceType).trim(),
      date: parsedDate,
      mileage: parsedMileage,
      cost: parsedCost,
      notes: notes ? String(notes).trim() : null,
      vehicleId: vehicle.id,
    });

    const populatedService = await db.Service.findByPk(service.id, {
      include: { model: db.Vehicle },
    });

    res.status(201).json({ msg: 'Service Created!', service: populatedService || service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
}

export async function deleteService(req: AuthenticatedRequest, res: Response) {
  try {
    const service: any = await db.Service.findByPk(req.params.id, {
      include: { model: db.Vehicle },
    });

    if (!service || !service.Vehicle || service.Vehicle.userId !== req.userId) {
      return res.status(404).json({ msg: 'Service not found!' });
    }

    await service.destroy();
    res.status(200).json({ msg: 'Service deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
}

export async function updateService(req: AuthenticatedRequest, res: Response) {
  const { serviceType, date, mileage, cost, notes, vehicleId } = req.body;

  try {
    const service: any = await db.Service.findByPk(req.params.id, {
      include: { model: db.Vehicle },
    });

    if (!service || !service.Vehicle || service.Vehicle.userId !== req.userId) {
      return res.status(404).json({ msg: 'Service Record Not Found!' });
    }

    const updates: Record<string, any> = {};

    if (serviceType !== undefined) updates.serviceType = String(serviceType).trim();
    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ msg: 'Invalid date provided.' });
      }
      updates.date = parsedDate;
    }
    if (mileage !== undefined) {
      const parsedMileage = parseInt(mileage, 10);
      if (isNaN(parsedMileage) || parsedMileage < 0) {
        return res.status(400).json({ msg: 'Mileage must be a non-negative number.' });
      }
      updates.mileage = parsedMileage;
    }
    if (cost !== undefined) {
      const parsedCost = parseFloat(cost);
      if (isNaN(parsedCost) || parsedCost < 0) {
        return res.status(400).json({ msg: 'Cost must be a non-negative number.' });
      }
      updates.cost = parsedCost;
    }
    if (notes !== undefined) {
      updates.notes = notes ? String(notes).trim() : null;
    }

    if (vehicleId !== undefined && vehicleId !== service.vehicleId) {
      const targetVehicle = await db.Vehicle.findOne({
        where: { id: vehicleId, userId: req.userId },
      });
      if (!targetVehicle) {
        return res.status(404).json({ msg: 'Target vehicle not found or unauthorized.' });
      }
      updates.vehicleId = targetVehicle.id;
    }

    await service.update(updates);

    const updatedService = await db.Service.findByPk(service.id, {
      include: { model: db.Vehicle },
    });

    res.status(200).json({
      msg: 'Service Record Updated Successfully!',
      service: updatedService || service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
}
