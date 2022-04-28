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
//dfs implementation
//mp -> map data struture between token and right part of IR //unordered_map<string,struct node> 
//d -> map storing set of dependencies for each token //unordered_map<string,set<string>>
//cur -> token for which dependency is being found
void dfs(string cur,unordered_map<string,struct node> &mp,unordered_map<string,set<string>> &d){ 
    vis[cur] = true;
    for(string x : mp[cur].right){
        d[cur].insert(x);
        if(vis.find(x) == vis.end()){
            dfs(x,mp,d);
        }
    }
    for(string x : mp[cur].func){
        if(x.substr(0,4) == "attr") d[cur].insert(x);
    }
    for(string x : mp[cur].right){
        for(string y : d[x]){
            d[cur].insert(y);
        }
    }
}
// void create_graph(){
//     // close("output.txt");
//     // freopen("graph_creater.dot","w",stdout);

//     // freopen("output.txt", "w", stdout);


//     ofstream File("temp.dot");
//     File << "digraph{";
//     int val = INT_MAX;
// //    for(int i=(int)mp.size()-1;i>=0;i--){
//     for(int i=0;i<mp.size();i++){
//         auto l = mp[i];
//         string x = l.first;
//         struct node yy = l.second;
//         auto y=l.second.right;
//         // File << yy.annotation << endl;
//         // set<string> dont_track = {"transformlist","select","concat","record","createrow","implicitcast"};
//         // File << x  << " : " << fieldMapper[x].first << endl;
//         if(yy.annotation.substr(0,6) == "symbol"){

//             int j = i + 1;
//             auto s = mp[j];

//             while(s.second.annotation.size() > 0){
//                 s = mp[++j];
//             }

//             // File << s.first << endl;

//             string dest = fieldMapper[s.first].first;
//             if(dest == "") dest = fieldMapper[s.first].second;
//             File << fieldMapper[x].first << " -> " <<  dest << endl;
            
//             continue;
//         }

//         if((int)y.size() == 0 || (yy.func.size() > 0 && yy.func[0] != "assign")) continue;

//         for(auto z:y){
//             auto a = fieldMapper[x].first, b = fieldMapper[z].first;
//             if(a.size() > 0 && b.size() > 0){
//                 replace( a.begin(), a.end(), '\"', '\'');
//                 //replace(a.begin(),a.end(),"*(D'))")
//                 int pos = a.find("->");
//                 string f = a.substr(0,pos);
//                 string s = a.substr(pos+2,val);

//                 File << "\"" + f + "\"->\"" + s +"\""<<endl;

//             }
//         }
            
//     }
//     File << "}";
//     File.close();

// }
ofstream File("temp.js");

