// public/app.js
const API = '';
let token = '';
let username = '';

const qs = (id) => document.getElementById(id);

qs('loginBtn').onclick = async () => {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: qs('username').value,
      password: qs('password').value,
    }),
  });

  const data = await res.json();
  if (res.ok) {
    token = data.token;
    username = qs('username').value;
    switchToApp();
  } else {
    alert(data.message);
  }
};

qs('registerBtn').onclick = async () => {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: qs('username').value,
      password: qs('password').value,
    }),
  });

  const data = await res.json();
  alert(data.message);
};

qs('balanceBtn').onclick = async () => {
  const res = await fetch(`${API}/balance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  qs('balance').innerText = data.balance;
};

qs('payBtn').onclick = async () => {
  const toUserId = Number(qs('toUser').value);
  const amount = Number(qs('amount').value);

  const res = await fetch(`${API}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ toUserId, amount }),
  });

  const data = await res.json();
  alert(data.message);
};

qs('transactionsBtn').onclick = async () => {
  const res = await fetch(`${API}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  const list = qs('transactions');
  list.innerHTML = '';
  data.transactions.forEach((t) => {
    const li = document.createElement('li');
    li.innerText = `${t.timestamp}: ₹${t.amount} from ${t.fromUserId} to ${t.toUserId}`;
    list.appendChild(li);
  });
};

function switchToApp() {
  qs('auth-section').classList.add('hidden');
  qs('app-section').classList.remove('hidden');
  qs('userLabel').innerText = username;
}
