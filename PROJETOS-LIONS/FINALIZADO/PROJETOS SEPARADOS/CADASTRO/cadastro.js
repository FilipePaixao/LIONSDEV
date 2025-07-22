const readline = require("readline");
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let catalogo = [];
let funcionarios = [];

const ARQUIVO_PRODUTOS = 'BancoDeProdutos.json';
const ARQUIVO_FUNCIONARIOS = 'BancoDeFuncionarios.json';

function salvarDados(nomeArquivo, dados, callback) {
    const jsonString = JSON.stringify(dados, null, 2);
    fs.writeFile(nomeArquivo, jsonString, (err) => {
        if (err) {
            console.log(`Erro ao salvar o arquivo '${nomeArquivo}':`, err);
        } else {
            console.log(`Dados de '${nomeArquivo}' salvos com sucesso!`);
        }
        if (callback) callback();
    });
}

function carregarDados(nomeArquivo, callback) {
    fs.readFile(nomeArquivo, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log(`Arquivo '${nomeArquivo}' não encontrado. Iniciando com uma lista vazia.`);
                callback([]);
            } else {
                console.log(`Erro ao carregar o arquivo '${nomeArquivo}':`, err);
                callback([]);
            }
            return;
        }

        try {
            const dados = JSON.parse(data);
            console.log(`Dados de '${nomeArquivo}' carregados com sucesso.`);
            callback(dados);
        } catch (parseErr) {
            console.log(`Erro ao analisar o JSON do arquivo '${nomeArquivo}':`, parseErr);
            callback([]);
        }
    });
}

function Inicio() {
    console.clear();
    console.log(`=`.repeat(15) + `CATALOGO` + `=`.repeat(15));
    rl.question(
        "=== Bem vindo(a), ao sistema!! ===\n 1 - Para Listar os produtos cadastrados\n Digite aqui o que deseja: ",
        (pergunta01) => {
            switch (pergunta01.toLowerCase()) {
                case "1":
                    ListarProdutosGenerico(Inicio);
                    break;
                case "sair":
                    process.exit();
                case "admin":
                    AdminMenu();
                    break;
                default:
                    console.log("Digite uma OPÇÃO VÁLIDA!!");
                    Inicio();
                    break;
            }
        }
    );
}

function AdminMenu() {
    console.clear();
    console.log(`=`.repeat(15) + `BEM VINDO A SESSÃO ADMINISTRADOR` + `=`.repeat(15));
    rl.question("Insira a Sua Credencial de Acesso: ", (credencial) => {
        if (credencial === "admin") {
            rl.question("Autenticado com Sucesso. \n 1 - Cadastro de Produtos\n 2 - Listar Produtos Cadastrados\n 3 - Deletar Produto Cadastrado \n 4 - Gerenciar Funcionários\n 5 - Voltar ao menu principal\n Selecione uma das opções: ", adminoption => {
                switch (adminoption) {
                    case "1":
                        CadastroProduto();
                        break;
                    case "2":
                        ListarProdutosGenerico(AdminMenu);
                        break;
                    case "3":
                        DeletarProduto();
                        break;
                    case "4":
                        MenuFuncionarios();
                        break;
                    case "5":
                        Inicio();
                        break;
                    default:
                        console.clear();
                        console.log("Digite uma OPÇÃO VÁLIDA!!");
                        AdminMenu();
                        break;
                }
            })
        } else {
            console.clear();
            console.log("Você não possui autorização para acessar!!");
            Inicio();
        }
    });
}

function CadastroProduto() {
    console.clear();
    rl.question("Insira o nome do produto para cadastra-lo: ", (cad_produto) => {
        if (!cad_produto.trim()) {
            console.log("Nome do produto não pode ser vazio.");
            CadastroProduto();
            return;
        }
        let ID = Math.floor(Math.random() * 100000) + 1;
        while (catalogo.some(p => p.ID === ID)) { // Bagulhjo pro ID nao repetir nunca
            ID = Math.floor(Math.random() * 100000) + 1;
        }
        catalogo.push({
            ID,
            Nome: cad_produto.trim(),
        });
        salvarDados(ARQUIVO_PRODUTOS, catalogo, () => {
            console.log(`O produto: ${cad_produto} foi inserido com sucesso no BANCO DE DADOS!!`);
            rl.question("Deseja cadastrar um novo produto?? (s/n): ", (confirmnewproduct) => {
                confirmnewproduct = confirmnewproduct.toLowerCase();
                if (confirmnewproduct === "s" || confirmnewproduct === "sim") {
                    CadastroProduto();
                } else {
                    AdminMenu();
                }
            });
        });
    });
}

