const db = require('../models/index.js');


async function getVehicles (req,res) {
  try {
    const vehicles = await db.Vehicle.findAll({
      where: {
        userId: req.userId
      },
      include: {
        model: db.Service
      }
    });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
};

async function getVehicleById (req,res) {
  try {
    const vehicle = await db.Vehicle.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: {
        model: db.Service,
      },
      order: [[db.Service, 'date', 'DESC']]
    });
    if (!vehicle) {
      return res.status(404).json({msg: "Vehicle Not Found."});
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
};

async function addVehicle (req, res) {
  const {make, model, year, licensePlate} = req.body;
  try {
    const vehicle = await db.Vehicle.create({
      make: make,
      model: model,
      year: year,
      licensePlate: licensePlate,
      userId: req.userId
    })
    res.status(201).json({msg: 'Vehicle Added Successfully!', vehicle});
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
};

async function deleteVehicle (req, res) {
  try {
    const removed = await db.Vehicle.destroy({
      where: {
        id: req.params.id,
        userId: req.userId
      },
    });
    if (!removed) {
      return res.status(404).json({msg: 'Vehicle Not Found.'})
    }
    res.status(200).json({msg: 'Vehicle Deleted Successfully!'});

  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(error);
  }
};

module.exports = {getVehicles, getVehicleById, addVehicle, deleteVehicle};