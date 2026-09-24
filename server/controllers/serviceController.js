const db = require('../models/index.js');


async function getServices (req, res) {
  try {
    const userVehicles = await db.Vehicle.findAll({
      where: { userId: req.userId },
      attributes: ['id']
    });
    const vehicleIds = userVehicles.map(v => v.id);

    const services = await db.Service.findAll({
      where: {
        vehicleId: vehicleIds
      },
      order: [['date', 'DESC']],
      include: {
        model: db.Vehicle
      }
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
};

async function addService (req, res) {
  const { serviceType, date, mileage, cost, notes, vehicleId } = req.body;

  try {
    const vehicle = await db.Vehicle.findOne({
      where: { id: vehicleId, userId: req.userId }
    });

    if (!vehicle) {
      return res.status(403).json({ msg: 'Unauthorized vehicle.' });
    }

    const service = await db.Service.create({
      serviceType,
      date,
      mileage,
      cost,
      notes,
      vehicleId
    });
    res.status(201).json({msg: 'Service Created!', service});
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
};

async function deleteService(req, res) {
  try {
    const service = await db.Service.findByPk(req.params.id, {
      include: { model: db.Vehicle }
    });

    if (!service || service.Vehicle.userId !== req.userId) {
      return res.status(404).json({msg: 'Service not found!'});
    }

    await service.destroy();
    res.status(200).json({msg: 'Service deleted successfully!'});
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
};

async function updateService(req,res) {
  try {
    const service = await db.Service.findByPk(req.params.id, {
      include: { model: db.Vehicle }
    });

    if (!service || service.Vehicle.userId !== req.userId) {
      return res.status(404).json({msg: 'Service Record Not Found!'});
    }

    await service.update(req.body);
    res.status(200).json({msg: 'Service Record Updated Successfully!'});
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.log(error);
  }
}

module.exports = {getServices, addService, deleteService, updateService};