function ListarProdutosGenerico(menuRetorno) {
    console.clear();
    if (catalogo.length === 0) {
        console.log("Não há produtos cadastrados!!");
        rl.question("Pressione Enter para retornar ao menu: ", () => {
            menuRetorno();
        });
        return;
    }
    console.log("==== Produtos Cadastrados no momento ===");
    catalogo.forEach((produto, index) => {
        console.log(`${index + 1}. ID: ${produto.ID} | Nome: ${produto.Nome}`);
    });
    rl.question("Pressione Enter para retornar ao menu: ", () => {
        menuRetorno();
    });
}

function DeletarProduto() {
    console.clear();
    if (catalogo.length === 0) {
        console.log("Não há produtos cadastrados... Retornando!!");
        AdminMenu();
        return;
    }
    ListarProdutosGenerico(() => {
        rl.question("Insira o ID do produto que deseja DELETAR (ou 'sair' para cancelar): ", inputIDDELETE => {
            if (inputIDDELETE.toLowerCase() === "sair") {
                console.log("Operação de remoção abortada.");
                AdminMenu();
                return;
            }

            let SeletorCatalogo = parseInt(inputIDDELETE);
            if (isNaN(SeletorCatalogo)) {
                console.log("ID inválido. Por favor, digite um número.");
                DeletarProduto();
                return;
            }

            const indexID = catalogo.findIndex(obj => obj.ID === SeletorCatalogo);

            if (indexID === -1) {
                console.log("ID de produto não encontrado!");
                DeletarProduto();
                return;
            }

            rl.question(`Você escolheu remover o item ${catalogo[indexID].Nome}. Confirme com SIM ou rejeite com NAO: `, (confirmacaocat) => {
                confirmacaocat = confirmacaocat.toLowerCase();
                if (confirmacaocat === "s" || confirmacaocat === "sim") {
                    catalogo.splice(indexID, 1);
                    salvarDados(ARQUIVO_PRODUTOS, catalogo, () => {
                        console.log(`O item com ID ${inputIDDELETE} foi REMOVIDO do CATALOGO!!!`);
                        AdminMenu();
                    });
                } else {
                    console.log("Operação de REMOÇÃO ABORTADA!!");
                    AdminMenu();
                }
            });
        });
    });
}

function MenuFuncionarios() {
    console.clear();
    console.log(`=`.repeat(20) + `CADASTRO FUNCIONARIOS` + `=`.repeat(20));
    console.log(`Funcionários Atuais: ${funcionarios.length}`);
    rl.question("Selecione uma das opções abaixo: \n 1 - Adicionar funcionario \n 2 - Exibir todos os funcionarios cadastrados \n 3 - Editar funcionario \n 4 - Remover funcionario \n 5 - Funcionario com Maior e Menor Salario \n 6 - Voltar ao menu de administrador\n 7 - Sair do sistema\nInsira aqui: ",
        (opcao) => {
            switch (opcao) {
                case "1":
                    cadastroFuncionario();
                    break;
                case "2":
                    ListarFuncionariosGenerico(MenuFuncionarios);
                    break;
                case "3":
                    editarFuncionario();
                    break;
                case "4":
                    deletarfuncionario();
                    break;
                case "5":
                    maiorMenorSalario();
                    break;
                case "6":
                    AdminMenu();
                    break;
                case "7":
                    rl.question("Ao sair você perderá tudo! Deseja mesmo sair? (s/n): ", (sairsimounao) => {
                        sairsimounao = sairsimounao.toLowerCase();
                        if (sairsimounao === "s" || sairsimounao === "sim") {
                            console.clear();
                            process.exit();
                        } else {
                            console.log("Saída abortada");
                            MenuFuncionarios();
                        }
                    });
                    break;
                default:
                    console.clear();
                    console.log("Insira uma opção válida");
                    MenuFuncionarios();
                    break;
            }
        }
    );
}

