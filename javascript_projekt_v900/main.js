var game = new Phaser.Game(500, 500, Phaser.AUTO, 'gameDiv');

var newSprite = 'assets/angrybird.png';
var currentScore = 0;
var name = "";
var v = -200;

var newBackground = 'assets/background_1.png';
var resultatet = document.getElementById("result");
// Audioknappar
var audioElembutton_player = document.getElementById('player');
var audioElembutton_player1 = document.getElementById('player1');
var audioElembutton_player2 = document.getElementById('player2');

//var labelStart = this.game.add.text(170, 400, "Tryck S för start!", { font: "20px Arial", fill: "#ffffff" });
//var labelStart = this.labelStart;

//översätter text till objekt
var highscore = JSON.parse(localStorage.getItem("Highscore"));

//om highscore inte existerar skapa ett tomt objekt med result som attribut och en tillhörande tom array
if (!highscore) {
    highscore = {results: []};   
}

var mainState = {

    preload: function() { 
        
        game.load.image('background', newBackground);
        //game.stage.backgroundColor = bg;

        game.load.image('bird', newSprite);  
        game.load.image('pipe', 'assets/tile3.png'); 
    },
    
    run: function() {
        // om ett namn finns så hämta inte ett nytt
        if (name == "") {
            name = prompt("username");
        }
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);               
        this.bird.body.gravity.y = 1000; 
        this.hasStarted = true;
        this.labelStart.destroy();
        
        //game.sKey.onDown.addOnce(removeText, this);

        
    },
    
    create: function() { 
        game.add.sprite(0, 0, 'background');
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');  
        // this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);           

        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        // this.bird.body.gravity.y = 1000; 

        // New anchor position
        this.bird.anchor.setTo(-0.2, 0.5); 
        
        this.hasStarted = false;
        
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 
        
        var sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        sKey.onDown.add(this.run, this);
        
        this.score = 0;
        //score text
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial Black", fill: "#ffffff", strokeThickness: 6, stroke: "#000" });
        
        //Start text 
        this.labelStart = this.game.add.text(130, 380, "Tryck S för start!", { font: "27px Arial Black", fill: "#fff", strokeThickness: 6, stroke: "#000"  });

},


    update: function() {
        if (this.bird.inWorld == false) {
            this.restartGame(); 
        }

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 

        // Slowly rotate the bird downward, up to a certain point.
        if (this.bird.angle < 20)
            this.bird.angle += 1;     
    
        
    },

    jump: function() {
        // om dom inte tryckt på s-knappen kan dom inte hoppa
        if (this.hasStarted == false) {
            return;
        }
       
        // If the bird is dead, he can't jump
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;

        // Jump animation
        game.add.tween(this.bird).to({angle: -20}, 100).start();

        // Play sound
        //this.jumpSound.play();
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive == false)
            return;
            
        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        this.game.time.events.remove(this.timer);
    
        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
        
        // startar om
        this.restartGame();
        // börja från vänster
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        // s-knappen
        this.hasStarted = false;
        // stilla fågel
        this.bird.body.gravity.y = 0;
        
    },

    restartGame: function() {
        //kontrollerar om nuvarande resultat är större än ditt bästa
        if (this.score > currentScore) {
            currentScore = this.score;
        }
        game.state.start('main');
        
        
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
        
        //kontrollerar om den sista pipan som sätts sist inte är 0, hur fort piporna genereras beror på hastigheten dessa lämnar skärmen
        if (pipe !== null) {
        pipe.reset(x, y);
        pipe.body.velocity.x = v;  
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
        }
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+3;
        
        for (var i = 0; i < 10; i++) {
            if (i != hole 
                && i != hole + 1 
                && i != hole - 1) {
                this.addOnePipe(400, i*50);  
            }
        }
            this.labelScore.text = this.score;  
            this.score += 100;
    },
};

game.state.add('main', mainState);  
game.state.start('main'); 

