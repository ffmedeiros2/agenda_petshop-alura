const customExpress = require('./config/customExpress');
const conexao = require('./infraestrutura/database/conexao');
const Tabela = require('./infraestrutura/database/tabelas');

conexao.connect((erro) => {
    if (erro) {
        console.log(erro);
    } else {
        console.log('Conectado ao banco de dados com sucesso');

        Tabela.init(conexao);
        const app = customExpress();

        app.listen(3000, () => console.log('servidor rodando na porta 3000'));
    }
});
