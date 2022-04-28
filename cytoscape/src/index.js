import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

var nodeHtmlLabel = require("cytoscape-node-html-label");
var expandCollapse = require("cytoscape-expand-collapse");

const data = require("../../temp.js");

const first = data.first;
const second = data.second;
const node = data.node;
const compound_child = data.compound_child;
const compound_parent = data.compound_parent;
const label_arr = data.labels; 
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
console.log("cc : " + compound_child);
console.log("cp : " + compound_parent);
console.log(compound_parent[0]);
cytoscape.use(dagre);

if (typeof cytoscape("core", "expandCollapse") === "undefined") {
  expandCollapse(cytoscape);
}
if (typeof cytoscape("core", "nodeHtmlLabel") === "undefined") {
  nodeHtmlLabel(cytoscape);
}


let Nodes = {};
let expand_data = {}; 
for(let i=0;i<node.length;i++){
        let obj;
        if(compound_child.includes(node[i])){
            const index = compound_child.indexOf(node[i]);
            const par_id = node.indexOf(compound_parent[index]);
            console.log(compound_child[index],compound_parent[index])

            obj = {data : {id : i, label : node[i], parent : par_id}};

            if(node[par_id] == "transform"){
                if(!(par_id in expand_data)) expand_data[par_id] = (String)(node[i]);
                else expand_data[par_id] += (String)(node[i]);
            }  
        }
        else obj = {data : {id : i, label : node[i]}};
        console.log(obj);

        Nodes[i] = (obj);
}
// console.log("nodes = " + Nodes);

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

  const obj = {data : {source : idx[second[i]], target : idx[first[i]], label : l}};
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
console.log("n = ");
for (let i=0;i<n.length;i++) {
  console.log(n[i]);
}
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
        //source-label : The text to display for an edge’s source label.
        //target-label : The text to display for an edge’s target label.

        color: "#9e9e9e", //The colour of the element’s label.
        //"text-opacity": "0.87",             //The opacity of the label text, including its outline.
        "font-family": "Nokia Pure Regular", //A comma-separated list of font names to use on the label text.
        //font-style : A CSS font style to be applied to the label text.
        //font-weight: "",                    //A CSS font weight to be applied to the label text.
        "text-transform": "uppercase", //A transformation to apply to the label text; may be none, uppercase, or lowercase.

        "text-wrap": "ellipsis", //A wrapping style to apply to the label text; may be none for no wrapping (including manual newlines: \n), wrap for manual and/or autowrapping, or ellipsis to truncate the string and append ‘…’ based on text-max-width. Note that with wrap, text will always wrap on newlines (\n) and text may wrap on any breakable whitespace character — including zero-width spaces (\u200b).
        "text-max-width": "100", //The maximum width for wrapped text, applied when text-wrap is set to wrap or ellipsis. For only manual newlines (i.e. \n), set a very large value like 1000px such that only your newline characters would apply.
        //text-overflow-wrap : The characters that may be used for possible wrapping locations when a line overflows text-max-width; may be whitespace (default) or anywhere. Note that anywhere is suited to CJK, where the characters are in a grid and no whitespace exists. Using anywhere with text in the Latin alphabet, for example, will split words at arbitrary locations.
        //text-justification** : The justification of multiline (wrapped) labels; may be left, center, right, or auto (default). The auto value makes it so that a node’s label is justified along the node — e.g. a label on the right side of a node is left justified.
        "line-height": "16px", //The line height of multiline text, as a relative, unitless value. It specifies the vertical spacing between each line. With value 1 (default), the lines are stacked directly on top of one another with no additional whitespace between them. With value 2, for example, there is whitespace between each line equal to the visible height of a line of text.

        "text-valign": "bottom", //The vertical alignment of a node’s label; may have value left, center, or right.
        "text-halign": "right", //The vertical alignment of a node’s label; may have value top, center, or bottom.

        //source-text-offset : For the source label of an edge, how far from the source node the label should be placed.
        //target-text-offset : For the target label of an edge, how far from the target node the label should be placed.

        "text-margin-x": "-10px", //A margin that shifts the label along the x-axis.
        "text-margin-y": "-2px", //A margin that shifts the label along the y-axis.
        //source-text-margin-x : (For the source label of an edge.)
        //source-text-margin-y : (For the source label of an edge.)
        //target-text-margin-x : (For the target label of an edge.)
        //target-text-margin-y : (For the target label of an edge.)

        //text-rotation : A rotation angle that is applied to the label.
        //source-text-rotation : (For the source label of an edge.)
        //target-text-rotation : (For the target label of an edge.)

        //text-outline-color : The colour of the outline around the element’s label text.
        //text-outline-opacity : The opacity of the outline on label text.
        //text-outline-width : The size of the outline on label text.

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
        // position:'relative',
        //"shape-polygon-points": ""  //An array (or a space-separated string) of numbers ranging on [-1, 1], representing alternating x and y values (i.e. x1 y1 x2 y2, x3 y3 ...). This represents the points in the polygon for the node’s shape. The bounding box of the node is given by (-1, -1), (1, -1), (1, 1), (-1, 1). The node’s position is the origin (0, 0).

        "background-color": "#05A18F", //The colour of the node’s body.
        //"background-blacken": "",  //Blackens the node’s body for values from 0 to 1; whitens the node’s body for values from 0 to -1.
        //"background-opacity": "", ////The opacity level of the node’s background colour.
        //"background-fill": "", //The filling style of the node’s body; may be solid (default), linear-gradient, or radial-gradient.

        //"background-gradient-stop-colors": "",  //The colours of the background gradient stops (e.g. cyan magenta yellow).
        //"background-gradient-stop-positions": "",   //The positions of the background gradient stops (e.g. 0% 50% 100%). If not specified or invalid, the stops will divide equally.
        //"background-gradient-direction": "",  //For background-fill: linear-gradient, this property defines the direction of the background gradient.

        //"border-width": "",  //The size of the node’s border.
        //"border-style": "",  //The style of the node’s border; may be solid, dotted, dashed, or double.
        //"border-color": "",  //The colour of the node’s border.
        //"border-opacity": "",  //The opacity of the node’s border.

        //"padding": "",  //The amount of padding around all sides of the node. Either percentage or pixel value can be specified. For example, both 50% and 50px are acceptable values. By default, percentage padding is calculated as a percentage of node width.
        //"padding-relative-to": "",  //Determines how padding is calculated if and only if the percentage unit is used. Accepts one of the keywords specified below.

        //"compound-sizing-wrt-labels": "",  //Whether to include labels of descendants in sizing a compound node; may be include or exclude.
        //"min-width": "",  //Specifies the minimum (inner) width of the node’s body for a compound parent node (e.g. 400px). If the biases for min-width do not add up to 100%, then the biases are normalised to a total of 100%.
        //"min-width-bias-left": "",  //When a compound node is enlarged by its min-width, this value specifies the percent of the extra width put on the left side of the node (e.g. 50%).
        //"min-width-bias-right": "",  //When a compound node is enlarged by its min-width, this value specifies the percent of the extra width put on the right side of the node (e.g. 50%).
        //"min-height": "",  //Specifies the minimum (inner) height of the node’s body for a compound parent node (e.g. 400px). If the biases for min-height do not add up to 100%, then the biases are normalised to a total of 100%.
        //"min-height-bias-top": "",  //When a compound node is enlarged by its min-height, this value specifies the percent of the extra width put on the top side of the node (e.g. 50%).
        //"min-height-bias-bottom": "",  //When a compound node is enlarged by its min-height, this value specifies the percent of the extra width put on the bottom side of the node (e.g. 50%).

        //"background-image": draw.svg("./imgs/ic_equipment_ne.svg").fill("#ffffff"),//"./imgs/ic_equipment_ne.svg", //The URL that points to the image that should be used as the node’s background. PNG, JPG, and SVG are supported formats.
        //"background-image-crossorigin": "", //All images are loaded with a crossorigin attribute which may be anonymous or use-credentials. The default is set to anonymous.
        //"background-image-opacity": "", //The opacity of the background image.
        "background-width": "24px", //Specifies the width of the image. A percent value (e.g. 50%) may be used to set the image width relative to the node width. If used in combination with background-fit, then this value overrides the width of the image in calculating the fitting — thereby overriding the aspect ratio. The auto value is used by default, which uses the width of the image.
        "background-height": "24px" //Specifies the height of the image. A percent value (e.g. 50%) may be used to set the image height relative to the node height. If used in combination with background-fit, then this value overrides the height of the image in calculating the fitting — thereby overriding the aspect ratio. The auto value is used by default, which uses the height of the image.
        //"background-fit": "", //How the background image is fit to the node; may be none for original size, contain to fit inside node, or cover to cover the node.
        //"background-repeat": "", //Whether to repeat the background image; may be no-repeat, repeat-x, repeat-y, or repeat.
        //"background-position-x: "", //The x position of the background image, measured in percent (e.g. 50%) or pixels (e.g. 10px).
        //"background-position-y: "", //The y position of the background image, measured in percent (e.g. 50%) or pixels (e.g. 10px).
        //"background-offset-x: "", //The x offset of the background image, measured in percent (e.g. 50%) or pixels (e.g. 10px).
        //"background-offset-y: "", //The y offset of the background image, measured in percent (e.g. 50%) or pixels (e.g. 10px).
        //"background-width-relative-to: "", //Changes whether the width is calculated relative to the width of the node or the width in addition to the padding; may be inner or include-padding. If not specified, include-padding is used by default.
        //"background-height-relative-to: "", //Changes whether the height is calculated relative to the height of the node or the height in addition to the padding; may be inner or include-padding. If not specified, include-padding is used by default.
        //"background-clip: "", //How background image clipping is handled; may be node for clipped to node shape or none for no clipping.
        //"bounds-expansion": "2px" //Specifies a padding size (e.g. 20px) that expands the bounding box of the node in all directions. This allows for images to be drawn outside of the normal bounding box of the node when background-clip is none. This is useful for small decorations just outside of the node. bounds-expansions accepts 1 value (for all directions), 2 values, ([topAndBottom, leftAndRight]) or 4 values ([top, right, bottom, left]).
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
    // {
    //       selector: "edge .dim,.dim",
    //       style:{
    //           visibility:'hidden',
    //       }
    // },
    // {
    //     selector:".dialogBox",
    //     style:{
    //         shape:'rectangle',
    //         height:"500px",
    //         width:'500px',
    //         // position:'absolute',
    //         right:'10px'
    //     }
    // },
    // {
    //   selector:".expandLabel",
    //   style:{
    //     visibility:'visible',
    //     "text-max-width": "1000",
    //   }
  // }, 
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
          "text-max-width": "1000",
        }
      },
      {
        selector:'node.semitransp',
        style:{
          'opacity': '0.1',
          "text-max-width": "50",
        }
      },
      {
        selector:'edge.highlight',
        style:{
          'mid-target-arrow-color': '#FFF'
        }
      },
      {
        selector:'edge.semitransp',
        style:{
          'opacity': '0.1'
        }
      },
  ],

  layout: {
    name: "dagre",
    padding: 30
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
  console.log(removed[id]);
  if(removed[id]) node.successors().targets().addClass("hidden");
  else node.successors().targets().removeClass("hidden"); 
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
  }
  else{
    var neigh = e.target;
    cy.elements().removeClass('semitransp');
    neigh.removeClass('highlight').outgoers().union(neigh.incomers()).removeClass('highlight');
  }
  tapped[this.id()] = 1 - tapped[this.id()];
});

