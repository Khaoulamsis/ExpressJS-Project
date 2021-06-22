const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

//connect to db
const mysql = require('mysql');

app.use( express.static( "views/img" ) );
app.use('/views/img/', express.static('./views/img'));

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'expressdb'
});
 
connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
});

//definir moteur de template
//set views file
app.set('views',path.join(__dirname,'views'));
//app.use(express.static(path.join(__dirname, 'public')));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ajouter le chemin d'accueil et définir la page d'index des etudiants
app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM monuments";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('index', {
            title : 'Monuments Historiques au Maroc',
            monument : rows
        });
    });
});

app.get('/map', (req, res) => {
    let sql = "SELECT * FROM monuments";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('map', {
            title: 'Monuments Historiques Du Maroc',
            monument: rows
        });
    });
})
app.get('/user', (req, res) => {
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('user', {
            title: 'Liste Des Utilisateurs',
            user: rows
        });
    });
})
app.get('/visite', (req, res) => {
    let sql = "SELECT * FROM visites";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('visite', {
            title: 'Liste Des Visites',
            visite: rows
        });
    });
})
app.get('/add',(req, res) => {
    res.render('add', {
        title : 'Monuments Historiques Du Maroc'
    });
});

app.post('/save',(req, res) => { 
    
    let data = {id: req.body.id, nom: req.body.nom, latitude: parseFloat(req.body.latitude), longitude: parseFloat(req.body.longitude), ville: req.body.ville};
    let sql = "INSERT INTO monuments SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/edit/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `Select * from monuments where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('edit', {
            title : 'Monuments',
            m : result[0]
        });
    });
});


app.post('/update',(req, res) => {
    const Id = req.body.id;
    let sql = "update monuments SET id='"+req.body.id+"',  nom='"+req.body.nom+"',  latitude='"+req.body.latitude+"',  longitude='"+req.body.longitude+"',  ville='"+req.body.ville+"' where id ="+Id;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


app.get('/delete/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `DELETE from monuments where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/map',(req, res) => {
    res.render('map', {
        title : 'map'
    });
});




// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});