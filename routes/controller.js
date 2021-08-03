const db = require('./db.js');
const query = require('./query.js')
const jwt = require('jsonwebtoken')
const SECRET = '@NEEXSA'
// const jsPDF = require('jspdf')
const pdf = require('html-pdf')
const ejs = require('ejs')
const path = require('path');
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const multer = require('multer')
const fs = require('fs')

exports.clientes = async (req, res, next) => {
    try{
        const body = req.body
        const params = {
            nomePesquisa: body.nomePesquisa
        }
        let cql = query.cql.Clientes;
        let result = await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar os cliente'})
    }
}

exports.novoClientes = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            novoNomeCliente: body.novoNomeCliente
        }
        let cql = query.cql.NovoClientes;
        await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({mensagem: 'Cliente salvo com sucesso'})
    }catch (e){
        res.status(500).send({message: 'Não foi possivel fazer cadastro'})
    }
}

exports.deleteClientes = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            nomeCliente: body.nomeCliente
        }
        let cql = ''
        cql = query.cql.VerificarProjetos
        let verificarProjetos = await db.neo4j.executeCypherAsync(cql, params)

        if (verificarProjetos.length > 0) {
            res.status(200).send({projeto: verificarProjetos, mensagem: 'Esse cliente possui projetos ativos'})
        } else {
            cql = query.cql.DeleteCliente
            await db.neo4j.executeCypherAsync(cql, params)
            res.status(200).send({projeto: 0, mensagem: 'Cliente deletado com sucesso'})
        }

    }catch (e){
        res.status(500).send({message: 'Não foi possivel excluir o cliente'})
    }
}

exports.alterarStatusCliente = async (req, res, next) => {
    try {
        let body = req.body
        let params = {
            nomeCliente: body.nomeCliente,
            status: body.status
        }
        let cql = ''
        if (body.status === false) {
            cql = query.cql.VerificarProjetos
            let verificarProjetos = await db.neo4j.executeCypherAsync(cql, params)
            if (verificarProjetos.length > 0) {
                res.status(200).send({projeto: verificarProjetos, mensagem: 'Esse cliente possui projetos ativos'})
            } else {
                cql = query.cql.AlterarStatusCliente
                await db.neo4j.executeCypherAsync(cql, params)
                res.status(200).send({projeto: 0, mensagem: 'Status do cliente alterado com sucesso'})
            }
        } else {
            cql = query.cql.AlterarStatusCliente
                await db.neo4j.executeCypherAsync(cql, params)
                res.status(200).send({projeto: 0, mensagem: 'Status do cliente alterado com sucesso'})
        }
    } catch (err) {
        res.status(500).send({message: 'Não foi possivel alterar o status'})
    }
}

exports.projetos = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            nomeCliente: body.nomeCliente,
            dataInicio: body.dataInicio,
            textoPesquisar: body.textoPesquisar
        }
        let cql = query.cql.Projetos;
        let result = await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar os projetos'})
    }
}

exports.novoProjeto = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            nomeCliente: body.nomeCliente,
            novoNomeProjeto: body.novoNomeProjeto,
            dataInicio: body.dataInicio
        }
        let cql = query.cql.NovoProjeto;
        await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({mensagem: 'Projeto salvo com sucesso'})
    }catch (e){
        res.status(500).send({message: 'Não foi possivel fazer cadastro do projeto'})
    }
}

exports.alterarStatusProjeto = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            nomeCliente: body.nomeCliente,
            nomeProjeto: body.nomeProjeto,
            status: body.status
        }
        let cql = ''
        if (body.status === false) {
            cql = query.cql.VerificarCliente
            let verificarCliente = await db.neo4j.executeCypherAsync(cql, params)
            if (verificarCliente.length > 0) {
                res.status(200).send({cliente: verificarCliente, mensagem: 'Cliente Ativo'})
            } else {
                cql = query.cql.PausarProjeto;
                await db.neo4j.executeCypherAsync(cql, params)
                res.status(200).send({cliente: 0, mensagem: 'Status do projeto alterado com sucesso'})
            }
        } else {
            cql = query.cql.PausarProjeto;
            await db.neo4j.executeCypherAsync(cql, params)
            res.status(200).send({cliente: 0, mensagem: 'Status do projeto alterado com sucesso'})
        }
    }catch (e){
        res.status(500).send({message: 'Não foi possivel alterar o status do projeto'})
    }
}

