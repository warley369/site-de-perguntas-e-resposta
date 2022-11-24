const bodyParser = require('body-parser');
const express = require('express');
const app =express();
const conn = require('./database/db');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');



//databaseci
 conn.authenticate()
 .then(() => {
    console.log('conexao feita com sucesso')
 })
.catch((Error) =>{
    console.log(error)
})

//Estou dizendo para o express usar o EJS como view engine

app.set('view engine','ejs');
app.use(express.static('public'));
// bodyParser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
//Rotas
app.get('/', (req, res) =>{
    Pergunta.findAll({raw: true, order:[
        ['id','desc']
    ]}).then(Pergunta => {
        res.render('index',{ Pergunta: Pergunta})

    })
}); 

app.get('/perguntar', (req, res) => {
res.render('perguntar');
});
 
app.post('/salvarpergunta', (req, res) =>{
    var titulo = req.body.titulo;
     var descricao = req.body.descricao;
     Pergunta.create({
        titulo: titulo,
        descricao: descricao
     }).then(() => {
        res.redirect('/')
     });
});

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where:{ id:id }
    }).then(Pergunta => {
        if( Pergunta != undefined){
           
             Resposta.findAll({ where: {perguntaId: Pergunta.id},
                order:[ ['id', 'desc']]
            }).then( respostas => {
                res.render('pergunta',{
                    Pergunta: Pergunta,
                    respostas: respostas
                });
            })

     }else{
            res.redirect('/');
        }
    })
});

app.post('/responder', (req, res )=> {

    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/'+perguntaId);
    })
});

app.listen(8080, () => {
    console.log('app rodando!')
});