{
    function myScript(thisObj){
        function myScript_buildUI(thisObj){
            var myPanel = (thisObj instanceof Panel) ? thisObj : new Window('palette', 'AE Tools', undefined, {resizeable:true});
            myPanel.maximumSize.height = 200;
            
           res = "group{orientation:'column',alignment:['fill','fill'],\
                            groupOne: Panel{text:'EXR Workflow',alignment:['fill','top'],alignChildren:['fill','top'],spacing:0,\
                                    groupOneA: Group{orientation: 'row',alignment:['fill','top'],alignChildren:['left','top'],minimumSize:[50,10], margins:0,\
                                        exr: Checkbox{text:'EXtractoR'},\
                                        gamma: Checkbox{text:'Exposure'},\
                                        gamLabel: StaticText{text:'Gamma:'},\
                                        gamEdit: EditText{minimumSize:[40,0]},\
                                        },\
                                    groupOneB: Group{orientation:'column',alignment:['fill','top'],alignChildren:['fill','top'],margins:0, spacing:0,\
                                        addFX: Button{text:'Extract!', spacing: 0,margins: 0},\
                                        },\
                                },\
                            groupThree: Panel{text:'QuickFX', orientation:'row',alignment:['fill','top'], alignChildren:['fill','top'],\
                                groupThreeA: Group{orientation:'column',alignment:['fill','top'], alignChildren:['fill','top'],margins:0, spacing:0,\
                                    quickCamBlur: Button{text:'Camera Lens Blur',spacing:0},\
                                    quickGauss: Button{text:'Gaussian Blur',spacing:0},\
                                    quickToner: Button{text:'CC Toner',spacing:0},\
                                    quickCurve: Button{text:'Curves',spacing:0},\
                                    quickLumetri: Button{text:'Lumetri',spacing:0},\
                                },\
                                groupThreeA: Group{orientation:'column',alignment:['fill','top'], alignChildren:['fill','top'],margins:0, spacing: 0,\
                                    quickTurblent: Button{text:'Turbulent Disp',spacing:0},\
                                    quickFractal: Button{text:'Fractal Noise',spacing:0},\
                                    quickParticle: Button{text:'CC Particle World',spacing:0},\
                                    quickGlow: Button{text:'Glow',spacing:0},\
                                    quickSlider: Button{text:'Slider Control',spacing:0},\
                                },\
                            },\
                        },\
                    }";          
            
            myPanel.grp = myPanel.add(res);            
            
            ///GroupNames
            ex1 = myPanel.grp.groupOne.groupOneA; //EXR Tools
            ex2 = myPanel.grp.groupOne.groupOneB; //EXR Add FX
            ex3 = myPanel.grp.groupThree.groupThreeA; //QuickFX
            
            //Defaults
            ex1.exr.value = true; //box is checked
            ex1.gamma.value = true; //boxed is checked
            ex1.gamEdit.text = "2.2"; //default gamma correction
            
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