import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
console.log("dir",process.cwd());
import { selectedFunc } from "../data.js";

var nodeHtmlLabel = require("cytoscape-node-html-label");
var expandCollapse = require("cytoscape-expand-collapse");

const data = require("../../2/temp2.js");

const first = data.first;
const second = data.second;
const node = data.node;
const compound_child = data.compound_child;
const compound_parent = data.compound_parent;
const records = data.records;
const label_arr = data.labels; 
const fieldsToNodes_fields = data.fieldsToNodes_fields;
const fieldsToNodes_nodeName = data.fieldsToNodes_nodeName;
const transformStruct = data.transformStruct;

/*every 3 elements in the array forms [source,target,label] for an edge
  i.e. for some k, 
  data.labels[3*k] = source_name, data.labels[3*k+1] = target_name, data.labels[3*k+2] = label
*/ 

const arr = compound_parent;
let idx = {};
for(let i=0;i<node.length;i++){
  idx[node[i]] = i;
}

// console.log(first);
// console.log("cc : " + compound_child);
// console.log("cp : " + compound_parent);
// console.log(compound_parent[0]);
cytoscape.use(dagre);

if (typeof cytoscape("core", "expandCollapse") === "undefined") {
  expandCollapse(cytoscape);
}
if (typeof cytoscape("core", "nodeHtmlLabel") === "undefined") {
  nodeHtmlLabel(cytoscape);
}


let Nodes = {};
let expand_data = {}; 
let fieldNames_to_num = {};
let fieldNames_to_num_counter = 1;
for(let i=0;i<node.length;i++){
        let obj;
        if(compound_child.includes(node[i])){
            const index = compound_child.indexOf(node[i]);
            const par_id = node.indexOf(compound_parent[index]);
            // console.log(compound_child[index],compound_parent[index])

            obj = {id : i, label : node[i], parent : par_id};
        }
        else obj = {id : i, label : node[i]};

        let node_index; 
        // console.log(node[i]);
        //// start 25.06
        if(fieldsToNodes_nodeName.includes(node[i])){

            node_index = fieldsToNodes_nodeName.indexOf(node[i]);


            const fieldNames = fieldsToNodes_fields[node_index];

            for(let l=0;l<fieldNames.length;l++){
              const field = fieldNames[l];
              field = field.replace(".field#","");
              field = field.replace("field#","");
              let num;
              if(!(field in fieldNames_to_num)){
                 fieldNames_to_num[field] = fieldNames_to_num_counter;
                 fieldNames_to_num_counter += 1;
              }
              num = fieldNames_to_num[field];
              obj = { ...obj,[num] : '1'}
            }
              // obj = {...obj,[i]:'1'};
        }

        console.log(obj);

        Nodes[i] = ({data:obj});
}
// console.log("nodes = " + Nodes);
console.log("fieldNames_to_num : ",fieldNames_to_num);
let Edges = [];
let LabelNames = {};

for(let j=0;j<label_arr.length;j+=3){
    const idx_source = node.indexOf(label_arr[j]);
    const idx_target = node.indexOf(label_arr[j+1]);
    LabelNames[idx_source + "-" + idx_target] = label_arr[j+2];
}

for(let i=0;i<first.length;i++){

  const s = idx[second[i]] + "-" +idx[first[i]];
  let l = "edge";
  if(s in LabelNames) l = LabelNames[s];

  const obj = {data : {source : idx[first[i]], target : idx[second[i]], label : l}};
  // console.log(i,obj);
  Edges.push(obj);
}

// console.log("edges = " + Edges);

let n = [];
const keys = Object.keys(Nodes);
for(let i=0;i<keys.length;i++){
  if(keys[i] in expand_data){
      Nodes[keys[i]].data.expand = expand_data[i];
  }
  n.push(Nodes[i]);
}
// console.log("n = ");
// for (let i=0;i<n.length;i++) {
//   console.log(n[i]);
// }
var elems = {
    nodes : n,
    edges : Edges,
  };


