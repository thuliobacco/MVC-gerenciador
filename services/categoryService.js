const db = require("../config/db");

// Função para obter todas as categorias
const getAllCategories = async () => {
  try {
    const result = await db.query("SELECT * FROM Categories ORDER BY id ASC");
    return result.rows;
  } catch (error) {
    throw new Error("Erro ao obter categorias: " + error.message);
  }
};

// Função para obter uma categoria por ID
const getCategoryById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM Categories WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao obter categoria: " + error.message);
  }
};

// Função para criar uma nova categoria
const createCategory = async (titulo) => {
  try {
    const result = await db.query(
      "INSERT INTO Categories (titulo) VALUES ($1) RETURNING *",
      [titulo]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao criar categoria: " + error.message);
  }
};

// Função para atualizar uma categoria por ID
const updateCategory = async (id, titulo) => {
  try {
    const result = await db.query(
      "UPDATE Categories SET titulo = $1 WHERE id = $2 RETURNING *",
      [titulo, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao atualizar categoria: " + error.message);
  }
};

// Função para deletar uma categoria por ID
const deleteCategory = async (id) => {
  try {
    const result = await db.query(
      "DELETE FROM Categories WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao deletar categoria: " + error.message);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
