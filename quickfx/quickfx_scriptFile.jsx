{
    function myScript(thisObj){
        function myScript_buildUI(thisObj){
            var myPanel = (thisObj instanceof Panel) ? thisObj : new Window('palette', 'AE Tools', undefined, {resizeable:true});

           res = "Group{orientation:'column',alignment:['fill','left'],\
                            groupZero: Panel{text:'Active Tools',orientation:'row',alignment:['fill','top'],alignChildren:['fill','top'],spacing:0,\
                                groupZeroA: Group{orientation: 'row',alignment:['fill','top'],alignChildren:['fill','top'],margins:0,\
                                exr: Checkbox{text:'EXR'},\
                                quick: Checkbox{text:'QuickFX'},\
                                chroma: Checkbox{text:'ChromaFX'},\
                                },\
                            },\
                            groupOne: Panel{text:'EXR Workflow',alignment:['fill','top'],alignChildren:['fill','top'],spacing:0,\
                                    groupOneA: Group{orientation: 'row',alignment:['fill','top'],alignChildren:['left','top'],minimumSize:[50,10], margins:0,\
                                        exr: Checkbox{text:'EXtractoR'},\
                                        gamma: Checkbox{text:'Exposure'},\
                                        gamLabel: StaticText{text:'Gamma:'},\
                                        gamEdit: EditText{minimumSize:[40,0]},\
                                        },\
                                    groupOneB: Group{orientation:'column',alignment:['fill','top'],alignChildren:['fill','top'],margins:0, spacing:0,\
                                        addFX: Button{text:'EXtRact!', spacing: 0,margins: 0},\
                                        },\
                                },\
                            groupTwo: Panel{text:'QuickFX', orientation:'row',alignment:['fill','top'], alignChildren:['fill','top'],\
                                groupTwoA: Group{orientation:'column',alignment:['fill','top'], alignChildren:['fill','top'],margins:0, spacing:0,\
                                    quickCamBlur: Button{text:'Camera Lens Blur', spacing: 0,margins: 0},\
                                    quickGauss: Button{text:'Gaussian Blur',spacing:0},\
                                    quickToner: Button{text:'CC Toner',spacing:0},\
                                    quickCurve: Button{text:'Curves',spacing:0},\
                                    quickLumetri: Button{text:'Lumetri',spacing:0},\
                                },\
                                groupTwoB: Group{orientation:'column',alignment:['fill','top'], alignChildren:['fill','top'],margins:0, spacing: 0,\
                                    quickTurbulent: Button{text:'Turbulent Displace',spacing:0},\
                                    quickFractal: Button{text:'Fractal Noise',spacing:0},\
                                    quickParticle: Button{text:'CC Particle World',spacing:0},\
                                    quickGlow: Button{text:'Glow',spacing:0},\
                                    quickSlider: Button{text:'Slider Control',spacing:0},\
                                },\
                            },\
                           groupThree: Panel{text:'ChromaFX', orientation:'row',alignment:['fill','top'], alignChildren:['fill','top'],\
                                groupThreeA: Group{orientation:'column',alignment:['fill','top'], alignChildren:['fill','top'],margins:0, spacing:0,\
                                    chromaSelective: Button{text:'Selective Color', spacing: 0,margins: 0},\
                                    chromaKey: Button{text:'Keylight',spacing:0},\
                                },\
                                groupThreeB: Group{orientation:'column',alignment:['fill','top'], alignChildren:['fill','top'],margins:0, spacing: 0,\
                                    chromaSpill: Button{text:'Adv. Spill Suppress',spacing:0},\
                                    chromaSoftMatte: Button{text:'Refine Soft Matte',spacing:0},\
                                },\
                            },\
                        },\
                    }";

            myPanel.grp = myPanel.add(res);

            ///GroupNames
            ex0a = myPanel.grp.groupZero.groupZeroA;
            ex1a = myPanel.grp.groupOne.groupOneA; //EXR Tools
            ex1b = myPanel.grp.groupOne.groupOneB; //EXR Add FX
            ex2a = myPanel.grp.groupTwo.groupTwoA; //QuickFX A
            ex2b = myPanel.grp.groupTwo.groupTwoB; //QuickFX B
            ex3a = myPanel.grp.groupThree.groupThreeA; //ChromaFX A
            ex3b = myPanel.grp.groupThree.groupThreeB;

            //Defaults
            ex0a.exr.value = true;
            ex0a.quick.value = true;
            ex0a.chroma.value = true;
            ex1a.exr.value = true; //box is checked
            ex1a.gamma.value = true; //boxed is checked
            ex1a.gamEdit.text = "2.2"; //default gamma correction
           
            
           ex0a.exr.onClick = function() {
                if (ex0a.exr.value == false) {
                    myPanel.grp.groupOne.maximumSize.height=0;
                    myPanel.grp.groupOne.hide();
                }
                else {
                    myPanel.grp.groupOne.maximumSize.height=500;
                    myPanel.grp.groupOne.show();
                }
            myPanel.layout.layout(true);
            return myPanel;
               }
           
            ex0a.quick.onClick = function() {
                if (ex0a.quick.value == false) {
                    myPanel.grp.groupTwo.maximumSize.height=0;
                    myPanel.grp.groupTwo.hide();
                }
                else {
                    myPanel.grp.groupTwo.maximumSize.height=500;
                    myPanel.grp.groupTwo.show();
                }
            myPanel.layout.layout(true);
            return myPanel;
               }
           
            ex0a.chroma.onClick = function() {
                if (ex0a.chroma.value == false) {
                    myPanel.grp.groupThree.maximumSize.height=0;
                    myPanel.grp.groupThree.hide();
                }
                else {
                    myPanel.grp.groupThree.maximumSize.height=500;
                    myPanel.grp.groupThree.show();
                }
            myPanel.layout.layout(true);
            return myPanel;
               }
            

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

ex1b.addFX.onClick = function() {
    // create an undo group
    app.beginUndoGroup("Extraction");

    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];

        // Add checked off effects to the selected layers.
            if (ex1a.exr.value == true) {
                var exp = curLayer.Effects.addProperty("EXtractoR");
            }
            if (ex1a.gamma.value == true) {
                var gammaAmount = parseFloat(ex1a.gamEdit.text);
                var gamma = curLayer.Effects.addProperty("ADBE Exposure2");
                gamma.property("ADBE Exposure2-0005").setValue(gammaAmount);
            }
    }
    // close the undo group
    app.endUndoGroup();
}

ex2a.quickCamBlur.onClick = function() {
    app.beginUndoGroup("quickCamBlur");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE Camera Lens Blur");
    }
    app.endUndoGroup();
}

