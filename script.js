var PLAYER_TOKEN = 'X'
var COMPUTER_TOKEN='O'
var movePlayer=true;
var showing=false;
const wins=[['0','1','2'],['3','4','5'],['6','7','8'],['0','3','6'],['1','4','7'],['2','5','8'],['0','4','8'],['2','4','6']];
var board = ['','','','','','','','','']

function getBestIndex(board,depth,player){
	var otherToken=(player==PLAYER_TOKEN) ? COMPUTER_TOKEN : PLAYER_TOKEN;
	var gamestate=isGameOver(board)
	if(gamestate===otherToken) {
		return -10 + depth;
	}
	if(gamestate===null){
		return 0;
	}
	var max = -Infinity;
	var index=0;

	for (var i=0;i<9;i++){
		if(board[i]==''){
			var boardCopy = board.slice();
			boardCopy[i]=player;
			var moveVal= -getBestIndex(boardCopy,depth+1,otherToken);

			if(moveVal>max){
				max = moveVal;
				index=i;
			}

		}
	}

	if(depth===0){
		return index;
	}
	return max;
}

function highlightCells(c1,c2,c3){
	$(".cell").css("background-color","#fff");
	$(".board").find('div[indx='+c1+']').css("background-color","#FF9999");
	$(".board").find('div[indx='+c2+']').css("background-color","#FF9999");
	$(".board").find('div[indx='+c3+']').css("background-color","#FF9999");
}

function isGameOver(b){
	for(var i=0;i<wins.length;i++){
		var w = wins[i];
		if(b[w[0]]===PLAYER_TOKEN && b[w[1]]===PLAYER_TOKEN && b[w[2]]===PLAYER_TOKEN) {return PLAYER_TOKEN;}
		if(b[w[0]]===COMPUTER_TOKEN && b[w[1]]===COMPUTER_TOKEN && b[w[2]]===COMPUTER_TOKEN) {
			return COMPUTER_TOKEN;
		}
	}
	if(b.indexOf('')===-1){return null;} // tie game
	return false; // Else no winner and moves still available
}

//highlight winning cells
function showWin(b){
	for(var i=0;i<wins.length;i++){
		var w = wins[i];
		if(b[w[0]]===PLAYER_TOKEN && b[w[1]]===PLAYER_TOKEN && b[w[2]]===PLAYER_TOKEN) {
			showing=true;
			highlightCells(w[0],w[1],w[2]);
		}
		if(b[w[0]]===COMPUTER_TOKEN && b[w[1]]===COMPUTER_TOKEN && b[w[2]]===COMPUTER_TOKEN) {
			showing=true;
			highlightCells(w[0],w[1],w[2]);
			break;
		}
	}
}

function moveAI(){
	var indx=getBestIndex(board,0,COMPUTER_TOKEN)
	board[indx]=COMPUTER_TOKEN;
	var cell=$(".board").find('[indx='+indx+']');
	cell.html(COMPUTER_TOKEN);
	cell.attr('token',COMPUTER_TOKEN);
	movePlayer=true;
	if(isGameOver(board)===COMPUTER_TOKEN){
		movePlayer=false;
		setGameStatus("Player " + COMPUTER_TOKEN + ' wins');
		showWin(board);
		board=resetBoard();
	}


}

function setGameStatus(message){
	$(".gamestatus").html(message);
}


function resetBoard(time=2000){
	setTimeout(function(){
		var cells=$(".board").find('div[indx]')
		cells.html("");
		cells.css("background-color","#fff")
		cells.attr("token","");
		movePlayer=true;
		showing=false;
		$(".gamestatus").html("");
	},time);
	return ['','','','','','','','',''];
}

$(window).on('load',function(){
    $('#tokenModal').modal('show');
});

$(document).ready(function(){



	// change cell color on hover
	$(".cell").hover(function(e){
		if(!showing){
			// if ($(this).html() === "") {
			if ($(this).attr("token") === "") {
				$(this).css("background-color",e.type === "mouseenter"?"#A0A0A0":"#fff");
				var token =(e.type === "mouseenter") ? PLAYER_TOKEN:"";
				$(this).html(token);
		
			} else {
				$(this).css("background-color","#fff");
			}
		}
	});

	// On cell click
	$(".cell").click(function(){
		var indx=$(this).attr('indx');
		// if ($(this).html()==='' && movePlayer){
		if ($(this).attr('token')==='' && movePlayer){
			$(this).html(PLAYER_TOKEN);
			$(this).attr('token',PLAYER_TOKEN);
			$(this).css("background-color","#fff");
			board[indx]=PLAYER_TOKEN;
			movePlayer=false;
			var gamestate=isGameOver(board)
			if(gamestate===false){
				setTimeout(moveAI,300);
			} else if (gamestate===null){
				setGameStatus("Tie game");
				board=resetBoard();
			} else {
				setGameStatus("Player " + gamestate+' wins');
				board=resetBoard();
			}
		}

	});

	$(".reset").click(function(){
		board=resetBoard(0);
	});

	$(".PX").click(function(){
		PLAYER_TOKEN='X';
		COMPUTER_TOKEN='O';
		board=resetBoard(0);
	})

	$(".PO").click(function(){
		PLAYER_TOKEN='O';
		COMPUTER_TOKEN='X';
		board=resetBoard(0);
	})

	$(".PX").hover(function(e){
		$(this).css("background-color",e.type === "mouseenter"?"#C0C0C0":"#fff");
	});

	$(".PO").hover(function(e){
		$(this).css("background-color",e.type === "mouseenter"?"#C0C0C0":"#fff");
	});
});