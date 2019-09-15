const handleSignin = (db, bcrypt) => (req, res ) =>  {

	let { email, password } = req.body;
	if(!email || !password){
		return res.status(404).json('please provide both email and password')
	}

	db.select('email','hash')
	.from('login')
	.where({email})
	.then(user => {
		if(user.length){
			let hash = bcrypt.compareSync(password, user[0].hash);
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
}

module.exports = {
	handleSignin:handleSignin
}