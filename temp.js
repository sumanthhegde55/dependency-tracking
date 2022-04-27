exports.first = [`CatRecs`, `CatThem`, `Project(DATASET : SomeFile , TRANSFORM : CatThem)`, `SomeFile`, `myrec`, `record`, `{
	(value1 , value2 , catvalues).catvalues -> (((myrec.value1) * (myrec.value2)) * (D"-")) * (AUTO_INCREMENT) , 
	(value1 , value2 , catvalues).value1 -> myrec.value1 , 
	(value1 , value2 , catvalues).value2 -> myrec.value2 , 
}`, ];
exports.second = [`output1`, `Project(DATASET : SomeFile , TRANSFORM : CatThem)`, `CatRecs`, `Project(DATASET : SomeFile , TRANSFORM : CatThem)`, `SomeFile`, `myrec`, `CatThem`, ];
exports.node = [`CatRecs`,`CatThem`,`Project(DATASET : SomeFile , TRANSFORM : CatThem)`,`SomeFile`,`myrec`,`output1`,`record`,`{
	(value1 , value2 , catvalues).catvalues -> (((myrec.value1) * (myrec.value2)) * (D"-")) * (AUTO_INCREMENT) , 
	(value1 , value2 , catvalues).value1 -> myrec.value1 , 
	(value1 , value2 , catvalues).value2 -> myrec.value2 , 
}`,];
;exports.compound_child=[`{
	(value1 , value2 , catvalues).catvalues -> (((myrec.value1) * (myrec.value2)) * (D"-")) * (AUTO_INCREMENT) , 
	(value1 , value2 , catvalues).value1 -> myrec.value1 , 
	(value1 , value2 , catvalues).value2 -> myrec.value2 , 
}`,];
exports.compound_parent=[`CatThem`,];