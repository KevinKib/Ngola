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

        // Game parameters
        let maxGameLength = 1000;
        let maxNbGames = 1;

        // AI settings
        let randomAI = new AI(angola);
        let smartAI_0 = new AI_Minimax(angola, 0);
        let smartAI_1 = new AI_Minimax(angola, 1);
        let smartAI_2 = new AI_Minimax(angola, 2);
        let smartAI_3 = new AI_Minimax(angola, 3);
        

        // Player settings
        let player_1 = smartAI_1;
        let player_2 = smartAI_1;

        let p1_gameOutput = false;
        let p2_gameOutput = false;

        while (nbGames < maxNbGames) {

            // if (nbGames % 1000 == 0) console.log(nbGames);

            let i = 0;

            // Game
            angola.plateau.ascii_light();
            while(angola.enJeu && i < maxGameLength) {
                Writer.enableOutput = false;
                
                let move = null;

                if (angola.joueurCourant === 1)  {
                    Writer.enableOutput = p1_gameOutput;
                    move = player_1.play();
                    Writer.log('AI_1 | Move played : '+move+'\n');
                }
                else {
                    Writer.enableOutput = p2_gameOutput;
                    move = player_2.play();
                    Writer.log('AI_2 | Move played : '+move+'\n');
                }

                Writer.enableOutput = true;

                angola.play(move);
                angola.plateau.ascii_light();
                Writer.log('');
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

        Writer.enableOutput = true;
        Writer.log('J1Score : '+j1Score);
        Writer.log('J2Score : '+j2Score);

        /*
        console.log(player_1.nbTours + '|' + player_1.nbLegalMoves);
        console.log(player_2.nbTours + '|' + player_2.nbLegalMoves);
        */
        

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