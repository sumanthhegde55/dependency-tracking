//ECL dependency tracking 
//uses c++ STL extensively


#include<bits/stdc++.h>
using namespace std;
 

//token -> left part of IR (like %e120)
// node to represent one line in IR
// *this node is not the same node as in DAG, its just a structure to store info
struct node { 
    string cnst,annotation;
    vector<string> right,func;
    //varibles on the right side on IR expression and function
};

unordered_map<string,bool> vis; // data strucutre for dfs
vector<pair<string,struct node>> mp; 
unordered_map<string,pair<string,string>> fieldMapper;
unordered_map<string,vector<string>> transforms;
unordered_map<string,int> counts;
unordered_map<string,string> records;
unordered_map<string,string> recName_to_structure;
unordered_map<string,string> self_records;
unordered_map<string,string> transform_recStruct; // contains record structure for a given annotation
unordered_map<string,string> transform_name_annotation;

unordered_map<string,vector<string>> ir_fields; // map containing fields related to each line of ir

unordered_map<string,string> temp;

ofstream File("temp5.js");

set<pair<string,string>> e;
unordered_map<string,string> compound_nodes;
vector<vector<string>> labels;

void addedge(string node,string present,unordered_map<string,struct node> &mp2,string &compound_parent){

    // if(fieldMapper[node].second == "others" || fieldMapper[node].first.size() == 0) return;


    if(mp2[node].annotation.substr(0,6) == "symbol"){
            // File << "\"" + mp2[node].annotation.substr(7,INT_MAX) + "\"" << " -> " << present << endl;
            string t = mp2[node].annotation.substr(7,INT_MAX);
            //// e.insert({"\"" + t + "\"",present});
            labels.push_back(vector<string>{present,t,fieldMapper[node].second});
            e.insert({t,present});

            // if(fieldMapper[node].first == "myrec") File << "in sym "<< present << "\n"; 
            if(compound_parent.length() > 0){
                // File << fieldMapper[node].first << " " << compound_parent << endl;
                compound_nodes[fieldMapper[node].first] = compound_parent;
            }

            string tmp;
            if(fieldMapper[node].second != "dataset"){
                tmp = compound_parent;
                compound_parent = mp2[node].annotation.substr(7,INT_MAX);
            }
            addedge(mp2[node].right[0],mp2[node].annotation.substr(7,INT_MAX) ,mp2,compound_parent);
            if(fieldMapper[node].second != "dataset") compound_parent = tmp;
    }

    else if(mp2[node].annotation.length() > 0){
        addedge(mp2[node].right[0],present,mp2,compound_parent);
    }

    else if(mp2[node].func.size() > 0){
        
        string str = mp2[node].func[0];
        // if(str == "colon") File << node << " " << fieldMapper[node].second << endl;
        if(compound_parent.length() > 0){
            // File << str << " " << fieldMapper[node].first << " " << compound_parent << endl;
            if(str == "record") compound_nodes[str] = compound_parent; 
            else compound_nodes[fieldMapper[node].first] = compound_parent;
        }

        if(str == "newusertable"){
            addedge(mp2[node].right[0],present,mp2,compound_parent);
            return;
        }
        else if(str == "inlinetable"){
            addedge(mp2[node].right[1],present,mp2,compound_parent);
            return;
        }
        else if(str == "sort"){

            //// str = "\"" + fieldMapper[node].first + "\"";
            str = fieldMapper[node].first;
            // File << str << " -> " << present << endl;    
            e.insert({str,present});
            labels.push_back(vector<string>{present,str,"sorted dataset"});
            addedge(mp2[node].right[0],str,mp2,compound_parent);
            return;
        }
        else if(str == "transform"){
            ////str = "\"" + fieldMapper[node].first + "\"";
            //  str = fieldMapper[node].first;
            // File << present << endl;
            for(auto x : mp2[node].right){
                if(mp2[x].func[0] == "assignall"){
                    for(auto y : mp2[x].right)
                        addedge(y,present,mp2,compound_parent);
                }
            }
            for(auto x : transforms[node]){
                // File << x << " " << present << endl;
                labels.push_back(vector<string>{present,x,"assign"});
                e.insert({x,present});
                compound_nodes[x] = compound_parent;
            }

            for(auto x : mp2[node].right){
                if(fieldMapper[x].first.substr(0,4) == "SELF"){
                    auto y = node;
                    while(fieldMapper[y].second.substr(0,4) != "self"){
                        y = mp2[y].right[0];
                    }
                    y = mp2[y].right[0];
                    string transform_name = fieldMapper[node].first;
                    string recStruct_name = fieldMapper[y].first;
                    // cout << "node : " << node << "\nname of transform : " << transform_name << "\nrecname : " << recStruct_name <<"\n";
                    // transform_recStruct[transform_name] = recName_to_structure[recStruct_name];
                    transform_recStruct[recName_to_structure[recStruct_name]] = transform_name_annotation[transform_name];
                    // cout << recName_to_structure[recStruct_name] << "\n" << transform_name_annotation[transform_name] << "\n\n\n";
                    break;
                }
            }
            //// replace( str.begin(), str.end(), '\"', '\'');
            //// str = "\"" + str.substr(1);
            ////str = str.substr(0,str.size()-1) + "\"";
        }
        // File << str << endl;

        else if(str == "count" || str == "filter"){
            if(str == "filter"){
                 str += to_string(++counts["f_count"]);
                
                // File << "\"" + fieldMapper[mp2[node].right[1]].first + "\"" << " -> " << str << endl;
                 ////e.insert({"\"" + fieldMapper[mp2[node].right[1]].first + "\"",str});
                 labels.push_back(vector<string>{str,fieldMapper[mp2[node].right[1]].first,fieldMapper[mp2[node].right[1]].second});
                 e.insert({fieldMapper[mp2[node].right[1]].first,str});

            }
            else str += to_string(++counts["c_count"]);
            addedge(mp2[node].right[0],str,mp2,compound_parent);
        }
        else if(str == "hqlproject"){
            str = "Project(DATASET : " + fieldMapper[mp2[node].right[0]].first + " , ";
            str += "TRANSFORM : " + fieldMapper[mp2[node].right[1]].first + ")";
            ////str = "\"" + str + "\"";
            labels.push_back(vector<string>{present,str,fieldMapper[node].second});
            e.insert({str,present});
            for(auto x : mp2[node].right) addedge(x,str,mp2,compound_parent);
        }
        else if(str == "normalize" || str == "output" || str == "join" || str == "rollup"){
            string tmp,s=str;
            if(str == "normalize"){
                // tmp = compound_parent;
                str += to_string(++counts["n_count"]);
                // compound_parent = str;
            }
            if(str == "rollup") str += to_string(++counts["rollup_count"]);

            if(str == "output") str = present;

            for(auto x : mp2[node].right){
                
                if(s != "output"){
                    if(fieldMapper[x].second == "others") continue;
                    string to = fieldMapper[x].first;
                    if(to == "count") to += to_string(counts["c_count"] + 1);
                    vector<string> v{str,to};

                    if(fieldMapper[x].second == "Constant") v.push_back("ITERATIONS");
                    else{
                       if(fieldMapper[x].second == "logical_operation" || fieldMapper[x].second == "conditional"){
                           v.push_back(str + " CONDITION");
                       }
                       else v.push_back(fieldMapper[x].second);
                    }
                    labels.push_back(v);
                }
                addedge(x,str,mp2,compound_parent);
            }
            // if(str == "normalize") compound_parent = tmp;
        }
        else if(fieldMapper[node].second == "others"){
            // File << node << endl;
            for(auto x : mp2[node].right){
                // File << fieldMapper[x].first << " " << fieldMapper[x].second << endl;
                if(fieldMapper[x].second != "Constant") addedge(x,present,mp2,compound_parent);
            }
            return;
        }
        // else if(str == "equality" || str == "conditional") 
        //     File << fieldMapper[node].first << " -> " << present << endl;
        if(str == "eq" || str == "if" || fieldMapper[node].second == "logical_operation"){

            //    File << "\"" + fieldMapper[node].first + "\"" << " -> " << present << endl;
            ////e.insert({ "\"" + fieldMapper[node].first + "\"",present});
            string edge_label = fieldMapper[node].second;
            if(present.substr(0,5) == "rollup" || present.substr(0,4) == "join") edge_label = present + " condition";
            // labels.push_back(vector<string>{present,fieldMapper[node].first,edge_label});
            e.insert({fieldMapper[node].first,present});
        }
        else if(str != present && str != "transform"){
            // File << str << " -> " << present << endl; 
               if(present.substr(0,4) != "norm") labels.push_back(vector<string>{present,str,fieldMapper[node].second});
               else labels.push_back(vector<string>{present,str,"ITERATIONS"});
               if(str == "record"){
                   str += "_" + present;
                   records[str] = recName_to_structure[fieldMapper[node].first];
               }
               e.insert({str,present});
        }
    }
    else{
        string str = fieldMapper[node].first;
        // str = "\"" + str + "\"";
        //// replace( str.begin(), str.end(), '\"', '\'');  

        // File << "\"" + str + "\"" << " -> " << present << endl;  
        ////e.insert({"\"" + str + "\"",present}); 
        e.insert({str,present}); 

    } 


}

