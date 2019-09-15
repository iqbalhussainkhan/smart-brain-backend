const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '2a150ff9325f4fe6934be520ad8594a9'
});
 

const handleAPICall = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
}
const handleImage = (req, res, db) => {
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
}

module.exports = {
	handleImage:handleImage
}