exports.rdos = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            dataInicio: body.dataInicio ? body.dataInicio : null,
            textoPesquisar: body.textoPesquisar ? body.textoPesquisar : '',
            nomeCliente: body.nomeCliente ? body.nomeCliente : '',
            nomeProjetos: body.nomeProjetos ? body.nomeProjetos : ''
        }
        let cql = query.cql.Rdos;
        let result = await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar as RDOs'})
    }
}

exports.novoRdo = async (req, res, next) => {
    try{
        let body = req.body
        let cql = ''

        let tipo = body.tipo

        let params = {
            nomeCliente: body.nomeCliente,
            nomeProjetos: body.nomeProjetos,
            dateInicio: body.dataIDRDO,
            idRDO: body.dataIDRDO,
            areaAtuacao: body.areaAtuacao,
            cartaChamada: body.cartaChamada,
            nomeFiscal: body.nomeFiscal,
            nomeEncarregado: body.nomeEncarregado,
            condicaoManha: body.condicaoManha,
            condicaoTarde: body.condicaoTarde,
            condicaoNoite: body.condicaoNoite,
            prazoAtividade: body.prazoAtividade,
            diasDecorridos: body.diasDecorridos,
            prorrogacao: body.prorrogacao,
            diasRestantes: body.diasRestantes,
            diasDeAtrazos: body.diasDeAtrazos,
            opcoesDDS: body.opcoesDDS,
            opcoesPrejuizo: body.opcoesPrejuizo,
            opcoesViolacao: body.opcoesViolacao,
            opcoesOciosidade: body.opcoesOciosidade,
            servico: body.servico,
            inicioReal: body.inicioReal,
            terminoReal: body.terminoReal,
            inicioPrevisto: body.inicioPrevisto,
            terminoPrevisto: body.terminoPrevisto,
            comentarios: body.comentarios,
            status: tipo === 'salvar' ? 'Criado' : 'Enviado',
            dataCriacao: body.dataCriacao,
            dataFinalizado: body.dataFinalizado,
            sequencial: body.sequencial
        }
        cql = query.cql.NovoRdo;
        await db.neo4j.executeCypherAsync(cql, params)

        let efetivoArray = body.efetivos
        for (const item of efetivoArray ) {

            item.nomeProjetos = body.nomeProjetos
            item.idRDO = body.dataIDRDO

            try {
                cql = query.cql.NovoRdoEfetivos;
                await db.neo4j.executeCypherAsync(cql, item)
            } catch (err) {
                console.log(err)
            }
        }

        let atividadeArray = body.atividades
        for (const item of atividadeArray ) {

            item.nomeProjetos = body.nomeProjetos
            item.idRDO = body.dataIDRDO

            try {
                cql = query.cql.NovoRdoAtividade;
                await db.neo4j.executeCypherAsync(cql, item)
            } catch (err) {
                console.log(err)
            }
        }


        res.status(200).send({mensagem: 'RDO salvo com sucesso'})
    }catch (e){
        res.status(500).send({message: 'Não foi possivel fazer cadastro do RDO'})
    }
}

