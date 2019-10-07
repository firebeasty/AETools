var myWin = new Window('palette',  "Extract", undefined);
    myWin.orientation = "row";
    
var groupOne = myWin.add("group",undefined, "Group1");
    groupOne.add("button", undefined, "Extract EXR");
    
 myWin.show();