var cy = (window.cy = cytoscape({
  container: document.getElementById("cy"),

  boxSelectionEnabled: false,
  autounselectify: true,

  ready: function () {
    var api = this.expandCollapse({
      layoutBy: {
        name: "dagre",
        animate: "end",
        randomize: false,
        fit: false
      },
      fisheye: false,
      animate: false,
      undoable: false,
      expandCollapseCuePosition: "top-left",
      expandCollapseCueSize: 12,
      expandCollapseCueLineSize: 20,
      expandCueImage: "./imgs/expand-alt-solid.svg",
      collapseCueImage: "./imgs/compress-alt-solid.svg",
      expandCollapseCueSensitivity: 1,
      edgeTypeInfo: "edgeType",
      groupEdgesOfSameTypeOnCollapse: false,
      allowNestedEdgeCollapse: false,
      zIndex: 999

      //layoutBy: dagre, // to rearrange after expand/collapse. It's just layout options or whole layout function. Choose your side!
      // recommended usage: use cose-bilkent layout with randomize: false to preserve mental map upon expand/collapse
      //fisheye: true, // whether to perform fisheye view after expand/collapse you can specify a function too
      //animate: false, // whether to animate on drawing changes you can specify a function too
      //animationDuration: 1000, // when animate is true, the duration in milliseconds of the animation
      //ready: function () {}, // callback when expand/collapse initialized
      //undoable: true, // and if undoRedoExtension exists,
      //cueEnabled: true, // Whether cues are enabled
      //expandCollapseCuePosition: "top-right", // default cue position is top left you can specify a function per node too
      //expandCollapseCueSize: 12, // size of expand-collapse cue
      //expandCollapseCueLineSize: 8, // size of lines used for drawing plus-minus icons
      //expandCueImage: undefined, // image of expand icon if undefined draw regular expand cue
      //collapseCueImage: undefined, // image of collapse icon if undefined draw regular collapse cue
      //expandCollapseCueSensitivity: 1, // sensitivity of expand-collapse cues
      //edgeTypeInfo: "edgeType", // the name of the field that has the edge type, retrieved from edge.data(), can be a function, if reading the field returns undefined the collapsed edge type will be "unknown"
      //groupEdgesOfSameTypeOnCollapse: false, // if true, the edges to be collapsed will be grouped according to their types, and the created collapsed edges will have same type as their group. if false the collapased edge will have "unknown" type.
      //allowNestedEdgeCollapse: true, // when you want to collapse a compound edge (edge which contains other edges) and normal edge, should it collapse without expanding the compound first
      //zIndex: 999 // z-index value of the canvas in which cue ımages are drawn
    });
    //api.collapseAll();
  },
  style: [
    //CORE
    {
      selector: "core",
      css: {
        //"active-bg-color": "",                      //The colour of the indicator shown when the background is grabbed by the user.
        //"active-bg-opacity": "",                    //The opacity of the active background indicator.
        "active-bg-size": 0 //The size of the active background indicator.

        //"selection-box-color": "",                  //The background colour of the selection box used for drag selection.
        //"selection-box-border-color": "",           //The colour of the border on the selection box.
        //"selection-box-border-width": "",           //The size of the border on the selection box.
        //"selection-box-opacity": ""                 //The opacity of the selection box.

        //"outside-texture-bg-color": "",             //The colour of the area outside the viewport texture when initOptions.textureOnViewport === true.
        //"outside-texture-bg-opacity": ""            //The opacity of the area outside the viewport texture.
      }
    },

    //LABEL
    {
      selector: "label",
      css: {
        label: "data(label)", //The text to display for an element’s label (demo).

        color: "#9e9e9e", //The colour of the element’s label.
        
        "font-family": "Nokia Pure Regular", //A comma-separated list of font names to use on the label text.
       
        "text-transform": "uppercase", 

        "text-wrap": "ellipsis", 
        "text-max-width": "100", 
       
        "line-height": "16px", //The line height of multiline text, as a relative, unitless value. It specifies the vertical spacing between each line. With value 1 (default), the lines are stacked directly on top of one another with no additional whitespace between them. With value 2, for example, there is whitespace between each line equal to the visible height of a line of text.

        "text-valign": "bottom", //The vertical alignment of a node’s label; may have value left, center, or right.
        "text-halign": "right", //The vertical alignment of a node’s label; may have value top, center, or bottom.

        "text-margin-x": "-10px", //A margin that shifts the label along the x-axis.
        "text-margin-y": "-2px", //A margin that shifts the label along the y-axis. 

        "text-background-opacity": "1", //The opacity of the label background; the background is disabled for 0 (default value).
        "text-background-shape": "roundrectangle", //The shape to use for the label background, can be rectangle or round-rectangle.
        "text-background-padding": "3px" //A padding on the background of the label (e.g 5px); zero padding is used by default.
      }
    },
    {
      selector:"node:label",
      css:{
        "text-background-color": "#ebebeb", //A colour to apply on the text background.
        "font-size": "15px", //The size of the label text.
      }
    },
    {
      selector:"edge:label",
      css:{
        "text-background-color": "#ffe", //A colour to apply on the text background.
        "font-size" : "10px"
      }
    },
    //NODE
    {
      selector: "node",
      css: {
        width: "38px", //The width of the node’s body.
        height: "38px", //The height of the node’s body.
        shape: "ellipsis", //The shape of the node’s body. Note that each shape fits within the specified width and height, and so you may have to adjust width and height if you desire an equilateral shape (i.e. width !== height for several equilateral shapes). Only *rectangle shapes are supported by compounds, because the dimensions of a compound are defined by the bounding box of the children.
      

        "background-color": "#05A18F", //The colour of the node’s body.
       
        "background-width": "24px", 
        "background-height": "24px" 
         }
    },
    {
      selector: "node.hover",
      css: {
        //"background-color": "#6e6e6e",
        //"border-width": "4px",
        //"border-color": "#5da4ef",
        //"bounds-expansion": "0px"
      }
    },
    {
      selector: "node:selected",
      css: {
        "background-color": "#9e9e9e",
        "border-width": "4px",
        "border-color": "#5DA4EF",
        "bounds-expansion": "0px"
      }
    },
    {
      selector: "node:selected.hover",
      css: {
        "background-color": "#6e6e6e",
        "border-width": "4px",
        "border-color": "#5da4ef",
        "bounds-expansion": "0px"
      }
    },
    //GROUP
    {
      selector: "$node > node",
      css: {
        "background-color": "#fff",
        "background-image": null,
        "border-width": "1px",
        "border-color": "#ccc",

        //LABEL
        color: "#fff",
        "text-margin-x": "0px",
        "text-margin-y": "-4px",
        "text-background-color": "#ccc",
        "text-background-padding": "4px"
      }
    },
    {
      selector: ":parent",
      css: {
        "text-valign": "top",
        "text-halign": "center"
      }
    },
    //EDGE
    {
      selector: "edge",
      style: {
        width: 2,
        "curve-style": "bezier",
        "target-arrow-shape": "triangle",
        //LABEL
        // label: "data('label')",
        // "text-background-color": "#ebcebeb",
        // "background-color" : "red"
      }
    },
    {
      selector: "edge.hover",
      style: {
        width: 2,
        "line-color": "#239df9"
      }
    },
    {
      selector: "edge:selected",
      style: {
        width: 1,
        "line-color": "#239df9"
      }
    },
    {
      selector:'.hidden',
      style:{
        'display' : 'none'
      }
    }, 
    {
      selector:'node.highlight',
      style:{
        'border-color': '#FFF','border-width': '2px',
        "text-max-width": "100000",
      }
    },
    {
      selector:'node.semitransp',
      style:{
        'opacity': '0.1',
        "text-max-width": "50",
         "background-color":'magenta',
         
      }
    },
    {
      selector:'edge.highlight',
      style:{
        'mid-target-arrow-color': 'cyan',
        'line-color': 'red',
      }
    },
    {
      selector:'edge.semitransp',
      style:{
        'opacity': '0.1'
      }
    },
    {
      selector:'edge.selected_edges',
      style:{
        'line-color': 'red',
        'target-arrow-color': '#b830f7',
        'opacity':'1',
      }
    }, 
      {
        selector:'.clickedNode',
        style:{
           'border-color':'red',
           'text-max-width' : "100000",
        }
      },
  ],
  layout: {
    name: "dagre",
    // name: "dagre",
    // rankDir:  "LR",
    // animate: false,
    // fit: true,
    // padding: 50,
    // spacingFactor: 1.2,
  },






  // layout: {
  //   name: "dagre"
  // },

  // style: [
  //   {
    //   selector: "node",
    //   style: {
    //     label: "data(label)",
    //     shape: "roundrectangle",
    //     width: "1000px",
    //     height: "100px",
    //     textWrap: "wrap",
    //     "text-valign": "center",
    //     "text-halign": "center",
    //     "background-color": "grey",
    //     "border-color": "black",
    //     "border-width": 2,
    //   }
    // },
    // {
    //   selector: ':parent',
    //   css: {
    //     width:'2000px',
    //     height:'30000px',
    //   }
    // },
    // {
    //   selector: ':child',
    //   css: {
    //     width:"900px",
    //     height:"100px",
    //     opacity:'80%'
    //   }
    // },
    // {
  //     selector : ".hidden",
  //     style:{
  //       display:'none',
  //     },
  //   },
  //   {
  //     selector: "edge",
  //     style: {
  //       "curve-style": "bezier",
  //       width: 4,
  //       "target-arrow-shape": "triangle",
  //       "line-color": "#9dbaea",
  //       "target-arrow-color": "#9dbaea"
  //     }
  //   }
  // ],
  elements:elems,
  
}));