exports.editarRdo = async (req, res, next) => {
    try{
        let body = req.body
        let cql = ''

        let tipo = body.tipo
        let nomeFiscalSplit = body.nomeFiscal ? body.nomeFiscal.split('-') : ''
        body.nomeFiscalSplit = nomeFiscalSplit ? nomeFiscalSplit[1].trim() : ''
        let nomeEncarregadoSplit = body.nomeEncarregado ? body.nomeEncarregado.split('-') : ''
        body.nomeEncarregadoSplit = nomeEncarregadoSplit ? nomeEncarregadoSplit[1].trim() : ''

        let params = {
            nomeCliente: body.nomeCliente,
            nomeProjetos: body.nomeProjetos,
            dateInicio: body.dataIDRDO,
            idRDO: body.dataIDRDO,
            areaAtuacao: body.areaAtuacao,
            cartaChamada: body.cartaChamada,
            nomeFiscal: body.nomeFiscal,
            nomeEncarregado: body.nomeEncarregado,
            condicaoManha: body.condicaoManha,
            condicaoTarde: body.condicaoTarde,
            condicaoNoite: body.condicaoNoite,
            prazoAtividade: body.prazoAtividade,
            diasDecorridos: body.diasDecorridos,
            prorrogacao: body.prorrogacao,
            diasRestantes: body.diasRestantes,
            diasDeAtrazos: body.diasDeAtrazos,
            opcoesDDS: body.opcoesDDS,
            opcoesPrejuizo: body.opcoesPrejuizo,
            opcoesViolacao: body.opcoesViolacao,
            opcoesOciosidade: body.opcoesOciosidade,
            servico: body.servico,
            inicioReal: body.inicioReal,
            terminoReal: body.terminoReal,
            inicioPrevisto: body.inicioPrevisto,
            terminoPrevisto: body.terminoPrevisto,
            comentarios: body.comentarios,
            status: tipo === 'salvar' ? 'Criado' : tipo === 'finalizar' ? 'Enviado' : 'Assinado',
            dataCriacao: body.dataCriacao,
            dataFinalizado: body.dataFinalizado,
            sequencial: body.sequencial,
            comentariosContratante: body.comentariosContratante
        }
        cql = query.cql.EditarRdo;
        await db.neo4j.executeCypherAsync(cql, params)

        cql = query.cql.DeleteRdoEfetivos;
        await db.neo4j.executeCypherAsync(cql, params)

        cql = query.cql.DeleteRdoAtividade;
        await db.neo4j.executeCypherAsync(cql, params)

        let efetivoArray = body.efetivos
        for (const item of efetivoArray ) {

            item.nomeProjetos = body.nomeProjetos
            item.idRDO = body.dataIDRDO

            try {

                cql = query.cql.NovoRdoEfetivos;
                await db.neo4j.executeCypherAsync(cql, item)
            } catch (err) {
                console.log(err)
            }
        }

        let atividadeArray = body.atividades
        for (const item of atividadeArray ) {

            item.nomeProjetos = body.nomeProjetos
            item.idRDO = body.dataIDRDO

            try {
                cql = query.cql.NovoRdoAtividade;
                await db.neo4j.executeCypherAsync(cql, item)
            } catch (err) {
                console.log(err)
            }
        }

        // if (tipo === 'assinar') {
        if (tipo) {

            const filePath = path.join(__dirname, "pdf.ejs")
    
            aws.config.update({
                accessKeyId: 'AKIA3W7SB22BQZO67YLE',
                secretAccessKey: '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',
                region: 'sa-east-1'
            })
    
            const s3 = new aws.S3();
    
            await ejs.renderFile(filePath, {body}, (err, html) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(html)
                    pdf.create(html,{
                        "format": "A4",
                        "orientation": "portrait"
                    }).toStream(function(err, stream){
                        console.log(stream)
                        if (err) return res.status(500).send(err)
                        // stream.pipe(fs.createWriteStream(`${body.dataIDRDO}.pdf`));

                        const params = {
                            s3,
                            Bucket: 'neexsa-htg-pdfs',
                            acl: 'public-read',
                            Key: `${body.dataIDRDO}.pdf`,
                            Body: stream,
                            ContentType: 'application/pdf',
                        };

                        var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
                        
                        s3.upload(params, options, (err, res) => {
                            if (err) {
                                console.log(err, 'err');
                            }
                            console.log(res, 'res');
                        });
                    }) 
                }
            })
        }

        res.status(200).send({mensagem: 'RDO salvo com sucesso'})
    }catch (e){
        res.status(500).send({message: 'Não foi possivel fazer cadastro do RDO'})
    }
}

exports.rdoDoDia = async (req, res, next) => {
    try {
        let body = req.body
        let params = {
            dataHora: body.dataHora
        }
        let cql = query.cql.RdoDoDia
        let resultRdo = await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({resultRdo})
    } catch (err) {
        res.status(500).send({ mensagem: 'Não foi possivel buscar os dados' })
    }
}

exports.dominioClientes = async (req, res, next) => {
    try {
        let cql = query.cql.DominioClientes;
        let result = await db.neo4j.executeCypherAsync(cql)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar os Clientes'})
    }
}

exports.dominioClientesAtivos = async (req, res, next) => {
    try {
        let cql = query.cql.DominioClientesAtivos
        let result = await db.neo4j.executeCypherAsync(cql)
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send({resposta: err, message: 'Não foi possivel buscar os Clientes'})
    }
}

exports.dominioProjetosClientes = async (req, res, next) => {
    try {
        let cql = query.cql.DominioProjetosClientes;
        let result = await db.neo4j.executeCypherAsync(cql)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar os Projetos'})
    }
}

