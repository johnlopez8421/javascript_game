// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Game and game state variables
var Game = {
    time:0,           // accumulated time between enemy moves, seconds
    speed:1000,        // target value between enemy moves, milliseconds
    alive:true,       // are we alive?
    points:0,         // # of goal row reaches
    speeddec:10,    // decrement of speed for each subsequent win
    enemycount:1,                          // # of current enemies
    enemymax:4,                           // most possible enemies
    athome:false,                         // were we at the home row last keystroke?
    xvals:[0, 100, 200, 300, 400],        // grid squares. left = 0
    yvals:[-10, 50, 130, 210, 300, 380]  // grid squares. top = -10
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    for(j=0; j<allEnemies.length; j++)
    {
        if(Game.time>Game.speed)
        {
             allEnemies[j].xpos++;
             Game.time = 0;
        }
        else
        {
            Game.time+=dt*1000;      //delta-t is in mSec, convert back to seconds. not exact but OK
        }
        if(allEnemies[j].xpos > Game.xvals.length)
        {
            allEnemies[j].xpos = 0;
        }
        
        allEnemies[j].x = Game.xvals[allEnemies[j].xpos]; 
        allEnemies[j].y = Game.yvals[allEnemies[j].ypos];

        /* collision detect */
        if(allEnemies[j].xpos === player.xpos)
        {
            if(allEnemies[j].ypos === player.ypos)
            {
                Game.alive = false;  // player is kill
             }
        }
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.x = 0;
Enemy.prototype.y = 0;
Enemy.prototype.xpos = 0;      // position in the xvals array
Enemy.prototype.ypos = 0;      // postion in the yvals array

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){

    this.sprite = 'images/char-boy.png';
}



Player.prototype.x = 0;
Player.prototype.y = 0;
Player.prototype.xpos = 2;      // position in the xvals array
Player.prototype.ypos = 5;      // postion in the yvals array

Player.prototype.update = function(){
    //console.log('update');
};

Player.prototype.render = function(){
    if(!Game.alive)
    {
        player.sprite = 'images/Rock.png';
    };

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// upon a keypress...
Player.prototype.handleInput = function(code){

    // ignore keystrokes if we're dead
    if(!Game.alive) return;

    // if we're already at the home row, respawn at bottom dead center
    if(Game.athome)
    {
        player.xpos = 2;
        player.ypos = 5;
        Game.athome = false;
    }
    else    // else move to the new position
    {
        switch(code)
        {
            case 'left':
                if(player.xpos>0)
                {
                    player.xpos--;
                }
                break;
            case 'right':
                if(player.xpos < (Game.xvals.length-1))
                {
                    player.xpos++;
                }
                break;
            case 'up':
                if(player.ypos>0)
                {
                    player.ypos--;
                }
                break;
            case 'down':
                if(player.ypos < (Game.yvals.length-1))
                {
                    player.ypos++;
                }
                break;
            default:
                break;
        }
    }

    player.x = Game.xvals[player.xpos];
    player.y = Game.yvals[player.ypos];
 
    if(player.ypos==0)  // home row
    {
        Game.points++;
        Game.speed -= Game.speeddec;
        Game.athome = true;
    }
}

Player.prototype.handleOutput = function()
{
    document.getElementById("output").innerHTML = 'Points: ' + Game.points;
    if(!Game.alive)
    {
        document.getElementById("dead").innerHTML = 'You died. Refresh to try again :(';
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = [];

for(j=0; j<Game.enemycount; j++)
{
    allEnemies.push(new Enemy);    
}

for(j=0; j<allEnemies.length; j++)
{
    allEnemies[j].xpos=0;
    // 1 through 3 are valid
    allEnemies[j].ypos=j+1;   
    if(allEnemies[j].ypos>3)
    {
        allEnemies[j].ypos -= 3;   
    }
    allEnemies[j].x = Game.xvals[allEnemies[j].xpos]; //xvals[this.xpos];
    allEnemies[j].y = Game.yvals[allEnemies[j].ypos];; //yvals[this.ypos];
};


player = new Player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    player.handleOutput();
});
