require("dotenv").config();
const { getDrive, createDir, uploadFile } = require("./drive");
const fs = require("fs");
const delay = require("delay");

const walk = async (dir, driveDirId) => {
  const drive = getDrive();
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    await delay(1500);
    const filepath = dir + "/" + file;
    const stat = fs.statSync(filepath);
    if (stat && stat.isDirectory()) {
      console.log("Create Dir: ", filepath);
      const newDir = await createDir(drive, file, driveDirId);
      await delay(1000);
      walk(filepath, newDir.id);
    } else {
      console.log("Upload File: ", filepath);
      await uploadFile(drive, filepath, file, driveDirId);
      await delay(1000);
    }
  }
};

const main = async (driveParentId = process.env.GA_TMP_DRIVE_PARENT_ID) => {
  try {
    const filepath = "/data";
    console.log({ filepath });
    // const driveParentId = process.argv[2] || process.env.GA_TMP_DRIVE_PARENT_ID;
    await walk(filepath, driveParentId);
  } catch (error) {
    console.log(error?.response?.data || error?.message);
  }
};

// main();
module.exports = main;
