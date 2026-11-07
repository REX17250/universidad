// Error con código HTTP para que el manejador de errores sepa qué status responder
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

module.exports = HttpError;