// cy.on('mouseout', 'node', function(e){
//   var neigh = e.target;
//   cy.elements().removeClass('semitransp');
// neigh.removeClass('highlight').outgoers().union(neigh.incomers()).removeClass('highlight');
// });



// cy.on('tap','node',function(){
//   if(!this.hasClass('dialogBox')){
//     cy.nodes().addClass('dim');
//     this.removeClass('dim');
//     cy.$('#' + this.id()).addClass('dialogBox');  
//   }
//   else{
//     cy.nodes().removeClass('dim');
//     this.removeClass('dialogBox');  
//   }
// })

// let removedData;
// cy.on('tap',"node :child",function(){
//   // console.log(cy.$('#' + this.id()).hasClass('expandLabel'));
//   if(!cy.$('#' + this.id()).hasClass('expandLabel')){
//     // let someNodes = cy.nodes(`[id!='${this.id()}']`);
//   //   this.removeClass('dim');
//     cy.nodes().addClass('dim');
//     cy.nodes().addClass('dim');
//     // cy.nodes().addClass('dim');  
//     cy.$('#' + this.id()).addClass('expandLabel');
//   }
//   else{
//     cy.add(removedData);
//     cy.$('#' + this.id()).removeClass(' expandLabel');  
//     cy.nodes().removeClass('dim');
//   }
// })





