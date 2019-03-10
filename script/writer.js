/** Permet de gérer l'affichage; l'activer ou le désactiver, à souhait. */
class Writer {

    /** Méthode permettant d'écrire dans la console, si l'affichage est activé. */
    static log(message) {
        if (Writer.outputEnabled === true) {
            console.log(message);
        }
    }

    /** Méthode permettant d'écrire dans la console sans sauter de ligne, si l'affichage est activé. */
    static logOnLine(message) {
        if (Writer.outputEnabled === true) {
            process.stdout.write(message);
        }
    }

    /** Mutateur de la variable d'affichage. */
    static set enableOutput(bool) {
        Writer.outputEnabled = bool;
    }

}

/** Variable indiquant si l'affichage est activé ou non. */
Writer.outputEnabled = true;

module.exports = Writer;