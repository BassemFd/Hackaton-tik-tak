
// 37 left
// 38 up
// 39 right
// 40 down



$(document).keydown(function(e){
    switch (e.which) {
        case 37:
            $('#player').attr('src', `images/mario-left-1.png`).animate({
                left: '-=50'
            });
        break;
        
        case 38:
            $('#player').attr('src', `images/mario-back-1.png`).animate({
                top: '-=50'
            })
        break;
    
        case 39:
        $('#player').attr('src', `images/mario-right-1.png`).animate({
            left: '+=50'
        });
        break;
    
        case 40:
        $('#player').attr('src', `images/mario-front-1.png`).animate({
            top: '+=50'
        });
        break;
    
        case 13:
        $('#player').attr('src', `images/mario-jump.png`); 
        break;
    }
    })