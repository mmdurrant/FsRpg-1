'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Action = require('./action.server.model'),
	Schema = mongoose.Schema;

/**
 * Card Schema
 */
var OriginSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	deck: {
		type: Schema.ObjectId,
		ref: 'Deck'
	},
	deckSize: {
		type: Number
	},
	deckName: {
		type: String
	},
	cardType: {
		type: String
	},
	cardNumber: {
		type: Number
	},
	aspect: {
		type: Schema.Types.ObjectId,
		ref: 'Aspect'
	},
	prerequisite: {
		type: String
	},
	description: {
		show: {
			type: Boolean,
			default: false
		},
		content: {
			type: String
		}
	},
	benefit: {
		show: {
			type: Boolean,
			default: false
		},
		content: {
			type: String
		},
		criticalSuccess: {
			show: {
				type: Boolean,
				default: false
			},
			content: {
				type: String
			}
		}
	},
	actions: [
		Action
	],
	origin: {
		archetype: {
			type: String
		},
		allegiance: {
			type: String
		},
		race: {
			type: String
		},
		size: {
			type: String,
			default: 'medium'
		},
		rank: {
			type: Number,
			default: 0
		},
		speed: {
			type: Number
		},
		durability: {
			type: Number
		},
		health: {
			type: Number
		},
		stamina: {
			type: Number
		},
		injury: {
			type: Number
		},
		fatigue: {
			type: Number
		}
	}
});

mongoose.model('Origin', OriginSchema);