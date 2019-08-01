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

        // GAME SETTINGS
        const maxNbGames = 1;
        const text = {
            board: true,
            p1_thinking: false,
            p2_thinking: true,
        }


        // AI settings
        const randomAI = new AI(ngola);
        const smartAI_0 = new AI_Minimax(ngola, 0);
        const smartAI_1 = new AI_Minimax(ngola, 1);
        const smartAI_2 = new AI_Minimax(ngola, 2);
        const smartAI_3 = new AI_Minimax(ngola, 3);
        const player_human = new Human(ngola);


        // Player settings
        let player_1 = smartAI_0;
        let player_2 = smartAI_1;


        // Variables
        let nbGames = 0;
        let j1Score = 0;
        let j2Score = 0;
        let maxGameLength = 1000;

        while (nbGames < maxNbGames) {
            let i = 0;

            // Game
            ngola.initialiser(player_1.initBoard(1));
            ngola.initialiser(player_2.initBoard(2));

            Writer.enableOutput = text.board;
            Writer.log('\nGame initialized.\n');
            
            ngola.plateau.ascii_light();
            Writer.log('');

            while(ngola.enJeu && ngola.estInitialise && i < maxGameLength) {
                Writer.enableOutput = false;
                
                let move = null;

                if (ngola.joueurCourant === 1)  {
                    Writer.enableOutput = text.p1_thinking;
                    move = await player_1.play();

                    // Display move
                    Writer.enableOutput = text.board;
                    Writer.log('AI_1 | Move played : '+move+'\n');
                }
                else {
                    Writer.enableOutput = text.p2_thinking;
                    move = await player_2.play();

                    // Display move
                    Writer.enableOutput = text.board;
                    Writer.log('AI_2 | Move played : '+move+'\n');
                }

                Writer.enableOutput = text.board;

                try {
                    ngola.play(move);
                }
                catch(e) {
                    console.error('Invalid move.\n');
                }
                
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
        console.log('');

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