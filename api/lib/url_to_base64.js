var fs = require("fs");
// import fetch err
// const fetch = require("node-fetch");
// below line is a workaroumd to the above error
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class Base64Encoding {
  convert_url_to_base64(url) {
    return new Promise(async (res, rej) => {
      var file_name = url.split("/")[url.split("/").length - 1];
      const response = await fetch(url);
      const buffer = await response.buffer();
      fs.writeFile(file_name, buffer, () => {
        var b64content = fs.readFileSync(file_name, { encoding: "base64" });
        fs.unlinkSync(file_name);
        res(b64content);
      });
    });
  }


  convert_url_to_buffer(url) {
    return new Promise(async (res, rej) => {
      var file_name = url.split("/")[url.split("/").length - 1];
      const response = await fetch(url);
      const buffer = await response.buffer();
      fs.writeFile(file_name, buffer, () => {
        var buffer_content = fs.createReadStream(file_name);
        fs.unlinkSync(file_name);
        res(buffer_content);
      });
    });
  }
}

module.exports = new Base64Encoding();
