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

        let maxNbGames = 1;

        while (nbGames < maxNbGames) {
            let randomAI = new AI(angola);
            let smartAI_0 = new AI_Minimax(angola, 0);
            let smartAI_1 = new AI_Minimax(angola, 1);
            let i = 0;

            angola.plateau.ascii_light();
            while(angola.enJeu && i < maxGameLength) {

                let move = null;

                Writer.enableOutput = false;
                if (angola.joueurCourant === 1)  {
                    move = smartAI_0.play();
                    console.log('AI_1 | Move played : '+move+'\n');
                }
                else {
                    move = smartAI_0.play();
                    console.log('AI_2 | Move played : '+move+'\n');
                }
                Writer.enableOutput = true;

                angola.play(move);
                angola.plateau.ascii_light();
                console.log('');
                i++;
            }

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