function cadastroFuncionario() {
    console.clear();
    console.log("Bem vindo a etapa de CADASTRO, siga as instruções:");
    rl.question("Digite o nome do(a) funcionário(a): ", (nome) => {
        if (!nome.trim()) {
            console.log("Nome do funcionário não pode ser vazio.");
            cadastroFuncionario();
            return;
        }
        rl.question("Insira o cargo: ", (cargo) => {
            if (!cargo.trim()) {
                console.log("Cargo não pode ser vazio.");
                cadastroFuncionario();
                return;
            }
            rl.question("Admin? (s/n): ", (PerguntaAdmin01) => {
                const isAdmin = (PerguntaAdmin01.toLowerCase() === "s" || PerguntaAdmin01.toLowerCase() === "sim");
                rl.question("Insira o Salário do mesmo: ", (salario) => {
                    const salarioFloat = parseFloat(salario);
                    if (isNaN(salarioFloat) || salarioFloat <= 0) {
                        console.log("O Salário digitado não é um número válido ou é um valor inválido!");
                        cadastroFuncionario();
                    } else {
                        let FuncionarioNumero = Math.floor(Math.random() * 100000) + 1;
                        while (funcionarios.some(f => f.FuncionarioNumero === FuncionarioNumero)) { // Garante ID único
                            FuncionarioNumero = Math.floor(Math.random() * 100000) + 1;
                        }
                        funcionarios.push({
                            FuncionarioNumero,
                            nome: nome.trim(),
                            cargo: cargo.trim(),
                            Admin: isAdmin,
                            salario: salarioFloat,
                        });
                        salvarDados(ARQUIVO_FUNCIONARIOS, funcionarios, () => {
                            console.log("Funcionário cadastrado com sucesso!");
                            MenuFuncionarios();
                        });
                    }
                });
            });
        });
    });
}

function ListarFuncionariosGenerico(menuRetorno) {
    console.clear();
    if (funcionarios.length === 0) {
        console.log("Nenhum funcionário cadastrado no momento!!");
        rl.question("Pressione Enter para retornar ao menu: ", () => {
            menuRetorno();
        });
        return;
    }
    console.log("========== Aqui está a lista de funcionários cadastrados: ==========");
    funcionarios.forEach((funcionario) => {
        console.log(`ID: ${funcionario.FuncionarioNumero} | Nome: ${funcionario.nome} | Cargo: ${funcionario.cargo} | Salário: R$${funcionario.salario.toFixed(2)} | Admin: ${funcionario.Admin ? 'Sim' : 'Não'}`);
    });
    rl.question("Pressione Enter para retornar ao menu: ", () => {
        menuRetorno();
    });
}

function editarFuncionario() {
    console.clear();
    if (funcionarios.length === 0) {
        console.log("Nenhum funcionário cadastrado para editar.");
        MenuFuncionarios();
        return;
    }

    ListarFuncionariosGenerico(() => {
        rl.question("Insira o ID do funcionário que deseja editar (ou 'sair' para cancelar): ", (idParaEditar) => {
            if (idParaEditar.toLowerCase() === "sair") {
                console.log("Operação de edição abortada.");
                MenuFuncionarios();
                return;
            }

            const id = parseInt(idParaEditar);
            if (isNaN(id)) {
                console.log("ID inválido. Por favor, digite um número.");
                editarFuncionario();
                return;
            }

            const index = funcionarios.findIndex(f => f.FuncionarioNumero === id);

            if (index === -1) {
                console.log("ID não encontrado. Retornando ao menu.");
                MenuFuncionarios();
                return;
            }

            const funcionario = funcionarios[index];
            console.log(`Editando funcionário: ${funcionario.nome}`);

            rl.question(`Novo nome (Deixe em branco para manter '${funcionario.nome}'): `, (novoNome) => {
                rl.question(`Novo cargo (Deixe em branco para manter '${funcionario.cargo}'): `, (novoCargo) => {
                    rl.question(`Novo salário (Deixe em branco para manter '${funcionario.salario.toFixed(2)}'): `, (novoSalario) => {
                        rl.question(`Tornar Admin? (s/n) (Deixe em branco para manter '${funcionario.Admin ? 'Sim' : 'Não'}'): `, (novoAdmin) => {

                            if (novoNome.trim()) funcionario.nome = novoNome.trim();
                            if (novoCargo.trim()) funcionario.cargo = novoCargo.trim();
                            if (novoSalario.trim()) {
                                const salarioParse = parseFloat(novoSalario);
                                if (!isNaN(salarioParse) && salarioParse > 0) {
                                    funcionario.salario = salarioParse;
                                } else {
                                    console.log("Salário inválido, mantendo o salário anterior.");
                                }
                            }
                            if (novoAdmin.trim()) {
                                const adminLowerCase = novoAdmin.toLowerCase();
                                if (adminLowerCase === "s" || adminLowerCase === "sim") {
                                    funcionario.Admin = true;
                                } else if (adminLowerCase === "n" || adminLowerCase === "nao") {
                                    funcionario.Admin = false;
                                } else {
                                    console.log("Opção de Admin inválida, mantendo o status anterior.");
                                }
                            }

                            salvarDados(ARQUIVO_FUNCIONARIOS, funcionarios, () => {
                                console.log("Funcionário editado com sucesso!");
                                MenuFuncionarios();
                            });
                        });
                    });
                });
            });
        });
    });
}