let selected_nodes = null;

export const submitFunc = (record,field,flag,label=null) => {
  
  if(selected_nodes){
    console.log('clearing selected_nodes in submitFunc...');
    cy.$("*").not(selected_nodes).removeClass('semitransp');
    cy.$("*").not(selected_nodes).connectedEdges().removeClass('semitransp');
    selected_nodes.removeClass('highlight');
    selected_nodes.connectedEdges().removeClass('highlight');
    selected_nodes.connectedEdges().removeClass('selected_edges');
    selected_nodes = null;
  }

  let queryVal;
  if(flag == 0){
    field = field.replace("field#","");
    console.log("record = ",record,"field = ",field);
    const search = record + field;
    console.log(search);
    search = fieldNames_to_num[search];
    console.log(search);
    queryVal = `node[` + search + ` = '1']`;
  }
  else if(flag > 0){
    record = record.replace(".field#","");
    record = record.replace("field#","");
    record = record.replace(".","");
    console.log("record = ",record);
    queryVal = `node[` + fieldNames_to_num[record] + ` = '1']`,queryVal = queryVal.replace("#","\\#");
  }
  else{
    console.log('label ' + label);
    queryVal = `node[label=` + `'` + label + `'` + `]`;
  }
  console.log("query = ",queryVal);
  selected_nodes = cy.filter(queryVal);
  // console.log(selected_nodes[0]);
  cy.$("*").not(selected_nodes).addClass('semitransp');
  cy.$("*").not(selected_nodes).connectedEdges().addClass('semitransp');
  selected_nodes.removeClass('semitransp');
  selected_nodes.connectedEdges().removeClass('semitransp');
  selected_nodes.addClass('highlight');
  selected_nodes.connectedEdges().addClass('highlight');
  selected_nodes.connectedEdges().addClass('selected_edges');
};

