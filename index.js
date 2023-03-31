const express = require('express'); //Import the express dependency
const port = 5555;                  //Save the port number where your server will be listening
const app = express();//Instantiate an express app, the main work horse of this server
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use('/CSS', express.static(__dirname + "/CSS"));

var board=[];
createBoard();

const router = express.Router();
var cnt=0;
var LastMove={}
LastMove.GameOver=0;
var CurrentPlayer=1;
router.get('/GetLast',function(req,res){
  res.send(LastMove);
});
router.get('/GetMove/:p/:c',function(req,res){
    if(CurrentPlayer == req.params.p) {
        let plyr = Number(req.params.p);
        let col = Number(req.params.c);
        dropCoin(col, plyr);
        if(CheckFinish(plyr)){
            EndGame();
        } else {
            CurrentPlayer = (CurrentPlayer == 1) ? 2 : 1;
        }
    }
    res.send(LastMove);
});
router.get('/', (req, res) => {        //get requests to the root ("/") will route here
      cnt++;
      res.render("index", {
      timesShown: cnt,
    });
                                                  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});


//add the router
app.use('/', router);


app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});

function createBoard(){
  for(let r=0;r<6;r++){
    board[r]=[];
    for(let c=0;c<7;c++){
      board[r][c]=0;
    }
  }
}
function dropCoin(col,plyr){
  for(let r=board.length-1;r>=0;r--){
    if(board[r][col]==0){
      board[r][col]=plyr;
      LastMove.row=r;
      LastMove.col=col;
      LastMove.plyr=plyr;
      break;
    }
  }
}
function EndGame(){
    console.log("FINISHED");
    LastMove.GameOver=1;
}
function CheckFinish(plyr){
    for(let r=0;r<6;r++) {
        for (let c = 0; c < 7; c++) {
            if(board[r][c]==plyr){
                if((c+3<7)&&(CheckRight(r,c)))
                    return true;
                if((r+3<6)&&(CheckDown(r,c)))
                    return true;
                if((c+3<7)&&(r+3<6)&&(CheckDiag1(r,c)))
                    return true;
                if((c>=3)&&(r+3<6)&&(CheckDiag2(r,c)))
                    return true;
            }
        }
    }
    return false;
}
function CheckRight(rr,cc){
    for(let k=1;k<4;k++){
        if(board[rr][cc]!=board[rr][cc+k]){
            return false;
        }
    }
    return true;
}
function CheckDown(rr,cc){
    for(let k=1;k<4;k++){
        if(board[rr][cc]!=board[rr+k][cc]){
            return false;
        }
    }
    return true;
}
function CheckDiag1(rr,cc){
    for(let k=1;k<4;k++){
        if(board[rr][cc]!=board[rr+k][cc+k]){
            return false;
        }
    }
    return true;
}
function CheckDiag2(rr,cc){
    for(let k=1;k<4;k++){
        if(board[rr][cc]!=board[rr+k][cc-k]){
            return false;
        }
    }
    return true;
}