function deletarfuncionario() {
    console.clear();
    if (funcionarios.length === 0) {
        console.log("Não há funcionários para serem removidos.");
        MenuFuncionarios();
        return;
    }

    ListarFuncionariosGenerico(() => {
        rl.question("Insira o ID do funcionário que deseja remover (ou 'sair' para cancelar): ", (idParaRemover) => {
            if (idParaRemover.toLowerCase() === "sair") {
                console.log("Operação de remoção abortada.");
                MenuFuncionarios();
                return;
            }

            const id = parseInt(idParaRemover);
            if (isNaN(id)) {
                console.log("ID inválido. Por favor, digite um número.");
                deletarfuncionario();
                return;
            }

            const index = funcionarios.findIndex(f => f.FuncionarioNumero === id);

            if (index === -1) {
                console.log("ID não encontrado. Retornando ao menu.");
                MenuFuncionarios();
                return;
            }

            rl.question(`Você escolheu remover o funcionário ${funcionarios[index].nome}. Confirme sua remoção com SIM ou rejeite-a com NAO: `, (confirmacao) => {
                confirmacao = confirmacao.toLowerCase();
                if (confirmacao === "sim" || confirmacao === "s") {
                    funcionarios.splice(index, 1);
                    salvarDados(ARQUIVO_FUNCIONARIOS, funcionarios, () => {
                        console.log("Funcionario removido com sucesso!");
                        MenuFuncionarios();
                    });
                } else {
                    console.log("Operação de remoção abortada.");
                    MenuFuncionarios();
                }
            });
        });
    });
}

function maiorMenorSalario() {
    console.clear();
    if (funcionarios.length < 2) {
        console.log("Não há funcionários suficientes para comparação de salários (mínimo 2).");
        rl.question("Pressione Enter para retornar ao menu: ", () => {
            MenuFuncionarios();
        });
        return;
    }

    const maior = funcionarios.reduce((prev, current) => (prev.salario > current.salario) ? prev : current);
    const menor = funcionarios.reduce((prev, current) => (prev.salario < current.salario) ? prev : current);

    console.log(`\n============== Estatísticas de Salário ==============`);
    console.log(`Funcionário com MAIOR salário: ${maior.nome} (R$${maior.salario.toFixed(2)})`);
    console.log(`Funcionário com MENOR salário: ${menor.nome} (R$${menor.salario.toFixed(2)})`);
    console.log(`====================================================\n`);

    rl.question("Pressione Enter para retornar ao menu: ", () => {
        MenuFuncionarios();
    });
}

console.log("Iniciando o sistema...");
carregarDados(ARQUIVO_PRODUTOS, (dadosProdutos) => {
    catalogo = dadosProdutos;
    carregarDados(ARQUIVO_FUNCIONARIOS, (dadosFuncionarios) => {
        funcionarios = dadosFuncionarios;
        Inicio();
    });
});