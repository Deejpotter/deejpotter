/*--------------------------------------------------
    #Index

    #Description
    #Variables
    #Events
    #Functions
        #Preload
        #Create
        #Update

--------------------------------------------------*/


/*--------------------------------------------------
    #Description

    Make a game where you put a gladiator together, choose the head, body, and legs
    then they fight against AI gladiators. The head increases magic, the body strength, and the legs agility.
    They have a triangle effect where they are each strong against another.

    CLASSES
    Gladiator - Parent class for all fighters
    Races - Probably human, elf, orc. Each one is good at one thing. Inherit from gladiator.
    Head, Body, Legs - Components of the gladiator class. Should be able to be swapped out for what's in the inventory.

--------------------------------------------------*/


/*--------------------------------------------------
    #Variables
--------------------------------------------------*/

const game = new Phaser.Game(480, 320, Phaser.AUTO, 'game-area', {
    preload: preload, create: create, update: update
  });




/*--------------------------------------------------
    #Functions
--------------------------------------------------*/

/*
    #Preload
*/

// Preloads the game assets
function preload() {
    
}


/*
    #Create
*/

// Runs when the game starts
function create() {

}


/*
    #Update
*/

// Runs every frame
function update() {
    
}

