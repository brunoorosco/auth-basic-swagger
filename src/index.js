import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import swaggerUi from 'swagger-ui-express'

const app = express()

import { swaggerDocument } from './src/swagger.js'

// Basic HTTP authentication middleware
app.use((req, res, next) => {
	// If 'Authorization' header not present
	if (!req.get('Authorization')) {
		var err = new Error('Not Authenticated!')
		// Set status code to '401 Unauthorized' and 'WWW-Authenticate' header to 'Basic'
		res.status(401).set('WWW-Authenticate', 'Basic')
		next(err)
	}
	// If 'Authorization' header present
	else {
		// Decode the 'Authorization' header Base64 value
		const credentials = Buffer.from(req.get('Authorization').split(' ')[1], 'base64')
			// <Buffer 75 73 65 72 6e 61 6d 65 3a 70 61 73 73 77 6f 72 64>
			.toString()
			// username:password
			.split(':')
		// ['username', 'password']

		const username = credentials[0]
		const password = credentials[1]


		// If credentials are not valid
		if (!(username === process.env.USER && password === process.env.PASS)) {

			res.status(401).send('Error de authetication')

		}
		res.status(200)
		// Continue the execution
		next()
	}
})

// Endpoints
app.get('/', (req, res) => {
	res.send('Protected route with Basic HTTP Authentication!')
})

app.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument)
);


// Run the server
app.listen(8080)







