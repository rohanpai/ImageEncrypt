var encryptImg = function(){
   "use strict";    
    //private
    function convertImageToCanvas (image) {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        return canvas;
     };

     function convertCanvasToImage (canvas) {
	        var image = new Image();
	        image.src = canvas.toDataURL("image/png");
	        return image;
     };


    return{
         encryptImage: function(image){
            var imgCanvas = convertImageToCanvas(image);
            var encryptedCanvas = document.createElement("canvas");
            encryptedCanvas.width = imgCanvas.width;
            encryptedCanvas.height = imgCanvas.height;
        
            var encryptedCtx = encryptedCanvas.getContext("2d");
            var imgCtx = imgCanvas.getContext("2d");
            for(var i = 0; i < imgCanvas.height; i++){
                for(var j = 0; j < imgCanvas.width; j++){
                    var imgPixel = imgCtx.getImageData(i,j,1,1).data;
                    encryptedCtx.fillStyle = "rgb("+imgPixel[0]+","+imgPixel[1]+","+imgPixel[2]+")"; 
                    //if(i == 1) console.log( "rgb("+imgPixel[0]+","+imgPixel[1]+","+imgPixel[2]+)" );
                    //encryptedCtx.fillStyle = "rgb(164,188,212)";
                    encryptedCtx.fillRect(i,j,1,1);
                    
                }         
            }
            return encryptedCanvas;
         }

    }
};
