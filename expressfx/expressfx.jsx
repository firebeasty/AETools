{
    function myScript(thisObj){
        function myScript_buildUI(thisObj){
            var myPanel = (thisObj instanceof Panel) ? thisObj : new Window('palette', 'ExpressFX', undefined, {resizeable:true}, {scrollable:true});
            
           res = "group{orientation:'row',alignment:['left','left'],\
                        \
                        groupTwo: Group{orientation:'row',alignment:['auto','top'], alignChildren:['fill','top'],margins:0,\
                            \
                            groupA: Group{orientation:'column',alignment:['fill','top'],alignChildren:['fill','top'],margins:0, spacing:2,\
                                Destroy: Button{text:'Clear Expressions', helpTip:'Deletes expressions on selected properties'},\
                                Driver: Button{text:'Driver', helpTip:'Appends a base Driver-Passenger expression with linear() to the end of your current expression.'},\
                                snapToMarker: Button{text:'SnapToMarker', helpTip:'This expression, meant to be used on Time Remap of a precomp, will snap to, and hold on the time for a matching comp marker within the precomp everytime it sees a marker on the precomp layer. USEFUL FOR STILLS.'},\
                                looper: Button{text:'Looper', helpTip:'Loops in and out of an animated property'},\
                            },\
                            \
                            groupB: Group{orientation:'column',alignment:['fill','top'],alignChildren:['fill','top'],margins:0, spacing:2,\
                                Wiggle: Button{text:'Wiggle', helpTip:'Adds a Wiggle to selected properties and adds sliders to control the Freq, Mag, and Seed'},\
                                playAtMarker: Button{text:'PlayAtMarker', helpTip:'This expression, meant to be used on Time Remap of a precomp, will play back a precomp everytime it sees a marker on the precomp layer. USEFUL FOR REPEATING ACTIONS/SPRITE ANIMATIONS'},\
                                animateChunk: Button{text:'AnimateAtMarker', helpTip:'This expression, meant to be used on Time Remap of a precomp, will snap to and play a set duration (eg 1sec) for a matching comp marker within the precomp. USEFUL FOR MULTIPLE SMALL ANIMATIONS'},\
                                activeLayer: Button{text:'ActiveToText', helpTip:'Apply to a text layer. This will turn the text to the layer name of the top-most active layer below the text layer. USEFUL FOR STAGGERED NAMES OR SHOT LISTS IN ANIMATICS'},\
                            },\
                        },\
                    }";
            
            myPanel.grp = myPanel.add(res);
            buttons = myPanel.grp.groupTwo.groupA;
            buttons2 = myPanel.grp.groupTwo.groupB;
            myPanel.layout.layout(true);
            return myPanel;
            }
        var myScriptPal = myScript_buildUI(thisObj);
        
        if((myScriptPal != null) && (myScriptPal instanceof Window)) {
            myScriptPal.center();
            myScriptPal.show();
            }
        }
   
   myScript(this);
   }

//DESTROY EXPRESSIONS
buttons.Destroy.onClick = function() {
    // create an undo group
    app.beginUndoGroup("express");

    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    
    var props = comp.selectedProperties;

    for (var i = 0; i < props.length; i++){
        if (props[i].canSetExpression){
        props[i].expression = "";
        }
    }
}

//WIGGLE
buttons2.Wiggle.onClick = function() {
    // create an undo group
    app.beginUndoGroup("express");
    
    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    
    var props = comp.selectedProperties;

    for (var i = 0; i < layers.length; i++){
        var currentLayer = layers[i];
        
        var sliderFreq = currentLayer.Effects.addProperty("ADBE Slider Control");
        sliderFreq.name = "wiggle-Freq";
        sliderFreq.property(1).setValue(1);
        
        var sliderMag = currentLayer.Effects.addProperty("ADBE Slider Control");
        sliderMag.name = "wiggle-Mag";
        sliderMag.property(1).setValue(10);
        
        var sliderSeed = currentLayer.Effects.addProperty("ADBE Slider Control");
        sliderSeed.name = "wiggle-Seed";
        sliderSeed.property(1).setValue(0);
        }
    
    for (var i = 0; i < props.length; i++){
        if (props[i].canSetExpression){
        props[i].expression =
"var seed = thisLayer.effect('wiggle-Seed')('Slider');\
var freq = thisLayer.effect('wiggle-Freq')('Slider');\
var mag = thisLayer.effect('wiggle-Mag')('Slider');\
\
seedRandom(seed);\
wiggle(freq,mag);";
        }
    }

    // close the undo group
    app.endUndoGroup();
}


