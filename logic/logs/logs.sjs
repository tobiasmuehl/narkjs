module.exports = logs

function logs(nark) {
	nark.on('auth added', function() {
		nark.router.get('/api/logs', nark.auth.isAuth(),function* logs() {
			this.body = [{
					id: 1,
					description: 'Started Job Process!',
					date: new Date() - 60000 * 50
				}, {
					id: 2,
					description: 'Completed Job Process!',
					date: new Date
			}]

		})
	})
}