const clickFunc = (s) => {

  // if(!fieldsToNodes_nodeName.includes(s)) return;
  if(selected_nodes){
    console.log('clearing selected_nodes in clickFunc...');
    cy.$("*").not(selected_nodes).removeClass('semitransp');
    cy.$("*").not(selected_nodes).connectedEdges().removeClass('semitransp');
    selected_nodes.removeClass('highlight');
    selected_nodes.connectedEdges().removeClass('highlight');
    selected_nodes.connectedEdges().removeClass('selected_edges');
    selected_nodes = null;
  }
  const node_index = fieldsToNodes_nodeName.indexOf(s);
  const fieldNames = fieldsToNodes_fields[node_index];
  const immediate = fieldsToNodes_fields[node_index];
  selectedFunc(s,fieldNames,immediate);
  console.log('sent');
  return;
}

//---------- for collapse expand 
const removed = {};
cy.on('cxttapstart','node',function(){
  const node = cy.nodes('#' + this.id());
  const id = this.id();
  node.successors().targets().addClass("hidden");
  if(!(id in removed)){
      removed[id] = 1;
  }
  else{
      removed[id] = 1 - removed[id];
  }
  // console.log(removed[id]);
  if(removed[id]){
    node.successors().targets().addClass("hidden");
    node.successors().sources('[id!=\'' + id + '\']').addClass("hidden");
    node.successors().siblings('[id!=\'' + id + '\']').addClass("hidden");
    node.successors().addClass("hidden");
  }
  else{
    node.successors().removeClass("hidden"); 
    // node.successors().('[id!=\'' + id + '\']').removeClass("hidden");
  }
});
// ---------------
let tapped={};
cy.on('click', 'node', function(e){

  if(!(this.id() in tapped)){
    tapped[this.id()] = 1;
  }
  if(tapped[this.id()]){

    var neigh = e.target;
    cy.elements().difference(neigh.outgoers().union(neigh.incomers())).not(neigh).addClass('semitransp');
    neigh.addClass('highlight').outgoers().addClass('highlight');
    cy.$('#' + this.id()).addClass('clickedNode');

    clickFunc(cy.$('#' + this.id()).data('label'));
  }
  else{
    var neigh = e.target;
    cy.elements().removeClass('semitransp');
    neigh.removeClass('highlight').outgoers().union(neigh.incomers()).removeClass('highlight');
    cy.$('#' + this.id()).removeClass('clickedNode');
    // for records only
    if(selected_nodes){
      console.log('clearing selected_nodes in clickFunc...');
      cy.$("*").not(selected_nodes).removeClass('semitransp');
      cy.$("*").not(selected_nodes).connectedEdges().removeClass('semitransp');
      selected_nodes.removeClass('highlight');
      selected_nodes.connectedEdges().removeClass('highlight');
      selected_nodes.connectedEdges().removeClass('selected_edges');
      selected_nodes = null;
    }
    // console.log(cy.$('#' + this.id()).data('label'));
    const label = cy.$('#' + this.id()).data('label');
  }
  tapped[this.id()] = 1 - tapped[this.id()];
});

