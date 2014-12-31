'use strict';
var cardsModule = angular.module('pcs');

// Factory-service for managing PC card deck.
cardsModule.factory('PcsTraits', ['Pcs', 'PcsCardDeck', 
	function(Pcs, PcsCardDeck){
		var service = {};
		
		// Factor Trait Limit
		service.factorTraitLimit = function(){
			Pcs.pc.traitLimit = Math.floor((Pcs.pc.level || 0) / 4 + 1);
			this.validateTraits();
		};
		
		service.validateTraits = function(){
			for(var ia = 0; ia < Pcs.pc.traitLimit; ia++){
				if(!this.traitAtLevel(ia * 4)){
					this.addTrait(ia * 4);
				}
			}
			for(var ic = 0; ic < Pcs.pc.cards.length; ic++){
				if(Pcs.pc.cards[ic].level > Pcs.pc.level){
					PcsCardDeck.removeCard(ic);
				}
			}
		};
		
		service.traitAtLevel = function(level){
			var traitAtLevel = false;
			for(var ib = 0; ib < Pcs.pc.cards.length; ib++){
				if(Pcs.pc.cards[ib].cardType === 'trait'){
					if(Pcs.pc.cards[ib].level === level){
						traitAtLevel = true;
					}
				}
			}
			return traitAtLevel;
		};
		
		service.addTrait = function(level){
			var newTrait = {
				name: 'Level '+level+' Trait',
				cardType: 'trait',
				x_index: Pcs.pc.cards[Pcs.lastCard()].x_index + 1,
				y_index: 0,
				x_coord: Pcs.pc.cards[Pcs.lastCard()].x_coord + 250,
				y_coord: 0,
				x_dim: 250,
				y_dim: 350,
				x_overlap: false,
				y_overlap: false,
				locked: true,
				level: level
			};
			Pcs.pc.cards.push(newTrait);
		};
		
		return service;
	}]);