exports.dominioColaboradores = async (req, res, next) => {
    try{
        let cql = query.cql.DominioColaboradores;
        let result = await db.neo4j.executeCypherAsync(cql)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar os Colaboradores'})
    }
}
exports.dominioFuncao = async (req, res, next) => {
    try{
        let cql = query.cql.DominioFuncao;
        let result = await db.neo4j.executeCypherAsync(cql)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar as Funções'})
    }
}

exports.dominioPermissao = async (req, res, next) => {
    try{
        let cql = query.cql.DominioPermissao;
        let result = await db.neo4j.executeCypherAsync(cql)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar as Funções'})
    }
}

exports.novoColaboradores = async (req, res, next) => {
    try {
        let body = req.body
        let params = {
            colaborador: {
                reg: body.reg,
                dataCriacao: body.dataCriacao,
                nome: body.nomeColaborador,
                email: body.emailColaborador,
                telefone: body.telefoneColaborador,
                cpf: body.cpfColaborador,
                funcao: body.funcaoColaborador,
                status: 'ativo'
            }
        }
        let cql = query.cql.VerificarColaborador
        let qtd = await db.neo4j.executeCypherAsync(cql, params)
        if (qtd > 0) {
            res.status(200).send({qtd: qtd, mensagem: 'Nome Existente' })
        } else {
            let cql = query.cql.NovoColaborador
            await db.neo4j.executeCypherAsync(cql, params)
            res.status(200).send({ mensagem: 'Salvo com sucesso' })
        } 
    } catch (err) {
        res.status(500).send({ mensagem: 'Não foi possivel salvar' })
    }
}

exports.editarColaboradores = async (req, res, next) => {
    try {
        let body = req.body
        let params = {
            colaborador: {
                reg: body.reg,
                dataCriacao: body.dataCriacao,
                nome: body.nomeColaborador,
                email: body.emailColaborador,
                telefone: body.telefoneColaborador,
                cpf: body.cpfColaborador,
                funcao: body.funcaoColaborador
            }
        }
        let cql = query.cql.EditarColaborador
        await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({ mensagem: 'Salvo com sucesso' })
    } catch (err) {
        res.status(500).send({ mensagem: 'Não foi possivel salvar' })
    }
}

exports.alterarStatusColaboradores = async (req, res, next) => {
    try {
        let body = req.body
        let params = {
            colaborador: {
                reg: body.reg,
                dataCriacao: body.dataCriacao,
                nome: body.nomeColaborador,
                email: body.emailColaborador,
                telefone: body.telefoneColaborador,
                cpf: body.cpfColaborador,
                funcao: body.funcaoColaborador,
                status: body.status
            }
        }
        let cql = query.cql.AlterarStatusColaborador
        await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({ mensagem: 'Status alterado com sucesso' })
    } catch (err) {
        res.status(500).send({ mensagem: 'Não foi possivel alterar o status' })
    }
}

exports.gerarPdf = async (req, res, next) => {

    let body = req.body

    const filePath = path.join(__dirname, "pdf.ejs")

    aws.config.update({
        accessKeyId: 'AKIA3W7SB22BQZO67YLE',
        secretAccessKey: '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',
        region: 'sa-east-1'
    })

    const s3 = new aws.S3();


    ejs.renderFile(filePath, {body}, (err, html) => {
        if (err) {
            console.log(err)
        } else {
            console.log(html)

            pdf.create(html,{}).toStream(function(err, stream){
                stream.pipe(fs.createWriteStream(`${body.dataIDRDO}.pdf`));
                const params = {
                    s3,
                    Bucket: 'neexsa-htg-pdfs',
                    acl: 'public-read',
                    Key: `${body.dataIDRDO}.pdf`,
                    Body: stream,
                    ContentType: 'application/pdf',
                };
                s3.upload(params, (err, res) => {
                    if (err) {
                        console.log(err, 'err');
                    }
                    console.log(res, 'res');
                });
            }) 
        }
    })
    


    /* ejs.renderFile(filePath, {body}, (err, html) => {
            if (err) {
                console.log(err)
            } else {
                console.log(html)

                pdf.create(html,{}).toFile(`./pdf/${body.dataIDRDO}.pdf`,(err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(res)
                    }
                }) 
            }
    }) */
}

