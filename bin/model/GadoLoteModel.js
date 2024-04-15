const sequelize = require('../data/db');
const { DataTypes } = require('sequelize');
const term = require('../resources/terminal');

const GadoLote = sequelize.define('tbl_gado_lote', {
  lote: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  unidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
});

/**
 * Método para excluir todos os registros da tabela.
 * @function
 * @returns {Promise<void>} - Promessa vazia que indica o término da operação.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */
GadoLote.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await GadoLote.destroy({ truncate: true });
    return true;

  } catch (error) {
    term('Erro ao excluir registros da tbl_gado_lote:', error);
    throw error;
  }
};

module.exports = GadoLote;
