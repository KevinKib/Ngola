const Ngola = require('./ngola').Ngola;
const AI = require('./ai');
const AI_Minimax = require('./ai_minimax');
const Human = require('./human');
const Writer = require('./writer');

class Main {

    static run() {
        this.test_runAI();
    }

    static async test_runAI() {   

        let ngola = new Ngola();

        let nbGames = 0;
        let j1Score = 0;
        let j2Score = 0;

        // Game parameters
        let maxGameLength = 1000;
        const maxNbGames = 1;

        // AI settings
        let randomAI = new AI(ngola);
        let smartAI_0 = new AI_Minimax(ngola, 0);
        let smartAI_1 = new AI_Minimax(ngola, 1);
        let smartAI_2 = new AI_Minimax(ngola, 2);
        let smartAI_3 = new AI_Minimax(ngola, 3);

        const player_human = new Human(ngola);
        

        // Player settings
        let player_1 = smartAI_2;
        let player_2 = player_human;

        const p1_gameOutput = false;
        const p2_gameOutput = false;

        while (nbGames < maxNbGames) {
            let i = 0;

            // Game
            ngola.plateau.ascii_light();
            ngola.initialiser(player_1.initBoard(1));
            ngola.initialiser(player_2.initBoard(2));
            console.log('');
            ngola.plateau.ascii_light();
            console.log('');

            while(ngola.enJeu && ngola.estInitialise && i < maxGameLength) {
                Writer.enableOutput = false;
                
                let move = null;

                if (ngola.joueurCourant === 1)  {
                    Writer.enableOutput = p1_gameOutput;
                    move = await player_1.play();
                    Writer.log('AI_1 | Move played : '+move+'\n');
                }
                else {
                    Writer.enableOutput = p2_gameOutput;
                    move = await player_2.play();
                    Writer.log('AI_2 | Move played : '+move+'\n');
                }

                Writer.enableOutput = true;

                ngola.play(move);
                ngola.plateau.ascii_light();
                Writer.log('');
                i++;
            }

            let etatJeu = this.attribuerPoints(ngola.etatZeroSum);
            [j1Score, j2Score] = [j1Score + etatJeu[0], j2Score + etatJeu[1]];

            nbGames++;
            ngola.reset();

        }

        Writer.enableOutput = true;
        Writer.log('J1Score : '+j1Score);
        Writer.log('J2Score : '+j2Score);

        /*
        console.log(player_1.nbTours + '|' + player_1.nbLegalMoves);
        console.log(player_2.nbTours + '|' + player_2.nbLegalMoves);
        */
        

    }

    /** Attribue les points de la partie à un joueur. 
     * @returns Tableau avec le score du joueur 1 en index 0 et le score du joueur 2 en index 1.
    */
    static attribuerPoints(etatZeroSum) {
        let j1Score = 0;
        let j2Score = 0;

        switch(etatZeroSum) {
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

        return [j1Score, j2Score];
    }

    static test_clone() {   

        let ngola = new Ngola();
        let maxGameLength = 10;
        let i = 0;
        let randomAI = new AI(ngola);

        while(ngola.peutJouer && i < maxGameLength) {
            let move = randomAI.play();
            ngola.play(move);
            i++;
        }
        ngola.actualiserVainqueur();


        // Tests
        let clone = ngola.clone();
        if (ngola.equals(clone)) {
            console.log('verified !');
        }
        ngola.play(clone.listeLegalMoves[0]);
        if (ngola.equals(clone)) {
            console.log('error !');
        }   
    }
}

module.exports.Main = Main;