exports.awsPdf = async (req, res, next) => {

    const id = req.body.id

    console.log(`${id}.pdf`)

    const s3 = new aws.S3()
    aws.config.update({accessKeyId: 'AKIA3W7SB22BQZO67YLE', secretAccessKey: 'lPY0lCW15ozjlKKymG8yCx02lU3TPK3Ngan8srIW'})

    const myBucket = 'neexsa-htg-pdfs'
    const myKey = `${id}.pdf`
    const signedUrlExpireSeconds = 60 * 5 // your expiry time in seconds.

    const url = s3.getSignedUrl('getObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds
       })

    res.send(url)
    
}

exports.awsPdfFinalizado = async (req, res, next) => {
    const id = req.body.id

    console.log(`RdosFinalizados/${id}.pdf`)

    const s3 = new aws.S3()
    aws.config.update({accessKeyId: 'AKIA3W7SB22BQZO67YLE', secretAccessKey: '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'})

    const myBucket = 'neexsa-htg-pdfs-finalizados'
    const myKey = `${id}.pdf`
    const signedUrlExpireSeconds = 60 * 5 // your expiry time in seconds.

    const url = s3.getSignedUrl('getObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds
       })

    res.send(url)
}

exports.colaboradores = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            textoPesquisar: body.textoPesquisar ? body.textoPesquisar : '',
            status: body.status
        }
        let cql = query.cql.Colaboradores;
        let result = await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar os Colaboradores'})
    }
}

exports.funcao = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            textoPesquisar: body.textoPesquisar ? body.textoPesquisar : ''
        }
        let cql = query.cql.Funcao;
        let result = await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar as Funções'})
    }
}

exports.novaFuncao = async (req, res, next) => {
    try{
        let body = req.body
        let cql = ''
        let params = {
            novoNomeFuncao: body.novoNomeFuncao ? body.novoNomeFuncao : ''
        }
        cql = query.cql.VerificarFuncao;
        let qtd = await db.neo4j.executeCypherAsync(cql, params)
        if (qtd > 0) {
            res.status(200).send({qtd: qtd, mensagem: 'Função já existente'})
        } else {
            cql = query.cql.NovaFuncao;
            await db.neo4j.executeCypherAsync(cql, params)
            res.status(200).send({mensagem: 'Salvo com sucesso'})
        }
    }catch (e){
        res.status(500).send({resposta: e, mensagem: 'Não foi possivel salvar'})
    }
}

exports.deleteFuncao = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            nomeFuncao: body.nomeFuncao.nome ? body.nomeFuncao.nome : ''
        }
        let cql = query.cql.DeletarFuncao;
        await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({mensagem: 'Deletado com sucesso'})
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel deletar a Função'})
    }
}

exports.rdosUser = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            dataInicio: body.dataInicio ? body.dataInicio : null,
            textoPesquisar: body.textoPesquisar ? body.textoPesquisar : '',
            nomeCliente: body.nomeCliente ? body.nomeCliente : '',
            nomeProjetos: body.nomeProjetos ? body.nomeProjetos : '',
            nomeUser: body.nomeUser ? body.nomeUser : ''
        }
        let cql = query.cql.RdosUser;
        let result = await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar as RDOs'})
    }
}

exports.uploadPdf = async (req, res, next) => {
    try {
        const pdf = req.files
        const name = req.nome
        console.log(pdf, name)
    } catch (err) {
        console.log(err)
    }
}

exports.finalizarRDO = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            idRDO: body.idRDO,
            status: body.status,
            dataFinalizado: body.dataFinalizado
        }
        let cql = query.cql.FinalizarRDO;
        await db.neo4j.executeCypherAsync(cql, params)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar as RDOs'})
    }
}

exports.getSenha = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            nomeUser: body.nomeUser,
            emailUser: body.emailUser
        }
        let cql = query.cql.GetSenha;
        let senha = await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({senha})
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar a Senha'})
    }
}

exports.novaSenha = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            nomeUser: body.nomeUser,
            emailUser: body.emailUser,
            novaSenha: body.novaSenha
        }
        let cql = query.cql.NovaSenha;
        await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({ message: 'Senha salva!!!'})
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar as RDOs'})
    }
}

exports.criarAcesso= async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            cpf: body.cpf,
            email: body.email,
            nome: body.nome
        }
        let cql = query.cql.CriarAcesso;
        await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({ message: 'Senha salva!!!'})
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar as RDOs'})
    }
}

