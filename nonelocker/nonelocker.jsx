{
    function myScript(thisObj){
        function myScript_buildUI(thisObj){
            var myPanel = (thisObj instanceof Panel) ? thisObj : new Window('palette', 'NoneLocker', undefined, {resizeable:true});
            
           res = "group{orientation:'column',alignment:['fill','fill'],\
                        group: Panel{text:'NoneLocker',orientation:'row',alignment:['fill','top'],alignChildren:['left','top'],minimumSize:[50,50],\
                            Lock: Button{text:'Lock', helpTip:'Locks layers with none-colored labels'},\
                            UnLock: Button{text:'Unlock', helpTip:'Unlocks layers with none-colored labels'},\
                        },\
                    }";
            
            myPanel.grp = myPanel.add(res);
            buttons = myPanel.grp.group;            
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

buttons.Lock.onClick = function() {
    // create an undo group
    app.beginUndoGroup("Lock");

    var cc = app.project.activeItem;

    for (i=1; i<cc.layers.length+1; i++){
        var curLayer = cc.layers[i];
        
        if (curLayer.label == 0) {
            curLayer.locked = true;
            }
    }

    // close the undo group
    app.endUndoGroup();
}

buttons.UnLock.onClick = function() {
    // create an undo group
    app.beginUndoGroup("UnLock");

    var cc = app.project.activeItem;

    for (i=1; i<cc.layers.length+1; i++){
        var curLayer = cc.layers[i];
        
        if (curLayer.label == 0) {
            curLayer.locked = false;
            }
    }

    // close the undo group
    app.endUndoGroup();
}