/*var box1 = document.getElementById("bg");

box1.addEventListener("click", function() {
    bg = '#000000';
    game.stage.backgroundColor = bg;
});*/



//Hämtar knappar för ändring av bakgrundsfärg
var box1 = document.getElementById("bg1");
var box2 = document.getElementById("bg2");
var box3 = document.getElementById("bg3");


//Kod för bakgrundsfärgen
box1.addEventListener("click", function() {
    //orange
    newBackground = 'assets/background_1.png';
    game.load.image('background', newBackground);
    game.state.restart();
});

box2.addEventListener("click", function() {
    //green 
    newBackground = 'assets/background_4.png';
    game.load.image('background', newBackground);
    game.state.restart();
});

box3.addEventListener("click", function() {
    //pink
    newBackground = 'assets/background_5.png';
    game.load.image('background', newBackground);
    game.state.restart();
});




var pausgame = document.getElementById("paus");

var changeSprite1 = document.getElementById("sprites1");
var changeSprite2 = document.getElementById("sprites2");
var changeSprite3 = document.getElementById("sprites3");

var startgame = document.getElementById("start");

changeSprite1.addEventListener("click", function() {
    newSprite = 'assets/angrybird.png';
    game.load.image('bird', newSprite);
    game.state.restart();
});

changeSprite2.addEventListener("click", function() {
    newSprite = 'assets/cat.png';
    game.load.image('bird', newSprite);
    game.state.restart();
});

changeSprite3.addEventListener("click", function() {
    newSprite = 'assets/penguin.png';
    game.load.image('bird', newSprite);
    game.state.restart();
});


pausgame.addEventListener("click", function() {
    localStorage.clear();
    //pushar in resultatet o namn i ett objekt
    highscore.results.push({ name: name, score: currentScore });
    //skapar highscore med tillhörande resultat i textform med hjälp av stringify, sparar de i lokala datorn
    localStorage.setItem("Highscore", JSON.stringify(highscore));

        
    while (resultatet.firstChild) {
        resultatet.removeChild(resultatet.firstChild);   
    }
    highscore.results.forEach (function(result) {
    
    var skapalista = document.createElement("li");
    
    skapalista.textContent = "Name: " + result.name + " Score:" + result.score;
    
    resultatet.appendChild(skapalista);
        });
    
    
    
    
    
    //ändrar resultat
    currentScore = 0;
    //nollställer namn
    name = "";
});


    //bakgrundsmusik
    function toggleSound() {
      var audioElem = document.getElementById('bgmu');
      if (audioElem.paused)
          audioElem.play();
      else
    audioElem.pause();
}

var box4 = document.getElementById("v");
var box5 = document.getElementById("v1");
var box6 = document.getElementById("v0");

//Kod för hastighetsändring
box4.addEventListener("click", function() {
    v = -500;
});

box5.addEventListener("click", function() {
    v = -150;
});

box6.addEventListener("click", function() {
    v = -200;
});

//Bakgrundsmusik variabler
var audioElem_bg=document.getElementById("bgMusic_firebg");
var audioElem_bg1=document.getElementById("bgMusic_odybg");
var audioElem_bg2=document.getElementById("bgMusic_capbg");




//bakgrundsmusik
audioElembutton_player.addEventListener("click", function() {
    audioElem_bg1.pause();
    audioElem_bg2.pause();
    
    
    if (audioElem_bg.paused) {
        audioElem_bg.play();
    
    }
    else{
        audioElem_bg.pause();
    }
    
    
});

audioElembutton_player1.addEventListener("click", function() {
    
    audioElem_bg.pause();
    audioElem_bg2.pause();
    
    if(audioElem_bg1.paused) {
        audioElem_bg1.play();
    }
    else{
     audioElem_bg1.pause();   
    }

});

audioElembutton_player2.addEventListener("click", function() {

    audioElem_bg.pause();
    audioElem_bg1.pause();
    
    if(audioElem_bg2.paused) {
     audioElem_bg2.play();
    }
    else{
     audioElem_bg2.pause();  
    }
});


   

