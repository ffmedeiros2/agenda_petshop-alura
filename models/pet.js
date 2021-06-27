const conexao = require('../infraestrutura/database/conexao');
const uploadDeArquivos = require('../infraestrutura/arquivos/uploadDeArquivos');

class Pet {
    adiciona(pet, res) {
        uploadDeArquivos(pet.imagem, pet.nome, (erro, imagem) => {
            if (erro) {
                res.status(400).json({ erro });
            } else {
                const query = 'INSERT INTO Pets SET ?';

                const novoPet = { ...pet, imagem };
                conexao.query(query, novoPet, (erro) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        res.status(201).json(novoPet);
                    }
                });
            }
        });
    }
}

module.exports = new Pet();
