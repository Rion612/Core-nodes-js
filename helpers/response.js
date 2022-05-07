class ResponseController{
    async success_reponse(message, data = {}) {
        try {
            const obj = {
                status : true,
                message: message,
                data: data
            }
            return obj;
        } catch (error) {
            console.log(error)
        }
    }
    async failure_reponse(message, error = {}) {
        try {
            const obj = {
                status : false,
                message: message,
                error: error
            }
            return obj;
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = new ResponseController();