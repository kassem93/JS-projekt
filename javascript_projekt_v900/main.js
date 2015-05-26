// Skapar Phaser objekt och spelvärden
var game = new Phaser.Game( 500, 500, Phaser.AUTO, "gameDiv" ),
    // Globala variabler som används inne i spelet
    currentScore = 0, 
    name = "",
    newSprite = "assets/angrybird.png", 
    newBackground = "assets/background_1.png",
    v = -200;

// Översätter text till objekt
var highscore = JSON.parse(localStorage.getItem( "Highscore" ));
// Om highscore inte existerar skapa ett tomt objekt med result som attribut och en tillhörande tom array
if ( !highscore ) {
    highscore = {
        results: []
    };
}

var mainState = {
    // Denna funktion körs i början, här laddas spelets tillgångar
    // som figur-bilder, bakgrundsbilder och hinder
    preload: function() {
        game.load.image( "background", newBackground );
        game.load.image( "figure", newSprite );
        game.load.image( "pipe", "assets/tile3.png" );
    },
    // Denna funktion körs när spelet går igång
    run: function() {
    // Om ett namn finns så hämta inte ett nytt
        if ( name === "" ) {
            name = prompt( "username" );
        }
        this.timer = this.game.time.events.loop( 1500, this.addRowOfPipes, this );
        this.figure.body.gravity.y = 1000;
        this.hasStarted = true;
        // Raderar texten labelStart
        this.labelStart.destroy();
        // Raderar texten labelPress
        this.labelPress.destroy();
  },
    // Denna funktionen skapar allt det visuella
    create: function() {
        game.add.sprite( 0, 0, "background" );
        game.physics.startSystem( Phaser.Physics.ARCADE );
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple( 20, "pipe" );         
        this.figure = this.game.add.sprite( 100, 245, "figure" );
        game.physics.arcade.enable( this.figure ); 
        // Ny ankringsposition
        this.figure.anchor.setTo( -0.2, 0.5 );
        this.hasStarted = false;
        var spaceKey = this.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
        spaceKey.onDown.add( this.jump, this );
        var sKey = this.game.input.keyboard.addKey( Phaser.Keyboard.S );
        sKey.onDown.add( this.run, this );
        this.score = 0;
        // Text för poängen
        this.labelScore = this.game.add.text( 20, 20, "0", {
            font: "30px Arial Black",
            fill: "#ffffff",
            strokeThickness: 6,
            stroke: "#000"
        });
        // Text för "Press S to start"
        this.labelStart = this.game.add.text( 130, 380, "Press S to start!", {
            font: "27px Arial Black",
            fill: "#fff",
            strokeThickness: 6,
            stroke: "#000"
        });
        // Text för "Spacebar to jump"
        this.labelPress = this.game.add.text( 163, 425, "Spacebar to jump", {
            font: "18px Arial Black",
            fill: "#fff",
            strokeThickness: 6,
            stroke: "#000"
        });
    },
    // En funktion som laddas 60 gånger per sekund
    // Funktionen innehåller spelets logik
    update: function() {
        if ( this.figure.inWorld === false ) {
            this.restartGame();
        }
        game.physics.arcade.overlap( this.figure, this.pipes, this.hitPipe, null, this );
        // Slowly rotate the figure downward, up to a certain point.
        if ( this.figure.angle < 20 ) this.figure.angle += 1;
    },
    // Denna funktion gör så att figuren kan hoppa
    jump: function() {
        // Om man inte har tryckt på tangenten S, kan man inte spela
        if ( this.hasStarted === false ) {
            return;
        }
        // Om karaktären är död, kan den inte hoppa
        if ( this.figure.alive === false ) return;
        this.figure.body.velocity.y = -350;
        // Jump animation
        game.add.tween( this.figure ).to({
            angle: -20
        }, 100).start();
  },
    // Denna funktionen körs när figuren träffar ett hinder
    hitPipe: function() {
        // Om figuren redan har träffat ett hinder, finns det inget som vi ska göra
        if ( this.figure.alive === false ) return;
        // Deklarerar figurens property "alive" till false
        this.figure.alive = false;
        // Hindrar nya "pipes" att skapas
        this.game.time.events.remove( this.timer );
        // Gå igenom alla "pipes" och stoppa dess rörelse
        this.pipes.forEachAlive( function(p) {
            p.body.velocity.x = 0;
        }, this );
        // Startar om spelet
        this.restartGame();
        // Spelet startar och går åt vänster
        game.physics.arcade.overlap(this.figure, this.pipes, this.hitPipe, null, this);
        this.hasStarted = false;
        // Låter figuren stå stilla
        this.figure.body.gravity.y = 0;
    },
    // Denna funktionen startar om allting
    restartGame: function() {
        // Kontrollerar om nuvarande resultat är större än ditt bästa
        if ( this.score > currentScore ) {
            currentScore = this.score;
        }
        // Startar "main" state, alltså starta om hela spelet
        game.state.start( "main" );
    },
    // Denna funktionen hämtar hinder (pipes) och raderar dessa när de är utanför spelskärmen
    addOnePipe: function( x, y ) {
        var pipe = this.pipes.getFirstDead();
        // Kontrollerar om den sista pipan som sätts sist inte är 0, hur fort piporna genereras beror på hastigheten dessa lämnar skärmen
        if ( pipe !== null ) {
            pipe.reset( x, y );
            pipe.body.velocity.x = v;
            pipe.checkWorldBounds = true;
            pipe.outOfBoundsKill = true;
        }
    },
    // Denna funktionen adderar antalet hinder (pipes)
    addRowOfPipes: function() {
        // Positionen för hålet där figuren kan hoppa igenom
        var hole = Math.floor( Math.random() * 5 ) + 3;
        for ( var i = 0; i < 10; i++ ) {
            if ( i != hole && i != hole + 1 && i != hole - 1 ) {
                this.addOnePipe( 400, i * 50 );
            }
        }
        this.labelScore.text = this.score;
        this.score += 100;
    },
};
// Skapar spelet "main"
game.state.add( "main", mainState );
// Startar spelet
game.state.start( "main" );

