const fs = require("fs");
const path = require("path");
const Buffer = require("buffer").Buffer;
const { checkFileExistOrNot } = require("../helpers/file");
const status_code = require("../constants/statusCodes");
const { success_reponse, failure_reponse } = require("../helpers/response");
const messages = require("../constants/messages");
const { notFound } = require("./notFound");
const filePath = path.join(path.dirname(__dirname), "/Data/data.json");
class studentContoller {
  async getAllStudentList(reqData, callback) {
    try {
      if (reqData.method == "get") {
        const fileExist = await checkFileExistOrNot(filePath);
        if (fileExist) {
          let data = fs.readFileSync(
            path.join(path.dirname(__dirname), "/Data/data.json")
          );
          if (data.length) {
            const students = JSON.parse(data);
            callback(
              status_code.HTTP_OK,
              await success_reponse(messages.DataFound, students)
            );
          } else {
            callback(
              status_code.HTTP_OK,
              await success_reponse(messages.DataNotFound, students)
            );
          }
        } else {
          callback(
            status_code.HTTP_INTERNAL_SERVER_ERROR,
            await failure_reponse(messages.FileNotFound)
          );
        }
      } else {
        await notFound(reqData, callback);
      }
    } catch (error) {
      callback(
        status_code.HTTP_INTERNAL_SERVER_ERROR,
        await failure_reponse(messages.ServerError, error)
      );
    }
  }
  async createStudent(reqData, callback) {
    try {
      if (reqData.method == "post") {
        const fileExist = await checkFileExistOrNot(filePath);
        if (fileExist) {
          let data = fs.readFileSync(
            path.join(path.dirname(__dirname), "/Data/data.json")
          );
          let students = JSON.parse(data);
          const id = Math.floor(Math.random() * 100) + 1;
          const name = reqData.body.name;
          const email = reqData.body.email;
          const obj = { id, name, email };
          if (id && name && email) {
            students.push(obj);
            fs.writeFileSync(
              path.join(path.dirname(__dirname), "/Data/data.json"),
              JSON.stringify(students),
              {
                encoding: "utf8",
                flag: "w",
              }
            );
            callback(
              status_code.HTTP_OK,
              await success_reponse(messages.StudentCreated, obj)
            );
          } else {
            callback(
              status_code.HTTP_OK,
              await failure_reponse(messages.ValidationError)
            );
          }
        } else {
          callback(
            status_code.HTTP_INTERNAL_SERVER_ERROR,
            await failure_reponse(messages.FileNotFound)
          );
        }
      } else {
        await notFound(reqData, callback);
      }
    } catch (error) {
      callback(
        status_code.HTTP_INTERNAL_SERVER_ERROR,
        await failure_reponse(messages.ServerError, error)
      );
    }
  }
  async deleteStudent(reqData, callback) {
    try {
      if (reqData.method == "delete") {
        const fileExist = await checkFileExistOrNot(filePath);
        if (fileExist) {
          let data = fs.readFileSync(
            path.join(path.dirname(__dirname), "/Data/data.json")
          );
          let students = JSON.parse(data);
          const id = reqData.params;
          const data_found = students.find((x) => x.id == id);
          if (data_found) {
            const keyword = reqData.queryStringObject.keyword;
            if (keyword) {
              if (keyword == "DELETE") {
                students = students.filter((x) => x.id != id);
                fs.writeFileSync(
                  path.join(path.dirname(__dirname), "/Data/data.json"),
                  JSON.stringify(students),
                  {
                    encoding: "utf8",
                    flag: "w",
                  }
                );
                callback(
                  status_code.HTTP_OK,
                  await success_reponse(messages.StudentRemoved)
                );
              } else {
                callback(
                  status_code.HTTP_OK,
                  await failure_reponse(messages.KeywordNotMatch)
                );
              }
            } else {
              callback(
                status_code.HTTP_OK,
                await failure_reponse(messages.KeywordRequired)
              );
            }
          } else {
            callback(
              status_code.HTTP_OK,
              await failure_reponse(messages.DataNotFound)
            );
          }
        }
        else {
          callback(
            status_code.HTTP_INTERNAL_SERVER_ERROR,
            await failure_reponse(messages.FileNotFound)
          );
        }
      } else {
        await notFound(reqData, callback);
      }
    } catch (error) {
      callback(
        status_code.HTTP_INTERNAL_SERVER_ERROR,
        await failure_reponse(messages.ServerError, error)
      );
    }
  }
  async editStudent(reqData, callback) {
    try {
      if (reqData.method == "put") {
        const fileExist = await checkFileExistOrNot(filePath);
        if (fileExist) {
          let data = fs.readFileSync(
            path.join(path.dirname(__dirname), "/Data/data.json")
          );
          let students = JSON.parse(data);
          const id = reqData.body.id;
          let position;
          let std_data;
          let f = false;
          for (let i = 0; i < students.length; i++) {
            if (students[i].id == id) {
              f = true;
              std_data = students[i];
              position = i;
              break;
            }
          }
          if (!f) {
            callback(
              status_code.HTTP_OK,
              await failure_reponse(messages.DataNotFound)
            );
          } else {
            if (reqData.body.name) {
              std_data.name = reqData.body.name;
            }
            if (reqData.body.email) {
              std_data.email = reqData.body.email;
            }
            students[position] = std_data;
            fs.writeFileSync(
              path.join(path.dirname(__dirname), "/Data/data.json"),
              JSON.stringify(students),
              {
                encoding: "utf8",
                flag: "w",
              }
            );
            callback(
              status_code.HTTP_OK,
              await success_reponse(messages.StudentUpdated, std_data)
            );
          }
        } else {
          callback(
            status_code.HTTP_INTERNAL_SERVER_ERROR,
            await failure_reponse(messages.FileNotFound)
          );
        }
      } else {
        await notFound(reqData, callback);
      }
    } catch (error) {
      callback(
        status_code.HTTP_INTERNAL_SERVER_ERROR,
        await failure_reponse(messages.ServerError, error)
      );
    }
  }
  async uploadFile(reqData, callback) {
    try {
      if (reqData.method == "post") {
        if (reqData.body && reqData.body.files) {
          // console.log(reqData.body.files)
          for (let i = 0; i < reqData.body.files.length; i++) {
            const uploadPath = path.join(
              path.dirname(__dirname),
              "/uploads/",
              reqData.body.files[i].filename
            );
            console.log(uploadPath);
            fs.open(uploadPath, "w", function (err, r) {
              if (r) {
                fs.writeFileSync(
                  uploadPath,
                  Buffer.from(reqData.body.files[i].value, "latin1")
                );
              }
            });
          }
          callback(
            status_code.HTTP_OK,
            await success_reponse(messages.FileUploaded)
          );
        } else {
          callback(
            status_code.HTTP_OK,
            await success_reponse(messages.FileIsNotSelected)
          );
        }
      } else {
        await notFound(reqData, callback);
      }
    } catch (error) {
      callback(
        status_code.HTTP_INTERNAL_SERVER_ERROR,
        await failure_reponse(messages.ServerError, error)
      );
    }
  }
}
module.exports = new studentContoller();
