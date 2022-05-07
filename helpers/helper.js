const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes/routes");
const notFoundController = require("../controllers/notFound");
const querystring = require('querystring');
const { getBoundary } = require("./file");

class HelperHandler {
  async handleReqRes(req, res) {
    const parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    let params;
    if (path.match(/\/student\/delete\/([0-9]+)/)) {
      let p = path.split("/");
      path = p[1] + "/" + p[2];
      params = p[3];
    }
    let trimmedPath = path.replace(/^\/+|\/+$/g, "");
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;
    const contentType = req.headers['content-type'];
    let requestProperties = {
      parsedUrl,
      path,
      trimmedPath,
      method,
      queryStringObject,
      params,
      headersObject,
    };
    let realData = "";
    const chosenHandler = routes[trimmedPath]
      ? routes[trimmedPath]
      : notFoundController.notFound;
    // const decoder = new StringDecoder('latin1');
    if(contentType && contentType.includes(';')){
      if(contentType.split(';')[0] == "multipart/form-data") {
        req.setEncoding('latin1');
      }
      else {
        req.setEncoding('utf8')
      }
    }
    if (
      contentType &&
      (contentType.includes("image/") || contentType.includes("text/"))
    ) {
      req.setEncoding("latin1");
    }
    req.on("data", (chunk) => {
      realData += chunk;
      // realData += decoder.write(chunk);
    });
    req.on("end", () => {
      // console.log(typeof realData)
      if (realData) {
        if (contentType == "application/json") {
          realData = JSON.parse(realData);
        } else if (contentType.split(';')[0] == "multipart/form-data") {
          let contentType_array = contentType.split(';');
          let boundary = contentType_array[1].trim();
          boundary = boundary.slice(9);
          realData = realData.split(boundary)
          let result = {};
          for(let element of realData){
            let name = element.match(/(?:name=")(.+?)(?:")/);
            if(!name) continue;
            let value = element.match(/(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/)
            if(!value) continue;
            let filename = element.match(/(?:filename=")(.*?)(?:")/)
            if(filename){
              const file = {};
              file['value'] = value[1];
              file['filename'] = filename[1].trim();
              let content_type = element.match(/(?:Content-Type:)(.*?)(?:\r\n)/)
              file['Content-Type'] = content_type[1].trim();
              if (!result.files) {
                result.files = []
              }
              result.files.push(file)
            }else {
              result[name[1]] = value[1];
            }
          }
          realData = result;
        }
        else if (contentType.includes("image/") || contentType.includes("text/")
        ) {
          let files =[];
          const contentType_array = contentType.split('/');
          if(contentType_array[0] == 'text'){
            const obj = {
              value : realData,
              filename: Date.now()+'.'+'txt',
              content_type: contentType,
            }
            files.push(obj)
          }
          else if(contentType_array[0] == 'image'){
            const obj = {
              value : realData,
              filename: Date.now()+'.'+'jpg',
              content_type: contentType,
            }
            files.push(obj)
          }
          realData = { files }
        }
        else {
          realData = querystring.decode(realData);
        }
        requestProperties.body = realData;
      }
      chosenHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof statusCode === "number" ? statusCode : 500;
        payload = typeof payload === "object" ? payload : {};
        res.setHeader("Content-Type", "application/json");
        res.writeHead(statusCode);
        res.end(JSON.stringify(payload));
      });
    });
  }
}

module.exports = new HelperHandler();
