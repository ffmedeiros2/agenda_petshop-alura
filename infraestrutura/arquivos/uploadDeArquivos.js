const fs = require('fs');
const path = require('path');

module.exports = (caminho, nomeDoArquivo, callback) => {
    const tiposValidos = ['jpg', 'png', 'jpeg'];
    const tipo = path.extname(caminho);
    const isTipoValido = tiposValidos.indexOf(tipo.substring(1)) !== -1;

    if (isTipoValido) {
        const novoCaminho = `./assets/imagens/${nomeDoArquivo}${tipo}`;

        fs.createReadStream(caminho)
            .pipe(fs.createWriteStream(novoCaminho))
            .on('finish', () => callback(false, novoCaminho));
    } else {
        const erro = 'Tipo inválido';
        console.log('Erro! Tipo invalido');
        callback(erro);
    }
};
