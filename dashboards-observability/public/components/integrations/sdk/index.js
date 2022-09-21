// const prompt = require('prompt');
const { mkdir } = require('fs').promises;
var fs = require('fs');
const indexTemplate = require('./templates/indexTemplate');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('User Input', function (name) {
    console.log(name);
  rl.question('Where do you live ? ', function (country) {
    console.log(`${name}, is a citizen of ${country}`);
    rl.close();
  });
});

rl.on('close', function () {
  console.log('\nBYE BYE !!!');
  process.exit(0);
});

async function createFileStructure(file){
    if (!fs.existsSync(file)){
        fs.mkdirSync(file, { recursive: true });
        fs.writeFile(`${file}/${file}.tsx`, indexTemplate.content.replace(/{file}/gi,file[0].toUpperCase() + file.slice(1)), function (err) {
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
}

// prompt.start();

// prompt.get(['integerationName'], function (err, result) {
//   if (err) {
//     return onErr(err);
//   }
//   console.log('Command-line input received:');
//   console.log('  Integeration Name : ' + result.integerationName);

//   var actionName = result.integerationName.split(" ");

//   // console.log(test.split(" "));

//   console.log(actionName[0]);
//   switch (actionName[0]) {
//     case 'nginx':
//       createFileStructure(actionName[0]);
//       break;
    
//     case 'apache':
//       createFileStructure(actionName[0]);
//       break;
      
//     case 'clean':
//       cleanFolder(actionName[1]);
//       // createFileStructure(result.integerationName);
//       break;  
  
//     default:
//       console.log("Please Provide Appropriate input");
//       break;
//   }
// });

var folderFile = {
  doc :["constant.tsx", "index.tsx"],
  schema :["schema.ts"],
  tabs: ["index.tsx"]
};

async function createSubFolder(parent) {
  try {
    const dirnames  = ['doc', 'schema', 'tabs'];

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
      .catch(console.error))
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