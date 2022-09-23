// const prompt = require('prompt');
const { mkdir } = require('fs').promises;
var fs = require('fs');
var path = require('path');
const indexTemplate = require('./templates/indexTemplate');

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

(async() => {
  try {
    const name = await prompt("Action Name: ");

    var actionName = name.split(" ");
    switch (actionName[0]) {
      case 'nginx':
        createFileStructure(actionName[0]);
        break;
      
      case 'apache':
        createFileStructure(actionName[0]);
        break;
        
      case 'clean':
        cleanFolder(path.join(__dirname, `../plugins/${actionName[1]}`));
        break;  
    
      default:
        console.log("Please Provide Appropriate input");
        break;
    }
    // const lastName = await prompt(`Thanks for the test`);
    rl.close();
  } catch (e) {
    console.error("Unable to prompt", e);
  }
})();

// When done reading prompt, exit program 
rl.on('close', () => process.exit(0));

async function createFileStructure(fi){
  let file = path.join(__dirname, `../plugins/${fi}`)
    if (!fs.existsSync(file)){
        fs.mkdirSync(file, { recursive: true });
        fs.writeFile(`${file}/index.tsx`, indexTemplate.content.replace(/{file}/gi,fi[0].toUpperCase() + fi.slice(1)), function (err) {
          if (err) throw err;
        });
        const compl = await createSubFolder(file);
    }else{
        onErr('Already Existed');
    }
}

function onErr(msg){
  console.log(msg);
}

async function createFilesInFolder(dirName,parent){
  folderFile[dirName].map((file) => {
    fs.writeFile(`${parent}/${dirName}/${file}`, '', function (err) {
      if (err) throw err;
    });
  })
};

var folderFile = {
  doc :["constant.tsx", "index.tsx"],
  schema :["schema.ts"]
  // tabs: ["index.tsx"]
};

async function createSubFolder(parent) {
  try {
    const dirnames  = ['doc', 'schema'];
    await Promise.all(
      dirnames.map(dirname => mkdir(`${parent}/${dirname}`)
      .then((res) => {
        if(fs.existsSync(`${parent}/${dirname}`)){
          createFilesInFolder(dirname,parent);
          // console.log(folderFile[dirname]);
          // console.log(dirname);
          console.log(fs.existsSync(`${parent}/${dirname}`));
        }
      })
      .catch((err) => {console.error(err)}))
    );
    // All dirs are created here or errors reported.
  } catch (err) {
    console.error(err);
  }
}

const cleanFolder = function(path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)

    if (files.length > 0) {
      files.forEach(function(filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          cleanFolder(path + "/" + filename)
        } else {
          fs.unlinkSync(path + "/" + filename)
        }
      })
      fs.rmdirSync(path)
    } else {
      fs.rmdirSync(path)
    }
  } else {
    console.log("Integeration path not found.")
  }
}