//DRIVER
buttons.Driver.onClick = function() {
    // create an undo group
    app.beginUndoGroup("express");
    
    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    
    var props = comp.selectedProperties;
    
    for (var i = 0; i < props.length; i++){
        if (props[i].canSetExpression){
        var curExp = props[i].expression
        curExp = curExp + "\
var driver = time; //value that this property reacts to\
var driverMin = 0;\
var driverMax = 1;\
var passengerStart = 0;\
var passengerEnd = 100;\
\
linear(driver, driverMin, driverMax, passengerStart, passengerEnd);";

        props[i].expression = curExp;
        }
    }

    // close the undo group
    app.endUndoGroup();
}


//PLAY AT MARKER
buttons2.playAtMarker.onClick = function() {
    // create an undo group
    app.beginUndoGroup("express");
    
    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    
    for (var i = 0; i< layers.length; i++){
        if(layers[i].canSetTimeRemapEnabled) {
            layers[i].timeRemapEnabled=false;
            layers[i].timeRemapEnabled=true;
            layers[i].timeRemap. setSelectedAtKey(2, true);
            layers[i].timeRemap.removeKey(2);
        }
        
        var props = layers[i].timeRemap;
        
        if (props.canSetExpression){
        props.expression =
"//Will trigger the time to progress from start-end at each layer marker.\
\
var precompDuration = thisLayer.source.duration - framesToTime(1); //Sets the length to precomp duration\
var priorMarkerIndex = 0;\
\
if (thisLayer.marker.numKeys > 0) { \
    var nearestMarker = thisLayer.marker.nearestKey(time);\
    priorMarkerIndex = nearestMarker.index;\
\
    if (nearestMarker.time > time) {\
        priorMarkerIndex = nearestMarker.index - 1;\
    }\
}\
\
if (priorMarkerIndex == 0) {\
    0;\
} else {\
    var priorMarker = thisLayer.marker.key(priorMarkerIndex);\
\
    var driver = time;\
    var driverMin = priorMarker.time;\
    var driverMax = driverMin + precompDuration;\
    var passengerStart = 0;\
    var passengerEnd = precompDuration;\
\
    linear(driver, driverMin, driverMax, passengerStart, passengerEnd);\
}";
        }
    }

    // close the undo group
    app.endUndoGroup();
}

//SNAP TO MARKER
buttons.snapToMarker.onClick = function() {
    // create an undo group
    app.beginUndoGroup("express");
    
    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    
    for (var i = 0; i< layers.length; i++){
        if(layers[i].canSetTimeRemapEnabled) {
            layers[i].timeRemapEnabled=false;
            layers[i].timeRemapEnabled=true;
            layers[i].timeRemap. setSelectedAtKey(2, true);
            layers[i].timeRemap.removeKey(2);
        }
        
        var props = layers[i].timeRemap;
        
        if (props.canSetExpression){
        props.expression =
"//Will trigger the time to snap to the time of the precomp that matches the layer marker comment.\
\
var priorMarkerIndex = 0;\
var outputTime = 0;\
\
if (thisLayer.marker.numKeys > 0) {\
    var nearestMarker = thisLayer.marker.nearestKey(time);\
    priorMarkerIndex = nearestMarker.index;\
\
    if (nearestMarker.time > time) {\
        priorMarkerIndex = nearestMarker.index - 1;\
    }\
}\
\
if (priorMarkerIndex == 0) {\
    outputTime = 0;\
} else {\
    var priorComment = thisLayer.marker.key(priorMarkerIndex).comment;\
    var sourceComp = thisLayer.source;\
\
    for (var i = 1; i <= sourceComp.marker.numKeys; i = i + 1) {\
        var precompMarker = sourceComp.marker.key(i);\
        \
        if (precompMarker.comment == priorComment) {\
            outputTime = precompMarker.time;\
            break;\
        }\
    }\
}\
\
outputTime;";
        }
    }

    // close the undo group
    app.endUndoGroup();
}

