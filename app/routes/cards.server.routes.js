'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var aspects = require('../../app/controllers/aspects');
	var traits = require('../../app/controllers/traits');
	var feats = require('../../app/controllers/feats');
	var augments = require('../../app/controllers/augments');
	var items = require('../../app/controllers/items');
	var origins = require('../../app/controllers/origins');
	
	// Aspects Routes
	app.route('/aspects')
		.get(aspects.list);
	
	app.route('/aspects/:deckId')
		.get(aspects.query);
	
	app.route('/aspect')
		.post(users.requiresLogin, aspects.create);

	app.route('/aspect/:aspectId')
		.get(aspects.read)
		.put(users.requiresLogin, aspects.hasAuthorization, aspects.update)
		.delete(users.requiresLogin, aspects.hasAuthorization, aspects.delete);
	
	// Trait Routes
	app.route('/traits')
		.get(traits.list)
		.post(users.requiresLogin, traits.create);
	
	app.route('/traits/:traitId')
		.get(traits.read)
		.put(users.requiresLogin, traits.hasAuthorization, traits.update)
		.delete(users.requiresLogin, traits.hasAuthorization, traits.delete);
	
	// Feat Routes
	app.route('/feats')
		.get(feats.list)
		.post(users.requiresLogin, feats.create);
	
	app.route('/feats/:featId')
		.get(feats.read)
		.put(users.requiresLogin, feats.hasAuthorization, feats.update)
		.delete(users.requiresLogin, feats.hasAuthorization, feats.delete);
	
	// Augment Routes
	app.route('/augments')
		.get(augments.list)
		.post(users.requiresLogin, augments.create);
	
	app.route('/augments/:augmentId')
		.get(augments.read)
		.put(users.requiresLogin, augments.hasAuthorization, augments.update)
		.delete(users.requiresLogin, augments.hasAuthorization, augments.delete);
	
	// Item Routes
	app.route('/items')
		.get(items.list)
		.post(users.requiresLogin, items.create);
	
	app.route('/items/:itemId')
		.get(items.read)
		.put(users.requiresLogin, items.hasAuthorization, items.update)
		.delete(users.requiresLogin, items.hasAuthorization, items.delete);
	
	// Origin Routes
	app.route('/origins')
		.get(origins.list)
		.post(users.requiresLogin, origins.create);
	
	app.route('/origins/:originId')
		.get(origins.read)
		.put(users.requiresLogin, origins.hasAuthorization, origins.update)
		.delete(users.requiresLogin, origins.hasAuthorization, origins.delete);
	
	// Card middleware
	app.param('aspectId', aspects.aspectByID);
	app.param('traitId', traits.traitByID);
	app.param('featId', feats.featByID);
	app.param('augmentId', augments.augmentByID);
	app.param('itemId', items.itemByID);
	app.param('originId', origins.originByID);
};
