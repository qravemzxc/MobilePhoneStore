const uuid = require('uuid')
const path = require('path');
const {Device, DeviceInfo,Basket,Purchases} = require('../models/models')
const ApiError = require('../error/ApiError');

class DeviceController {

    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, description} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({name, price, brandId, typeId, img: fileName,description});
            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where:{brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId}, limit, offset})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId, brandId}, limit, offset})
        }
        return res.json(devices)
    }

    async  getOne(req, res) {
      try {
        const { id } = req.params;
        const device = await Device.findOne({
          where: { id },
        });
        
        if (!device) {
          return res.status(404).json({ error: 'Device not found' });
        }
    
        return res.json(device);
      } catch (error) {
        console.error('Error fetching device:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
   
    async delete(req, res, next) {
        try {
          const { id } = req.params;
      
          // Delete associated device information
          await DeviceInfo.destroy({
            where: {
              deviceId: id,
            },
          });
      
          // Delete the device
          await Device.destroy({
            where: {
              id,
            },
          });
      
          return res.json({ message: 'Device successfully deleted' });
        } catch (e) {
          next(ApiError.badRequest(e.message));
        }
      }
      async createPurchase(req, res){
        try {
          const { userId, deviceId, amount } = req.body;
          const purchase = await Purchases.create({ userId, deviceId, amount });
          res.status(201).json(purchase);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      };
      async update(req, res) {
        try {
          const { id, name, price, brandId, typeId, description } = req.body;
      
          let fileName = null;
          if (req.files && req.files.img) {
            const { img } = req.files;
            fileName = `${uuid.v4()}.jpg`;
            await img.mv(path.resolve(__dirname, '..', 'static', fileName));
          }
      
          const device = await Device.findByPk(id);
          if (!device) {
            return res.status(404).json({ error: 'Device not found' });
          }
      
          const updatedDevice = await Device.update(
            {
              name,
              price,
              img: fileName,
              description,
              typeId,
              brandId
            },
            {
              where: { id: device.id },
              returning: true
            }
          );
      
          return res.json(updatedDevice);
        } catch (error) {
          console.error('Error updating device:', error);
          if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.message });
          } else {
            return res.status(500).json({ error: 'Error updating device' });
          }
        }
      }

}

module.exports = new DeviceController()