var newSprite = "assets/angrybird.png", 
    newBackground = "assets/background_1.png",
    v = -200;
    
// Hämtar resultat diven och pausknappen
var resultatet = document.getElementById( "result" ),
    pausGame = document.getElementById( "paus" );

// Hämtar musikknappar
var fireButton = document.getElementById( "fire_within" ),
    odysseyButton = document.getElementById( "odyssey" ),
    caprisunButton = document.getElementById( "caprisun" );

// Hämtar knappar för ändring av bakgrundsfärg
var cityButton = document.getElementById( "bg_city" ),
    desertButton = document.getElementById( "bg_desert" ),
    spaceButton = document.getElementById( "bg_space" );

// Hämtar karaktärsknappar
var angryButton = document.getElementById( "angrybird" ),
    catButton = document.getElementById( "cat" ),
    penguinButton = document.getElementById( "penguin" );

// Hämtar hastighetsknappar
var fastButton = document.getElementById( "fast_mode" ),
    slowButton = document.getElementById( "slow_mode" ),
    resetButton = document.getElementById( "reset_speed" );

// Bakgrundsmusik variabler
var fireMusic = document.getElementById( "bgMusic_firebg" ),
    odysseyMusic = document.getElementById( "bgMusic_odybg" ),
    caprisunMusic = document.getElementById( "bgMusic_capbg" );

// Knapparna för ändring av bakgrunden
cityButton.addEventListener( "click", function() {
  newBackground = "assets/background_1.png";
  game.load.image( "background", newBackground );
  game.state.restart();
});

desertButton.addEventListener( "click", function() {
  newBackground = "assets/background_4.png";
  game.load.image( "background", newBackground );
  game.state.restart();
});

spaceButton.addEventListener( "click", function() {
  newBackground = "assets/background_5.png";
  game.load.image( "background", newBackground );
  game.state.restart();
});

// Knapparna för ändring av figuren
angryButton.addEventListener( "click", function() {
  newSprite = "assets/angrybird.png";
  game.load.image( "figure", newSprite );
  game.state.restart();
});

catButton.addEventListener( "click", function() {
  newSprite = "assets/cat.png";
  game.load.image( "figure", newSprite );
  game.state.restart();
});

penguinButton.addEventListener( "click", function() {
  newSprite = "assets/penguin.png";
  game.load.image( "figure", newSprite );
  game.state.restart();
});

// Denna knappen sparar poäng med tillhörande namn och avslutar spelet
pausGame.addEventListener( "click", function() {
    localStorage.clear();
    // Pushar in resultatet o namn i ett objekt
    highscore.results.push({
        name: name,
        score: currentScore
    });
    // Skapar highscore med tillhörande resultat i textform med hjälp av stringify, sparar de i lokala datorn
    localStorage.setItem( "Highscore", JSON.stringify(highscore) );
    // While-loopen gör så att arrayen inte skapas om för varje gång ett nytt resultat visas
    while ( resultatet.firstChild ) {
        resultatet.removeChild( resultatet.firstChild );
    }
    // En array som skapar resultatet och lägger till den i ett listelement
    highscore.results.forEach( function( result ) {
        var createList = document.createElement( "li" );
        createList.textContent = "Name: " + result.name + " - " +
            " Score: " + result.score;
        resultatet.appendChild( createList );
    });
    // Ändrar resultat
    currentScore = 0;
    // Nollställer namn
    name = "";
});

// Kod för hastighetsändring
fastButton.addEventListener( "click", function() {
  v = -500;
});

slowButton.addEventListener( "click", function() {
  v = -150;
});

resetButton.addEventListener( "click", function() {
  v = -200;
});

// Bakgrundsmusik
fireButton.addEventListener("click", function() {
  odysseyMusic.pause();
  caprisunMusic.pause();
    // Om fireMusic är pausad, alltså inte igång, kommer den att sättas igång när man klickar på knappen
    if ( fireMusic.paused ) {
        fireMusic.play();
        // Annars förblir den pausad, samma princip gäller för resterande bakgrundsmusik-knappar
    } else {
        fireMusic.pause();
    }
});

odysseyButton.addEventListener( "click", function() {
    fireMusic.pause();
    caprisunMusic.pause();
    if ( odysseyMusic.paused ) {
        odysseyMusic.play();
    } else {
        odysseyMusic.pause();
    }
});

caprisunButton.addEventListener( "click", function() {
    fireMusic.pause();
    odysseyMusic.pause();
    if ( caprisunMusic.paused ) {
        caprisunMusic.play();
    } else {
        caprisunMusic.pause();
    }
});