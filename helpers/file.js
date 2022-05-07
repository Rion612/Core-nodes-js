const fs = require('fs');

class FileController {
    async checkFileExistOrNot (path){
        try {
            if(fs.existsSync(path)){
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = new FileController()