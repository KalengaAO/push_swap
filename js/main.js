// Estado do jogo
let stackA = [];
let stackB = [];
let history = [];
let gameOver = false;

// Gera lista aleatória e inicializa o jogo
function generateList(size) {
  stackA = [];
  const numbers = new Set();
  while (numbers.size < size) {
    numbers.add(Math.floor(Math.random() * 10));
  }
  stackA = [...numbers];

  stackB = [];
  history = [];
  gameOver = false;
  render();
  updateButtons();
  hideCongrats();
  autoInitialPush();
  render();
  updateButtons();
}

// Envia até 2 elementos para B automaticamente após geração
function autoInitialPush() {
  let count = 0;
  while (stackA.length > 3 && count < 2) {
    push(stackA, stackB, "pb");
    count++;
  }
}

// Renderiza visualmente as pilhas e o histórico
function render() {
  renderStack('elements-a', stackA);
  renderStack('elements-b', stackB);
  const historyLog = document.getElementById('history-log');
  if (history.length === 0) {
    historyLog.textContent = 'lista de comando vazia';
  } else {
    historyLog.innerHTML = history.map((cmd, i) => (i + 1) + ' - ' + cmd).join('\n');
  }

  if (isSorted(stackA) && stackB.length === 0 && stackA.length > 1) {
    showCongrats();
    disableAllCommands();
    gameOver = true;
  }
}

// Renderiza uma pilha específica
function renderStack(id, stack) {
  const container = document.getElementById(id);
  container.innerHTML = '';
  stack.forEach(n => {
    const img = document.createElement('img');
    img.src = `img/${n}.png`;
    img.alt = n;
    img.style.width = '70px';
    container.appendChild(img);
  });
}

// Atualiza botões com base nas regras
function updateButtons() {
  if (gameOver) return;


  const swA = document.getElementById('sw-a');
  const raA = document.getElementById('ra-a');
  const rraA = document.getElementById('rra-a');
  const pb = document.getElementById('pb');
  const pa = document.getElementById('pa');
  const swB = document.getElementById('sw-b');
  const raB = document.getElementById('ra-b');
  const rraB = document.getElementById('rra-b');

  swA.disabled = stackA.length >= 4;
  raA.disabled = stackA.length < 3;
  rraA.disabled = stackA.length < 3;
  pb.disabled = stackA.length <= 3;

  pa.disabled = stackB.length === 0;

  const bEmpty = stackB.length === 0;
  swB.disabled = bEmpty;
  raB.disabled = bEmpty;
  rraB.disabled = bEmpty;
}

function disableAllCommands() {
  document.querySelectorAll('button').forEach(btn => {
    if (btn.id !== 'generate' && btn.id !== 'show-history') {
      btn.disabled = true;
    }
  });
}

function swap(stack) {
  if (stack.length >= 2) {
    [stack[0], stack[1]] = [stack[1], stack[0]];
  }

}

function rotate(stack) {
  if (stack.length > 1) {
    stack.push(stack.shift());
  }
}

function reverseRotate(stack) {
  if (stack.length > 1) {
    stack.unshift(stack.pop());
  }
}


function push(from, to, name) {
  if (from.length) {
    const top = from.shift();
    if (name === "pb" && stackB.length > 1) {
      if (top > stackB[0]) return;
    }
    to.unshift(top);
    history.push(name);
  }
}

function isSorted(stack) {
  for (let i = 0; i < stack.length - 1; i++) {
    if (stack[i] > stack[i + 1]) return false;
  }
  return true;
}

function showCongrats() {
  const msg = document.createElement('h1');
  msg.textContent = 'Parabéns! A stack está ordenada!';
  msg.style.color = 'blue';
  msg.style.textAlign = 'center';
  msg.id = 'congrats-msg';
  document.body.appendChild(msg);
}

function hideCongrats() {
  const el = document.getElementById('congrats-msg');
  if (el) el.remove();
}

// Eventos dos botões
document.getElementById('generate').onclick = () => {
  const size = parseInt(document.getElementById('size').value);
  if (size >= 2) generateList(size);
};

document.getElementById('sw-a').onclick = () => { swap(stackA); history.push("sw a"); render(); updateButtons(); };
document.getElementById('ra-a').onclick = () => { rotate(stackA); history.push("ra a"); render(); updateButtons(); };
document.getElementById('rra-a').onclick = () => { reverseRotate(stackA); history.push("rra a"); render(); updateButtons(); };
document.getElementById('pb').onclick = () => { push(stackA, stackB, "pb"); render(); updateButtons(); };
document.getElementById('pa').onclick = () => { push(stackB, stackA, "pa"); render(); updateButtons(); };

document.getElementById('sw-b').onclick = () => { swap(stackB); history.push("sw b"); render(); updateButtons(); };
document.getElementById('ra-b').onclick = () => { rotate(stackB); history.push("ra b"); render(); updateButtons(); };
document.getElementById('rra-b').onclick = () => { reverseRotate(stackB); history.push("rra b"); render(); updateButtons(); };

document.getElementById('show-history').onclick = () => render();
