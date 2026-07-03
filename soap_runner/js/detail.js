let chars = "0123456789abcdefghijklmnopqrstuvwxyz @,'";

let board = [];

function makeBoard() {
  for (let i=0;i<chars.length;i++) {
    board.push(chars[i]);
    let id = i+1;
    for (let j=1;j<chars.length;j++){
      if (!chars[id]) id = 0;
      board[i] += chars[id];
      id++;
    }
  }
}

makeBoard();

function crypt(key,msg) {
  let keylg = '';
  let id = 0;
  let cmsg = '';
  for (let i = 0;i<msg.length;i++) {
    if (!key[id]) id = 0;
    keylg += key[id];
    id++;
  }
  for (let i=0;i<msg.length;i++) {
    let id1 = chars.indexOf(keylg[i]);
    let id2 = chars.indexOf(msg[i]);
    cmsg += board[id1][id2];
  }
  return cmsg.replace(',','#');
}

function decrypt(key,msg) {
  let keylg = '';
  let id = 0;
  let dmsg = '';
  msg = msg.replace('#',',');
  for (let i = 0; i < msg.length; i++) {
    if (!key[id]) id = 0;
    keylg += key[id];
    id++;
  }
  for (let i = 0; i < msg.length; i++) {
    let id1 = chars.indexOf(keylg[i]);
    let id2 = board[id1].indexOf(msg[i]);
    dmsg += chars[id2];
  }
  return dmsg;
}
