(function() {
	angular
		.module('app.logs')
		.config(config)
	config.$inject = ['$stateProvider']
	function config ($stateProvider) {
		
		$stateProvider
			.state('logs', {
				url: '/logs',
				templateUrl: 'logs/view.html',
				controller: 'LogsCtrl',
				controllerAs: 'logs',
				resolve: {
					loggedIn: ['Login',function(Login) {
						return Login.checkLoggedIn()
					}]
				}
			})
	}
})()
