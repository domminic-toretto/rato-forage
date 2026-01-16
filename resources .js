class Resource {
constructor (x , y , type ) {
this . x = x ;
this . y = y ;
this . type = type ;
this . width = 32;
this . height = 32;
}
draw ( ctx ) {
const colors = {
’ apple ’: ’# FF6B6B ’ ,
’ grass ’: ’#51 CF66 ’ ,
’ stone ’: ’#8 B8680 ’
};
ctx . fillStyle = colors [ this . type ]
|| ’#999 ’;
ctx . fillRect ( this .x , this .y ,

this . width , this . height ) ;

// Label do tipo
ctx . fillStyle = ’# fff ’;
ctx . font = ’10 px Arial ’;
ctx . fillText ( this . type , this . x + 2 ,
this . y + 20) ;

}
isCollidingWith ( player ) {
return player . x < this . x + this . width &&
player . x + player . width > this . x &&
player . y < this . y + this . height &&
player . y + player . height > this . y ;

}
}
class ResourceManager {
constructor () {
this . resources = [];
this . spawnInterval = 3000;
this . lastSpawn = 0;
}
spawnResource ( canvas ) {
const types = [ ’ apple ’ , ’ grass ’ , ’ stone ’];
const type = types [ Math . floor ( Math . random () *
types . length ) ];

const x = Math . random () *
( canvas . width - 32) ;
const y = Math . random () *
( canvas . height - 32) ;
this . resources . push ( new Resource (x , y ,
type ) ) ;

}
update ( canvas , currentTime ) {
if ( currentTime - this . lastSpawn >
this . spawnInterval ) {
this . spawnResource ( canvas ) ;
this . lastSpawn = currentTime ;
}
}
draw ( ctx ) {
this . resources . forEach ( resource = > {
resource . draw ( ctx ) ;
}) ;
}
removeResource ( index ) {
this . resources . splice ( index , 1) ;
}
}
