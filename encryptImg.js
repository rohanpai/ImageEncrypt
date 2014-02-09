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
            
            var key = Math.random() * 365464564556456456456456456456;

            var encryptedCtx = encryptedCanvas.getContext("2d");
            var imgCtx = imgCanvas.getContext("2d");
            for(var i = 0; i < imgCanvas.height; i++){
                for(var j = 0; j < imgCanvas.width; j++){
                    var imgPixel = imgCtx.getImageData(i,j,1,1).data;

                    if(i < imgCanvas.width / 2){
                        imgPixel[0] = (imgPixel[0] * key) % 255;
                        imgPixel[1] = (imgPixel[1] * key) % 255;
                        imgPixel[2] = (imgPixel[2] * key) % 255;
                        imgPixel[3] = (imgPixel[3] * key) % 255;
                    }
                    //imgPixel[1] += -1;

                    encryptedCtx.fillStyle = "rgb("+imgPixel[0]+","+imgPixel[1]+","+imgPixel[2]+")"; 
                    //if(i == 1) console.log( "rgb("+imgPixel[0]+","+imgPixel[1]+","+imgPixel[2]+)" );
                    //encryptedCtx.fillStyle = "rgb(164,188,212)";
                    encryptedCtx.fillRect(i,j,1,1);
                    
                }         
            }
            return convertCanvasToImage(encryptedCanvas);
         },

         stego: function(image, message){

            var secret = {message: "", marker: 0};
            for (var i = 0; i < message.length; i++) {
                var letter = message.charAt(i).charCodeAt(0);
                letter = letter.toString(2);
                while(letter.length < 8)
                    letter = '0' + letter
                secret.message += letter;
            }

            var imgCanvas = convertImageToCanvas(image);
            var encryptedCanvas = document.createElement("canvas");
            encryptedCanvas.width = imgCanvas.width;
            encryptedCanvas.height = imgCanvas.height;

            var encryptedCtx = encryptedCanvas.getContext("2d");
            var imgCtx = imgCanvas.getContext("2d");
            for(var i = 0; i < imgCanvas.height; i++){
                for(var j = 0; j < imgCanvas.width; j++){
                    var imgPixel = imgCtx.getImageData(i,j,1,1).data;
                    var newPixels = [];

                    if(secret.marker < secret.message.length){
                        for (var k = 0; k < 3; k++) {
                            var binary = imgPixel[k].toString(2);
                            while(binary.length < 8)
                                binary = '0' + binary
                            if(binary[binary.length - 1] !== secret.message.charAt(secret.marker)){
                                debugger;
                                binary =  binary.substring(0,7) + secret.message.charAt(secret.marker);
                            }
                            secret.marker++;
                            imgPixel[k] = parseInt(binary, 2);
                        }
                    }

                    encryptedCtx.fillStyle = "rgb("+imgPixel[0]+","+imgPixel[1]+","+imgPixel[2]+")"; 
                    encryptedCtx.fillRect(i,j,1,1);
                    
                }         
            }

            return convertCanvasToImage(encryptedCanvas);
         },

        /* blowfish
         *  Implementation of basic blowfish algorithm
         */

        blowfish: function(){
            var P = []; //18
            var S = new Array(4);
            for (var i = 0; i < 18; i++) {
                P[i] = i;
            }

            for(var i = 0; i < S.length; i++){
                S[i] = new Array(256);
            } 
            var that = this; 

            var encrypt = function (L, R){
                for(var i = 0; i < 16; i += 2){
                    L ^= P[i];
                    R ^= f(L);
                    R ^= P[i+1];
                    L ^= f(R);
                }
                L ^= P[16];
                R ^= P[17];
                var temp = L;
                L = R;
                R = temp;
            };

            var decrypt = function(L, R){
                for(var i = 16; i > 0; i -=2) {
                    L ^= P[i+1];
                    R ^= f(L);
                    R ^= P[i];
                    L ^= f(R);
                }
                L ^= P[1];
                R ^= P[0];
                var temp = L;
                L = R;
                R = temp;
            };

            var f = function(x){
                var h = S[0][x >> 24] + S[1][x >> 16 & 0xff];
                return ( h ^ S[2][x >> 8 & 0xff] ) + S[3][x & 0xff];
            }


            var keySchedule = function(key, keyLength, encrypt, decrypt, f){

                for(var i = 0; i < 18; i++) {
                    P[i] = i;
                }

                //
                // initializing the P-Array and S-boxes with values derived from pi: omitted in example
                //
                for (var i = 0; i < 18; ++i)
                    P[i] ^= key[i % keyLength];
                var L, R;
                L = 0; R = 0;
                for (var i = 0; i < 18; i+=2){
                    encrypt(L, R);
                    P[i] = L;
                    P[i + 1] = R;
                }

                for (var i = 0; i < 4; ++i){
                    for(var j = 0; j < 256; j+=2){
                        encrypt(L, R);
                        S[i][j] = L; S[i][j+1] = R;
                    }
                }

            };
            keySchedule(10, 1, encrypt, decrypt, f);
            console.log(P);
            console.log(S);


        },

        /* AES
            Basic implementation of AES (Advanced Encryption Standard algorithm)
         */
        AES: function(){

        }


    }
};
