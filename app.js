const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// ============================================
// 🔥 BANCO DE DADOS DE LICENÇAS (ASSINATURA MENSAL)
// ============================================
const licencas = {
    // CONTA: { chave, plano, expiracao, corretora }
    "531275325": {
        chave: "ABC123-XYZ789",
        plano: "anual",
        expiracao: "2026-12-31",
        corretora: "FTMO"
    },
    // Exemplo de cliente mensal
    "12345678": {
        chave: "CLIENTE123",
        plano: "mensal",
        expiracao: "2026-06-30",
        corretora: "MetaTrader"
    }
};

// ============================================
// 📅 FUNÇÃO PARA VERIFICAR EXPIRAÇÃO
// ============================================
function estaExpirado(dataExpiracao) {
    const hoje = new Date();
    const expiracao = new Date(dataExpiracao);
    return hoje > expiracao;
}

// ============================================
// ✅ ROTA DE VALIDAÇÃO
// ============================================
app.get('/licenca', (req, res) => {
    const conta = req.query.conta;
    const chave = req.query.chave;
    const corretora = req.query.corretora || 'desconhecida';
    
    console.log(`📡 Requisição: conta=${conta}, chave=${chave}, corretora=${corretora}`);
    
    if (!conta || !chave) {
        return res.json({ 
            valido: false, 
            erro: 'Faltam parâmetros' 
        });
    }
    
    const licenca = licencas[conta];
    
    // Verificar se conta existe
    if (!licenca) {
        return res.json({ 
            valido: false, 
            erro: 'Conta não cadastrada' 
        });
    }
    
    // Verificar chave
    if (licenca.chave !== chave) {
        return res.json({ 
            valido: false, 
            erro: 'Chave inválida' 
        });
    }
    
    // Verificar expiração
    if (estaExpirado(licenca.expiracao)) {
        return res.json({ 
            valido: false, 
            erro: 'Assinatura expirada. Renove em contato@seuemail.com' 
        });
    }
    
    // Calcular dias restantes
    const hoje = new Date();
    const expiracao = new Date(licenca.expiracao);
    const diasRestantes = Math.ceil((expiracao - hoje) / (1000 * 60 * 60 * 24));
    
    // Sucesso!
    res.json({ 
        valido: true, 
        conta: conta,
        plano: licenca.plano,
        expiracao: licenca.expiracao,
        dias_restantes: diasRestantes,
        corretora: licenca.corretora
    });
});

// Rota de teste
app.get('/', (req, res) => {
    res.json({ 
        status: 'API de Licenças Ativa',
        versao: '1.0'
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