//ANIMATE AT MARKER
buttons2.animateChunk.onClick = function() {
    // create an undo group
    app.beginUndoGroup("express");
    
    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    
    for (var i = 0; i< layers.length; i++){
        if(layers[i].canSetTimeRemapEnabled) {
            layers[i].timeRemapEnabled=false;
            layers[i].timeRemapEnabled=true;
            layers[i].timeRemap. setSelectedAtKey(2, true);
            layers[i].timeRemap.removeKey(2);
        }
        
        var props = layers[i].timeRemap;
        
        if (props.canSetExpression){
        props.expression =
"//Will trigger the time to snap to the time of the precomp that matches the layer marker comment.\
\
// layer with the layer markers (thisLayer by default, change to \
// another layer if linking to another layer's markers)\
var sourceLayer = thisLayer;\
\
var segmentLengthInSeconds = 1; // set length of sections inside precomp (distance between markers).\
\
\
var priorMarkerIndex = 0;\
var precompDuration = segmentLengthInSeconds - framesToTime(1); //Sets the length to loop\
var outputTime = 0;\
\
if (sourceLayer.marker.numKeys > 0) {\
    var nearestMarker = sourceLayer.marker.nearestKey(time);\
    priorMarkerIndex = nearestMarker.index;\
\
    if (nearestMarker.time > time) {\
        priorMarkerIndex = nearestMarker.index - 1;\
    }\
}\
\
if (priorMarkerIndex == 0) {\
    outputTime = 0;\
} else {\
	var priorMarker = sourceLayer.marker.key(priorMarkerIndex);\
    var priorComment = priorMarker.comment;\
    var sourceComp = sourceLayer.source;\
	\
\
\
    for (var i = 1; i <= sourceComp.marker.numKeys; i++) {\
        var precompMarker = sourceComp.marker.key(i);\
\
        if (precompMarker.comment == priorComment) {\
				var driver = time;\
				var driverMin = priorMarker.time;\
				var driverMax = driverMin + precompDuration;\
				var passengerStart = precompMarker.time;\
				var passengerEnd = passengerStart + precompDuration;\
				break;\
        }\
    }\
	outputTime = linear(driver, driverMin, driverMax, passengerStart, passengerEnd);\
}\
outputTime;";
        }
    }

    // close the undo group
    app.endUndoGroup();
}


//LOOPER
buttons.looper.onClick = function() {
    // create an undo group
    app.beginUndoGroup("express");

    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    
    var props = comp.selectedProperties;

    for (var i = 0; i < props.length; i++){
        if (props[i].canSetExpression){
        props[i].expression =
"var loopType = \"cycle\"; //Change loop type here\
\
loopIn(loopType) + loopOut(loopType) - value;";
        }
    }
}


//ACTIVE TO TEXT
buttons2.activeLayer.onClick = function() {
    // create an undo group
    app.beginUndoGroup("express");

    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    
    for (var i = 0; i< layers.length; i++){
        
        var props = layers[i].text.sourceText;
        
        if (props.canSetExpression){
        props.expression =
"var textLayer = \"\"; //Change default text here\
var firstLayerIndex = thisLayer.index+1; //First layer to evaluate\
var layerCount = thisComp.numLayers; //Number of layers below this layer to evaluate\
\
for (var i = firstLayerIndex; i <= thisComp.numLayers; i++) {\
	var compLayer = thisComp.layer(i);\
        if (compLayer.active == true) {\
        textLayer = compLayer.name;\
        break;\
        }\
}\
textLayer;";
        }
    }

    // close the undo group
    app.endUndoGroup();
}