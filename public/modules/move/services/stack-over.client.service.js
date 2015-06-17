'use strict';

// Factory-service for managing card-deck, card-slot and card-panel directives.
angular.module('move').factory('stackOver', ['$rootScope', 'CoreVars', 'Bakery', 'PanelUtils', 'StackUtils',
    function($rootScope, CoreVars, Bakery, PanelUtils, StackUtils){
        
        return function(cardList, slot, panel){
            if(!CoreVars.cardMoving && !slot.x_overlap && !panel.x_overlap){
                
                console.log('stackOver');
                
                var slot_x = slot.x_coord;
                var slot_y = slot.y_coord;
                var slot_x_overlap = slot.x_overlap;
                var slot_y_overlap = slot.y_overlap;
                
                var panel_x = panel.x_coord;
                var panel_y = panel.y_coord;
                var panel_x_overlap = panel.x_overlap;
                var panel_y_overlap = panel.y_overlap;
                var panel_lowest_index = PanelUtils.getLowestPanel(cardList, panel_x).index;
                var panel_lowest_coord = cardList[panel_lowest_index].y_coord;
                
                var newColumn = panel_x > slot_x ? slot_x : slot_x - CoreVars.x_dim_em;
                
                if(!slot_x_overlap && !panel_x_overlap){
                    CoreVars.setCardMoving();
                    for(var ia = 0; ia < cardList.length; ia++){
                        if(!cardList[ia].dragging && cardList[ia].x_coord === newColumn && cardList[ia].y_coord > slot_y){
                            cardList[ia].y_coord += panel_lowest_coord + CoreVars.y_dim_em;
                        }
                        if(cardList[ia].dragging){
                            cardList[ia].x_coord = slot_x;
                            cardList[ia].y_coord += slot_y + CoreVars.y_dim_em - panel_y;
                        }
                        if(cardList[ia].x_coord > panel_x && panel_y === 0){
                            cardList[ia].x_coord -= CoreVars.x_dim_em;
                        }
                    }
                    
                    StackUtils.setStack(cardList, slot);
                    StackUtils.setStack(cardList, panel);
                }
                
                $rootScope.$digest();
            }
        };
        
    }]);