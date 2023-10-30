// Written by Dor Verbin, October 2021
// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/

function playVids(videoId, scale) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var videoCol = document.getElementById(videoId + "Div");
    var vid = document.getElementById(videoId);

    var staticRender = true;
    
    var mouseX = 0;
    var mouseY = 0;

    var position = 0.5;
    var sVidWidth = vid.videoWidth/2;
    var sVidHeight = vid.videoHeight;
    var vidWidth = scale * vid.videoWidth/2;
    var vidHeight = scale * vid.videoHeight;

    var mergeContext = videoMerge.getContext("2d");
    mergeContext.font = "48px serif";

    function checkMouseInBbox() {
        // Normalize to [0, 1]
        // bcr = videoMerge.getBoundingClientRect();
        // position = ((e.pageX - bcr.x) / bcr.width);
        if (mouseX == 0 || mouseY == 0){
            return false;
        }
        bbox = videoMerge.getBoundingClientRect();
        return  mouseX > bbox.x && mouseX < bbox.x + bbox.width &&
                mouseY > bbox.y && mouseY < bbox.y + bbox.height;
    }

    if (vid.readyState > 3) {
        vid.play();

        function trackMouseGlobal(e) {
            mouseX = e.clientX
            mouseY = e.clientY
        }
        function trackTouchGlobal(e) {
            mousePos = e.touches[0]
        }
        function trackLocation(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.pageX - bcr.x) / bcr.width);
        }
        function trackLocationTouch(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.touches[0].pageX - bcr.x) / bcr.width);
        }
        function openFullscreen() {
            var elem = videoMerge
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
              elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
              elem.msRequestFullscreen();
            }
        }

        document.addEventListener("mousemove",  trackMouseGlobal, false);
        videoMerge.addEventListener("mouseup",  openFullscreen, false);
        videoMerge.addEventListener("touchmove",  trackTouchGlobal, false);
        videoMerge.addEventListener("touchstart", trackTouchGlobal, false);
        videoMerge.addEventListener("mousemove",  trackLocation, false);
        videoMerge.addEventListener("touchstart", trackLocationTouch, false);
        videoMerge.addEventListener("touchmove",  trackLocationTouch, false);

        function drawLoop() {
            if (checkMouseInBbox()){
                vid.play();
            } else {
                vid.pause();
            }

            if (checkMouseInBbox() || staticRender){
                mergeContext.drawImage(vid, 0, 0, sVidWidth, sVidHeight, 0, 0, vidWidth, vidHeight);  
                var sColStart = (sVidWidth * position).clamp(0.0, sVidWidth);
                var colStart = sColStart * scale;
                var sColWidth = (sVidWidth - (sVidWidth * position)).clamp(0.0, sVidWidth);
                var colWidth = sColWidth * scale
                mergeContext.drawImage(vid, sColStart+sVidWidth, 0, sColWidth, sVidHeight, colStart, 0, colWidth, vidHeight);
            }
            
            requestAnimationFrame(drawLoop);
            // mergeContext.fillText(videoMerge.clientWidth, 10, 50);


            if (checkMouseInBbox() || staticRender){
                var arrowLength = 0.09 * vidHeight;
                var arrowheadWidth = 0.025 * vidHeight;
                var arrowheadLength = 0.04 * vidHeight;
                var arrowPosY = vidHeight / 10;
                var arrowWidth = 0.007 * vidHeight;
                var currX = vidWidth * position;

                // Draw circle
                mergeContext.arc(currX, arrowPosY, arrowLength*0.7, 0, Math.PI * 2, false);
                mergeContext.fillStyle = "#FFD79390";
                mergeContext.fill()
                //mergeContext.strokeStyle = "#444444";
                //mergeContext.stroke()
                
                // Draw border
                mergeContext.beginPath();
                mergeContext.moveTo(vidWidth*position, 0);
                mergeContext.lineTo(vidWidth*position, vidHeight);
                mergeContext.closePath()
                mergeContext.strokeStyle = "#575655";
                mergeContext.lineWidth = 5;            
                mergeContext.stroke();

                // Draw arrow
                mergeContext.beginPath();
                mergeContext.moveTo(currX, arrowPosY - arrowWidth/2);
                
                // Move right until meeting arrow head
                mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowWidth/2);
                
                // Draw right arrow head
                mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowheadWidth/2);
                mergeContext.lineTo(currX + arrowLength/2, arrowPosY);
                mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowheadWidth/2);
                mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowWidth/2);

                // Go back to the left until meeting left arrow head
                mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowWidth/2);
                
                // Draw left arrow head
                mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowheadWidth/2);
                mergeContext.lineTo(currX - arrowLength/2, arrowPosY);
                mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY  - arrowheadWidth/2);
                mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY);
                
                mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY - arrowWidth/2);
                mergeContext.lineTo(currX, arrowPosY - arrowWidth/2);

                mergeContext.closePath();

                mergeContext.fillStyle = "#575655";
                mergeContext.fill();
                
                // Render static frame only once
                staticRender = false;
            }         
        }  
        requestAnimationFrame(drawLoop);
    } 
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
    
    
function resizeAndPlay(element)
{
  var cv = document.getElementById(element.id + "Merge");
  var col = document.getElementById(element.id + "Div");

  var vScale = 2 * col.offsetWidth / element.videoWidth
  
  cv.width = vScale * element.videoWidth/2;
  cv.height = vScale * element.videoHeight;
//   cv.width = element.videoWidth/2;
//   cv.height = element.videoHeight;
  element.play();
  element.style.height = "0px";  // Hide video without stopping it
    
  playVids(element.id, vScale);
}
