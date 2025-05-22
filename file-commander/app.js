const fs = require("node:fs/promises");
const { Buffer } = require("node:buffer");

(async () => {
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

  const createFile = async (path) => {
    try {
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();

      return console.log(`The file ${path} already exists.`);
    } catch (e) {
      const newFileHandle = await fs.open(path, "w");
      console.log("A new file was successfully created.");
      newFileHandle.close();
    }
  };

  const deleteFile = async (path) => {
   try {
      const fileHandle = await fs.open(path, "r");
      fileHandle.close();

      await fs.unlink(path);
      console.log(`The file ${path} was successfully deleted.`);
    }
    catch (e) {
      return console.log(`The file ${path} does not exist.`);
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      const fileHandle = await fs.open(oldPath, "r");
      fileHandle.close();

      await fs.rename(oldPath, newPath);
      console.log(`The file ${oldPath} was successfully renamed to ${newPath}.`);
    } catch (error) {
      return console.log(`The file ${oldPath} does not exist.`);
    }
  };

  const addToFile = async (path, content) => {
   try {
      const fileHandle = await fs.open(path, "r");
      fileHandle.close();

      await fs.appendFile(path, content);
      console.log(`A content was successfully appended to the ${path} file.`);
    } catch (error) {
      return console.log(`The file ${path} does not exist.`);
    }
  };

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    const stats = await commandFileHandler.stat();
    const size = stats.size;

    const buff = Buffer.alloc(size);

    const offset = 0;
    const length = buff.byteLength;
    const position = 0;

    await commandFileHandler.read(buff, offset, length, position);

    const command = buff.toString("utf-8");

    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);

      renameFile(oldFilePath, newFilePath);
    }

    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);

      addToFile(filePath, content);
    }
  });

  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
