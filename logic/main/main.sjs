module.exports = mainRoutes

function mainRoutes(nark) {
	nark.on('built', () => {
		nark.emit('starting routes')
		nark.app.use(nark.router.routes())
		nark.app.use(nark.serve(nark.BASEPATH))
		nark.app.use(function*(next) {
			yield* nark.sendfile.call(this, nark.BASEPATH + '/main/views/index.html')
			if (!this.status) this.throw(404)
		})
		nark.app.listen(4000, console.log.bind(this,'App listening on port 4000'))
	})
}