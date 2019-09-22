
const handleRegister = (req,res,db,bcrypt) => {
	let { name, email, password } = req.body;

	if( !name || !email || !password){
		return res.status(404).json('please provied all input fields')
	}
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
}

module.exports ={
	handleRegister:handleRegister
}