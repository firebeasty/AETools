/* Water Color Automation
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
                                MasterSetup: Button{text:'WC Master Comp', helpTip:'Automates Watercolor master comp control layers and precomps layers'},\
                                MainPrecompSetup: Button{text:'WC Obj Precomp', helpTip:'Use inside character and prop precomps to generate layers and FX presets'},\
                                ShadowPrecompSetup: Button{text:'WC Shade Precomp', helpTip:'Use inside shadow and  to generate layers and FX presets'},\
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

//ANIMATION FFX PRESETS
var ffxMasterControl = File(File($.fileName).path + "/watercolor-files/" + "controller_mastercomp.ffx"); //Master Comp Controller
var ffxMasterShadowControl = File(File($.fileName).path + "/watercolor-files/" + "controller_shadow_mastercomp.ffx"); //Master Comp Shadow Controller
var ffxBGCCMaster = File(File($.fileName).path + "/watercolor-files/" + "bgcc_mastercomp.ffx"); //BGCC Preset
var ffxBGGradientMaster = File(File($.fileName).path + "/watercolor-files/" + "bggradient_mastercomp.ffx"); //BGLayerStyle Preset

    //PROP PRECOMP EXR FFX
    var ffxPropDiffBase = File(File($.fileName).path + "/watercolor-files/" + "diff_base_precomp.ffx"); //Prop Diff_Base Preset
    var ffxPropDiffLinesOver = File(File($.fileName).path + "/watercolor-files/" + "diff_lines_precomp.ffx"); //Prop Diff_LinesOverlay Preset
    var ffxPropNrmShadowMatte = File(File($.fileName).path + "/watercolor-files/" + "nrm_shadowmatte_precomp.ffx"); //Prop Nrm_ShadowMatte Preset
    var ffxPropDiffPaintTexMatte = File(File($.fileName).path + "/watercolor-files/" + "diff_paintmatte_precomp.ffx"); //Prop Diff_PaintTexMatte Preset
    //PROP PRECOMP SOLIDS FFX
    var ffxPropShadowSolid = File(File($.fileName).path + "/watercolor-files/" + "shadow_solid_precomp.ffx"); //Prop ShadowSolid Preset
    var ffxBoil = File(File($.fileName).path + "/watercolor-files/" + "boil_precomp.ffx"); //Prop Boil Adjustment Layer Preset
    var ffxPaintTex = File(File($.fileName).path + "/watercolor-files/" + "painttex_precomp.ffx"); //Prop WaterColor Paint Texture Layer Preset
    var ffxRoughen = File(File($.fileName).path + "/watercolor-files/" + "roughen_precomp.ffx"); //Prop Roughen Preset
    //PROP CONTROLLER FFX
    var ffxPropControlPrecomp = File(File($.fileName).path + "/watercolor-files/" + "controller_obj_precomp.ffx"); //Prop Roughen Preset


buttons.MasterSetup.onClick = function() {
// create an undo group
app.beginUndoGroup("watercolor");        
    
    var comp = app.project.activeItem;
    var parentComp = comp;
    var myLayers = comp.selectedLayers;
    
    var originalNames = [];
    var originalIndicies = [];
    var precompNames = [];
    var exrLayers = 0;


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
            if(suffix == "shadow"){
                masterControl.applyPreset(ffxMasterShadowControl);
            } else {
                masterControl.applyPreset(ffxMasterControl);
            }
            
            exrLayers++;
        } 
    
    if (exrLayers > 1) {
        
            for (i = 2; i <= exrLayers; i++) {
                comp.layer(i).moveToBeginning();
            }
            
            const bgccMasterSolid = comp.layers.addSolid([1,1,1], 'BG_CC', comp.width, comp.height, 1.0);
            bgccMasterSolid.applyPreset(ffxBGCCMaster);
            bgccMasterSolid.adjustmentLayer = true;
            comp.layer(1).moveToEnd();

            const bgGradMasterSolid = comp.layers.addSolid([1,1,1], 'BG_Gradient', comp.width, comp.height, 1.0);
            bgGradMasterSolid.applyPreset(ffxBGGradientMaster);
            comp.layer(1).moveToEnd();
            
            const canvasPlaceholder = comp.layers.addSolid([1,1,1], 'PaperTexture - Placeholder', comp.width, comp.height, 1.0);
            canvasPlaceholder.blendingMode = BlendingMode.MULTIPLY;
            canvasPlaceholder.moveAfter(comp.layer(exrLayers+1));
            canvasPlaceholder.label = 11;
            
            alert("Replace Layer " +(exrLayers+1) + " (Orange) with your paper/canvas texture.\
Manually adjust the scale/position per shot to change the look");
        }
    
    }

// close the undo group
app.endUndoGroup();
}
    
buttons.MainPrecompSetup.onClick = function() {

// create an undo group
app.beginUndoGroup("watercolor-precomp");        
    
    
    var comp = app.project.activeItem;
    var precompChecker = comp.name.split("_");
    var exrNames = ['Diff_PaintTexMatte', 'Nrm_ShadowMatte', 'Diff_LinesOverlay', 'Diff_Base'];
    var exrFFX = [ffxPropDiffPaintTexMatte, ffxPropNrmShadowMatte, ffxPropDiffLinesOver, ffxPropDiffBase];
    
    
    if ((/[a-zA-Z]/).test(precompChecker[precompChecker.length-1]) == true) {
    
        //Duplicates out the four layers that make up the EXR layers
        var firstLayer = comp.layer(1);
        var firstNumFX = firstLayer.effect.numProperties;
        
        //Removes FX from EXR layer to begin duplication process.
        if (firstNumFX > 0) {
            for (i=firstNumFX; i >0; i--) { 
            firstLayer.effect.property(i).remove();
            }
        }
        
        //Duplicates single EXR layer into 4 copies for watercolor process
        firstLayer.duplicate();
        firstLayer.duplicate();
        firstLayer.duplicate();
        
        //Rename EXR layers and apply ffx presets to each.
        for (i=1; i <= comp.numLayers; i++) {
            
            for (j=1; j <= comp.numLayers; j++){
                comp.layer(j).selected = false;
            }
            
            comp.layer(i).selected = true;
            comp.layer(i).name = exrNames[i-1];
            comp.layer(i).applyPreset(exrFFX[i-1]);  
            comp.layer(i).label = 9;
        }
    
        //Setup EXR layer blending modes, layer switches, and TRKMattes
        comp.layer(1).enabled = false;
        comp.layer(2).enabled = false;
        comp.layer(3).blendingMode = BlendingMode.SOFT_LIGHT;
        comp.layer(3).preserveTransparency = true;

        
        //Shadow Solid
        var prop_shadowSolid = comp.layers.addSolid([0,0,0], 'Shadow', comp.width, comp.height, 1.0);
        prop_shadowSolid.applyPreset(ffxPropShadowSolid);
        prop_shadowSolid.label = 10;
        prop_shadowSolid.moveAfter(comp.layer(3));
        prop_shadowSolid.blendingMode = BlendingMode.DARKEN;
        prop_shadowSolid.trackMatteType = TrackMatteType.LUMA_INVERTED;
        
        //Boil Layer
        var prop_boilAdjust = comp.layers.addSolid([1,1,1], 'Boil', comp.width, comp.height, 1.0);
        prop_boilAdjust.adjustmentLayer = true;
        prop_boilAdjust.label = 13;
        prop_boilAdjust.applyPreset(ffxBoil);
        prop_boilAdjust.moveAfter(comp.layer(2));
        
        //Paint Tex Layer
        var prop_paintTex = comp.layers.addSolid([0.5,0.5,0.5], 'PaintTex - Placeholder', comp.width, comp.height, 1.0);
        prop_paintTex.applyPreset(ffxPaintTex);
        prop_paintTex.label = 11;
        prop_paintTex.applyPreset(ffxPaintTex);
        prop_paintTex.moveAfter(comp.layer(2));
        prop_paintTex.blendingMode = BlendingMode.SOFT_LIGHT;
        prop_paintTex.preserveTransparency = true;
        prop_paintTex.trackMatteType = TrackMatteType.ALPHA;
        
        //Roughen
        var prop_roughen = comp.layers.addSolid([1,1,1], 'Roughen', comp.width, comp.height, 1.0);
        prop_roughen.adjustmentLayer = true;
        prop_roughen.label = 13;
        prop_roughen.applyPreset(ffxRoughen);
        
        //Precomp Controller
        var nameWords = comp.name.split("_");
        var suffix = nameWords[nameWords.length-1];
        var propController = comp.layers.addNull();
        propController.name = "Controller_"+suffix;
        propController.guideLayer = true;
        propController.label = 14;
        propController.enabled = false;
        propController.applyPreset(ffxPropControlPrecomp);
        
        //SetMattes
        comp.layer(8).effect(13)(1).setValue(9);
        comp.layer(7).effect(1)(1).setValue(9);
        comp.layer(6).effect(10)(1).setValue(9);
        
        alert("Replace Layer 4 (Orange) with your paint texture to finish the effect.\
You may need to loopOut() the time remapping to get a repeating texture");
                
    
    } else {
        alert("Use in a character or prop precomp, not the master comp. Note - this script doesn't work unless the last suffix in the precomp name \
(separated by underscores) starts with a letter. [E.g. character01 or prop]");
        }

// close the undo group
app.endUndoGroup();
}




buttons.ShadowPrecompSetup.onClick = function() {

// create an undo group
app.beginUndoGroup("watercolor-precomp");        
    
    var comp = app.project.activeItem;


// close the undo group
app.endUndoGroup();
}