exports.first = [`(flag).flag -> IF(substring((chars).chars) == D"~")`, `(name , address , gender).address -> (((((((D"Address) * (layout_person.street)) * (D",)) * (layout_person.city)) * (D",)) * (layout_person.state)) * (D")) * (layout_person.zip)`, `(name , address , gender).gender -> layout_person.gender`, `(name , address , gender).name -> (((((D"Name) * (layout_person.firstname)) * (D")) * (layout_person.middleinitial)) * (D")) * (layout_person.lastname)`, `16`, `DeclareData exported`, `DeclareData exported`, `GetDetails`, `MyFunc`, `PrintFunc`, `Xform`, `count`, `count`, `ds`, `filter1`, `n`, `normalize1`, `normalize2`, `record`, `transform`, `transform`, `{
	DATASET : ds
	NO_ITERATIONS : 16
	TRANSFORMATION : Xform
}.flag == 1`, ];
exports.second = [`Xform`, `GetDetails`, `GetDetails`, `GetDetails`, `normalize1`, `count`, `normalize2`, `normalize2`, `output1`, `output2`, `normalize1`, `MyFunc`, `normalize2`, `normalize1`, `count`, `filter1`, `n`, `PrintFunc`, `ds`, `GetDetails`, `Xform`, `filter1`, ];
exports.node = [`(flag).flag -> IF(substring((chars).chars) == D"~")`,`(name , address , gender).address -> (((((((D"Address) * (layout_person.street)) * (D",)) * (layout_person.city)) * (D",)) * (layout_person.state)) * (D")) * (layout_person.zip)`,`(name , address , gender).gender -> layout_person.gender`,`(name , address , gender).name -> (((((D"Name) * (layout_person.firstname)) * (D")) * (layout_person.middleinitial)) * (D")) * (layout_person.lastname)`,`16`,`DeclareData exported`,`GetDetails`,`MyFunc`,`PrintFunc`,`Xform`,`count`,`ds`,`filter1`,`n`,`normalize1`,`normalize2`,`output1`,`output2`,`record`,`transform`,`{
	DATASET : ds
	NO_ITERATIONS : 16
	TRANSFORMATION : Xform
}.flag == 1`,];
;exports.compound_child=[`transform`,];
exports.compound_parent=[`GetDetails`,];