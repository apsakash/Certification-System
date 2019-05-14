const express = require('express');
const app = express();
var path    = require("path");

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

app.get('/issuer', (req,res) => {
    res.render('index');
    console.log(res);
});

app.get('/myissuer', (req,res) => {
    res.render('mytest');
    console.log(res);
});

app.get('/verify', (req,res) => {
    res.render('verifier');
    console.log(res);
});

app.get('/issuing', (req,res) => {

    firstName = req.query.firstName;
    lastName = req.query.lastName;
    department = req.query.department;
    cgpa = req.query.cgpa;
    remark = req.query.remark;
    var name = firstName + " " + lastName;
    var data = firstName  + " " + lastName + " " + department + " " + cgpa + " " + remark;
    res.render("certificate", { name : name , department : department , cgpa : cgpa , remark : remark });
});

const server = app.listen(7002, ()=> {
    console.log('RUNNING ON PORT -  ',server.address().port);
});


