'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('core').factory('CoreMove', ['$rootScope', 'Bakery', 'CorePanel', 'CoreStack', 'Campaigns',
	function($rootScope, Bakery, CorePanel, CoreStack, Campaigns){
		var service = {};
		
		service.windowHeight = 0;
		
		var x_dim = 15;
		var y_dim = 21;
		var x_tab = 3;
		var y_tab = 3;
		var x_cover = 12;
		var y_cover = 18;
		var _moveSpeed = 800;
		var cardMoved = false;
		var cardMoving = false;
		var dropdownOpen;
		var moveTimer;
		
		var getCardList = function(){
			return Bakery.resource.cardList;
		};
		
		var getCardIndex = function(x_coord, y_coord){
			var _deck = getCardList();
			var _card = {};
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord === x_coord && _deck[i].y_coord === y_coord){
					return i;
				}
			}
		};
		
		var getFirstIndex = function(){
			return getCardIndex(0, 0);
		};
		
		service.getLastIndex = function(){
			var _deck = getCardList();
			var _card = {};
			var _last = 0;
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord > (_card.x_coord || 0)){
					_last = i;
					_card = _deck[i];
				}
			}
			return _last;
		};
		
		var getLastIndex = function(){
			var _deck = getCardList();
			var _card = {};
			var _last = 0;
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord > (_card.x_coord || 0)){
					_last = i;
					_card = _deck[i];
				}
			}
			return _last;
		};
		
		var getLowestIndex = function(x_coord){
			var _deck = getCardList();
			var _card = {};
			var _lowest = 0;
			for(var i = 0; i < _deck.length; i++){
				if(_deck[i].x_coord === x_coord){
					if(_deck[i].y_coord > (_card.y_coord || -1)){
						_lowest = i;
						_card = _deck[i];
					}
				}
			}
			return _lowest;
		};
		
		var setColumn = function(x_coord){
			var _deck = getCardList();
			var lowest_index = getLowestIndex(x_coord);
			var lowest_y_coord = _deck[lowest_index].y_coord;
			if(lowest_y_coord > 0){
				for(var i = 0; i < _deck.length; i++){
					if(_deck[i].x_coord === x_coord){
						_deck[i].stacked = true;
						if(_deck[i].y_coord < lowest_y_coord){
							_deck[i].y_overlap = true;
						} else {
							_deck[i].y_overlap = false;
						}
					}
				}
			} else {
				_deck[lowest_index].stacked = false;
				_deck[lowest_index].y_overlap = false;
			}
		};
		
		var initialize = function(){
			toggleListeners(true);
		};
		
		var toggleListeners = function(enable){
			if(!enable) return;
			$rootScope.$on('screenSize:onHeightChange', onHeightChange);
			
			$rootScope.$on('corePanel:onPressCard', onPressCard);
			$rootScope.$on('corePanel:onReleaseCard', onReleaseCard);
			$rootScope.$on('corePanel:toggleOverlap', toggleOverlap);
			
			$rootScope.$on('corePanel:moveHorizontal', moveHorizontal);
			$rootScope.$on('corePanel:moveDiagonalUp', moveDiagonalUp);
			$rootScope.$on('corePanel:moveDiagonalDown', moveDiagonalDown);
			$rootScope.$on('corePanel:moveVertical', moveVertical);
			
			$rootScope.$on('coreStack:unstackLeft', unstackLeft);
			$rootScope.$on('coreStack:unstackRight', unstackRight);
		};
		
		var onHeightChange = function(event, object){
			service.windowHeight = object.newHeight;
		};
		
		// Set move booleans
		var setCardMoving = function(interval){
			clearTimeout(moveTimer);
			cardMoving = true;
			cardMoved = true;
			moveTimer = setTimeout(function(){
				cardMoving = false;
				CoreStack.setDeckWidth(Bakery.resource.cardList);
			}, interval);
		};
		
		// Reset move variables
		var onPressCard = function(event, object){
			var panel = object.panel;
			var _deck = getCardList();
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_index = CorePanel.getPanel(_deck, panel_x, panel_y).index;
			
			cardMoved = false;
			if(_deck[panel_index].y_overlap){
				for(var ia = 0; ia < _deck.length; ia++){
					if(_deck[ia].x_coord === panel_x && _deck[ia].y_coord >= panel_y){
						_deck[ia].dragging = true;
					}
				}
			} else {
				_deck[panel_index].dragging = true;
			}
			
			$rootScope.$digest();
		};
		
		// Reset move variables
		var onReleaseCard = function(event, object){
			var panel = object.panel;
			var _deck = getCardList();
			var panel_index = CorePanel.getPanel(panel.x_coord, panel.y_coord).index;
			
			cardMoved = false;
			
			for(var ia = 0; ia < _deck.length; ia++){
				_deck[ia].dragging = false;
			}
			
			$rootScope.$digest();
		};
		
		var moveHorizontal = function(event, object){
			var _slot = object.slot;
			var _panel = object.panel;
			var _deck = getCardList();
			var _lowest_index = getLowestIndex(_panel.x_coord);
			if(_panel.y_coord > 0 || (_panel.y_coord === 0 && _panel.stacked && !_panel.y_overlap)){
				console.log('unstackCard');
				unstackCard(_slot, _panel);
			} else if (_panel.y_coord === 0){
				console.log('switchHorizontal');
				switchHorizontal(_slot, _panel);
			}
		};

		var moveDiagonalUp = function(event, object){
			var _slot = object.slot;
			var _panel = object.panel;
			var _deck = getCardList();
			var _lowest_index = getLowestIndex(_panel.x_coord);
			if(_panel.y_coord === 0){
				stackUnder(_slot, _panel);
			} else {
				unstackCard(_slot, _panel);
			}
		};

		var moveDiagonalDown = function(event, object){
			var _slot = object.slot;
			var _panel = object.panel;
			var _deck = getCardList();
			var _lowest_index = getLowestIndex(_panel.x_coord);
			if(_panel.y_coord === 0){
				stackOver(_slot, _panel);
			} else {
				unstackCard(_slot, _panel);
			}
		};
		
		var moveVertical = function(event, object){
			switchVertical(object.slot, object.panel);
		};
		
		var unstackLeft = function(event, object){
			if(object.panel.y_coord > 0){
				var _panel = object.panel;
				var _deck = getCardList();
				var unstack_coord = _deck[getFirstIndex()].x_coord - x_dim;
				unstackCard({x_coord: unstack_coord}, _panel);
			}
		};
		
		var unstackRight = function(event, object){
			if(object.panel.y_coord > 0){
				var _panel = object.panel;
				var _deck = getCardList();
				var _last = CoreStack.getLastPanel(_deck);
				var unstack_coord = _last.panel.x_coord + x_dim;
				unstackCard({x_coord: unstack_coord}, _panel);
			}
		};
		
		// Swap card order along horizontal axis
		var switchHorizontal = function(slot, panel){
			console.log('switchHorizontal');
			if(!cardMoving){
				var _deck = getCardList();
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = CorePanel.getPanel(_deck, slot_x, slot_y).index;
				var slot_x_overlap = slot.x_overlap;
				var slot_position = slot_x;
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = CorePanel.getPanel(_deck, panel_x, panel_y).index;
				var panel_x_overlap = panel.x_overlap;
				var panel_width = x_dim;
				
				if(panel_x - slot_x > 0){
				// PANEL MOVING LEFT
					setCardMoving(_moveSpeed);
					
					if(slot_x === 0 && panel_x_overlap){
						slot_position = 0;
						panel_width -= x_cover;
						_deck[slot_index].x_overlap = true;
						_deck[panel_index].x_overlap = false;
					} else {
						if(panel_x_overlap){
							panel_width -= x_cover;
							slot_position -= x_cover;
						}
						if(slot_x_overlap){
							slot_position += x_cover;
						}
					}
					for(var ia = 0; ia < _deck.length; ia++){
						if(_deck[ia].x_coord >= slot_x && _deck[ia].x_coord < panel_x){
						// Modify position of each card in "SLOT" column and to the left of "PANEL" column
							_deck[ia].x_coord += panel_width;
						} else if(_deck[ia].x_coord === panel_x){
						// Modify position of each card in "PANEL" column
							_deck[ia].x_coord = slot_position;
						}
					}
				} else if(panel_x - slot_x < 0){
				// PANEL MOVING RIGHT
					setCardMoving(_moveSpeed);
					if(panel_x === 0 && slot_x_overlap){
						var first_index = getFirstIndex();
				//		_deck[first_index].x_coord = 0;
						_deck[first_index].x_overlap = false;
						_deck[panel_index].x_overlap = true;
						panel_width -= x_cover;
					} else if(panel_x > 0){
						if(panel_x_overlap){
							panel_width -= x_cover;
						}
					}
					
					for(var ib = 0; ib < _deck.length; ib++){
						if(_deck[ib].x_coord <= slot_x && _deck[ib].x_coord > panel_x){
						// Modify position of each card in "SLOT" column
							_deck[ib].x_coord -= panel_width;
						} else if(_deck[ib].x_coord === panel_x){
						// Modify position of each card in "PANEL" column
							_deck[ib].x_coord = slot_position;
						}
					}
				}
				$rootScope.$digest();
			}
		};
		
		// Swap card order along vertical axis
		var switchVertical = function(slot, panel){
			if(!cardMoving){
				var _deck = getCardList();
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(slot_x, slot_y);
				var slot_y_overlap = slot.y_overlap;
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(panel_x, panel_y);
				var panel_y_overlap = panel.y_overlap;
				
				var lowest_index = getLowestIndex(slot_x);
				var lowest_y = _deck[lowest_index].y_coord;
				
				if(panel_y - slot_y > 0){
				// PANEL MOVING UP
					setCardMoving(_moveSpeed);
					
					_deck[slot_index].y_coord = panel_y;
					_deck[slot_index].y_overlap = panel_y_overlap;
					$rootScope.$digest();
					_deck[panel_index].y_coord = slot_y;
					_deck[panel_index].y_overlap = slot_y_overlap;
					
				} else if(panel_y - slot_y < 0){
				// PANEL MOVING DOWN
					setCardMoving(_moveSpeed);
					
					_deck[slot_index].y_coord = panel_y;
					_deck[slot_index].y_overlap = panel_y_overlap;
					$rootScope.$digest();
					_deck[panel_index].y_coord = slot_y;
					_deck[panel_index].y_overlap = slot_y_overlap;
				}
				$rootScope.$digest();
			}
		};
		
		var stackOver = function(slot, panel){
			if(!cardMoving && !slot.x_overlap && !panel.x_overlap){
				
				var _deck = getCardList();
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(slot_x, slot_y);
				var slot_x_overlap = slot.x_overlap;
				var slot_y_overlap = slot.y_overlap;
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(panel_x, panel_y);
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				var panel_lowest_index = getLowestIndex(panel_x);
				var panel_lowest_coord = _deck[panel_lowest_index].y_coord;
				
				var newColumn = panel_x > slot_x ? slot_x : slot_x - x_dim;
				
				if(!slot_x_overlap && !panel_x_overlap){
					setCardMoving(_moveSpeed);
					for(var ia = 0; ia < _deck.length; ia++){
						if(!_deck[ia].dragging && _deck[ia].x_coord === newColumn && _deck[ia].y_coord > slot_y){
							_deck[ia].y_coord += panel_lowest_coord + y_tab;
						}
						if(_deck[ia].dragging){
							_deck[ia].x_coord = slot_x;
							_deck[ia].y_coord += slot_y + y_tab - panel_y;
						}
						if(_deck[ia].x_coord > panel_x && panel_y === 0){
							_deck[ia].x_coord -= x_dim;
						}
					}
					setColumn(newColumn);
					setColumn(slot_x);
					setColumn(panel_x);
				}
				$rootScope.$digest();
			}
		};
		
		
		// Stack one card behind another and reposition deck to fill the gap
		var stackUnder = function(slot, panel){
			if(!cardMoving && !slot.x_overlap && !panel.x_overlap){
				
				var _deck = getCardList();
				
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_index = getCardIndex(panel_x, panel_y);
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				var panel_lowest_coord = _deck[getLowestIndex(panel_x)].y_coord;
				
				var slot_x = slot.x_coord;
				var slot_y = slot.y_coord;
				var slot_index = getCardIndex(slot_x, slot_y);
				var slot_lowest_coord = _deck[getLowestIndex(slot_x)].y_coord;
				var newColumn = panel_x > slot_x ? slot_x : slot_x - x_dim;
				
				setCardMoving(_moveSpeed);
				for(var ia = 0; ia < _deck.length; ia++){
					if(!_deck[ia].dragging && _deck[ia].x_coord === slot_x){
						_deck[ia].y_coord += panel_lowest_coord + y_tab;
					}
					if(_deck[ia].x_coord > panel_x){
						_deck[ia].x_coord -= x_dim;
					}
					if(_deck[ia].dragging){
						_deck[ia].x_coord = newColumn;
					}
				}
				setColumn(newColumn);
				setColumn(slot_x);
				setColumn(panel_x);
				$rootScope.$digest();
			}
		};
		
		// Withdraw card from stack and reposition deck to make room
		var unstackCard = function(slot, panel){
			if(!cardMoving){
				
				var _deck = getCardList();
				
				if(_deck[getLowestIndex(panel.x_coord)].y_coord > 0){
					var panel_x = panel.x_coord;
					var panel_y = panel.y_coord;
					var panel_index = getCardIndex(panel_x, panel_y);
					var panel_x_overlap = panel.x_overlap;
					var panel_y_overlap = panel.y_overlap;
					var slot_x = slot.x_coord;
					
					var new_slot_index, new_panel_index;
					
					if(panel_x - slot_x > 0){
					// Card is unstacking to the left
						setCardMoving(_moveSpeed);
						if(panel_y_overlap){
						// Unstack multiple cards to the left
							for(var ia = 0; ia < _deck.length; ia++){
								if(_deck[ia].x_coord > panel_x){
									_deck[ia].x_coord += x_dim;
								}
								if(_deck[ia].x_coord === panel_x){
									if(panel_y_overlap){
										if(_deck[ia].y_coord < panel_y){
											_deck[ia].x_coord += x_dim;
										} else if(_deck[ia].y_coord >= panel_y){
											_deck[ia].y_coord -= panel_y;
										}
									}
								}
							}
						} else if(!panel_y_overlap){
						// Unstack single card to the left
							for(var ib = 0; ib < _deck.length; ib++){
								if(_deck[ib].x_coord >= panel_x){
									if(_deck[ib].x_coord === panel_x && _deck[ib].y_coord > panel_y){
										_deck[ib].y_coord -= y_dim;
									}
									if(ib !== panel_index){
										_deck[ib].x_coord += x_dim;
									}
								}
							}
							_deck[panel_index].y_coord = 0;
							_deck[panel_index].stacked = false;
						}
						new_slot_index = getLowestIndex(panel_x);
						new_panel_index = getLowestIndex(panel_x + x_dim);
						
						_deck[new_slot_index].y_overlap = false;
						if(_deck[new_slot_index].y_coord === 0){
							_deck[new_slot_index].stacked = false;
						}
						
						_deck[new_panel_index].y_overlap = false;
						if(_deck[new_panel_index].y_coord === 0){
							_deck[new_panel_index].stacked = false;
						}
					} else if(panel_x - slot_x < 0 && !cardMoving){
					//Card is unstacking to the right
						setCardMoving(_moveSpeed);
						if(panel_y_overlap){
						// Unstack multiple cards to the right
							for(var ic = 0; ic < _deck.length; ic++){
								if(_deck[ic].x_coord > panel_x){
									_deck[ic].x_coord += x_dim;
								}
								if(_deck[ic].x_coord === panel_x){
									if(_deck[ic].y_coord >= panel_y){
										_deck[ic].x_coord += x_dim;
										_deck[ic].y_coord -= panel_y;
									}
								}
							}
						} else if(!panel_y_overlap){
						// Unstack single card to the right
							for(var id = 0; id < _deck.length; id++){
								if(_deck[id].x_coord > panel_x){
									_deck[id].x_coord += x_dim;
								}
								if(_deck[id].x_coord === panel_x && _deck[id].y_coord > panel_y){
									_deck[id].y_coord -= y_dim;
								}
							}
							_deck[panel_index].x_coord += x_dim;
							_deck[panel_index].y_coord = 0;
						}
						
						new_slot_index = getLowestIndex(panel_x);
						new_panel_index = getLowestIndex(slot_x);
						
						_deck[new_slot_index].y_overlap = false;
						if(_deck[new_slot_index].y_coord === 0){
							_deck[new_slot_index].stacked = false;
						}
						
						_deck[new_panel_index].y_overlap = false;
						if(_deck[new_panel_index].y_coord === 0){
							_deck[new_panel_index].stacked = false;
						}
					}
				}
				$rootScope.$digest();
			}
		};
		
		// Function for x_overlap and y_overlap
		var toggleOverlap = function(event, object){
			if(!cardMoved){
				var panel = object.panel;
				
				var _deck = getCardList();
				var panel_x = panel.x_coord;
				var panel_y = panel.y_coord;
				var panel_x_overlap = panel.x_overlap;
				var panel_y_overlap = panel.y_overlap;
				var panel_index = getCardIndex(panel_x, panel_y);
				var lowest_index = getLowestIndex(panel_x);
				var lowest_y = _deck[lowest_index].y_coord;
				
				if(panel_x > 0 && lowest_y === 0){
				// x_overlap
					if(panel_x_overlap && !cardMoving){
					// Card overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].x_overlap = false;
						for(var ia = 0; ia < _deck.length; ia++){
							if(panel_x <= _deck[ia].x_coord){
								_deck[ia].x_coord += x_cover;
							}
						}
					} else if(!panel_x_overlap && !cardMoving){
					// Card not overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].x_overlap = true;
						for(var ib = 0; ib < _deck.length; ib++){
							if(panel_x <= _deck[ib].x_coord){
								_deck[ib].x_coord -= x_cover;
							}
						}
					}
				} else if(panel_y !== lowest_y){
				// y_overlap
					if(panel_y_overlap && !cardMoving){
					// Card overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].y_overlap = false;
						for(var ic = 0; ic < _deck.length; ic++){
							if(panel_x === _deck[ic].x_coord && panel_y < _deck[ic].y_coord){
								_deck[ic].y_coord += y_cover;
							}
						}
					} else if(!panel_y_overlap && !cardMoving){
					// Card not overlapped
						setCardMoving(_moveSpeed);
						_deck[panel_index].y_overlap = true;
						for(var id = 0; id < _deck.length; id++){
							if(panel_x === _deck[id].x_coord && panel_y < _deck[id].y_coord){
								_deck[id].y_coord -= y_cover;
							}
						}
					}
				}
				$rootScope.$digest();
				cardMoved = false;
			}
		};
		
		var removeCard = function(panel){
			// FUNCTIONAL ?
			
			var _deck = getCardList();
			var panel_x = panel.x_coord;
			var panel_y = panel.y_coord;
			var panel_index = getCardIndex(panel_x, panel_y);
			var panel_width = panel.x_overlap ? x_tab : x_dim;
			var panel_height = panel.y_overlap ? y_tab : y_dim;
			var lowest_y_coord = _deck[getLowestIndex(panel_x)].y_coord;
			
			_deck.splice(panel_index, 1);
			for(var id = 0; id < _deck.length; id++){
				if(lowest_y_coord > 0){
					if(_deck[id].x_coord === panel_x && _deck[id].y_coord > panel_y){
						_deck[id].y_coord -= panel_height;
					}
					_deck[getLowestIndex(panel_x)].y_overlap = false;
				} else if(lowest_y_coord === 0){
					if(_deck[id].x_coord > panel_x){
						_deck[id].x_coord -= panel_width;
					}
				}
			}
		};
		
		initialize();
		
		return service;
	}]);
