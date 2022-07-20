require("dotenv").config();
const fs = require("fs");
const execAsync = require("./utils/exec-async");

const walk = async (dir, extentions) => {
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const filepath = dir + "/" + file;
    const stat = fs.statSync(filepath);
    if (stat && stat.isDirectory()) {
      walk(filepath, extentions);
    } else {
      const extension = file.split(".").pop();
      if (extentions.split(",").includes(extension)) {
        console.log("Uploading File: ", filepath);
        const filename =
          filepath.split("/").reverse()[0].replace(/[^a-zA-Z0-9]/g, "").replace(extension, "") + "." + extension;
        await execAsync(
          `curl --upload-file "${filepath.split("/").map(x => encodeURIComponent(x)).join("/")}" "https://transfer.sh/${filename}"`
        );
      }
    }
  }
};

const main = async (extentions = "mp4,mkv,mov,3gp") => {
  try {
    const filepath = "/data";
    console.log({ filepath });
    await walk(filepath, extentions);
  } catch (error) {
    console.log(error?.response?.data || error?.message);
  }
};

module.exports = main;
