const sequelize = require('../db/db');
const { DataTypes } = require('sequelize');
const term = require('../util/terminal');

const GadoLote = sequelize.define('gado_lote', {
  lote: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
  },
  unidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'A'
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
GadoLote.resetTable = async () => {
  try {
    // Excluir todos os registros da tabela
    await GadoLote.destroy({ truncate: true });
    return true;

  } catch (error) {
    term('Erro ao excluir registros da gado_lote:', error);
    throw error;
  }
};

module.exports = GadoLote;
