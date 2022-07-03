import {submitFunc} from "./src/index.js";
const data = require("../temp5.js");

const records = data.records;

const nodes = data.node;

console.log("data.js records = ",records);
console.log(nodes.length)
const fields={};

for(let i=0;i<records.length;i+=2){
    const f = records[i+1].split(",");
    for(let j=0;j<f.length;j++){
        f[j] = f[j].replace('(','');
        f[j] = f[j].replace(')','');
    }
    console.log("F: ",f);
    fields[records[i]] = f;
}

const getLabel = (name) =>{
        const newLabel = document.createElement("label");
        newLabel.setAttribute("for", 'radio-button');
        name = name.replace("field#","");
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
        value = value.replace("field#","");
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

export const selectedFunc = (name,dependencies,immediate) => {
    document.getElementById("graph-node-selected").replaceChildren();
    document.getElementById("immediate-fields").replaceChildren();
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

        nb.onclick = (e) =>{
            submitFunc(nb.value,null,1);
        }
        injectElements(nb,nl,"graph-node-selected");
    }

    for(let i=0;i<immediate.length/3;i++){
        const nb = getButton("immediate-fields",immediate[i]);
        const nl = getLabel(immediate[i]);

        nb.onclick = (e) =>{
            submitFunc(nb.value,null,1);
        }
        injectElements(nb,nl,"immediate-fields");
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
                     const s = recName.substring(0,6) === "record" ? recName.substring(7) : recName;
                     submitFunc(s,fieldButton.value,0);
                 }

                 injectElements(fieldButton,fieldLabel,"fields");
             }
        });

        injectElements(newButton,newLabel,"datasets");

        console.log(i);
    }
    for(let i=0;i<nodes.length;i++){
        const nodeLabel = getLabel(nodes[i]);
        const nodeButton = getButton('nodes-list',nodes[i]);
        nodeButton.onclick = (e) => {
            console.log('node button clicked');
            submitFunc(null,null,-1,nodeButton.value);
        }

        injectElements(nodeButton,nodeLabel,"nodes-list");
    }
}, false);