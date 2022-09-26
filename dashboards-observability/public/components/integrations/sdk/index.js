// const prompt = require('prompt');
const { mkdir } = require('fs').promises;
var fs = require('fs');
var path = require('path');
const indexTemplate = require('./templates/indexTemplate');

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const availableModule = { 
  'nginx':'nginx',
  'apache':'apache', 
  'mongodb':'mongodb', 
  'mysql':'mysql', 
  'postgres': 'postgres' 
};

var actionName = [];

(async() => {
  try {
    const name = await prompt("Action Name: ");
    actionName = name.split(" ");

    switch (actionName[0]) {
      case availableModule[actionName[0]]:
        createFileStructure(actionName[0]);        
        break;

      case 'clean':
        cleanFolder(path.join(__dirname, `../plugins/${actionName[1]}`));
        rl.close();
        break;  
    
      default:
        console.log("Please Provide Appropriate input");
        rl.close();
        break;
    }
    // const lastName = await prompt(`Thanks for the test`);
    
  } catch (e) {
    console.error("Unable to prompt", e);
  }
})();

rl.on('close', () => process.exit(0));

async function createFileStructure(fi){
  let file = path.join(__dirname, `../plugins/${fi}`)
    if (!fs.existsSync(file)){
        fs.mkdirSync(file, { recursive: true });
        fs.writeFile(`${file}/index.tsx`, indexTemplate.content.replace(/{file}/gi,fi[0].toUpperCase() + fi.slice(1)), function (err) {
          if (err) throw err;
        });
        await createSubFolder(file);
        rl.close();
    }else{
        onErr('Already Existed');
    }
}

function onErr(msg){
  console.log(msg);
}

var folderFile = {
  doc :["constant.tsx", "index.tsx"],
  schema :["schema.ts"]
  // tabs: ["index.tsx"]
};

function createFilesInFolder(dirName,parent){
  console.log("In the filname");
  folderFile[dirName].map((file) => {
    const fileContent = indexTemplate[actionName[0]+''+file.split('.')[0]];
    fs.writeFileSync(`${parent}/${dirName}/${file}`, fileContent);
  })
};

async function createSubFolder(parent) {
  try {
    const dirnames  = ['doc', 'schema'];
    await Promise.all(
      dirnames.map(dirname => mkdir(`${parent}/${dirname}`)
      .then((res) => {
        if(fs.existsSync(`${parent}/${dirname}`)){
          createFilesInFolder(dirname,parent);

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