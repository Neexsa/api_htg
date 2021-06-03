const express = require('express');
const router = express.Router();
var controller = require("./controller");

router.get('/', async function (req, res, next) {
    res.status(200).send("Root Response from :4040/api_htg")
    return 700000;
})

router.post('/clientes', controller.clientes)
router.post('/novo-clientes', controller.novoClientes)

router.post('/projetos', controller.projetos)
router.post('/novo-projeto', controller.novoProjeto)
router.post('/alterar-status-projeto', controller.alterarStatusProjeto)

router.post('/rdos', controller.rdos)
router.post('/novo-rdo', controller.novoRdo)
router.post('/rdo-do-dia', controller.rdoDoDia)

router.get('/dominio/clientes', controller.dominioClientes)
router.get('/dominio/projetosClientes', controller.dominioProjetosClientes)
router.get('/dominio/colaboradores', controller.colaboradores)

router.post('/gerar-pdf', controller.gerarPdf)
router.post('/aws-pdf', controller.awsPdf)
module.exports = router;