const {Type} = require('../models/models')
const ApiError = require('../error/ApiError');

class TypeController {
    async create(req, res) {
        const {name} = req.body
        const type = await Type.create({name})
        return res.json(type)
    }

    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }
    async delete(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Не передано имя бренда для удаления' });
        }
        const deletedCount = await Type.destroy({
            where: {
                name
            }
        });
        return res.json({ deletedCount });
    }
    async update(req, res) {
        try {
          const { oldTypeName, newTypeName } = req.body;
          const typeToUpdate = await Type.findOne({ name: oldTypeName });
      
          if (!typeToUpdate) {
            return res.status(404).json({ error: 'Тип не найден' });
          }
          typeToUpdate.name = newTypeName;
          await typeToUpdate.save();
                return res.status(200).json(typeToUpdate);
        } catch (error) {
          console.error('Ошибка при редактировании:', error);
          return res.status(500).json({ error: 'Ошибка при редактировании' });
        }
      }

}

module.exports = new TypeController()