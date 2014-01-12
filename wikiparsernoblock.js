/*\
title: $:/core/modules/parsers/wikiparser/wikiparsernoblock.js
type: application/javascript
module-type: parser



\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var ParserPrimer = function(type,text,options) {
	var returns={};

	// Initialise the classes if we don't have them already
	if(!this.pragmaRuleClasses) {
		ParserPrimer.prototype.pragmaRuleClasses = $tw.modules.createClassesFromModules("wikirule","pragma",$tw.WikiRuleBase);
	}
	if(!this.blockRuleClasses) {
		ParserPrimer.prototype.blockRuleClasses = $tw.modules.createClassesFromModules("wikirule","block",$tw.WikiRuleBase);
	}
	if(!this.inlineRuleClasses) {
		ParserPrimer.prototype.inlineRuleClasses = $tw.modules.createClassesFromModules("wikirule","inline",$tw.WikiRuleBase);
	}
	// Save the parse text
	returns.type = type;
	returns.source = text || "";
	returns.options = options;
	
	returns.pragmaRuleClasses=this.pragmaRuleClasses;
	returns.blockRuleClasses=this.blockRuleClasses;
	returns.inlineRuleClasses=this.inlineRuleClasses;
	return returns;
	
};

var  WikiParserClassic= function (type,text,options) { 
	require("$:/core/modules/parsers/wikiparser/basewikiparser.js")["baseWikiParser"].
												call(this,new ParserPrimer(type,text,options));
}

WikiParserClassic.prototype =Object.create( 
	require("$:/core/modules/parsers/wikiparser/basewikiparser.js")["baseWikiParser"].prototype);

exports["text/htmlplus"]= WikiParserClassic;
})();

