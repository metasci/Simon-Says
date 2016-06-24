




var soundGrn = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');

var soundRed = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');

var soundYlw = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');

var soundBlu = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');

var fail = new Audio('https://www.myinstants.com/media/sounds/candy-fail.mp3');
var win = new Audio('https://www.myinstants.com/media/sounds/195116__mattskydoodle__censor-beep.mp3');
win.volume = .01;
fail.volume = .1;


// cache DOM
var $power = $('.power div');
var $big = $('.big');
var $start = $('.start');
var $green = $('.grn');
var $red = $('.red');
var $yellow = $('.ylw');
var $blue = $('.blu');
var $counter = $('.count');
var $strict = $('.strict');
var $strictLight = $('.strctLt');

$power.on('click', function() {
    // disable all click events when power is off
    if(game.power === 0){
        $power.css({float: 'right'});
        game.power = 1;
        $counter.html('--');
        document.removeEventListener('mousedown', handler, true);
        
    }else {
        $power.css({float: 'left'});
        game.power = 0;
        game.reset();
        $counter.html(''); 
        // game.count = ''; ---turn counter off
        document.addEventListener('mousedown', handler, true);
    }
});




var human = {
    moves: []
}

var game = {
    go: 0,
    power: 1,
    turn: 0, // 1:human, 0:computer
    count: 0, // increment counter on win && display with 2 decimals
    list: [],
    strict: 0,
    interval: 0,
    reset: function(){
        // reset whole game when power is turned on
        game.strict = 1;
        human.moves = [];
        $strict.trigger('mousedown');
        game.count = 1;
        game.list = [];
        game.go = 0;
        game.turn = 0;
        clearInterval(game.interval);
        $counter.html(("0" + game.count).slice(-2)); 
    },
    play: function(push) {
        human.timer = 0;
        // stop all mouse activity during computer turn
        document.addEventListener('mousedown', handler, true);
        
        // add random color to end of game.list
        if(push){
            game.list.push(1 + Math.floor(Math.random()*4));
        }
        
        // play game.list
        
        // use recursion to emulate a loop while delaying iteration
        var i = 0;
        function delayedLoop(){ // also makes for a good timer
            $('#'+ game.list[i]).trigger('mousedown');
            if(++i === game.list.length){
                document.removeEventListener('mousedown', handler, true);
                game.turn = 1;
                // alert();
                game.interval = setTimeout(function() {
                    game.fail();
                }, 5000);
                return;
            }
            setTimeout(delayedLoop, 1000);
        }
        delayedLoop();
        
        // set failure timer
        
        
        // now its humans turn
        //on end of human turn, set human.moves = [];
        
        
    },
    test: function() {
        //test human.moves against game.list
        if(human.moves[human.moves.length - 1] !== game.list[human.moves.length - 1]) {
            // fail !! 
            game.fail();
            
        }else if(human.moves.length === game.list.length && game.count === 20){
            $counter.css('font-size', '25px');
            $counter.html("You Win!");
            setTimeout(function(){
                $counter.css('font-size', '40px');
                game.reset();
                game.play(1);
            }, 4000);
        }else if(human.moves.length === game.list.length){
            setTimeout(function(){
                win.play();
                game.turn = 0;
                // console.log('test else if');
                game.count++;
                $counter.html(("0" + game.count).slice(-2));
                human.moves = [];
                setTimeout(function(){
                    game.play(1);
                }, 2000);
            }, 1000);
        }
    },
    fail: function(){
        human.moves = [];
        game.turn = 0;
        fail.play();

        $counter.html('!!'); 

        setTimeout(function() {
            if(game.strict) {
                game.reset();
                game.play(1);
            }else {
                $counter.html(("0" + game.count).slice(-2));
                game.play(0);
            }
        }, 4000);
    }
}

// color button click 
$big.on('mousedown', function(){
    var $check = $(this);
    $check.addClass('active');
    setTimeout(function(){
        $check.removeClass('active');
    }, 600);
    
    switch(this.id){
        case '1':
            soundGrn.play();
            break;
        case '2':
            soundRed.play();
            break;
        case '3':
            soundYlw.play();
            break;
        case '4':
            soundBlu.play();
            break;
    }
    // store button id in appropriate list;
    if(game.turn){
        clearTimeout(game.interval);
        human.moves.push(Number(this.id));
        game.test();
    }
});

$start.on('mousedown', function() {
    if(!game.go){
        game.go = 1;
        $counter.html(("0" + game.count).slice(-2));
        game.play(1);
    }
});



$strict.on('mousedown', function(){
    if(game.strict){
        game.strict = 0;
        $strictLight.css('background-color', 'black');
    }else {
        game.strict = 1;
        $strictLight.css('background-color', '#ffb3b3');
    }
});

function handler(e){
    if(event.button === 0 && e.target.className !== 'switch'){
        e.stopPropagation();
        e.preventDefault();
    }
}


$(function(){
    document.addEventListener('mousedown', handler, true); // turn put this in another function that resets the game on OFF 
    game.reset();
    // console.log(game.power, 'power');
    $power.trigger('click');
    // console.log(game.power, 'power');
});


