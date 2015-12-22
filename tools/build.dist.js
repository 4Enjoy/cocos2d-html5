var fs = require("fs");
var path = require("path");
console.log("Publishing...");

var projectDir = process.cwd();

var projectJson = require(path.join(projectDir, "project.json"));
var engineDir = path.join(projectJson.engineDir || "frameworks/cocos2d-html5", "/");
var realEngineDir = path.join(projectDir, engineDir, "/");

var builder_dir = path.join(realEngineDir, "Builder");
function getList() {
    var list = null;
    function example(m) {
        list = m;
    }
    var code = fs.readFileSync(path.join(builder_dir, 'module.js'), "utf8");
    code += "example(module);";
    eval(code);
    return list.info;
}

var MODULES_LIST = getList();
var PROJECT_LIST = projectJson.modules;

var USED = {};
var ORDER = [];
var CACHE = {};

MODULES_LIST.forEach(function(m){
    CACHE[m.name] = m;
});

function addModule(name) {
    if(name in USED) {
        return;
    }

    if(!(name in CACHE)) {
        throw new Error("Unknown Module "+ name);
    }

    var m = CACHE[name];


    USED[m.name] = 1;
    ORDER.push(m.name);

    //if(projectJson.webgl) {
    //    var x = m.name + "-webgl";
    //    if(x in CACHE) {
    //        addModule(x);
    //    }
    //}
    //
    //m.rule.forEach(addModule);



}

//if(projectJson.webgl) {
//    PROJECT_LIST = PROJECT_LIST.map(function(m){
//        var name = m + "-webgl";
//        if(name in CACHE) {
//            return name;
//        }
//        return m;
//    })
//}

PROJECT_LIST.forEach(addModule);


function pack(source, destination) {
    var file = "";
    ORDER.forEach(function(m){
        var file_name = path.join(source, m + ".js");
        if(fs.existsSync(file_name)) {
            var content = fs.readFileSync(file_name, "utf8");
            file += content + "\n";
        }

    });

    fs.writeFileSync(destination, file);
}


console.log(ORDER);

var NAME = projectJson.outname || "cocos";

pack(path.join(builder_dir, "src"), path.join(projectDir, NAME + ".js"));
pack(path.join(builder_dir, "dist"), path.join(projectDir, NAME + ".min.js"));
//console.log(ORDER);

return;
