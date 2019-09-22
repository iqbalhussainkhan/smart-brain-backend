const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const pg = require('pg');
const knex = require('knex');
const saltRounds = 10;

const register = require('./controller/register');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image');


let db = knex({
  client: 'pg',
  connection: {
    host : 'postgresql-tetrahedral-37877',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});

let app = express();
app.use(bodyParser.json());
app.use(cors())

//home page 
app.get('/', (req,res) => {
	res.json('ITS WORKING')
	// console.log('its workings');
	// res.json(database.users)
})

//signin route for user 
app.post('/signin', (req, res) => {signin.handleSignin(req,res,db,bcrypt)});

//register route for new user 
app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)});


// get user profile by search
app.get('/profile/:id', (req, res) => {profile.handleProfile(req,res,db)});


//count user image entries in database
app.put('/image/:id', (req,res) => {image.handleImage(req, res, db)});

//handle api call for iamge
app.post('/handleAPICall', (req,res) => {image.handleAPICall(req, res)});


app.listen(process.env.PORT || 3000, () => {
	console.log(`APP is runnining on PORT:${process.env.PORT}`)
})

