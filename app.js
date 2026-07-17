import pg from 'pg';
import promptSync from 'prompt-sync';

const { Client } = pg;
const prompt = promptSync()

function criarCliente() {
    return new Client({
        host:     'localhost',
        port:     5432,
        user:     'postgres',
        password: 'root',
        database: 'almoxarifado_db'
    });
}

async function listarProdutos() {
    const client = criarCliente();

    try {

        await client.connect();

        const resultado = await client.query(
            'SELECT * FROM produtos ORDER BY id, nome, categoria, valor, estoque'
        );

        console.log('\n------- PRODUTOS EXISTENTES -------');

        if (resultado.rows.length === 0) {
            console.log('A loja está vazia no momento.');
        } else {
            resultado.rows.forEach(produto => {
                console.log(`
            Id: [${produto.id}],  
            Nome: ${produto.nome}
            Categoria: ${produto.categoria}
            Valor: ${produto.valor}
            Estoque: ${produto.estoque}
            `);
            });
        }

    } catch (erro) {

        console.log('Erro ao listar produtos:', erro.message);

    } finally {

        await client.end();

    }
}

async function CadastrarProduto(){
    const client = criarCliente();

    try {

        await client.connect();

        console.log("------ CADASTRAR NOVO PRODUTO ------")

        const nome      = prompt('Nome do Produto: ');
        const categoria = prompt('Categoria: ');
        const valor     = prompt('Valor: ');
        const estoque   = prompt('Estoque: '); 

        if (!nome || !categoria || !valor || !estoque) {
            console.log('Nome, categoria e valor são obrigatórios.');
            return;
        }

        const resultado = await client.query(
            `INSERT INTO produtos (nome, categoria, valor, estoque)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nome, categoria, valor, estoque]
        );

        console.log('\nProduto cadastrado com sucesso!');
        console.log(` ID gerado pelo banco: ${resultado.rows[0].id}`);
        console.log(` ${resultado.rows[0].nome} adicionado ao almoxarifado.`);

    } catch (erro) {

        console.log('Erro ao cadastrar item:', erro.message);

    } finally {

        await client.end();

    }
}

async function menu() {
    let rodando = true;

    while (rodando) {
        console.log('------------  ALMOXARIFADO ------------');
        console.log(' 1 - Ver itens da loja                 ');
        console.log(' 2 - Cadastrar novo item               ');
        console.log(' 0 - Fechar a loja                     ');
      

        const opcao = prompt('\nEscolha uma opção: ');

        switch (opcao) {
            case '1': await listarProdutos(); break;
            case '2': await CadastrarProduto(); break;
            case '0':
                rodando = false;
                console.log('\nFechando programa....\n');
                break;
            default:
                console.log('Opção inválida. Tente novamente.');
        }
    }
}

menu();
