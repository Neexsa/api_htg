const express = require('express');
const router = express.Router();
var controller = require("./controller");

router.get('/', async function (req, res, next) {
    res.status(200).send("Root Response from :4040/api_htg")
    return 700000;
})

router.post('/clientes', controller.clientes)
router.post('/novo-clientes', controller.novoClientes)
router.post('/delete-clientes', controller.deleteClientes)
router.post('/alterar-status-clientes', controller.alterarStatusCliente)

router.post('/projetos', controller.projetos)
router.post('/novo-projeto', controller.novoProjeto)
router.post('/alterar-status-projeto', controller.alterarStatusProjeto)

router.post('/rdos', controller.rdos)
router.post('/novo-rdo', controller.novoRdo)
router.post('/editar-rdo', controller.editarRdo)
router.post('/rdo-do-dia', controller.rdoDoDia)

router.post('/colaboradores', controller.colaboradores)
router.post('/novo-colaborador', controller.novoColaboradores)
router.post('/editar-colaborador', controller.editarColaboradores)
router.post('/alterar-status-colaborador', controller.alterarStatusColaboradores)

router.post('/funcao', controller.funcao)
router.post('/nova-funcao', controller.novaFuncao)
router.post('/delete-funcao', controller.deleteFuncao)

router.get('/dominio/clientes', controller.dominioClientes)
router.get('/dominio/clientes-ativos', controller.dominioClientesAtivos)
router.get('/dominio/projetos-clientes', controller.dominioProjetosClientes)
router.get('/dominio/colaboradores', controller.dominioColaboradores)
router.get('/dominio/funcao', controller.dominioFuncao)

router.post('/aws-pdf', controller.awsPdf)
module.exports = router;