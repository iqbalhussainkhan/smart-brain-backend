const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
const saltRounds = 10;


let database = {
	users: [
		{
			id:1,
			name:'iqbal',
			email:'iqbalkhan@yahoo.com',
			password:'khanjan',
			entries:0,
			joined: new Date()
		},
		{
			id:2,
			name:'jawad',
			email:'jawad@yahoo.com',
			password:'jawadkhan',
			entries:0,
			joined: new Date()
		}
	]
}

let app = express();
app.use(bodyParser.json());
app.use(cors())

//home page 
app.get('/', (req,res) => {
	res.json(database.users)
})

//signin route for user 
app.post('/signin', (req, res) => {

	if(req.body.email === database.users[0].email
	 && req.body.password === database.users[0].password){
		res.json(database.users[0])
	}else{
		res.status(400).json('faild')
	}
})

//register route for new user 
app.post('/register', (req,res) => {
	let { name, email, password } = req.body;
	database.users.push({
			id:3,
			name:name,
			email:email,
			password:password,
			entries:0,
			joined: new Date()
		})

	res.json(database.users[database.users.length-1]);
})

// get user profile by search
app.get('/profile/:id', (req, res) => {
	let { id } = req.params;

	if(checkUser(id)){
		res.json(checkUser(id));
	}else{
		res.status(404).json('user not found');
	}
	

})


//count user image entries in database
app.put('/image/:id', (req,res) => {
	let { id } = req.params;
	database.users.forEach(( user ) => {
		if(user.id === parseInt(id)){
			user.entries++
			return res.json(user.entries)
		}
	})
	res.status(404).json('user not found')
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