int main(){
    //redirecting ip and op
    ifstream inp;
    freopen("output.txt", "w", stdout);
    cout << "started reading\n";
    inp.open("input.txt");
    vector<string> txt;
    string s;
	while(getline(inp,s)){
		txt.insert(txt.begin(),s);
	}
	inp.close();

    cout << "finished.\n";


    //actual main code
    vector<string> outputs; // tokens with return in the IR
    
    //mp -> maplist between token and right part of IR 
    //later converted to actual map for dfs
    struct node vals;
    
    cout << "started tokenization...\n";
    for(string c: txt){
        // cout<<c<<"\n";
        string t;
        bool f = false,g=false;
        string left;
        vector<string> right;
        vector<string> func;
        string annotation;
        string cnst;
        int i=0;
        //code to convert each line of IR to the node format(present in output.txt)
        /*
        %e28 = table(%c2,%e21,%e23) : %t27;

        LEFT : %e28
        RIGHT : %c2 %e21 %e23 
        OPERATION : table 
        OUTPUTS : %e173 %e110 
        ANNOTATION : 
        CONSTANT : 
        */
        while(i < (int)c.size()){
            if(c[i] == ' '){
                if(t == "return") f = true;
                else if(t == "constant"){
                    i++;
                    while(c[i] != ' ') cnst += c[i++];
                }
                else if(t == "type"){
                    t = "";
                    while(c[i] != ';') t += c[i++];
                    right.push_back(t);
                }
                else if(!g) left = t;
                else if(t[0] == 'f') cnst = t;
                else if(t!="") right.push_back(t);
                t = "";
            }
            else if(c[i] == '=') g = true;
            else if(c[i] == ';'){
                if(f) outputs.push_back(t);
                else func.push_back(t);
                break;
            }
            else if(c[i] == '('){
                func.push_back(t);
                t = "";
            }
            else if(c[i] == ',' || c[i] == ')'){
                right.push_back(t);
                t = "";
            }
            else if(c[i] == '{'){
                right.push_back(t);
                t = "";
                i++;
                while(c[i] != '}' && c[i]!= '@') annotation += c[i++];
                // break;
            }
            else if(c[i] == ':') break;
            else if(c[i] == '['){

                if(t.size() > 0) right.push_back(t);
                t = "";
                i++;
                while(c[i] != ']') t += c[i++];
                // t += ']';
            }
            else t += c[i];
            i++;
        }
        // if(cnst.substr(0,5) == "field") cnst = cnst.substr(6);

        //  cout << "LEFT : " << left << endl;
        //  cout << "RIGHT : ";
        //  for(string x : right) cout<<x<<" ";
        //  cout<<endl;
        //  cout<<"OPERATION : ";
        //  for(string x : func) cout<<x<<" ";
        //  cout<<endl;
        //  cout<<"OUTPUTS : ";
        //  for(string x : outputs) cout<<x<<" ";
        //  cout<<endl;
        //  cout<<"ANNOTATION : "<<annotation;
        //  cout<<endl;
        //  cout<<"CONSTANT : "<<cnst;
        //  cout<<endl<<endl; 
         vals.cnst = cnst;
         vals.annotation = annotation;
         vals.right = right;
         vals.func = func;
         mp.push_back({left,vals});
    }
     
     cout << "finished\n";

    unordered_map<string,struct node> mp2(mp.begin(), mp.end());

    //lot of code to parse and exctract info out of the nodes created, string and character parsing
    
    for(int i=(int)mp.size()-1;i>=0;i--){

        auto x = mp[i];
        string le = x.first;
        struct node y = x.second;

        if(y.annotation.substr(0,6) == "symbol"){

            if(fieldMapper[y.right[0]].second == "externalcall"){
                    fieldMapper[le] = fieldMapper[y.right[0]];
            }
            else if(fieldMapper[y.right[0]].second != "transform"){ 
                fieldMapper[le] = make_pair(y.annotation.substr(7),"dataset");
                if(mp2[y.right[0]].func.size() == 0) 
                // if(fieldMapper[y.right[0]].second == "other_annotation") 
                    fieldMapper[y.right[0]] = fieldMapper[le];
                    
            // 30.05.2022 ----------------------

                else if(mp2[y.right[0]].func[0] == "record"){
                    string old_name = fieldMapper[y.right[0]].first;
                    string new_name = y.annotation.substr(7);

                    fieldMapper[y.right[0]].first = new_name;

                    string recStruct = recName_to_structure[old_name];
                    temp[recStruct] = new_name;

                    recName_to_structure[new_name] = recStruct;
                }

                // --------------------

            }
            else{
                transform_name_annotation[fieldMapper[y.right[0]].first] = y.annotation.substr(7);
                fieldMapper[le] = make_pair(y.annotation.substr(7),fieldMapper[y.right[0]].second);
            }
            
            if(fieldMapper[y.right[0]].second == "inlinetable"){
                string var = fieldMapper[y.right[0]].first;
                // fieldMapper[var].first = fieldMapper[le].first + fieldMapper[var].first;
                fieldMapper[var].first = fieldMapper[le].first;
            }

            
        }
        else if(y.annotation != ""){
            fieldMapper[le] = fieldMapper[y.right[0]];
            // fieldMapper[le] = {fieldMapper[y.right[0]].first,"other_annotation"};
        }
        else if(y.cnst != "") fieldMapper[le] = make_pair(y.cnst,"Constant");
        else if(y.right.size() > 0 && y.right[0].substr(0,7) == "counter") fieldMapper[le] = {"AUTO_INCREMENT","counter"};
        else if(y.func.size() > 0){
            //
            string func = y.func[0];
            if(func.substr(0,5) == "field"){
                if(y.right.size() > 0 && fieldMapper[y.right[0]].second != "others"){
                    fieldMapper[le] = make_pair(fieldMapper[y.right[0]].first,"field");
                }
                else fieldMapper[le] = make_pair(func.substr(6),"field");
            }
            else if(func.substr(0,7) == "funcdef"){
                    fieldMapper[le] = {func.substr(8),"funcdef"};
                    // cout << fieldMapper[le].first << " " << fieldMapper[le].second << endl;
            }
            else if(func == "implicitcast") fieldMapper[le] = fieldMapper[y.right[0]];
            else if(func == "externalcall"){
                 string op = fieldMapper[y.right.back()].first;
                 string p = "";
                for(int i=0;i<y.right.size()-1;i++){
                    p += fieldMapper[y.right[i]].first + ",";
                }
                fieldMapper[le] = {op + "(" + p + ")",func};
                // cout << fieldMapper[le].first << " " << fieldMapper[le].second << endl;
            }
            //
            else if(func == "record"){
                string op = "(";
                for(auto z : y.right){
                    op += fieldMapper[z].first + ",";
                }
                int oplen = op.length(); 
                op = op.substr(0,oplen-1); // remove the last comma
                op += ")";
                string r = "RECORD_" + to_string(counts["record"]++);
                fieldMapper[le] = make_pair(r,"record");
                recName_to_structure[r] = op;
                temp[op] = r;
            }
            else if(func == "self"){
                // fieldMapper[le] = make_pair(fieldMapper[y.right[0]].first,"self(" + fieldMapper[y.right[0]].second + ")");
                fieldMapper[le] = make_pair("SELF","self(" + fieldMapper[y.right[0]].second + ")");
                self_records[le] = fieldMapper[y.right[0]].first;
            }
            else if(func == "select"){
                string recField = fieldMapper[y.right[0]].first + "." + fieldMapper[y.right[1]].first;
                fieldMapper[le] = make_pair(recField,"select");
            }
            else if((func == "left" || func == "right" || func == "implicitcast")){
                fieldMapper[le] = fieldMapper[y.right[0]];
            }
            else if(func == "substring"){
                fieldMapper[le] = {"substring(" + fieldMapper[y.right[0]].first + ")","substring"};
            }
            else if(func == "count"){
                fieldMapper[le] = {"count","count"};
            }
            else if(func == "rowdiff"){
                string op = "ROWDIFF(";
                for(auto z : y.right) op += fieldMapper[z].first + ",";
                op += ")";
                fieldMapper[le] = {op,"rowdiff"};
            }
            else if(func == "sort"){
                string op = "SORT(" + fieldMapper[y.right[0]].first + "),";
                op += "PARAMETERS : " + fieldMapper[y.right[1]].first;
                fieldMapper[le] = {op,"sort"};
            }
            else if(func == "sortlist"){
                string op = "[";
                for(auto z : y.right) op += fieldMapper[z].first + ", ";
                op += "]";
                fieldMapper[le] = {op,"sort_parameters"};
            }
            else if(func == "assign"){
                string op = fieldMapper[y.right[0]].first + " -> " + fieldMapper[y.right[1]].first;
                string desc =  "- assigned ";
                if(fieldMapper[y.right[1]].second == "Constant" ) desc += "clean";
                else desc += "dirty";
                fieldMapper[le] = make_pair(op,desc);
            }
            else if(func == "if"){
                fieldMapper[le] = {"IF(" + fieldMapper[y.right[0]].first + ")","conditional"};
            }

            // --------------

            else if(func == "and" || func == "or"){
                fieldMapper[le] = { fieldMapper[y.right[0]].first + " " + func + " " + fieldMapper[y.right[1]].first ,"logical_operation"};

                // cout << fieldMapper[le].first << ", " << fieldMapper[le].second << endl;
            }
            else if(func == "rollup"){
                    fieldMapper[le] = {func,func};
            }

            // -----------
            else if(func == "inlinetable" || func == "newusertable"){
                fieldMapper[le] = {fieldMapper[y.right[1]].first,func};
            }
            else if(func == "concat"){
                string op = "(" + fieldMapper[y.right[0]].first + ") * " + "(" + fieldMapper[y.right[1]].first + ")";
                fieldMapper[le] = make_pair(op,"concatenate");
            }
            else if((func == "transform" || func == "hqlproject")){
                // string op = "{\n";
                for(auto z : y.right){
                //    if(fieldMapper[z].second != "others") op += "\t" + fieldMapper[z].first + " , \n";
                     if(fieldMapper[z].second != "others") 
                      transforms[le].push_back(fieldMapper[z].first);
                }
                // op += "}";
                fieldMapper[le] = {func,func};
            }
            else if(func == "createrow"){
                fieldMapper[le] = {"(" + fieldMapper[y.right[0]].first + ")","row"};
            }
            else if(func == "transformlist"){
                // string op = "[\n";
                for(auto z : y.right){
                    // op += "\t" + fieldMapper[z].first + " , \n";
                    transforms[le].push_back(fieldMapper[z].first);
                }
                // op += "]";
                fieldMapper[le] = {func,"transformlist"};
            }
            else if(func == "output"){
                string op;
                for(auto z : y.right){
                if(fieldMapper[z].second != "others") op += fieldMapper[z].first + " ";
                }
                fieldMapper[le] = {op,"output"};
            }  
            else if(func == "eq" || func == "gt" || func == "lt"){
                string op;
                if(func == "eq") op = " == ";
                else if(func == "gt") op = " > ";
                else if(func == "lt") op = " < ";
                fieldMapper[le] = {fieldMapper[y.right[0]].first + op + fieldMapper[y.right[1]].first,"equality"};
            }
            else if(func == "filter"){
                fieldMapper[le] = {"RECORDSET({x where " + fieldMapper[y.right[1]].first +"})","filter"};
            }
            else if(func == "normalize"){
                string op = "NORMALIZED(\n";
                for(auto z : y.right){
                    if(fieldMapper[z].second == "transform") op += "\tTRANSFORMATION : " + fieldMapper[z].first + "\n";
                    else if(fieldMapper[z].second == "Constant") op += "\tNO_ITERATIONS : " + fieldMapper[z].first + "\n";
                    else if(fieldMapper[z].second == "dataset") op += "\tDATASET : " + fieldMapper[z].first + "\n";
                }
                op += ")";
                fieldMapper[le] = {op,"normalize"};
            }

            else if(func == "join"){
                string op = "{DATASET1 : " + fieldMapper[y.right[0]].first + ", ";
                op += "DATASET2 : " + fieldMapper[y.right[1]].first + ", ";
                op += "CONDITION : " + fieldMapper[y.right[2]].first + ", ";
                if(y.right.size() > 3) op += "TRANSFORM : " + fieldMapper[y.right[3]].first;
                op += "}";
                fieldMapper[le] = {op,"join"};
            }
            else{
                fieldMapper[le] = {func,"others"};
            }

            if(fieldMapper[le].first == "transform"){
                fieldMapper[le].first += to_string(++counts["transform"]);
                // fieldMapper[le].second = fieldMapper[le].first;
            }
        }
    }

    // create_graph();


    //vector<pair<string,struct node>> mp;
    for(auto v:mp){
        auto x=v.first;
        auto y=v.second.right; //f;
        cout<<x<<" : ";
        for(auto z:y) cout<<z<<' ';
        cout<<'\n';

    }
    //outputs
    for(int i=(int)mp.size()-1;i>=0;i--){

        auto x = mp[i];
        string le = x.first;
        cout << le << " : ";

        if(fieldMapper[le].second != "") 
            cout << fieldMapper[le].first << " -----> " << fieldMapper[le].second;
        cout<<endl;
    }


 /* -------------------------
     30.05.2022 code for determining fields related to nodes of our graph
     */

        /*
         for key in map, we are using fieldMapper[x].first because this will be the label of nodes in the graph,
         and this map is required to pass information about fields which are related to a given node in a graph.
         Doing so gives direct access.

         The fields-which-are-related-to-a-node information is required as we need to track the data flow for a particular field.
         The graphing library has the option to filter based on attributes defined for each node. We are adding these related fields as attributes.
        */
       
        unordered_map<string,vector<string>> node_fields;
        unordered_map<string,vector<string>> immediate_node_fields;

        for(int i=(int)mp.size()-1;i>=0;i--){
             auto x = mp[i];
             string le = x.first;
             struct node y = x.second;

             if(y.cnst.substr(0,5) == "field"){
                ir_fields[le].push_back(fieldMapper[le].first);
                // File << le << endl;
                // for(auto x : ir_fields[le]){
                //     File << x << endl;
                // }
                // File << "-----------------\n";
             }
             if(y.func.size() > 0){
                string s = "`" + fieldMapper[x.first].first + "`";
                if(y.func[0] == "select"){
                    string s2 = '"' + fieldMapper[y.right[0]].first + '.' + fieldMapper[y.right[1]].first + '"'; 
                    ir_fields[le].push_back(s2);
                    immediate_node_fields[s].push_back(s2);
            //  File << le << " " << ir_fields[le][0] << endl; 
                }
                else{
                    for(auto z : y.right){
                         immediate_node_fields[s].push_back(fieldMapper[z].first);
                         
                         for(auto y : ir_fields[z])
                            ir_fields[le].push_back(y);

                         if(ir_fields[le].size() > 100) break;
                    }
                }
                // string s = "`" + fieldMapper[x.first].first + "`";
                node_fields[s] = ir_fields[le];
                // File << le << endl;
                // for(auto x : ir_fields[le]){
                //     File << x << endl;
                // }
                // File << "-----------------\n";
             }
        }
      /* ----------------------------*/


    // unordered_map<string,struct node> mp2(mp.begin(), mp.end());
    unordered_map<string,set<string>> d;
    // for(auto x:fieldMapper){
    //     cout<<x.first<<' '<<x.second.first<<' '<<x.second.second<<'\n';
    // }
    File << "exports.first = [";

    int counter  = 0;
    for(auto x : outputs){
        counter++;

        // File << x << " ";
        // while(fieldMapper[mp2[x].right[0]].second == "output") x = mp2[x].right[0]; 
        // File << mp2[x].right[0] << endl << endl;
        string tmp = "";
        for(auto y : mp2[x].right) addedge(y,"output" + to_string(counter)  ,mp2 , tmp);
    }

    set<string> nodes;

    for(auto x : e){
        //// replace( x.first.begin(), x.first.end(), '\"', '`');
        if(x.first[0] != '`') x.first = "`" + x.first + "`";
        if(x.first == "``" || x.second == "``") continue;
        nodes.insert(x.first);
        File <<  x.first << ", ";
    }
    File << "];\n";
    File << "exports.second = [";
    for(auto x : e){
        ////replace( x.second.begin(), x.second.end(), '\"', '`');
        if(x.first == "``" || x.second == "``") continue;
        if(x.second[0] != '`') x.second = "`" + x.second + "`";
        nodes.insert(x.second);
        File << x.second << ", ";
    }
    // for(auto x : temp){
    //     if(records.find(x.first) == records.end()){
    //         string s = x.first;
    //         s = '`' + x.first + '`';
    //         x.second = '`' + x.second + '`';
    //         nodes.insert(s);
    //     }
    // }
    File << "];\n";
    File << "exports.node = [";
    for(auto x : nodes) File << x << ",";
    File << "];\n";

    File << "exports.fieldsToNodes_fields = {";

    vector<string> vec;
    int i=0;
    for(auto x : nodes){
        // File << x << " : [";
        if(node_fields[x].size() == 0) continue;

        vec.push_back(x);

        string str = to_string(i++);
        File << str << " : [";
        for(auto y : node_fields[x])
            File <<"`" + y << "`" <<",";
        File << "],\n"; 
        
    }

    File << "};\n";

    // the index is mentioned above,the corresponding name is here in array
    // `` gives error when used as key. hence workaround used is an index in above object
    // the index in below array gives the actual node name

    /// 21.06 -----------
    File << "exports.immediate_fields = {";
    i=0;
    for(auto x : nodes){
        // File << x << " : [";
        if(node_fields[x].size() == 0) continue;

        string str = to_string(i++);
        File << str << " : [";
        for(auto y : immediate_node_fields[x])
            File << "`" + y << "`" <<",";
        File << "],\n"; 
    }
    File << "};\n";
    /// 21.06 ------------

    File << "exports.fieldsToNodes_nodeName = ["; 

    for(i=0;i<(int)vec.size();i++) File << vec[i] << ", ";
    File << "];\n";

    File << "exports.compound_child=[";
    for(auto x : compound_nodes){
        string s;
        if(x.first == "``") continue;
        if(x.first[0] != '`') s = "`" + x.first + "`";
        File << s << ",";
    }
    File << "];\n";

    File << "exports.compound_parent=[";
    for(auto x : compound_nodes){
        string s2;
        if(x.second == "``") continue;
        if(x.second[0] != '`') s2 = "`" + x.second + "`";
        File << s2 << ",";
    }
    File << "];\n";
    File << "exports.labels=[";
    for(auto x : labels){
        string s;
        if(x[0] != "`") s = "`" + x[0] + "`";
        File << s << ",";
        if(x[1] != "`") s = "`" + x[1] + "`";
        File << s << ",";
        if(x[2] != "`") s = "`" + x[2] + "`";
        File << s << ",";
    }
    File << "];\n";
    File << "exports.records = [";
    for(auto x : records){
        string s = "`" + x.first + "`";
        string s2 = "`" + x.second + "`";
        File << s <<", " << s2 << ", ";
    }
    // for(auto x : temp){
    //     if(records.find(x.first) == records.end()){
    //         string s = '`' + x.first + '`';
    //         x.second = "`" + x.second + "`";
    //         File << s << ", " << x.second << ", ";
    //     }
    // }
    File << "];\n";

    File << "exports.transformStruct = [";
    set<string> se;
    for(auto x : transform_recStruct){
        if(se.find(x.second) != se.end()) continue;
        se.insert(x.second);
        string s = '`' + x.first + '`';
        string s2 = '`' + x.second + '`';
        File << s2 << " , " << s << " , ";
    }
    File << "]\n";
    File.close();
}