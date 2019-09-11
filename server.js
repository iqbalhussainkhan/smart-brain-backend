const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const pg = require('pg');
const knex = require('knex');
const saltRounds = 10;


let db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
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
	res.json(database.users)
})

//signin route for user 
app.post('/signin', (req, res) => {

	let { email, password } = req.body;

	db.select('email','hash')
	.from('login')
	.where({email})
	.then(user => {
		console.log(user[0])
		if(user.length){
			let hash = bcrypt.compareSync(password, user[0].hash);
			console.log(hash)
			if(hash)
				db.select('*')
				.from('users')
				.where('email',user[0].email)
				.then(user => res.json(user[0]))
			else
				res.status(404).json('wrong credintials')
		}else{
			res.status(404).json('wrong credintials');
		}
	})
	.catch(err => res.status(400).json('request cannot complete please try again later'))


	// db('login')
	// .join('users','users.email','login.email')
	// .where({'login.email': email,'hash': password}).select('*')
	// .select('*')
	// .then(user => {
	// 	if(user.length){
	// 		res.json(user[0]);
	// 	}
	// 	else
	// 		res.status(404).json('incorrect user name or password');
	// })
	// .catch(err => res.status(400).json('bad request'));


})

//register route for new user 
app.post('/register', (req,res) => {
	let { name, email, password } = req.body;
	var hash = bcrypt.hashSync(password);

	db.transaction(trx => {
		trx('login')
		.returning('email')
		.insert({
			hash: hash,
			email: email
		})
		.then(loginEmail => {
			return trx('users')
			.returning('*')	
			.insert({
				name: name,
				email: loginEmail[0],
				joined: new Date()
			})
			.then(user => {
				res.json(user[0])
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	}).catch(err => res.status(404).json('cannot add user'));
})


// get user profile by search
app.get('/profile/:id', (req, res) => {
	let { id } = req.params;

	db('users')
	.where({ id })
	.select('*')
	.then(user => {
		if(user.length)
			res.json(user[0])
		else
			res.status(400).json('user not found')
	})
	.catch(err => res.status(400).json('Incrrect user id provided'));
})


//count user image entries in database
app.put('/image/:id', (req,res) => {
	let { id } = req.params;

	db.table('users')
	.returning('entries')
	.where({id})
	.increment('entries', 1)
	.then(entries => {
	  		if(entries.length)
	  			res.json(entries[0]);
	  		else
	  			res.json('0')
	  }).catch(err => res.send('bad request'));
})


app.listen(4000, () => {
	console.log('app is runnnig')
})


//function to check user if avalible of not 
const checkUser = (userId) => {
	const user = database.users.filter(user => {

		return user.id === parseInt(userId)
	});

	return user.length > 0 ? user 
	 : false
}


