const handleProfile = (req, res, db) => {
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
}

module.exports = {
	handleProfile:handleProfile
}