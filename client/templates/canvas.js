var ctx, color = "#000", x = 0, y = 0, z = 0;


Template.canvas.onRendered(function() {
    newCanvas();
});

Template.canvas.events({
    'click .save': function() {
        var canvas = document.getElementById("canvas");
        localStorage.setItem('sketch', canvas.toDataURL());
        alert('saved to local storage');

        newCanvas();
    }
});

// function to setup a new canvas for drawing
function newCanvas(){
    //define and resize canvas
    var height = $(window).height()-90;
    $("#content").height(height);
    var canvas = '<canvas id="canvas" width="'+$(window).width()+'" height="' + height + '"></canvas>';
    $("#content").html(canvas);

    // setup canvas
    ctx=document.getElementById("canvas").getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;

    // set starting point in center
    ctx.beginPath();
    x = $(window).width()/2 ;
    y = ($(window).height())/2 ;
    ctx.moveTo(x, y);

    // setup to trigger drawing on mouse or touch
    $("#canvas").drawTouch();
    //$("#canvas").drawPointer();
    $("#canvas").drawMouse();
}

// prototype to	start drawing on touch using canvas moveTo and lineTo
$.fn.drawTouch = function() {
    var start = function(e) {
        e = e.originalEvent;
        ctx.beginPath();
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;//-44;
        ctx.moveTo(x,y);
    };
    var move = function(e) {
        e.preventDefault();
        e = e.originalEvent;
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;//-44;
        ctx.lineTo(x,y);
        ctx.stroke();
    };
    $(this).on("touchstart", start);
    $(this).on("touchmove", move);
};

// prototype to	start drawing on mouse using canvas moveTo and lineTo
$.fn.drawMouse = function() {
    var clicked = 0;
    var start = function(e) {
        clicked = 1;
        ctx.beginPath();
        x = e.pageX;
        y = e.pageY;//-44;
        ctx.moveTo(x,y);
    };
    var move = function(e) {
        if(clicked){
            x = e.pageX;
            y = e.pageY;//-44;
            ctx.lineTo(x,y);
            ctx.stroke();
        }
    };
    var stop = function(e) {
        clicked = 0;
    };
    $(this).on("mousedown", start);
    $(this).on("mousemove", move);
    $(window).on("mouseup", stop);
};
