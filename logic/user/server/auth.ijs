'use strict'

let parse  = require('co-body'),
	jwt	= require('jsonwebtoken'),
	_	  = require('lodash')

module.exports = main
function main() {
	let nark = this,
	auth = {
		isAuth:	   isAuth,
		checkAuth:	checkAuth,
		authenticate: authenticate
	}
	nark.auth = auth
	nark.app.use(nark.auth.checkAuth)
	nark.router.post('/auth',auth.authenticate)

	function isAuth() {
		return function*(next) {
			if (this.user && this.user.iat > 0) {
				yield next
			} else {
				this.throw(401, 'must be logged in to view that page')
			}
		}
	}
	
	function* checkAuth (next) {
		let authHeader, token, elements, scheme
		authHeader = this.get('Authorization')
		if (authHeader) {
			elements = authHeader.split(' ')
			if (elements.length === 2) {
				scheme = elements[0]
				if (scheme === 'Bearer') {
					token = elements[1]
					try {
						this.user = jwt.verify(token, nark.config.secret)
					} catch (err) {
					}
				}
			}
		}
		yield next
	}
	
	function* authenticate() {
		let body, claim
		
		body = yield parse(this)
		let user = yield nark.User.findByEmail(body.email)
		if (!user.length) {
			this.throw(401, 'Couldn\'t find your email')
		}
		user = new nark.User(user[0])
		if (yield user.isPassword(body.password)) {
			this.body = {
				token: jwt.sign(user, nark.config.secret)
			}
		} else {
			this.throw(401, 'Wrong username or password')
		}
	}
}
