const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/licenca', (req, res) => {
    const conta = req.query.conta;
    const chave = req.query.chave;
    
    console.log(`📡 Requisição: conta=${conta}, chave=${chave}`);
    
    const contas_autorizadas = {
        "531275325": "ABC123-XYZ789"
    };
    
    if (!conta || !chave) {
        return res.json({ valido: false, erro: 'Faltam parâmetros' });
    }
    
    if (contas_autorizadas[conta] === chave) {
        res.json({ valido: true, conta: conta });
    } else {
        res.json({ valido: false, erro: 'Licença inválida' });
    }
});

app.get('/', (req, res) => {
    res.json({ status: 'API de Licenças funcionando!' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
