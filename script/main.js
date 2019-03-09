const Angola = require('./angola').Angola;
const AI = require('./ai');
const AI_Minimax = require('./ai_minimax');
const Writer = require('./writer');

class Main {

    constructor() {

    }

    static run() {
        this.test_runAI();
        Writer.log('Pizza !!!!');
        Writer.enableOutput = false;
        Writer.log('Fromage !!!!!');  
    }

    static test_runAI() {   

        let angola = new Angola();

        let nbGames = 0;
        let j1Score = 0;
        let j2Score = 0;

        let maxGameLength = 100;
        let maxNbGames = 100;

        while (nbGames < maxNbGames) {
            let randomAI = new AI(angola);
            let smartAI = new AI_Minimax(angola);
            let i = 0;

            while(angola.peutJouer && i < maxGameLength) {

                let move = null;

                if (i % 2 == 0) {
                    // Joueur 1
                    move = randomAI.play();
                }
                else {
                    // Joueur 2
                    move = randomAI.play();
                }

                //console.log('Move : '+move);
                angola.play(move);
                
                //angola.plateau.ascii_light();
                //console.log('');
                i++;
            }
            angola.actualiserVainqueur();

            switch(angola.etatZeroSum) {
                case 1: 
                    //console.log('Joueur 1 gagne.');
                    j1Score++;
                    break;
                case 0: 
                    //console.log('Match nul.');
                    j1Score += 0.5;
                    j2Score += 0.5;
                    break;
                case -1: 
                    //console.log('Joueur 2 gagne.');
                    j2Score++;
                    break;
                default:
                    //console.log('Erreur ?');
                    j1Score += 0.5;
                    j2Score += 0.5;
            }

            nbGames++;
            console.log(nbGames);
            angola.reset();
            
        }

        console.log('J1Score : '+j1Score);
        console.log('J2Score : '+j2Score);
        
    }

}

module.exports.Main = Main;