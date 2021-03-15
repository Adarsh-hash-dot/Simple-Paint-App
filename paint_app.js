//made by Adarsh 
//#user interation
//1. mouse down;
// 2. mouse up
// 3. mouse double click

// #logic impleme
// 1. draw drawTriangle
// 2. delete traingle
// 3. move triangle
// 4. clear canvas


var canvas = document.querySelector('canvas');
var context = canvas.getContext("2d");

//clear button mapping
function clearCanvas() {
    triangleArr = []
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//storing contents of canvas---------------------------------------------------
var triangleArr = []

//isoceles triangle class--------------------------------------------------------------
class Triangle {
    constructor(context,x1, y1, x2, y2,strokeColor,fillColor) {
        this.context = context;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
    }
    update = function (){
        drawIsocelesTriangle(this.context, this.x1,this.y1, this.x2, this.y2, this.strokeColor, this.fillColor)
    }
    isInside = function(l1,l2){
        var y3 = this.y2
        var x3 = this.x1 - (this.x2 - this.x1)   // getting x3 and y3 with isoceles triangle property
        return PointInTriangle (l1,l2,this.x1,this.y1,this.x2,this.y2,x3,y3)
    }
}

//Draw triangle------------------------------
function drawIsocelesTriangle(context, x1, y1, x2, y2, strokeColor, fillColor){
    y3 = y2
    x3 = x1 - (x2 - x1)
    drawTriangle(context,x1,y1,x2,y2,x3,y3,strokeColor, fillColor)
}

function drawTriangle(context, x1, y1, x2, y2, x3, y3, strokeColor, fillColor){
    context.fillStyle = fillColor
    context.strokeStyle = strokeColor
    context.beginPath()
    context.moveTo(x1,y1)
    context.lineTo(x2,y2)
    context.lineTo(x3, y3)
    context.closePath()
    context.fill()
    context.stroke()
}




//Utility functions---------------------------------
function screenUpdate() {
    context.clearRect(0,0,innerWidth,innerHeight);
    for(var i = 0; i < triangleArr.length; i++) 
    triangleArr[i].update();
    console.log(triangleArr);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function getMouseLocation(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
    y = event.clientY - canvas.getBoundingClientRect().top;
    return {x : x, y : y};
}

function sign(x1,y1,x2,y2,x3,y3){
    return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
    }
    
function PointInTriangle (l1,l2,x1,y1,x2,y2,x3,y3){
    var d1, d2, d3;
    var has_neg;
    var has_pos;

    d1 = sign(l1,l2, x1,y1, x2,y2);
    d2 = sign(l1,l2, x2,y2, x3,y3);
    d3 = sign(l1,l2, x3,y3, x1,y1);

    has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(has_neg && has_pos);
}

//--------------------------------------------------------------------------------------------------------
function deleteOnDoubleClick (l1,l2) {
    for(var i = triangleArr.length-1; i >= 0; i--) {
        if(triangleArr[i].isInside(l1,l2)) {
            console.log("deleting : " + i)
            triangleArr.splice(i,1)
            break;
        }
    }
    screenUpdate()
}

function getTringleWithPoint (l1,l2) {
    for(var i = triangleArr.length-1; i >= 0; i--) {
        console.log(triangleArr[i].isInside(l1,l2))
        if(triangleArr[i].isInside(l1,l2)) {
            var t = triangleArr[i];
            console.log("deleting : " + i)
            triangleArr.splice(i,1)
            return t;
        }
    }
}

function pointInTriangleArr (l1,l2) {
    for(var i = triangleArr.length-1; i >= 0; i--) {
        console.log(triangleArr[i].isInside(l1,l2))
        if(triangleArr[i].isInside(l1,l2)) {
            return true;
        }
    }
    return false;
}
//----------------------------------------------------------------------------------------------------------------------
var startPointX = null
var startPointY = null
var endPointX = null
var endPointY = null
var color = null;
var draw = false;

function doubleClick(event) {
    startPointX = getMouseLocation(event).x
    startPointY = getMouseLocation(event).y
    if(pointInTriangleArr(startPointX,startPointY)) {
        deleteOnDoubleClick(startPointX,startPointY)
    }
}

function dragStart(event) {
    startPointX = getMouseLocation(event).x
    startPointY = getMouseLocation(event).y
    if(!pointInTriangleArr(startPointX,startPointY)) {
        endPointX = getMouseLocation(event).x
        endPointY = getMouseLocation(event).y
        color = getRandomColor();
        draw = true;
    }
}

function dragStop(event) {
    endPointX = getMouseLocation(event).x
    endPointY = getMouseLocation(event).y
    if(draw){
            color = getRandomColor();
            triangleArr.push(new Triangle(context, startPointX,startPointY, endPointX, endPointY, "black", color));
        } 
    else {
            var tri = getTringleWithPoint(startPointX,startPointY);
            var diffX = endPointX - startPointX;
            var diffY = endPointY - startPointY;
            tri.x1 += diffX
            tri.x2 += diffX
            tri.y1 += diffY
            tri.y2 += diffY
            triangleArr.push(tri);
        }
    draw = false;
    screenUpdate()
}
//---------------------------------------------------------------------------------------------------------
function init() {
    canvas.addEventListener("dblclick", doubleClick);
    canvas.addEventListener('mousedown',dragStart,false);
    canvas.addEventListener('mouseup',dragStop,false);
}
init();



//for future use
// function animate() {
//     //console.log("animate working");
//     requestAnimationFrame(animate);
//     screenUpdate()
// }
// animate();

// function drag(event) {
//     endPointX = getMouseLocation(event).x
//     endPointY = getMouseLocation(event).y
    
//     //console.log(getMouseLocation(event));
//     }

//canvas.addEventListener('mousemove',drag,false);