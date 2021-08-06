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
router.post('/editar-projeto', controller.editarProjeto)
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
router.get('/dominio/permissao', controller.dominioPermissao)

router.post('/aws-pdf', controller.awsPdf)
router.post('/aws-pdf-finalizado', controller.awsPdfFinalizado)
router.post('/aws-assinatura', controller.assinaturaAws)
router.post('/aws-assinatura-user', controller.assinaturaUserAws)

router.post('/rdos-user', controller.rdosUser)
router.post('/upload-pdf', controller.uploadPdf)
router.post('/finalizar-rdo', controller.finalizarRDO)

router.post('/get-senha', controller.getSenha)
router.post('/nova-senha', controller.novaSenha)
router.post('/criar-acesso', controller.criarAcesso)
router.post('/user-colaboradores', controller.userColaboradores)

router.post('/get-user', controller.getUser)
router.post('/set-permissao', controller.setPermissao)
router.post('/new-permissao', controller.newPermissao)

router.post('/get-info-rdo', controller.getSeguenciaRdo)

router.get('/teste-pdf', controller.testePdf)
module.exports = router;