// -----------------------------------------------------------------
// trial codes below 


// cy.nodes().addClass('hidden');

// cy.$('#6').removeClass('hidden');
// setTimeout(() => {
//     cy.$("#4").removeClass('hidden')
// },3000);
// cy.ready(function() {
//   let parentNodeIds = ['6']
//   for (id in parentNodeIds) {
//     cy.nodes(`#${parentNodeIds[id]}`).successors().targets().classes('hidden')
//   }
// })

// cy.off("click");
// cy.on("click", function() {
//   cy.$('.hidden').removeClass('hidden')
// });

// let a = {};
// var bfs = cy.elements().bfs({
//   roots: cy.elements().roots(),
//   visit: function(v, e, u, i, depth){
//     console.log(depth)
//       // if(!(depth in a)){
//       //   a.depth = new Array();
//       // }
//       // a[depth].push(v.id());
//   },
//   directed: false
// });





// console.log(cy.$('#2').outgoers().targets()[1].data());
// var nodes = elems.nodes
// for(var x = 0; x < nodes.length; x++){
//   var curNode = cy.$("#" + nodes[x].data.id);
//   var id = curNode.data('id');
//   //get its connectedEdges and connectedNodes
//   var connectedEdges = curNode.connectedEdges(function(){
//       //filter on connectedEdges
//       return !curNode.target().anySame( curNode );
//   });
//   var connectedNodes = connectedEdges.targets();
//   //and store that in childrenData
//   //removed is true because all children are removed at the start of the graph
//   childrenData.set(id, {data:connectedNodes.union(connectedEdges), removed: true}); 
// } 
// var toRemove = [];
// //recursively removing all children of the Start node (all nodes but the Start node will be removed)
// recursivelyRemove(nodes[0].data.id, cy.$("#" + nodes[0].data.id),0);
// //replacing just the first level nodes
// childrenData.get(nodes[0].data.id).data.restore();
// childrenData.get(nodes[0].data.id).removed = false;

