{
function myScript(thisObj) {
    function myScript_buildUI(thisObj){
            var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Extract EXR", undefined, {resizeable:true});
            
                //resource list for UI buttons
            res = "group{orientation:'column',alignment:['fill','fill'],\
                        groupOne: Panel{text:'Enabled Effects',orientation:'row',alignment:['fill','top'],alignChildren:['left','top']minimumSize:[50,50],\
                            exr: Checkbox{text:'EXtractoR'},\
                            gamma: Checkbox{text:'Exposure'},\
                            gamLabel: StaticText{text:'Adjust Gamma:'},\
                            gamEdit: EditText{preferredSize:[70,-1]},\
                        },\
                        groupTwo: Group{orientation:'row',alignment:['fill','center'],alignChildren:['fill','fill'],minimumSize:[50,20],\
                            addFX: Button{text:'Add FX'},\
                        },\
                    }";
            
            myPanel.grp = myPanel.add(res);
            ex1 = myPanel.grp.groupOne;
            ex2 = myPanel.grp.groupTwo;
            
            //Defaults
            ex1.exr.value = true; //box is checked
            ex1.gamma.value = true; //boxed is checked
            ex1.gamEdit.text = "2.2"; //default gamma correction
            
            //Setup panel sizing
//~             myPanel.layout.layout(true);
//~             myPanel.grp.minimumSize = myPanel.grp.size;
            
            //Resizeability
//~             myPanel.layout.resize();
//~             myPanel.onResizing = myPanel.onResize = function(){this.layout.resize()};

            return myPanel;
        }
    
        var myScriptPal = myScript_buildUI (thisObj);
        
        if((myScriptPal != null) && (myScriptPal instanceof Window)){
            myScriptPal.center;
            myScriptPal.show();
            }
    
}
            
myScript(this);
}

ex2.addFX.onClick = function() {
    // create an undo group
    app.beginUndoGroup("Extraction");

    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        
        // Add checked off effects to the selected layers.
            if (ex1.exr.value == true) {
                var exp = curLayer.Effects.addProperty("EXtractoR");
            }
        
            if (ex1.gamma.value == true) {
                var gammaAmount = parseFloat(ex1.gamEdit.text);
                var gamma = curLayer.Effects.addProperty("ADBE Exposure2");
                gamma.property("ADBE Exposure2-0005").setValue(gammaAmount);
            }

    }

    // close the undo group
    app.endUndoGroup();
}
