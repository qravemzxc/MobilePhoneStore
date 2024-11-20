const { Brand } = require('../models/models');
const ApiError = require('../error/ApiError');

class BrandController {
    async create(req, res) {
        const { name } = req.body;
        const brand = await Brand.create({ name });
        return res.json(brand);
    }

    async delete(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Не передано имя бренда для удаления' });
        }
        const deletedCount = await Brand.destroy({
            where: {
                name
            }
        });
        return res.json({ deletedCount });
    }
    async update(req, res) {
        try {
          const { oldBrandName, newBrandName } = req.body;
          const brandToUpdate = await Brand.findOne({ name: oldBrandName });
      
          if (!brandToUpdate) {
            return res.status(404).json({ error: 'Бренд не найден' });
          }
          brandToUpdate.name = newBrandName;
          await brandToUpdate.save();
                return res.status(200).json(brandToUpdate);
        } catch (error) {
          console.error('Ошибка при редактировании:', error);
          return res.status(500).json({ error: 'Ошибка при редактировании' });
        }
      }

    async getAll(req, res) {
        const brands = await Brand.findAll();
        return res.json(brands);
    }
}

module.exports = new BrandController();