const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');
const term = require('../util/terminal');

const GadoFase = sequelize.define('gado_fase', {
  codigo: {
    type: DataTypes.STRING(1),
    primaryKey: true,
    autoIncrement: false,
  },
  fase: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  freezeTableName: true,
  updatedAt: false,
});

/**
 * Método para excluir todos os registros da tabela.
 * @function
 * @returns {Promise<void>} - Promessa vazia que indica o término da operação.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */
GadoFase.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await GadoFase.destroy({ truncate: true });
    return true;
    
  } catch (error) {
    term('Erro ao excluir registros da gado_fase:', error);
    throw error;
  }
};

module.exports = GadoFase;
