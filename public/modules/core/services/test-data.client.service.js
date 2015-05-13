'use strict';

angular.module('core').factory('mockDataBuilder', function() {
    var service = {};
    
    service.newMockData = function(){
        var mockData = {};
        
        mockData.aspect_1 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the First',
                cardType: 'Aspect',
                cardNumber: 1
            }
        };
        
        mockData.aspect_2 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Second',
                cardType: 'Aspect',
                cardNumber: 2
            }
        };
        
        mockData.aspect_3 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Third',
                cardType: 'Aspect',
                cardNumber: 3
            }
        };
        
        mockData.aspect_4 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Fourth',
                cardType: 'Aspect',
                cardNumber: 4
            }
        };
        
        mockData.aspect_5 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Fifth',
                cardType: 'Aspect',
                cardNumber: 5
            }
        };
        
        mockData.aspect_6 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Sixth',
                cardType: 'Aspect',
                cardNumber: 6
            }
        };
        
        mockData.aspect_7 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Seventh',
                cardType: 'Aspect',
                cardNumber: 7
            }
        };
        
        mockData.aspect_8 = {
            panelType: 'Aspect',
            aspectData: {
                name: 'Aspect the Eighth',
                cardType: 'Aspect',
                cardNumber: 8
            }
        };
        
        mockData.aspectDeck = {
            _id: 'aspectDeck_id',
            dependencies: [],
            cardList: [ 
                mockData.aspect_1, mockData.aspect_2,
                mockData.aspect_3, mockData.aspect_4,
                mockData.aspect_5, mockData.aspect_6,
                mockData.aspect_7, mockData.aspect_8
            ]
        };
        
        
        
        mockData.trait_1 = {
            panelType: 'Trait',
            traitData: {
                name: 'Trait the First',
                cardType: 'Trait',
                cardNumber: 1
            }
        };
        
        mockData.trait_2 = {
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Second',
                cardType: 'Trait',
                cardNumber: 2
            }
        };
        
        mockData.trait_3 = {
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Third',
                cardType: 'Trait',
                cardNumber: 3
            }
        };
        
        mockData.trait_4 = {
            panelType: 'Trait',
            traitData: {
                name: 'Trait the Fourth',
                cardType: 'Trait',
                cardNumber: 4
            }
        };
        
        mockData.traitDeck = {
            _id: 'traitDeck_id',
            dependencies: [
                { _id: 'aspectDeck_id' }
            ],
            cardList: [
                mockData.trait_1, mockData.trait_2,
                mockData.trait_3, mockData.trait_4
            ]
        };
        
        
        
        mockData.feat_1 = {
            panelType: 'Feat',
            featData: {
                name: 'Feat the First',
                cardType: 'Feat',
                cardNumber: 1
            }
        };
        
        mockData.feat_2 = {
            panelType: 'Feat',
            featData: {
                name: 'Feat the Second',
                cardType: 'Feat',
                cardNumber: 2
            }
        };
        
        mockData.feat_3 = {
            panelType: 'Feat',
            featData: {
                name: 'Feat the Third',
                cardType: 'Feat',
                cardNumber: 3
            }
        };
        
        mockData.feat_4 = {
            panelType: 'Feat',
            featData: {
                name: 'Feat the Fourth',
                cardType: 'Feat',
                cardNumber: 4
            }
        };
        
        mockData.featDeck = {
            _id: 'featDeck_id',
            dependencies: [],
            cardList: [
                mockData.feat_1, mockData.feat_2,
                mockData.feat_3, mockData.feat_4
            ]
        };
        
        
        
        return mockData;
    };
    
    
    
    return service;
});