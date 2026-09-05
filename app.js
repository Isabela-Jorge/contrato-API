const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

app.use(express.json());

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'aula_crud'
});

conexao.connect((erro) => {
    if (erro) {
        console.log('Erro ao conectar com o banco:', erro);
        return;
    }

    console.log('Conectado ao mysql');
});

app.get('/produtos', (req, res)=> {

    const sql = 'CALL sp_listar_produtos()'

    conexao.query(sql, (erro, resultado)=>{

        if(erro){
            return res.status(500).json({

                erro: 'erro ao buscar produtos'
            });
        }

        res.status(200).json(resultados[0])
    })

    app.post('/produtos', (req, res)=>{

        const {nome, preco} = req.body;

        const sql = 'CALL sp_cadastrar-produto(?, ?)'

        conexao.query(
            sql,
            [nome, preco],
            (erro, resultados)=>{

                if(erro){
                    return express.status(500).json({

                        erro: 'Erro ao cadastro produto'
                    })
                }
                
                const id = resultados[0][0].id

                res.status(201).json({

                    mensagem: 'produto cadastrado com sucesso!',
                    produto: {
                        id,
                        nome,
                        preco
                    }
                })
            }
        )
    });

    app.put('/produto/:id', (req, res)=>{

        const id = req.params.id;

        const { nome, preco} = req.body

        const sql = 'CALL sp_atualizar_produto(?, ?, ?)'

        conexao.query(
            sql,
            [id, nome, preco],
            (erro, resultados)=>{

                if(erro){
                    return res.status(500).json({

                        erro: 'Erro ao atualizar produto'
                    })

                }

                const linhaAfetadas =
                  resultados[0][0].linhaAfetadas

                if(linhaAfetadas){
                  return res.status(404).json({
                    erro: 'Produto não encontrado'
                  });
                }

                res.status(200).json({
                    mensagem: 'Produto atualizado com sucesso',
                    produto: {
                        id,
                        nome,
                        preco
                    }
                })
            }
        )
    })
})

app.delete('/produto/:id', (req, res)=>{

    const id = req.params.id;

    const sql = 'CALL sp_excluir_produto(?)'

    conexao.query(

        sql,
        [id],
        (erro, resultado)=>{

            if(erro){

                return res.status(500).json({
                    erro: 'Erro ao excluir produto'
                })
            }

            const linhaAfetadas =
            resultados[0][0].linhaAfetadas;

            if(linhaAfetadas === 0){
                return res.status(404).json({
                    erro: 'Produto excluido com sucesso'
                })
            }
        }
    )
})


app.listen(PORT, () => {

    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );
});
