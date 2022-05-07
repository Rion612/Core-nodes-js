class notFoundController {
  async notFound(reqData, callback) {
    callback(404, {
      status: false,
      message: "The requested URL was not found!",
      error: {}
    });
  }
}
module.exports = new notFoundController();
