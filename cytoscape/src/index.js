import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

const data = require("../../temp.js");

const first = data.first;
const second = data.second;
const node = data.node;
const compound_child = data.compound_child;
const compound_parent = data.compound_parent;

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

let Nodes = []; 
for(let i=0;i<node.length;i++){
        let obj;
        if(compound_child.includes(node[i])){
            const index = compound_child.indexOf(node[i]);
            const par_id = node.indexOf(compound_parent[index]);
            console.log(compound_child[index],compound_parent[index])
            obj = {data : {id : i, label : node[i], parent : par_id}};
        }
        else obj = {data : {id : i, label : node[i]}};
        console.log(obj);
        Nodes.push(obj);
}
console.log("nodes = " + Nodes);

let Edges = [];
for(let i=0;i<first.length;i++){
  const obj = {data : {source : idx[second[i]], target : idx[first[i]]}};
  // console.log(i,obj);
  Edges.push(obj);
}

console.log("edges = " + Edges);

var elems = {
    nodes : Nodes,
    edges : Edges,
  };

var childrenData = new Map(); //holds nodes' children info for restoration

var cy = (window.cy = cytoscape({
  container: document.getElementById("cy"),

  boxSelectionEnabled: false,
  autounselectify: true,

  layout: {
    name: "dagre"
  },

  style: [
    {
      selector: "node",
      style: {
        label: "data(label)",
        shape: "roundrectangle",
        width: "1000px",
        height: "100px",
        textWrap: "wrap",
        "text-valign": "center",
        "text-halign": "center",
        "background-color": "grey",
        "border-color": "black",
        "border-width": 2,
      }
    },
    {
      selector: ':parent',
      css: {
        width:'2000px',
        height:'30000px',
      }
    },
    {
      selector: ':child',
      css: {
        width:"900px",
        height:"100px",
        opacity:'80%'
      }
    },
    {
      selector : ".hidden",
      style:{
        display:'none',
      },
    },
    {
      selector: "edge",
      style: {
        "curve-style": "bezier",
        width: 4,
        "target-arrow-shape": "triangle",
        "line-color": "#9dbaea",
        "target-arrow-color": "#9dbaea"
      }
    }
  ],
  elements:elems,
  
}));

const removed = {};
cy.on('click','node',function(){
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
