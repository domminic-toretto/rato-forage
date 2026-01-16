class Inventory {
constructor () {
this . items = {
’ apple ’: 0 ,
’ grass ’: 0 ,
’ stone ’: 0 ,
’axe ’: 0 ,
’ pickaxe ’: 0
};
this . maxSlots = 20;
this . totalItems = 0;
}
addItem ( itemType , quantity = 1) {
if ( itemType in this . items ) {
this . items [ itemType ] += quantity ;
this . totalItems += quantity ;
return true ;
}
return false ;
}
removeItem ( itemType , quantity = 1) {
if ( this . items [ itemType ] >= quantity ) {
this . items [ itemType ] -= quantity ;
this . totalItems -= quantity ;
return true ;
}
return false ;
}
hasItems ( recipe ) {
for ( const [ item , qty ] of
Object . entries ( recipe . ingredients ) ) {
if ( this . items [ item ] < qty ) {
return false ;
}
}
return true ;
}
craftItem ( recipe ) {
if ( this . hasItems ( recipe ) ) {
for ( const [ item , qty ] of
Object . entries ( recipe . ingredients ) ) {
this . removeItem ( item , qty ) ;
}
this . addItem ( recipe . result , 1) ;
return true ;
}
return false ;
}
}
