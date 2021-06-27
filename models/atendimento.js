const axios = require('axios');
const moment = require('moment');
const conexao = require('../infraestrutura/database/conexao');
const repositorio = require('../repositorios/atendimento');

class Atendimento {
    constructor() {
        this.isDataValida = ({ data, dataCriacao }) =>
            moment(data).isSameOrAfter(dataCriacao);
        this.isClienteValido = ({ tamanho }) => tamanho >= 5;

        this.valida = (parametros) =>
            this.validacoes.filter((campo) => {
                const { nome } = campo;
                const param = parametros[nome];

                return !campo.valido(param);
            });

        this.validacoes = [
            {
                nome: 'data',
                valido: this.isDataValida,
                mensagem: 'Data deve ser maior ou igual à data atual',
            },
            {
                nome: 'cliente',
                valido: this.isClienteValido,
                mensagem: 'Cliente deve ter pelo menos 5 caractares',
            },
        ];
    }
    adiciona(atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format(
            'YYYY-MM-DD HH:mm:ss'
        );

        const params = {
            data: { data, dataCriacao },
            cliente: { tamanho: atendimento.cliente.length },
        };
        const erros = this.valida(params);
        const existemErros = erros.length;

        if (existemErros) {
            return new Promise((resolve, reject) => {
                reject(erros);
            });
        } else {
            const atendimentoDatado = { ...atendimento, dataCriacao, data };

            return repositorio
                .adiciona(atendimentoDatado)
                .then((resultados) => {
                    const id = resultados.insertId;
                    return { ...atendimento, id };
                });
        }
    }

    lista() {
        return repositorio.lista();
    }

    buscaPorId(id, res) {
        const query = `SELECT * FROM Atendimentos WHERE id = ${id}`;
        conexao.query(query, async (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                const atendimento = resultados[0];
                const cpf = atendimento.cliente;

                const { data } = await axios.get(
                    `http://localhost:8082/${cpf}`
                );

                atendimento.cliente = data;

                res.status(200).json(atendimento);
            }
        });
    }

    altera(id, valores, res) {
        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format(
                'YYYY-MM-DD HH:mm:ss'
            );
        }
        const query = 'UPDATE Atendimentos SET ? WHERE id = ?';

        conexao.query(query, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({ id });
            }
        });
    }

    deleta(id, res) {
        const query = `DELETE FROM Atendimentos WHERE id = ${id}`;

        conexao.query(query, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({ id });
            }
        });
    }
}

module.exports = new Atendimento();