ex2a.quickGauss.onClick = function() {
    app.beginUndoGroup("quickGauss");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE Gaussian Blur 2");
    }
    app.endUndoGroup();
}

ex2a.quickToner.onClick = function() {
    app.beginUndoGroup("quickToner");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("CC Toner");
    }
    app.endUndoGroup();
}

ex2a.quickCurve.onClick = function() {
    app.beginUndoGroup("quickCurve");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE CurvesCustom");
    }
    app.endUndoGroup();
}

ex2a.quickLumetri.onClick = function() {
    app.beginUndoGroup("quickLumetri");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE Lumetri");
    }
    app.endUndoGroup();
}

ex2b.quickTurbulent.onClick = function() {
    app.beginUndoGroup("quickTurbulent");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE Turbulent Displace");
    }
    app.endUndoGroup();
}

ex2b.quickFractal.onClick = function() {
    app.beginUndoGroup("quickFractal");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE Fractal Noise");
    }
    app.endUndoGroup();
}

ex2b.quickParticle.onClick = function() {
    app.beginUndoGroup("quickParticle");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("CC Particle World");
    }
    app.endUndoGroup();
}

ex2b.quickGlow.onClick = function() {
    app.beginUndoGroup("quickGlow");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE Glo2");
    }
    app.endUndoGroup();
}

ex2b.quickSlider.onClick = function() {
    app.beginUndoGroup("quickSlider");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE Slider Control");
    }
    app.endUndoGroup();
}

ex3a.chromaSelective.onClick = function() {
    app.beginUndoGroup("chromaSelective");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE SelectiveColor");
    }
    app.endUndoGroup();
}

ex3a.chromaKey.onClick = function() {
    app.beginUndoGroup("chromaKey");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("Keylight 906");
    }
    app.endUndoGroup();
}

ex3b.chromaSpill.onClick = function() {
    app.beginUndoGroup("chromaSpill");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE Spill2");
    }
    app.endUndoGroup();
}

ex3b.chromaSoftMatte.onClick = function() {
    app.beginUndoGroup("chromaSoftMatte");
    var curItem = app.project.activeItem;
    var selectedLayers = curItem.selectedLayers;

    for (i=0; i<selectedLayers.length; i++){
        var curLayer = curItem.selectedLayers[i];
        var exp = curLayer.Effects.addProperty("ADBE RefineMatte2");
    }
    app.endUndoGroup();
}