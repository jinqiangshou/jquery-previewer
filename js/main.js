!(function($){

    $(document).ready(function(){
        $('#block1').previewer({ 
            trigger: 'hover', 
            type: 'image', 
            src: 'img/USA.gif' 
        });
        $('#block2').previewer({ 
            trigger: 'click', 
            type: 'image',
            src: 'img/China.jpg'
        });
        $('#block3').previewer({ 
            trigger: 'hover', 
            type: 'text', 
            text: 'Hello! This is a jQuery plugin by Horst Xu.',
            containerCSS: {
                'border': '5px solid #FFCC00',
                'background-color': '#FFCC00',
                'border-radius': '5px'
            }
        });
        $('#block4').previewer({
            trigger: 'click', 
            type: 'text', 
            text: 'Hello! This is a jQuery plugin by Horst Xu.',
        });
        $('#block5').previewer({
            trigger: 'hover',
            type: 'video',
            src: 'movie/h5video.mp4'
        });
        $('#block6').previewer({
            src: 'movie/animal.ogg',
            type: 'video',
            trigger: 'click'
        });
        $('#block7').previewer({ 
            trigger: 'hover', 
            src: 'img/Australia.png', 
            containerCSS: {
                'border': '20px solid #000000',
                'border-radius': '8px',
                'background-color': '#000000'
            }
        });
        $('#block8').previewer({
            src: 'img/GreatBritain.jpg',
            beforeShow: function(){
                var text = $('textarea#textarea-block8').val();
                var mytext = 'The function beforeShow is called.';
                $('textarea#textarea-block8').val(text + mytext + '\n');
                console.log(mytext);
                console.log(this);
            },
            onShow: function(div){
                var text = $('textarea#textarea-block8').val();
                var mytext = 'The function onShow is called.';
                $('textarea#textarea-block8').val(text + mytext + '\n');
                console.log(mytext);
                console.log(this);
                console.log(div);
            }
        });
    });

})(jQuery);