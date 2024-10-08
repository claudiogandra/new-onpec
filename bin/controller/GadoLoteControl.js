require('dotenv').config();
const term = require("../util/terminal");
const renderProcess = require("../api/render");
const GadoLote = require('../model/GadoLoteModel');
const StreamData = require('../util/stream');
const sequelize = require("../db/db");
const userData = require('../util/userData');

const API_URL = (process.env.ONPEC == 'LOCAL')
? 'http://localhost:5115' : `http://on.roncador.com.br:${(process.env.ONPEC == 'DEV') ? '5115' : '7117'}`;

/**
 * Controller responsável manipular dados de 'Gado Lote'.
 *
 * @param {string} lote - O número do lote (até 20 caracteres).
 * @param {number} unidade - O número da unidade.
 * @param {string} descricao - A descrição do lote (até 255 caracteres).
 *
 * @returns {Promise<Object>} - Retorna um objeto com o status da operação e os dados do GadoLote.
 * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
 */

const GadoLoteControl = {
  
  async list(filters = {}) {
    try {
      const response = await GadoLote.findAll();
      return response;
      
    } catch (error) {
      term(error);
      return false;
    }
  },

  /**
   * Sincroniza as pesagens com a API usando a data mais recente como referência.
   *
   * @returns {Promise<object>} - Retorna um objeto com os resultados da busca se a operação for bem-sucedida, ou false em outros casos.
   * @throws {Error} - Lança um erro se ocorrer algum problema durante a operação.
   * @property {Array} response.data - Retorna um Array com dados atualizados de Gado Lote.
   */
  async push() {
    try {
      const response = await fetch(`${API_URL}/api/gadolote/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          client: JSON.stringify(await userData())
        },
        body: null
      });
  
      if (!response.body) {
        throw new Error('ReadableStream não disponível');
      }

      const data = await StreamData.read(response.body.getReader());

      term('Baixando dados de Gado Lote', data);
      return data;

    } catch (error) {
      term(error);
      return false;
    }
  },

  async import(data, window, proc, step) {
    let transaction;
    let count = 0;
    
    try {
      transaction = await sequelize.transaction();

      await GadoLote.sync({ freezeTableName: true });
        
      renderProcess(
        window,
        proc,
        {
          step: `Passo ${step}\n\n- Tabela Gado Lote`,
          msg: `Sincronizados: ${count} de ${data.length}`
        }
      );

      for (const item of data) {
        //console.log(item);
        await GadoLote.upsert(item, {
          transaction,
          fields: [
            'lote', 'unidade', 'descricao', 'createdAt', 'status',
          ]
        });
  
        count++;
        
        renderProcess(
          window,
          proc,
          {
            msg: `Sincronizados: ${count} de ${data.length}`
          }
        );
      }

      await transaction.commit();

      return true;

    } catch (error) {
      term(error); // Criar método de arquivo de erros 'logDBerrors'
      await transaction.rollback();
      return false;
    }
  },
}

module.exports = GadoLoteControl;
