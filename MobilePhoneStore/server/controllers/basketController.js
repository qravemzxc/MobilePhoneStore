const { Basket, BasketProduct } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    async create(req, res) {
        try {
          const { deviceId, userId } = req.body;
      
          if (!deviceId || !userId) {
            return res.status(400).json({ message: 'deviceId and userId are required' });
          }
      
          const basket = await Basket.create({ userId, deviceId });
          res.status(201).json(basket);
        } catch (e) {
          console.error(e);
          res.status(500).json({ message: 'Error creating basket item' });
        }
      }
      async delete(req, res) {
        const { userId, deviceId } = req.body;
      
        try {
          const baskets = await Basket.findAll({
            where: {
              userId,
              deviceId
            }
          });
      
          if (baskets.length > 0) {
            // Perform the delete operation on the retrieved baskets
            for (const basket of baskets) {
              await basket.destroy();
            }
      
            res.status(200).json({ message: 'Baskets deleted successfully.' });
          } else {
            res.status(404).json({ message: 'No baskets found for the given userId and deviceId.' });
          }
        } catch (error) {
          console.error('Error deleting baskets:', error);
          res.status(500).json({ message: 'An error occurred while deleting the baskets.' });
        }
      }
    async getAll(req, res) {
        try {
            const { userId } = req.query;
            const basket = await Basket.findOne({ 
                where: { userId },
                include: { model: BasketProduct, include: { all: true } }
            });
            return res.json(basket);
        } catch (e) {
            return res.status(500).json({ message: 'Ошибка при получении корзины' });
        }
    }
}

module.exports = new BasketController();