function drawText(color,font,textAlign,textBaseline,text,x,y){
	ctx.fillStyle = color;
	ctx.font = font;
	ctx.textAlign = textAlign;
	ctx.textBaseline = textBaseline;
	ctx.fillText(text, x, y);
}
function clearCanvas(x,y,width,height){
	ctx.clearRect ( x, y , width, height);
}