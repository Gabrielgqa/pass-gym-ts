export class ResouceNotFoundError extends Error {
    constructor(){
        super('Resource not found.');
    }
}