const taskCategoryService = require("../services/taskCategoryService");

const createTaskCategory = async (req, res) => {
  try {
    const { id_task, id_category } = req.body;
    const newTaskCategory = await taskCategoryService.createTaskCategory({
      id_task,
      id_category,
    });
    res.status(201).json(newTaskCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTaskCategory = async (req, res) => {
  try {
    const { id_task, id_category } = req.params;
    const deletedTaskCategory = await taskCategoryService.deleteTaskCategory(
      id_task,
      id_category
    );
    if (deletedTaskCategory) {
      res.status(200).json(deletedTaskCategory);
    } else {
      res
        .status(404)
        .json({ error: "Associação tarefa-categoria não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTaskCategory,
  deleteTaskCategory,
};