// //removes and restores nodes' children on click
// cy.on('tap', 'node', function(){
//   var nodes = this;
//   var id = nodes.data('id')
//   //if the node's children have been removed
//   if (childrenData.get(id).removed == true){
//     childrenData.get(id).data.restore();
//     const nodes = cy.$('#' + id).outgoers();
//     console.log(nodes.data());
//     childrenData.get(id).removed = false;
//     // recursivelyRemove(id,nodes,1);
//   } else {
//     //removed the children nodes and edges recursively

//     toRemove = [];
//     recursivelyRemove(id,nodes,0);

//   }
// });

// //recursively removes all children of the given node
// function recursivelyRemove(id,nodes,flag){
//   //nodes is the starting node where the recursion starts
//   //for loop that runs forever until a break or return, similiar to while true loop
//   console.log('clicked node' + id);
//   for(;;){
//     //setting removed to true for every node (every child, recursively down)
//     nodes.forEach(function(node){
//       childrenData.get(node.data('id')).removed = !flag;
//       if(flag){
//         childrenData.get(id).data.restore();
//         childrenData.get(id).removed = false;
//       }
//     });

//     if(flag){
//       for( var i = toRemove.length - 1; i >= 0; i-- ){ 
//         //removing those nodes (and associated edges)
//         console.log("adding " + toRemove[i].id());
//         childrenData.get(toRemove[i].id()).removed = false;
//         childrenData.get(toRemove[i].id()).data.restore();
//         toRemove[i].add();
//       } 
//       break;
//     }
//     var connectedEdges = nodes.connectedEdges(function(el){
//       //getting connectedEdges from all the nodes that only go down the tree 
//       //aka not keeping edges where their target is a node in the current group of nodes
//       return !el.target().anySame( nodes );
//     });
        
//     var connectedNodes = connectedEdges.targets();
//     //pushing the nodes at the end of those edges (targets) onto toRemove array
//     Array.prototype.push.apply( toRemove, connectedNodes );
//     // setTimeout({},2000);
//     //new set of nodes for next iteration is connectedNodes
//     nodes = connectedNodes;

//     //breaks out of loop if nodes is empty, meaning the last set of nodes had no further children
//     if( nodes.empty() ){ break; }
//     //otherwise loops again, using the newly collected connectedNodes
//   }
//   for( var i = toRemove.length - 1; i >= 0; i-- ){ 
//     //removing those nodes (and associated edges)
//     toRemove[i].remove();
//   } 
// }