set<pair<string,string>> e;
unordered_map<string,string> compound_nodes;
void addedge(string node,string present,unordered_map<string,struct node> &mp2,string &compound_parent){

    if(fieldMapper[node].second == "others" || fieldMapper[node].first.size() == 0) return;


    if(mp2[node].annotation.substr(0,6) == "symbol"){
            // File << "\"" + mp2[node].annotation.substr(7,INT_MAX) + "\"" << " -> " << present << endl;
            string t = mp2[node].annotation.substr(7,INT_MAX);
            //// e.insert({"\"" + t + "\"",present});

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

            addedge(mp2[node].right[0],str,mp2,compound_parent);
            return;
        }
        else if(str == "transform"){
            ////str = "\"" + fieldMapper[node].first + "\"";
            //  str = fieldMapper[node].first;
            // File << present << endl;
            for(auto x : transforms[node]){
                
                // File << x << " " << present << endl;
                e.insert({x,present});
                compound_nodes[x] = compound_parent;
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
                 e.insert({fieldMapper[mp2[node].right[1]].first,str});

            }
            else str += to_string(++counts["c_count"]);
            addedge(mp2[node].right[0],str,mp2,compound_parent);
        }
        else if(str == "hqlproject"){
            str = "Project(DATASET : " + fieldMapper[mp2[node].right[0]].first + " , ";
            str += "TRANSFORM : " + fieldMapper[mp2[node].right[1]].first + ")";
            ////str = "\"" + str + "\"";
            e.insert({str,present});
            for(auto x : mp2[node].right) addedge(x,str,mp2,compound_parent);
        }
        else if(str == "normalize" || str == "output" || str == "join"){
            string tmp;
            if(str == "normalize"){
                // tmp = compound_parent;
                str += to_string(++counts["n_count"]);
                // compound_parent = str;
            }
            if(str == "output") str = present;

            for(auto x : mp2[node].right){
                addedge(x,str,mp2,compound_parent);
            }
            // if(str == "normalize") compound_parent = tmp;
        }
        // else if(str == "equality" || str == "conditional") 
        //     File << fieldMapper[node].first << " -> " << present << endl;
        if(str == "eq" || str == "if"){

            //    File << "\"" + fieldMapper[node].first + "\"" << " -> " << present << endl;
            ////e.insert({ "\"" + fieldMapper[node].first + "\"",present});
            
            e.insert({fieldMapper[node].first,present});
        }
        else if(str != present && str != "transform"){
            // File << str << " -> " << present << endl; 
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
    inp.open("input2.txt");
    vector<string> txt;
    string s;
	while(getline(inp,s)){
		txt.insert(txt.begin(),s);
	}
	inp.close();



    //actual main code
    vector<string> outputs; // tokens with return in the IR
    
    //mp -> maplist between token and right part of IR 
    //later converted to actual map for dfs
    struct node vals;
 
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
            }
            else if(c[i] == ':') break;
            else if(c[i] == '['){
                while(c[i] != ']') t += c[i++];
                t += ']';
            }
            else t += c[i];
            i++;
        }
         cout << "LEFT : " << left << endl;
         cout << "RIGHT : ";
         for(string x : right) cout<<x<<" ";
         cout<<endl;
         cout<<"OPERATION : ";
         for(string x : func) cout<<x<<" ";
         cout<<endl;
         cout<<"OUTPUTS : ";
         for(string x : outputs) cout<<x<<" ";
         cout<<endl;
         cout<<"ANNOTATION : "<<annotation;
         cout<<endl;
         cout<<"CONSTANT : "<<cnst;
         cout<<endl<<endl; 
         vals.cnst = cnst;
         vals.annotation = annotation;
         vals.right = right;
         vals.func = func;
         mp.push_back({left,vals});
    }
    

    //lot of code to parse and exctract info out of the nodes created, string and character parsing
    
    for(int i=(int)mp.size()-1;i>=0;i--){

        auto x = mp[i];
        string le = x.first;
        struct node y = x.second;

        if(y.cnst.substr(0,5) == "field"){
            fieldMapper[le] = make_pair(y.cnst.substr(6),"field");
        }
        else if(y.annotation.substr(0,6) == "symbol"){

            if(fieldMapper[y.right[0]].second != "transform"){ 
                fieldMapper[le] = make_pair(y.annotation.substr(7),"dataset");
                fieldMapper[y.right[0]] = fieldMapper[le];
            }
            else
                fieldMapper[le] = make_pair(y.annotation.substr(7),fieldMapper[y.right[0]].second);
            
            
            if(fieldMapper[y.right[0]].second == "inlinetable"){
                string var = fieldMapper[y.right[0]].first;
                // fieldMapper[var].first = fieldMapper[le].first + fieldMapper[var].first;
                   fieldMapper[var].first = fieldMapper[le].first;
            }

            
        }
        else if(y.annotation != "") fieldMapper[le] = fieldMapper[y.right[0]];
        else if(y.cnst != "") fieldMapper[le] = make_pair(y.cnst,"Constant");
        else if(y.right.size() > 0 && y.right[0].substr(0,7) == "counter") fieldMapper[le] = {"AUTO_INCREMENT","counter"};
        else if(y.func.size() > 0){
            if(y.func[0] == "record"){
                string op = "(";
                for(auto z : y.right){
                    op += fieldMapper[z].first + " , ";
                }
                int oplen = op.length(); 
                op = op.substr(0,oplen-3); // remove the last comma
                op += ")";
                fieldMapper[le] = make_pair(op,"record");
            }
            else if(y.func[0] == "self") 
                fieldMapper[le] = make_pair(fieldMapper[y.right[0]].first,"self(" + fieldMapper[y.right[0]].second + ")");
            else if(y.func[0] == "select"){
                string recField = fieldMapper[y.right[0]].first + "." + fieldMapper[y.right[1]].first;
                fieldMapper[le] = make_pair(recField,"select");
            }
            else if((y.func[0] == "left" || y.func[0] == "right" || y.func[0] == "implicitcast")){
                fieldMapper[le] = fieldMapper[y.right[0]];
            }
            else if(y.func[0] == "substring"){
                fieldMapper[le] = {"substring(" + fieldMapper[y.right[0]].first + ")","substring"};
            }
            else if(y.func[0] == "count"){
                fieldMapper[le] = {"count","count"};
            }
            else if(y.func[0] == "rowdiff"){
                string op = "ROWDIFF(";
                for(auto z : y.right) op += fieldMapper[z].first + ",";
                op += ")";
                fieldMapper[le] = {op,"rowdiff"};
            }
            else if(y.func[0] == "sort"){
                string op = "SORT(" + fieldMapper[y.right[0]].first + "),";
                op += "PARAMETERS : " + fieldMapper[y.right[1]].first;
                fieldMapper[le] = {op,"sort"};
            }
            else if(y.func[0] == "sortlist"){
                string op = "[";
                for(auto z : y.right) op += fieldMapper[z].first + ", ";
                op += "]";
                fieldMapper[le] = {op,"sort_parameters"};
            }
            else if(y.func[0] == "assign"){
                string op = fieldMapper[y.right[0]].first + " -> " + fieldMapper[y.right[1]].first;
                string desc =  "- assigned ";
                if(fieldMapper[y.right[1]].second == "Constant" ) desc += "clean";
                else desc += "dirty";
                fieldMapper[le] = make_pair(op,desc);
            }
            else if(y.func[0] == "if"){
                fieldMapper[le] = {"IF(" + fieldMapper[y.right[0]].first + ")","conditional"};
            }
            else if(y.func[0] == "inlinetable" || y.func[0] == "newusertable"){
                fieldMapper[le] = {fieldMapper[y.right[1]].first,y.func[0]};
            }
            else if(y.func[0] == "concat"){
                string op = "(" + fieldMapper[y.right[0]].first + ") * " + "(" + fieldMapper[y.right[1]].first + ")";
                fieldMapper[le] = make_pair(op,"concatenate");
            }
            else if((y.func[0] == "transform" || y.func[0] == "hqlproject")){
                // string op = "{\n";
                for(auto z : y.right){
                //    if(fieldMapper[z].second != "others") op += "\t" + fieldMapper[z].first + " , \n";
                      transforms[le].push_back(fieldMapper[z].first);
                }
                // op += "}";
                fieldMapper[le] = {y.func[0],y.func[0]};
            }
            else if(y.func[0] == "createrow"){
                fieldMapper[le] = {"(" + fieldMapper[y.right[0]].first + ")","row"};
            }
            else if(y.func[0] == "transformlist"){
                // string op = "[\n";
                for(auto z : y.right){
                    // op += "\t" + fieldMapper[z].first + " , \n";
                    transforms[le].push_back(fieldMapper[z].first);
                }
                // op += "]";
                fieldMapper[le] = {y.func[0],"transformlist"};
            }
            else if(y.func[0] == "output"){
                string op;
                for(auto z : y.right){
                if(fieldMapper[z].second != "others") op += fieldMapper[z].first + " ";
                }
                fieldMapper[le] = {op,"output"};
            }  
            else if(y.func[0] == "eq"){
                fieldMapper[le] = {fieldMapper[y.right[0]].first + " == " + fieldMapper[y.right[1]].first,"equality"};
            }
            else if(y.func[0] == "filter"){
                fieldMapper[le] = {"RECORDSET({x where " + fieldMapper[y.right[1]].first +"})","filter"};
            }
            else if(y.func[0] == "normalize"){
                string op = "{\n";
                for(auto z : y.right){
                    if(fieldMapper[z].second == "transform") op += "\tTRANSFORMATION : " + fieldMapper[z].first + "\n";
                    else if(fieldMapper[z].second == "Constant") op += "\tNO_ITERATIONS : " + fieldMapper[z].first + "\n";
                    else if(fieldMapper[z].second == "dataset") op += "\tDATASET : " + fieldMapper[z].first + "\n";
                }
                op += "}";
                fieldMapper[le] = {op,"normalize"};
            }

            else if(y.func[0] == "join"){
                string op = "{\n\tDATASET1 : " + fieldMapper[y.right[0]].first + "\n";
                op += "\tDATASET2 : " + fieldMapper[y.right[1]].first + "\n";
                op += "\tCONDITION : " + fieldMapper[y.right[2]].first + "\n";
                if(y.right.size() > 3) op += "\tTRANSFORM : " + fieldMapper[y.right[3]].first + "\n";
                op += "}";
                fieldMapper[le] = {op,"join"};
            }
            else{
                fieldMapper[le] = {y.func[0],"others"};
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
    unordered_map<string,struct node> mp2(mp.begin(), mp.end());
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
        nodes.insert(x.first);
        File <<  x.first << ", ";
    }
    File << "];\n";
    File << "exports.second = [";
    for(auto x : e){
        ////replace( x.second.begin(), x.second.end(), '\"', '`');
        if(x.second[0] != '`') x.second = "`" + x.second + "`";
        nodes.insert(x.second);
        File << x.second << ", ";
    }
    File << "];\n";
    File << "exports.node = [";
    for(auto x : nodes) File << x << ",";
    File << "];\n;";

    File << "exports.compound_child=[";
    for(auto x : compound_nodes){
        string s;
        if(x.first[0] != '`') s = "`" + x.first + "`";
        File << s << ",";
    }
    File << "];\n";

    File << "exports.compound_parent=[";
    for(auto x : compound_nodes){
        string s2;
        if(x.second[0] != '`') s2 = "`" + x.second + "`";
        File << s2 << ",";
    }
    File << "];";

    File.close();


    for(string op : outputs){
        dfs(op,mp2,d);
    }
 
    // for(string op : outputs){
    //     cout << " DEPENDENCY OF " << op << " : ";
    //     for(string x : d[op]) cout << x << " ";
    //     cout<<endl;
    // }
    // if dependency of some specific token is required
    /*
    string op2 = "%e155";
    cout << " DEPENDENCY OF " << op2 << " : ";
    for(string x : d[op2]) cout << x << " ";
    cout << endl;
    */
    cout<<endl;
}