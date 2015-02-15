'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
		var mSocket = socketFactory({
			prefix: '',
            ioSocket: io.connect('http://fsrpg.herokuapp.com/#!/')
		});
		return mSocket;
    }
]);