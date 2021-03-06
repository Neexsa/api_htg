exports.cql = {
    Clientes: `
        MATCH (c:Cliente)
        WHERE toUpper(c.nome) CONTAINS toUpper($nomePesquisa)
        OPTIONAL MATCH (c)<-[:PROJETO_DA]-(p:Projeto)
        WITH count(p) as qtd, c
        OPTIONAL MATCH (c)<-[:PROJETO_DA]-(p)
        WHERE p.pausado = true
        WITH count(p) as qtdPausado, qtd, c
        RETURN collect({cliente: c{.*},
            quantidadeProjetosAtivos: toFloat((qtd - qtdPausado)),
            quantidadeProjetosPausados: toFloat(qtdPausado)
        })
    `,

    NovoClientes:`
        MERGE (c:Cliente {nome: $novoNomeCliente})
        SET c.ativo = true
    `,

    VerificarProjetos: `
        WITH $nomeCliente as pNomeCliente
        MATCH (c:Cliente)<-[:PROJETO_DA]-(p:Projeto)
        WHERE c.nome = pNomeCliente AND p.ativo = true AND p.pausado = false
        RETURN collect(p.nome)
    `,

    DeleteCliente: `
        WITH $nomeCliente as pNomeCliente
        MATCH (c:Cliente)
        WHERE c.nome = pNomeCliente
        DETACH DELETE c
    `,

    AlterarStatusCliente: `
        WITH $nomeCliente as pNomeCliente, $status as pStatus
        MATCH (c:Cliente)
        WHERE c.nome = pNomeCliente
        SET c.ativo = pStatus
    `,

    VerificarNomeProjeto: `
        WITH $dados AS pDados
        MATCH (c:Cliente)<-[:PROJETO_DA]-(p:Projeto)
        WHERE c.nome = pDados.nomeCliente AND toUpper(p.nome) = toUpper(pDados.novoNomeProjeto)
        RETURN collect(p.nome)
    `,

    NovoProjeto: `
        WITH $dados AS pDados
        MERGE (:Projeto 
            {
                nome: pDados.novoNomeProjeto, 
                dataInicio: pDados.dataInicio, 
                dataFim: pDados.dataFim, 
                ativo: true, 
                pausado: false,
                idProjeto: pDados.idProjeto,
                prorrogacao: pDados.prorrogacao,
                atividadesProjeto: pDados.atividadesProjeto
            })
        WITH pDados
        MATCH (c:Cliente), (p:Projeto)
        WHERE c.nome = pDados.nomeCliente AND p.nome = pDados.novoNomeProjeto
        CREATE (c)<-[:PROJETO_DA]-(p)
    `,

    NovasAtividadesProjeto: `
        WITH $dados AS pDados, $dadosObj AS pDadosObj
        MATCH (c:Cliente)<-[:PROJETO_DA]-(p:Projeto)
        WHERE c.nome = pDados.nomeCliente AND p.nome = pDados.novoNomeProjeto
        WITH pDadosObj, p

        CREATE (a:AtividadesProjeto {
            descricao: pDadosObj.descricao,
            item: pDadosObj.item,
            qtdCont: pDadosObj.qtdCont,
            totalMed: pDadosObj.totalMed,
            unidade: pDadosObj.unidade,
            valorUnit: pDadosObj.valorUnit,
            atividade: pDadosObj.atividade
        })

        WITH p, a
        CREATE (p)<-[:ATIVIDADE_DO]-(a)
    `,

    EditarProjeto: `
        WITH $dados AS pDados
        MATCH (c:Cliente)<-[:PROJETO_DA]-(p:Projeto)
        WHERE c.nome = pDados.nomeCliente AND p.nome = pDados.novoNomeProjeto
        SET p.nome = pDados.novoNomeProjeto, 
            p.dataInicio = pDados.dataInicio, 
            p.dataFim = pDados.dataFim,
            p.idProjeto = pDados.idProjeto,
            p.prorrogacao = pDados.prorrogacao,
            p.atividadesProjeto = pDados.atividadesProjeto
    `,

    DeleteAtividadesProjeto: `
        WITH $dados AS pDados
        MATCH (c:Cliente)<-[:PROJETO_DA]-(p:Projeto)<-[:ATIVIDADE_DO]-(a:AtividadesProjeto)
        WHERE c.nome = pDados.nomeCliente AND p.nome = pDados.novoNomeProjeto
        DETACH DELETE a
    `,

    Projetos: `
        WITH $nomeCliente AS pNomeCliente, 
        coalesce($dataInicio, -30599326412000) AS pDataInicio,
        coalesce($textoPesquisar, '') AS pTextoPesquisa

        MATCH (c:Cliente)<-[:PROJETO_DA]-(p:Projeto)
        WHERE c.nome CONTAINS pNomeCliente AND p.dataInicio >= pDataInicio AND p.nome CONTAINS pTextoPesquisa

        OPTIONAL MATCH (p)-[:ATIVIDADE_DO]-(a:AtividadesProjeto)

        WITH collect(a{.*}) AS atividadesProjeto, p, c
        RETURN collect(p{.*, 
            idProjeto: toFloat(p.idProjeto), 
            dataInicioInter: toFloat(p.dataInicio), 
            dataFimInter: toFloat(p.dataFim), 
            cliente: c.nome,
            atividades: atividadesProjeto
        }) as projetos
    `,

    VerificarCliente: `
        MATCH (c:Cliente)   
        WHERE c.nome = $nomeCliente AND c.ativo = false
        RETURN collect(c.nome)
    `,

    PausarProjeto: `
        MATCH (c:Cliente)<-[:PROJETO_DA]-(p:Projeto)
        WHERE c.nome = $nomeCliente AND p.nome = $nomeProjeto
        SET p.pausado = $status
    `,

    Rdos: `
        WITH coalesce($dataInicio, -30599326412000) AS pDataInicio,
        $textoPesquisar AS pTextoPesquisar,
        $nomeCliente AS pNomeCliente,
        $nomeProjetos AS pNomeProjetos
        MATCH (r:RDO)
        WHERE r.dataInicio >= pDataInicio 
        AND toUpper(r.cliente) CONTAINS toUpper(pNomeCliente) 
        AND toUpper(r.projeto) CONTAINS toUpper(pNomeProjetos)
        OPTIONAL MATCH (r)<-[:ATIVIDADE_DA]-(a:Atividades)
        WITH r, collect(a{.*}) as atividades
        OPTIONAL MATCH (r)<-[:EFETIVO_DA]-(e:Efetivos)
        WITH r, atividades, collect(e{.*}) as efetivos
        ORDER BY r.id_rdo DESC
        RETURN collect({rdo: r{.*}, atividade: atividades, efetivos: efetivos})
    `,

    NovoRdo: `
        WITH $nomeCliente AS pNomeCliente,
            $nomeProjetos AS pNomeProjetos,
            $dateInicio AS pDateInicio,
            $idRDO AS pIdRDO,
            $areaAtuacao AS pAreaAtuacao,
            $cartaChamada AS pCartaChamada,
            $nomeFiscal AS pNomeFiscal,
            $nomeEncarregado AS pNomeEncarregado,
            $condicaoManha AS pCondicaoManha,
            $condicaoTarde AS pCondicaoTarde,
            $condicaoNoite AS pCondicaoNoite,
            $prazoAtividade AS pPrazoAtividade,
            $diasDecorridos AS pDiasDecorridos,
            $prorrogacao AS pProrrogacao,
            $diasRestantes AS pDiasRestantes,
            $diasDeAtrazos AS pDiasDeAtrazos,
            $opcoesDDS AS pOpcoesDDS,
            $opcoesPrejuizo AS pOpcoesPrejuizo,
            $opcoesViolacao AS pOpcoesViolacao,
            $opcoesOciosidade AS pOpcoesOciosidade,
            $servico AS pServico,
            $inicioReal AS pInicioReal,
            $terminoReal AS pTerminoReal,
            $inicioPrevisto AS pInicioPrevisto,
            $terminoPrevisto AS pTerminoPrevisto,
            $comentarios AS pComentarios,
            $status AS pStatus,
            $dataCriacao AS pDataCriacao,
            $dataFinalizado AS pDataFinalizado,
            $sequencial AS pSequencial

        MERGE (r:RDO {
            cliente: pNomeCliente,
            projeto: pNomeProjetos,
            dataInicio: pDateInicio,
            id_rdo: pIdRDO,
            areaAtuacao: pAreaAtuacao,
            sequencia: pSequencial
        })

        SET r.cartaChamada = pCartaChamada,
        r.nomeFiscal = pNomeFiscal,
        r.nomeEncarregado = pNomeEncarregado,
        r.condicaoManha = pCondicaoManha,
        r.condicaoTarde = pCondicaoTarde,
        r.condicaoNoite = pCondicaoNoite,
        r.prazoAtividade = pPrazoAtividade,
        r.diasDecorridos = pDiasDecorridos,
        r.prorrogacao = pProrrogacao,
        r.diasRestantes = pDiasRestantes,
        r.diasDeAtrazos = pDiasDeAtrazos,
        r.opcoesDDS = pOpcoesDDS,
        r.opcoesPrejuizo = pOpcoesPrejuizo,
        r.opcoesViolacao = pOpcoesViolacao,
        r.opcoesOciosidade = pOpcoesOciosidade,
        r.servico = pServico,
        r.inicioReal = pInicioReal,
        r.terminoReal = pTerminoReal,
        r.inicioPrevisto = pInicioPrevisto,
        r.terminoPrevisto = pTerminoPrevisto,
        r.comentarios = pComentarios,
        r.status = pStatus,
        r.dataCriacao = pDataCriacao,
        r.dataFinalizado = pDataFinalizado


        WITH pNomeCliente, pNomeProjetos, pIdRDO

        MATCH (c:Cliente)<-[:PROJETO_DA]-(p:Projeto), (r:RDO)
        WHERE c.nome = pNomeCliente AND p.nome = pNomeProjetos AND r.id_rdo = pIdRDO

        CREATE (p)<-[:RDO_DA]-(r)
    `,

    EditarRdo: `
        WITH $nomeCliente AS pNomeCliente,
            $nomeProjetos AS pNomeProjetos,
            $dateInicio AS pDateInicio,
            $idRDO AS pIdRDO,
            $areaAtuacao AS pAreaAtuacao,
            $cartaChamada AS pCartaChamada,
            $nomeFiscal AS pNomeFiscal,
            $nomeEncarregado AS pNomeEncarregado,
            $condicaoManha AS pCondicaoManha,
            $condicaoTarde AS pCondicaoTarde,
            $condicaoNoite AS pCondicaoNoite,
            $prazoAtividade AS pPrazoAtividade,
            $diasDecorridos AS pDiasDecorridos,
            $prorrogacao AS pProrrogacao,
            $diasRestantes AS pDiasRestantes,
            $diasDeAtrazos AS pDiasDeAtrazos,
            $opcoesDDS AS pOpcoesDDS,
            $opcoesPrejuizo AS pOpcoesPrejuizo,
            $opcoesViolacao AS pOpcoesViolacao,
            $opcoesOciosidade AS pOpcoesOciosidade,
            $servico AS pServico,
            $inicioReal AS pInicioReal,
            $terminoReal AS pTerminoReal,
            $inicioPrevisto AS pInicioPrevisto,
            $terminoPrevisto AS pTerminoPrevisto,
            $comentarios AS pComentarios,
            $status AS pStatus,
            $dataCriacao AS pDataCriacao,
            $dataFinalizado AS pDataFinalizado,
            $sequencial AS pSequencial,
            $comentariosContratante AS pComentariosContratante

        MATCH (r:RDO)
        WHERE r.id_rdo = pIdRDO 

        SET r.areaAtuacao = pAreaAtuacao,
        r.cartaChamada = pCartaChamada,
        r.nomeFiscal = pNomeFiscal,
        r.nomeEncarregado = pNomeEncarregado,
        r.condicaoManha = pCondicaoManha,
        r.condicaoTarde = pCondicaoTarde,
        r.condicaoNoite = pCondicaoNoite,
        r.prazoAtividade = pPrazoAtividade,
        r.diasDecorridos = pDiasDecorridos,
        r.prorrogacao = pProrrogacao,
        r.diasRestantes = pDiasRestantes,
        r.diasDeAtrazos = pDiasDeAtrazos,
        r.opcoesDDS = pOpcoesDDS,
        r.opcoesPrejuizo = pOpcoesPrejuizo,
        r.opcoesViolacao = pOpcoesViolacao,
        r.opcoesOciosidade = pOpcoesOciosidade,
        r.servico = pServico,
        r.inicioReal = pInicioReal,
        r.terminoReal = pTerminoReal,
        r.inicioPrevisto = pInicioPrevisto,
        r.terminoPrevisto = pTerminoPrevisto,
        r.comentarios = pComentarios,
        r.status = pStatus,
        r.dataCriacao = pDataCriacao,
        r.dataFinalizado = pDataFinalizado,
        r.comentariosContratante = pComentariosContratante
    `,

    NovoRdoEfetivos: `
        WITH $nomeProjetos AS pNomeProjetos,
        $idRDO AS pIdRDO,
        $idEfetivo AS pIdEfetivo,
        $nomeEfetivo AS pNomeEfetivo,
        $funcaoEfetivo AS pFuncaoEfetivo,
        $horaNormalInicio AS pHoraNormalInicio,
        $horaNormalTermino AS pHoraNormalTermino,
        $horaNormalTotal AS pHoraNormalTotal,
        $horaNormalExtraInicio AS pHoraNormalExtraInicio,
        $horaNormalExtraTermino AS pHoraNormalExtraTermino,
        $horaNormalExtraTotal AS pHoraNormalExtraTotal,
        $horaNormalNoturnaInicio AS pHoraNormalNoturnaInicio,
        $horaNormalNoturnaTermino AS pHoraNormalNoturnaTermino,
        $horaNormalNoturnaTotal AS pHoraNormalNoturnaTotal,
        $horaExtraNoturnaInicio AS pHoraExtraNoturnaInicio,
        $horaExtraNoturnaTermino AS pHoraExtraNoturnaTermino,
        $horaExtraNoturnaTotal AS pHoraExtraNoturnaTotal,
        $horaExtraFdsInicio AS pHoraExtraFdsInicio,
        $horaExtraFdsTermino AS pHoraExtraFdsTermino,
        $horaExtraFdsTotal AS pHoraExtraFdsTotal

        MERGE (ef:Efetivos {
            idEfetivo: pIdEfetivo,
            nomeEfetivo: pNomeEfetivo,
            funcaoEfetivo: pFuncaoEfetivo,
            dataHora: pIdRDO
        })

        SET ef.horaNormalInicio = pHoraNormalInicio,
        ef.horaNormalTermino = pHoraNormalTermino,
        ef.horaNormalTotal = pHoraNormalTotal,
        ef.horaNormalExtraInicio = pHoraNormalExtraInicio,
        ef.horaNormalExtraTermino = pHoraNormalExtraTermino,
        ef.horaNormalExtraTotal = pHoraNormalExtraTotal,
        ef.horaNormalNoturnaInicio = pHoraNormalNoturnaInicio,
        ef.horaNormalNoturnaTermino = pHoraNormalNoturnaTermino,
        ef.horaNormalNoturnaTotal = pHoraNormalNoturnaTotal,
        ef.horaExtraNoturnaInicio = pHoraExtraNoturnaInicio,
        ef.horaExtraNoturnaTermino = pHoraExtraNoturnaTermino,
        ef.horaExtraNoturnaTotal = pHoraExtraNoturnaTotal,
        ef.horaExtraFdsInicio = pHoraExtraFdsInicio,
        ef.horaExtraFdsTermino = pHoraExtraFdsTermino,
        ef.horaExtraFdsTotal = pHoraExtraFdsTotal

        WITH pNomeProjetos, pIdRDO, pIdEfetivo, pNomeEfetivo

        MATCH (p:Projeto)<-[:RDO_DA]-(r:RDO), (e:Efetivos)
        WHERE p.nome = pNomeProjetos 
        AND r.id_rdo = pIdRDO 
        AND e.dataHora = pIdRDO 
        AND e.nomeEfetivo = pNomeEfetivo 
        AND e.idEfetivo = pIdEfetivo

        CREATE (r)<-[:EFETIVO_DA]-(e)
    `,

    DeleteRdoEfetivos: `
        WITH $idRDO AS pIdRDO
        MATCH (r:RDO)<-[:EFETIVO_DA]-(e:Efetivos)
        WHERE r.id_rdo = pIdRDO
        DETACH DELETE e
    `,

    NovoRdoAtividade: `
        WITH $nomeProjetos AS pNomeProjetos,
        $idRDO AS pIdRDO,
        $id AS pIdAtividade,
        $descricao AS pDescricao,
        $quantCont AS pQuantCont,
        $quantReal AS pQuantReal,
        $realAcum AS pRealAcum,
        $referencia AS pReferencia,
        $saldoCont AS pSaldoCont,
        $unidade AS pUnidade

        MERGE (at:Atividades {
            idAtividade: pIdAtividade,
            descricao: pDescricao,
            quantCont: pQuantCont,
            quantReal: pQuantReal,
            realAcum: pRealAcum,
            referencia: pReferencia,
            saldoCont: pSaldoCont,
            unidade: pUnidade,
            dataHora: pIdRDO
        })

        WITH pNomeProjetos, pIdRDO, pDescricao, pIdAtividade

        MATCH (p:Projeto)<-[:RDO_DA]-(r:RDO), (a:Atividades)
        WHERE p.nome = pNomeProjetos 
        AND r.id_rdo = pIdRDO 
        AND a.dataHora = pIdRDO 
        AND a.descricao = pDescricao 
        AND a.idAtividade = pIdAtividade

        CREATE (r)<-[:ATIVIDADE_DA]-(a)
    `,

    DeleteRdoAtividade: `
        WITH $idRDO AS pIdRDO
        MATCH (r:RDO)<-[:ATIVIDADE_DA]-(a:Atividades)
        WHERE r.id_rdo = pIdRDO 
        DETACH DELETE a
    `,

    DominioClientes: `
        MATCH (c:Cliente)
        WITH c
        ORDER BY c.nome
        RETURN collect(c.nome)
    `,

    DominioClientesAtivos:`
        MATCH (c:Cliente)
        WHERE c.ativo = true
        WITH c
        ORDER BY c.nome
        RETURN collect(c.nome)
    `,

    DominioProjetosClientes: `
        MATCH (c:Cliente)<-[:PROJETO_DA]-(p:Projeto)
        WITH p, c
        ORDER BY p.nome
        RETURN collect({cliente: c{.*}, projeto: p{.*}})
    `,

    DominioColaboradores: `
        MATCH (c:Colaborador)
        WITH c
        ORDER BY c.nome
        RETURN collect({nome: c.nome, reg: toFloat(c.reg), matricula: toFloat(c.matricula), funcao: c.funcao})
    `,

    DominioFuncao: `
        MATCH (f:Funcao)
        WITH f
        ORDER BY f.nome
        RETURN collect(f.nome)
    `,

    DominioPermissao: `
        MATCH (p:Permissao)
        WITH p
        ORDER BY p.item
        RETURN collect(p.item)
    `,

    RdoDoDia: `
        WITH $dataHora AS pDataHora
        MATCH (r:RDO)
        WHERE r.id_rdo >= pDataHora
        RETURN toFloat(count(r))
    `,

    Colaboradores:`
        WITH $textoPesquisar AS pNomePesquisa,
        $status AS pStatus
        MATCH (c:Colaborador)
        WHERE (
                toUpper(c.nome) CONTAINS toUpper(pNomePesquisa) 
                OR toUpper(c.email) CONTAINS toUpper(pNomePesquisa) 
                OR toUpper(c.funcao) CONTAINS toUpper(pNomePesquisa)
                OR toString(c.cpf) CONTAINS pNomePesquisa
                OR toString(c.reg) CONTAINS pNomePesquisa
            )
            AND c.status = pStatus
        WITH c
        ORDER BY c.nome DESC
        RETURN collect( c{.*, cpf: toFloat(c.cpf), reg: toFloat(c.reg), matricula: toFloat(c.matricula)})
    `,

    NovoColaborador: `
        CREATE (c:Colaborador)
        SET c = $colaborador
    `,
    
    VerificarColaborador:`
        WITH $colaborador.nome AS pNomeColaborador
        MATCH (c:Colaborador)
        WHERE toUpper(c.nome) = toUpper(pNomeColaborador)
        RETURN toFloat(count(c))
    `,

    EditarColaborador: `
        WITH $colaborador AS pColaborador
        MATCH (c:Colaborador {
            reg: pColaborador.reg,
            dataCriacao: pColaborador.dataCriacao,
            nome: pColaborador.nome
        })
        SET c.email = pColaborador.email,
        c.telefone = pColaborador.telefone,
        c.cpf = pColaborador.cpf,
        c.funcao = pColaborador.funcao,
        c.matricula = pColaborador.matricula
    `,
    AlterarStatusColaborador: `
        WITH $colaborador AS pColaborador
        MATCH (c:Colaborador {
            reg: pColaborador.reg,
            dataCriacao: pColaborador.dataCriacao,
            nome: pColaborador.nome
        })
        SET c.status = pColaborador.status
    `,

    Funcao: `
        WITH $textoPesquisar AS pNomePesquisa
        MATCH (f:Funcao)
        WHERE toUpper(f.nome) CONTAINS toUpper(pNomePesquisa)
        WITH f
        ORDER BY f.nome DESC
        RETURN collect( f{.*})
    `,
    NovaFuncao: `
        WITH $novoNomeFuncao AS pNovoNomeFuncao
        MERGE (f:Funcao {
            nome: pNovoNomeFuncao
        })
    `,
    VerificarFuncao: `
        WITH $novoNomeFuncao AS pNovoNomeFuncao
        MATCH (f:Funcao)
        WHERE f.nome = pNovoNomeFuncao
        RETURN toFloat(count(f))
    `,
    DeletarFuncao: `
        WITH $nomeFuncao AS pNomeFuncao
        MATCH (f:Funcao)
        WHERE f.nome = pNomeFuncao
        DELETE f
    `,

    RdosUser: `
        WITH coalesce($dataInicio, -30599326412000) AS pDataInicio,
        $textoPesquisar AS pTextoPesquisar,
        $nomeCliente AS pNomeCliente,
        $nomeProjetos AS pNomeProjetos,
        $nomeUser AS pNomeUser

        MATCH (r:RDO)
        WHERE (r.status = 'Enviado' OR r.status = 'Assinado') AND r.dataInicio >= pDataInicio 
        AND toUpper(r.cliente) CONTAINS toUpper(pNomeCliente) 
        AND toUpper(r.projeto) CONTAINS toUpper(pNomeProjetos)
        AND toUpper(r.nomeFiscal) CONTAINS toUpper(pNomeUser)

        OPTIONAL MATCH (r)<-[:ATIVIDADE_DA]-(a:Atividades)
        WITH r, collect(a{.*}) as atividades

        OPTIONAL MATCH (r)<-[:EFETIVO_DA]-(e:Efetivos)
        WITH r, atividades, collect(e{.*}) as efetivos
        
        ORDER BY r.id_rdo DESC
        RETURN collect({rdo: r{.*}, atividade: atividades, efetivos: efetivos})
    `,

    FinalizarRDO: `
        MATCH (r:RDO)
        WHERE r.id_rdo = $idRDO
        SET r.status = $status,
            r.dataFinalizado = $dataFinalizado
    `,

    GetSenha: `
        MATCH (n:User)
        WHERE n.nome = $nomeUser AND n.email = $emailUser
        RETURN n.senha
    `,

    NovaSenha: `
        MATCH (n:User)
        WHERE n.nome = $nomeUser AND n.email = $emailUser
        SET n.senha = $novaSenha
    `,

    CriarAcesso: `
        MERGE (n:User {email: $email})
        SET n.nome = $nome,
             n.senha = $cpf
    `,

    UserColaboradores: `
        WITH $textoPesquisar AS pNomePesquisa,
        $status AS pStatus
        MATCH (u:User)
        WITH collect(u.email) AS user, pNomePesquisa, pStatus
        MATCH (c:Colaborador)
        WHERE NOT c.email IN user AND 
            (
                toUpper(c.nome) CONTAINS toUpper(pNomePesquisa) 
                OR toUpper(c.email) CONTAINS toUpper(pNomePesquisa) 
                OR toUpper(c.funcao) CONTAINS toUpper(pNomePesquisa)
                OR toString(c.cpf) CONTAINS pNomePesquisa
                OR toString(c.reg) CONTAINS pNomePesquisa
            )
            AND c.status = pStatus
        WITH c
        ORDER BY c.nome DESC
        RETURN collect( c{.*, cpf: toFloat(c.cpf), reg: toFloat(c.reg) })
    `,

    GetUser: `
        WITH $textoPesquisar AS pNomePesquisa
        MATCH (u:User)
        WHERE (toUpper(u.nome) CONTAINS toUpper(pNomePesquisa) 
        OR toUpper(u.email) CONTAINS toUpper(pNomePesquisa))
        RETURN collect(u{.*})
    `,

    SetPermissao: `
        MATCH (u:User)
        WHERE u.email = $email
        SET u.permissao = $permissoes
    `,

    NewPermissao: `
        MERGE (n:Permissao {item: $novaPermissao})
    `,

    GetSeguenciaRdo: `
        WITH $nomeCliente AS pNomeCliente, $nomeProjetos AS pNomeProjetos
        MATCH (p:Projeto)-[:PROJETO_DA]->(c:Cliente)
        WHERE c.nome = pNomeCliente AND p.nome = pNomeProjetos

        OPTIONAL MATCH (p)-[:ATIVIDADE_DO]-(a:AtividadesProjeto)
        WITH DISTINCT {dataInicio: p.dataInicio, 
            dataFim: p.dataFim, 
            prorrogacao: toFloat(p.prorrogacao),
            atividadesProjeto: p.atividadesProjeto,
            atividades: collect(a{.*})
        } AS result, pNomeCliente, pNomeProjetos
        OPTIONAL MATCH (r:RDO)
        WHERE r.cliente = pNomeCliente AND r.projeto = pNomeProjetos
        WITH result{.*, seguencia: toFloat(count(r))} as result
        RETURN result
    `,

    GetIdFiscal: `
        MATCH (c:Colaborador)
        WHERE c.email = $emailFiscal
        RETURN c.reg
    `,

    GetIdFiscalAssinatura: `
        MATCH (c:Colaborador)
        WHERE c.matricula = $idFiscal
        RETURN c.reg
    `
}