exports.userColaboradores = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            textoPesquisar: body.textoPesquisar ? body.textoPesquisar : '',
            status: body.status
        }
        let cql = query.cql.UserColaboradores;
        let result = await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar os Colaboradores'})
    }
}

exports.getUser = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            textoPesquisar: body.textoPesquisar ? body.textoPesquisar : ''
        }
        let cql = query.cql.GetUser;
        let result = await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send(result)
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel buscar os Colaboradores'})
    }
}

exports.setPermissao = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            email: body.email,
            permissoes: body.permissoes
        }
        let cql = query.cql.SetPermissao;
        await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({message: 'Permissões salvas'})
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel salvar as Permissoes'})
    }
}

exports.newPermissao = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            novaPermissao: body.novaPermissao
        }
        let cql = query.cql.NewPermissao;
        await db.neo4j.executeCypherAsync(cql, params)
        res.status(200).send({message: 'Permissões salvas'})
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel salvar as Permissoes'})
    }
}

exports.getSeguenciaRdo = async (req, res, next) => {
    try{
        let body = req.body
        let params = {
            nomeCliente: body.nomeCliente,
            nomeProjetos: body.nomeProjetos
        }
        let cql = query.cql.GetSeguenciaRdo;
        let seguencia = await db.neo4j.executeCypherAsync(cql, params)
        let numSeg = 0
        if (seguencia > 0) {
            numSeg = seguencia + 1
            res.status(200).send({numSeguencia: numSeg})
        } else {
            numSeg = 1
            res.status(200).send({numSeguencia: numSeg})
        }
    }catch (e){
        res.status(500).send({resposta: e, message: 'Não foi possivel salvar as Permissoes'})
    }
}

exports.assinaturaAws = async (req, res, next) => {

    const idFiscal = req.body.idFiscal

    // console.log(`RdosFinalizados/${id}.pdf`)

    const s3 = new aws.S3()
    aws.config.update({accessKeyId: 'AKIA3W7SB22BQZO67YLE', secretAccessKey: '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'})

    const myBucket = 'neexsa-htg-pdfs-finalizados'
    const myKey = `${idFiscal}.pdf`
    // const myKey = 'assinatura.jpg'
    const signedUrlExpireSeconds = 60 * 5 // your expiry time in seconds.

    const url = s3.getSignedUrl('getObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds
       })

    res.send(url)
    
}

exports.assinaturaUserAws = async (req, res, next) => {

    try {
        let body = req.body
        let params = {
            emailFiscal: body.emailFiscal
        }
        let cql = query.cql.GetIdFiscal;
        let id = await db.neo4j.executeCypherAsync(cql, params)


        const idFiscal = id
    

        const s3 = new aws.S3()
        aws.config.update({accessKeyId: 'AKIA3W7SB22BQZO67YLE', secretAccessKey: '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'})
    
        const myBucket = 'neexsa-htg-pdfs-finalizados'
        const myKey = `${idFiscal}.pdf`
        // const myKey = 'assinatura.jpg'
        const signedUrlExpireSeconds = 60 * 5 // your expiry time in seconds.
    
        const url = s3.getSignedUrl('getObject', {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds
           })
    
        res.send({url, id})
    } catch (err) {

    }

    
}

exports.testePdf = async (req, res, next) => {

    const filePath = path.join(__dirname, "pdf.ejs")
    
    aws.config.update({
        accessKeyId: 'AKIA3W7SB22BQZO67YLE',
        secretAccessKey: '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',
        region: 'sa-east-1'
    })

    const s3 = new aws.S3();


    ejs.renderFile(filePath, (err, html) => {
        if (err) {
            console.log(err)
        } else {
            console.log(html)

            pdf.create(html,{
                format: "A4"
            }).toStream(function(err, stream){
                if (err) return res.status(500).send(err)
                // stream.pipe(fs.createWriteStream(`${body.dataIDRDO}.pdf`));
                const params = {
                    s3,
                    Bucket: 'neexsa-htg-pdfs',
                    acl: 'public-read',
                    Key: `teste.pdf`,
                    Body: stream,
                    ContentType: 'application/pdf',
                };
                s3.upload(params, (err, res) => {
                    if (err) {
                        console.log(err, 'err');
                    }
                    console.log(res, 'res');
                });
            }) 
        }
    })

}
    