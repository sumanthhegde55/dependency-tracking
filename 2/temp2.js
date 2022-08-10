exports.first = [`16`, `DeclareData exported`, `DeclareData exported`, `GetDetails`, `MyFunc`, `NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag == 1`, `PrintFunc`, `SELF.field#address -> (((((((D"Address) * (layout_person.field#street)) * (D",)) * (layout_person.field#city)) * (D",)) * (layout_person.field#state)) * (D")) * (layout_person.field#zip)`, `SELF.field#chars -> D"abc~xyz~def~fred"`, `SELF.field#flag -> IF(substring(ds.field#chars) == D"~")`, `SELF.field#gender -> layout_person.field#gender`, `SELF.field#name -> (((((D"Name) * (layout_person.field#firstname)) * (D")) * (layout_person.field#middleinitial)) * (D")) * (layout_person.field#lastname)`, `Xform`, `count1`, `count2`, `ds`, `filter1`, `layout_person`, `n`, `normalize1`, `normalize2`, `record_ds`, `record_layout_person`, ];
exports.second = [`normalize1`, `count2`, `normalize2`, `normalize2`, `output1`, `filter1`, `output2`, `GetDetails`, `ds`, `Xform`, `GetDetails`, `GetDetails`, `normalize1`, `MyFunc`, `normalize2`, `normalize1`, `count1`, `DeclareData exported`, `filter1`, `n`, `PrintFunc`, `ds`, `layout_person`, ];
exports.node = [`16`,`DeclareData exported`,`GetDetails`,`MyFunc`,`NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag == 1`,`PrintFunc`,`SELF.field#address -> (((((((D"Address) * (layout_person.field#street)) * (D",)) * (layout_person.field#city)) * (D",)) * (layout_person.field#state)) * (D")) * (layout_person.field#zip)`,`SELF.field#chars -> D"abc~xyz~def~fred"`,`SELF.field#flag -> IF(substring(ds.field#chars) == D"~")`,`SELF.field#gender -> layout_person.field#gender`,`SELF.field#name -> (((((D"Name) * (layout_person.field#firstname)) * (D")) * (layout_person.field#middleinitial)) * (D")) * (layout_person.field#lastname)`,`Xform`,`count1`,`count2`,`ds`,`filter1`,`layout_person`,`n`,`normalize1`,`normalize2`,`output1`,`output2`,`record_ds`,`record_layout_person`,];
;exports.fieldsToNodes_fields = {0 : [`field#personid`,`field#firstname`,`field#lastname`,`field#middleinitial`,`field#gender`,`field#street`,`field#city`,`field#state`,`field#zip`,],
1 : [`"SELF.field#name"`,`"layout_person.field#firstname"`,`"layout_person.field#middleinitial"`,`"layout_person.field#lastname"`,`"SELF.field#gender"`,`"layout_person.field#gender"`,`"SELF.field#address"`,`"layout_person.field#street"`,`"layout_person.field#city"`,`"layout_person.field#state"`,`"layout_person.field#zip"`,],
2 : [`"SELF.field#chars"`,`field#chars`,`"SELF.field#flag"`,`"ds.field#chars"`,`"NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag"`,],
3 : [`"NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag"`,],
4 : [`field#personid`,`field#firstname`,`field#lastname`,`field#middleinitial`,`field#gender`,`field#street`,`field#city`,`field#state`,`field#zip`,`field#personid`,`field#firstname`,`field#lastname`,`field#middleinitial`,`field#gender`,`field#street`,`field#city`,`field#state`,`field#zip`,`"SELF.field#name"`,`"layout_person.field#firstname"`,`"layout_person.field#middleinitial"`,`"layout_person.field#lastname"`,`"SELF.field#gender"`,`"layout_person.field#gender"`,`"SELF.field#address"`,`"layout_person.field#street"`,`"layout_person.field#city"`,`"layout_person.field#state"`,`"layout_person.field#zip"`,],
5 : [`"SELF.field#address"`,`"layout_person.field#street"`,`"layout_person.field#city"`,`"layout_person.field#state"`,`"layout_person.field#zip"`,],
6 : [`"SELF.field#chars"`,],
7 : [`"SELF.field#flag"`,`"ds.field#chars"`,],
8 : [`"SELF.field#gender"`,`"layout_person.field#gender"`,],
9 : [`"SELF.field#name"`,`"layout_person.field#firstname"`,`"layout_person.field#middleinitial"`,`"layout_person.field#lastname"`,],
10 : [`"SELF.field#flag"`,`"ds.field#chars"`,],
11 : [`"SELF.field#chars"`,`field#chars`,`"SELF.field#flag"`,`"ds.field#chars"`,`"NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag"`,],
12 : [`"SELF.field#chars"`,`field#chars`,],
13 : [`"SELF.field#chars"`,`field#chars`,`"SELF.field#flag"`,`"ds.field#chars"`,`"NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag"`,],
14 : [`field#personid`,`field#firstname`,`field#lastname`,`field#middleinitial`,`field#gender`,`field#street`,`field#city`,`field#state`,`field#zip`,],
15 : [`"SELF.field#chars"`,`field#chars`,`"SELF.field#flag"`,`"ds.field#chars"`,],
16 : [`"SELF.field#chars"`,`field#chars`,`"SELF.field#flag"`,`"ds.field#chars"`,],
17 : [`field#personid`,`field#firstname`,`field#lastname`,`field#middleinitial`,`field#gender`,`field#street`,`field#city`,`field#state`,`field#zip`,`field#personid`,`field#firstname`,`field#lastname`,`field#middleinitial`,`field#gender`,`field#street`,`field#city`,`field#state`,`field#zip`,`"SELF.field#name"`,`"layout_person.field#firstname"`,`"layout_person.field#middleinitial"`,`"layout_person.field#lastname"`,`"SELF.field#gender"`,`"layout_person.field#gender"`,`"SELF.field#address"`,`"layout_person.field#street"`,`"layout_person.field#city"`,`"layout_person.field#state"`,`"layout_person.field#zip"`,],
};
exports.immediate_fields = {0 : [`table`,``,],
1 : [`transform1`,``,],
2 : [`count`,``,],
3 : [`NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag`,`1`,],
4 : [`NORMALIZED(
, DATASET : DeclareData exportedTRANSFORMATION : GetDetails)`,``,],
5 : [`SELF.field#address`,`(((((((D"Address) * (layout_person.field#street)) * (D",)) * (layout_person.field#city)) * (D",)) * (layout_person.field#state)) * (D")) * (layout_person.field#zip)`,`SELF.field#address -> (((((((D"Address) * (layout_person.field#street)) * (D",)) * (layout_person.field#city)) * (D",)) * (layout_person.field#state)) * (D")) * (layout_person.field#zip)`,``,],
6 : [`SELF.field#chars`,`D"abc~xyz~def~fred"`,],
7 : [`SELF.field#flag`,`IF(substring(ds.field#chars) == D"~")`,`SELF.field#flag -> IF(substring(ds.field#chars) == D"~")`,``,],
8 : [`SELF.field#gender`,`layout_person.field#gender`,`SELF.field#gender -> layout_person.field#gender`,``,],
9 : [`SELF.field#name`,`(((((D"Name) * (layout_person.field#firstname)) * (D")) * (layout_person.field#middleinitial)) * (D")) * (layout_person.field#lastname)`,`SELF.field#name -> (((((D"Name) * (layout_person.field#firstname)) * (D")) * (layout_person.field#middleinitial)) * (D")) * (layout_person.field#lastname)`,``,],
10 : [`transform3`,``,],
11 : [`DeclareData exported`,`RECORDSET({x where NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag == 1})`,],
12 : [`ds`,``,],
13 : [`n`,`NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag == 1`,`RECORDSET({x where NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag == 1})`,``,],
14 : [`field#personid`,`field#firstname`,`field#lastname`,`field#middleinitial`,`field#gender`,`field#street`,`field#city`,`field#state`,`field#zip`,`layout_person`,``,`layout_person`,`seq(1)`,],
15 : [`NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform)`,``,],
16 : [`ds`,`16`,`Xform`,`attr#$_countproject_`,`seq(2)`,`NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform)`,``,],
17 : [`DeclareData exported`,`count`,`GetDetails`,`seq(1)`,`NORMALIZED(
, DATASET : DeclareData exportedTRANSFORMATION : GetDetails)`,``,],
};
exports.fieldsToNodes_nodeName = [`DeclareData exported`, `GetDetails`, `MyFunc`, `NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag == 1`, `PrintFunc`, `SELF.field#address -> (((((((D"Address) * (layout_person.field#street)) * (D",)) * (layout_person.field#city)) * (D",)) * (layout_person.field#state)) * (D")) * (layout_person.field#zip)`, `SELF.field#chars -> D"abc~xyz~def~fred"`, `SELF.field#flag -> IF(substring(ds.field#chars) == D"~")`, `SELF.field#gender -> layout_person.field#gender`, `SELF.field#name -> (((((D"Name) * (layout_person.field#firstname)) * (D")) * (layout_person.field#middleinitial)) * (D")) * (layout_person.field#lastname)`, `Xform`, `count2`, `ds`, `filter1`, `layout_person`, `n`, `normalize1`, `normalize2`, ];
exports.compound_child=[`SELF.field#address -> (((((((D"Address) * (layout_person.field#street)) * (D",)) * (layout_person.field#city)) * (D",)) * (layout_person.field#state)) * (D")) * (layout_person.field#zip)`,`SELF.field#gender -> layout_person.field#gender`,`SELF.field#chars -> D"abc~xyz~def~fred"`,`SELF.field#name -> (((((D"Name) * (layout_person.field#firstname)) * (D")) * (layout_person.field#middleinitial)) * (D")) * (layout_person.field#lastname)`,`transform3`,`SELF.field#flag -> IF(substring(ds.field#chars) == D"~")`,`transform1`,];
exports.compound_parent=[`GetDetails`,`GetDetails`,``,`GetDetails`,`Xform`,`Xform`,`GetDetails`,];
exports.labels=[`output1`,`MyFunc`,`dataset`,`filter1`,`NORMALIZED(
, DATASET : ds, NO_ITERATIONS : 16TRANSFORMATION : Xform).field#flag == 1`,`conditional`,`filter1`,`n`,`dataset`,`normalize1`,`ds`,`dataset`,`normalize1`,`ds`,`dataset`,`ds`,`SELF.field#chars -> D"abc~xyz~def~fred"`,`assign`,`ds`,`record`,`record`,`normalize1`,`16`,`ITERATIONS`,`normalize1`,`16`,`Constant`,`normalize1`,`Xform`,`transform`,`normalize1`,`Xform`,`transform`,`Xform`,`SELF.field#flag -> IF(substring(ds.field#chars) == D"~")`,`assign`,`n`,`normalize1`,`normalize`,`count1`,`filter1`,`filter`,`MyFunc`,`count1`,`count`,`output1`,``,``,`output2`,`PrintFunc`,`dataset`,`normalize2`,`DeclareData exported`,`dataset`,`normalize2`,`DeclareData exported`,`dataset`,`DeclareData exported`,`layout_person`,`dataset`,`layout_person`,`record`,`record`,`DeclareData exported`,``,``,`normalize2`,`count2`,`count`,`count2`,`DeclareData exported`,`dataset`,`DeclareData exported`,`layout_person`,`dataset`,`layout_person`,`record`,`record`,`DeclareData exported`,``,``,`normalize2`,`count2`,`ITERATIONS`,`normalize2`,`GetDetails`,`transform`,`normalize2`,`GetDetails`,`transform`,`GetDetails`,`SELF.field#name -> (((((D"Name) * (layout_person.field#firstname)) * (D")) * (layout_person.field#middleinitial)) * (D")) * (layout_person.field#lastname)`,`assign`,`GetDetails`,`SELF.field#gender -> layout_person.field#gender`,`assign`,`GetDetails`,`SELF.field#address -> (((((((D"Address) * (layout_person.field#street)) * (D",)) * (layout_person.field#city)) * (D",)) * (layout_person.field#state)) * (D")) * (layout_person.field#zip)`,`assign`,`PrintFunc`,`normalize2`,`normalize`,`output2`,``,``,`output2`,``,``,];
exports.records = [`record_layout_person`, `(field#personid,field#firstname,field#lastname,field#middleinitial,field#gender,field#street,field#city,field#state,field#zip)`, `record_ds`, `(field#chars)`, ];
exports.transformStruct = [`GetDetails` , `(field#name,field#address,field#gender)` , `Xform` , `(field#flag)` , `` , `(field#chars)` , ]
