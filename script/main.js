const Angola = require('./angola').Angola;
const AI = require('./ai');
const AI_Minimax = require('./ai_minimax');
const Writer = require('./writer');

class Main {

    static run() {
        this.test_runAI();
    }

    static test_runAI() {   

        let angola = new Angola();

        let nbGames = 0;
        let j1Score = 0;
        let j2Score = 0;

        let maxGameLength = 100;
        let maxNbGames = 1000;

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
                angola.play(move);
                i++;
            }
            angola.actualiserVainqueur();

            switch(angola.etatZeroSum) {
                case 1: 
                    //Writer.log('Joueur 1 gagne.');
                    j1Score++;
                    break;
                case 0: 
                    //Writer.log('Match nul.');
                    j1Score += 0.5;
                    j2Score += 0.5;
                    break;
                case -1: 
                    //Writer.log('Joueur 2 gagne.');
                    j2Score++;
                    break;
                default:
                    //Writer.log('Erreur ?');
                    j1Score += 0.5;
                    j2Score += 0.5;
            }

            nbGames++;
            Writer.log(nbGames);
            angola.reset();
            
        }

        Writer.log('J1Score : '+j1Score);
        Writer.log('J2Score : '+j2Score);
        
    }

    static test_clone() {   

        let angola = new Angola();
        let maxGameLength = 10;
        let i = 0;
        let randomAI = new AI(angola);

        while(angola.peutJouer && i < maxGameLength) {
            let move = randomAI.play();
            angola.play(move);
            i++;
        }
        angola.actualiserVainqueur();


        // Tests
        let clone = angola.clone();
        if (angola.equals(clone)) {
            console.log('verified !');
        }
        angola.play(clone.listeLegalMoves[0]);
        if (angola.equals(clone)) {
            console.log('error !');
        }
        
    }

}

module.exports.Main = Main;