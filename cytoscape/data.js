import {submitFunc} from "./src/index.js";
const data = require("../temp5.js");

const records = data.records;

console.log("data.js records = ",records);
const fields={};

for(let i=0;i<records.length;i+=2){
    const f = records[i+1].split(",");
    console.log("F: ",f);
    fields[records[i]] = f;
}

const getLabel = (name) =>{
        const newLabel = document.createElement("label");
        newLabel.setAttribute("for", 'radio-button');
        newLabel.innerHTML = name;
        newLabel.style.fontSize = 9;
        newLabel.style.overflowX = scroll;
        return newLabel;
}
const getButton = (name,value)=> {
        const newButton = document.createElement("input");
        newButton.setAttribute("type", 'radio');
        newButton.setAttribute("id", 'radio-button');
        newButton.setAttribute("name", name);
        newButton.setAttribute("value", value);
        newButton.style.width = '8px';
        newButton.style.height = '8px';
        return newButton;
}

const injectElements = (newButton,newLabel,name) => {
        var linebreak = document.createElement("br");

        document.getElementById(name).appendChild(newButton);
        document.getElementById(name).appendChild(newLabel);
        document.getElementById(name).appendChild(linebreak);
        return;
}

export const selectedFunc = (name,dependencies) => {
    console.log("name = " + name,"d = " + dependencies);
    const ele= document.createElement('div');
    const ele2 = document.createElement('div');
    ele.id = 'name';
    ele.innerHTML = "node : " + name;
    ele.style.fontSize = 9;
    ele2.style.fontSize = 9;
    ele2.innerHTML = 'dependencies : ';
    document.getElementById("graph-node-selected").appendChild(ele,ele2);

    for(let i=0;i<dependencies.length;i++){
        const nb = getButton("graph-node-selected",dependencies[i]);
        const nl = getLabel(dependencies[i]);
        injectElements(nb,nl,"graph-node-selected");
    }
    return;
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("datasets").replaceChildren();
    for(let i=0;i<records.length;i+=2){
        const newLabel = getLabel(records[i]);
        const newButton = getButton('datasets',records[i]);
        
        newButton.addEventListener('click',function(){
             document.getElementById("fields").replaceChildren();
             const recName = newButton.value;
             for(let j=0;j<fields[recName].length;j++){
                 const fieldLabel = getLabel(fields[recName][j]);
                 const fieldButton = getButton('fields',fields[recName][j]);
                 
                 fieldButton.onclick = (e) =>{
                    //  e.preventDefault();
                     submitFunc(recName.substring(7),fieldButton.value);
                 }

                 injectElements(fieldButton,fieldLabel,"fields");
             }
        });

        injectElements(newButton,newLabel,"datasets");

        console.log(i);
    }
}, false);

