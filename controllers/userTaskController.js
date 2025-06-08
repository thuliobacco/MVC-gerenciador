const userTaskService = require("../services/userTaskService");

const createUserTask = async (req, res) => {
  try {
    const { id_user, id_task } = req.body;
    const newUserTask = await userTaskService.createUserTask({
      id_user,
      id_task,
    });
    res.status(201).json(newUserTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserTask = async (req, res) => {
  try {
    const { id_user, id_task } = req.params;
    const deletedUserTask = await userTaskService.deleteUserTask(
      id_user,
      id_task
    );
    if (deletedUserTask) {
      res.status(200).json(deletedUserTask);
    } else {
      res
        .status(404)
        .json({ error: "Associação usuário-tarefa não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUserTask,
  deleteUserTask,
};
