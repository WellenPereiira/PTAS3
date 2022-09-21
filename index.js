// JWT
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
var { expressjwt: expressJWT } = require("express-jwt");
const cors = require('cors');

var cookieParser = require('cookie-parser')

const express = require('express');
const { usuario } = require('./models');

const app = express();

app.set('view engine', 'ejs');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.use(cookieParser());
app.use(
  expressJWT({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    getToken: req => req.cookies.token
  }).unless({ path: ["/", "/autenticar", "/logar", "/deslogar", "/cadastrar", "/cadastro"] }) //não precisa estar autenticado
);

app.get('/autenticar', async function(req, res){
  res.render('autenticar');
})

//TESTAR
app.get('/listar', async function(req, res){
  const usuarios = await usuario.findAll();
  res.json(usuarios);
})

app.get('/', async function(req, res){
  res.render("home")
})

app.get('/cadastrar', async function(req, res){ //abre a página de cadastro
  res.render('cadastrar'); //pega o index.ejs automáticamente
})

app.post('/logar', (req, res) => {
  var nome = req.body.nome;
  var user = req.body.user;
  var senha = req.body.senha;

  if(nome === 'Wellen' && user === 'Wellen' && senha === '1902'){
    const id = 1;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 3600 // expires in 1h
    });

    res.cookie('token', token, { httpOnly: true });
    return res.json({ auth: true, token: token });
  }

  res.status(500).json({message: 'Usuário inválido!'});
})

//TERMINAR
app.post('/cadastrar', async function(req, res){
  const usuario = await usuario.create(req.body)
  res.json(usuario);
})

app.post('/deslogar', function(req, res) {
  res.cookie('token', null, { httpOnly: true });
  res.json({deslogado: true})
})

app.listen(3000, function() {
  console.log('App de Exemplo escutando na porta 3000!')
});