﻿/* Water Color Automation
// Takes a Diffuse Pass and a Normal pass from a 3D render and automatically generates
// a comp stack that mimics the look of watercolored paints.
*/

{
    function myScript(thisObj){
        function myScript_buildUI(thisObj){
            var myPanel = (thisObj instanceof Panel) ? thisObj : new Window('palette', 'PandaExpress', undefined, {resizeable:true}, {scrollable:true});
            
           res = "group{orientation:'row',alignment:['left','left'],\
                        \
                        groupTwo: Group{orientation:'row',alignment:['auto','top'], alignChildren:['fill','top'],margins:0,\
                            \
                            groupA: Group{orientation:'column',alignment:['fill','top'],alignChildren:['fill','top'],margins:0, spacing:2,\
                                Watercolor: Button{text:'Watercolor', helpTip:'Automates Watercolor look'},\
                            },\
                        },\
                    }";
            
            myPanel.grp = myPanel.add(res);
            buttons = myPanel.grp.groupTwo.groupA;
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

// EXTERNAL FILES
//

//Animation Presets
var ffxMasterControl = File(File($.fileName).path + "/watercolor-files/" + "controller_mastercomp.ffx"); //Master Comp Controller
var ffxBGCCMaster = File(File($.fileName).path + "/watercolor-files/" + "bgcc_mastercomp.ffx"); //BGCC Preset
var ffxBGGradientMaster = File(File($.fileName).path + "/watercolor-files/" + "bggradient_mastercomp.ffx"); //BGCC Preset


buttons.Watercolor.onClick = function() {
// create an undo group
app.beginUndoGroup("watercolor");    
    
    var comp = app.project.activeItem;
    var parentComp = comp;
    var myLayers = comp.selectedLayers;
    
    var originalNames = [];
    var originalIndicies = [];
    var precompNames = [];

    if (myLayers.length == 0) {
        alert("Select Layer(s)");
        }

    else if (myLayers.length != 0) {
        
        //Creates precomps for each selected layer, and automatically names each comp
        for (i = 0; i < myLayers.length; i++){
            var currentLayer = myLayers[i];
        
            var suffix = currentLayer.name; //Original Layer's name
            var parentName = parentComp.name; //Master Comp Name
            var newCompName = parentName+suffix;
            
            originalNames.push(suffix);
            originalIndicies.push(currentLayer.index);
            precompNames.push(newCompName);
            
           //Sets the outline label color to pink for all precomps, except shadows which become purple
           var labelCol = 13;
           if (suffix == "shadow") {
                var labelCol = 10;
               }
           var newPrecomp = comp.layers.precompose([currentLayer.index], newCompName, true);
           newPrecomp.label = labelCol; //Sets label color in the outliner
           
           
           //Renames precomps in Master comp to original layer name
            var currentIndex = originalIndicies[i];
            comp.layer(currentIndex).name = originalNames[i];
            
            
            var masterControl = comp.layers.addNull();
            masterControl.guideLayer = true;
            masterControl.name = "Controller_"+suffix;
            masterControl.label = 14;
            masterControl.enabled = false;
            masterControl.applyPreset(ffxMasterControl);
        } 
    
    const bgccMasterSolid = comp.layers.addSolid([1,1,1], 'BG_CC', comp.width, comp.height, 1.0);
    bgccMasterSolid.applyPreset(ffxBGCCMaster);
    bgccMasterSolid.adjustmentLayer = true;

    const bgGradMasterSolid = comp.layers.addSolid([1,1,1], 'BG_Gradient', comp.width, comp.height, 1.0);
    bgGradMasterSolid.applyPreset(ffxBGGradientMaster);
    
    }


// close the undo group
app.endUndoGroup();
}
    
    
    
/*To-Do:
-Make the shadow controller unique so it doesn't have all the same controls - just color and opacity.
-Figure out expression on precomp controllers so they access the right controller in the Master using the controller's name


*/