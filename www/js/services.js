angular.module('app.services', [])

.factory('server', function() { 
        return function(indirizzo) { 
            return ('http://localhost:3000' + indirizzo);
        }
})

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}]);