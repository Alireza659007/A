// تنظیمات اولیه و بارگذاری
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = localStorage.getItem('currentUser') || null;
let theme = localStorage.getItem('theme') || 'girl';

// قیمت اولیه ارزها (تومان)
let cryptoPrices = JSON.parse(localStorage.getItem('cryptoPrices')) || {
  BTC: 1500000000,
  ETH: 100000000,
  DOGE: 4000,
  ADA: 15000,
  XRP: 20000
};

const ADMIN_PASS = 'Alireza65901';

// المان‌ها
const loginBox = document.getElementById('loginBox');
const dashboard = document.getElementById('dashboard');
const exchangePanel = document.getElementById('exchangePanel');
const crashPanel = document.getElementById('crashPanel');
const adminPanel = document.getElementById('adminPanel');

const welcomeEl = document.getElementById('welcome');
const balanceEl = document.getElementById('balance');
const leaderboardEl = document.getElementById('leaderboard');

const loginError = document.getElementById('loginError');
const transferMsg = document.getElementById('transferMsg');
const cryptoMsg = document.getElementById('cryptoMsg');
const adminMsg = document.getElementById('adminMsg');

// تنظیم تم
function setTheme(t) {
  theme = t;
  localStorage.setItem('theme', theme);
  applyTheme();
}
function applyTheme() {
  document.body.classList.remove('theme-girl', 'theme-boy');
  document.body.classList.add(theme === 'girl' ? 'theme-girl' : 'theme-boy');
}
applyTheme();

// لاگین کاربر
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    loginError.textContent = 'نام کاربری و رمز عبور را وارد کنید.';
    return;
  }
  loginError.textContent = '';

  // اگر کاربر وجود ندارد بسازیم با 75,000 تومان
  if (!users[username]) {
    users[username] = {
      password,
      balance: 75000,
      bets: [],
      cryptoWallet: {BTC:0, ETH:0, DOGE:0, ADA:0, XRP:0},
      theme: theme
    };
    saveUsers();
  } else {
    if (users[username].password !== password) {
      loginError.textContent = 'رمز عبور اشتباه است.';
      return;
    }
  }
  currentUser = username;
  localStorage.setItem('currentUser', currentUser);
  loadDashboard();
}

// ذخیره کاربران در localStorage
function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

// بارگذاری داشبورد
function loadDashboard() {
  loginBox.classList.add('hidden');
  dashboard.classList.remove('hidden');
  exchangePanel.classList.add('hidden');
  crashPanel.classList.add('hidden');
  adminPanel.classList.add('hidden');

  const user = users[currentUser];
  welcomeEl.textContent = `سلام ${currentUser}، به والت لوکس خوش آمدید!`;
  balanceEl.textContent = user.balance.toLocaleString();
  updateLeaderboard();
}

// ثبت شرط
function placeBet() {
  const betInput = document.getElementById('betAmount');
  const bet = Number(betInput.value);
  if (!bet || bet < 1000) {
    alert('مقدار شرط باید حداقل ۱۰۰۰ تومان باشد.');
    return;
  }
  if (bet > users[currentUser].balance) {
    alert('موجودی کافی نیست.');
    return;
  }
  users[currentUser].balance -= bet;
  users[currentUser].bets.push(bet);
  saveUsers();
  betInput.value = '';
  loadDashboard();
}

// انتقال پول به کاربر دیگر
function transferMoney() {
  const targetUser = document.getElementById('transferUser').value.trim();
  const amount = Number(document.getElementById('transferAmount').value);
  transferMsg.textContent = '';

  if (!targetUser || !amount || amount < 1000) {
    transferMsg.textContent = 'لطفا نام کاربر و مقدار معتبر وارد کنید.';
    return;
  }
  if (targetUser === currentUser) {
    transferMsg.textContent = 'نمی‌توانید به خودتان پول انتقال دهید.';
    return;
  }
  if (!users[targetUser]) {
    transferMsg.textContent = 'کاربر مقصد وجود ندارد.';
    return;
  }
  if (users[currentUser].balance < amount) {
    transferMsg.textContent = 'موجودی کافی ندارید.';
    return;
  }

  users[currentUser].balance -= amount;
  users[targetUser].balance += amount;
  saveUsers();
  transferMsg.textContent = `انتقال موفقیت‌آمیز ${amount.toLocaleString()} تومان به ${targetUser}`;
  loadDashboard();
}

// نمایش جدول برترین‌ها
function updateLeaderboard() {
  let arr = Object.entries(users);
  arr.sort((a, b) => b[1].balance - a[1].balance);
  leaderboardEl.innerHTML = '';
  for (let i = 0; i < Math.min(arr.length, 10); i++) {
    const [user, data] = arr[i];
    leaderboardEl.innerHTML += `<li><span>${user}</span><span>${data.balance.toLocaleString()} تومان</span></li>`;
  }
}

// نمایش پنل ارز دیجیتال
function showExchange() {
  dashboard.classList.add('hidden');
  exchangePanel.classList.remove('hidden');
  crashPanel.classList.add('hidden');
  adminPanel.classList.add('hidden');
  renderCryptoWallet();
  cryptoMsg.textContent = '';
  document.getElementById('cryptoAmount').value = '';
}

// نمایش بازی انفجار
function showCrashGame() {
  dashboard.classList.add('hidden');
  crashPanel.classList.remove('hidden');
  exchangePanel.classList.add('hidden');
  adminPanel.classList.add('hidden');
  resetCrash();
  document.getElementById('crashBet').value = '';
  document.getElementById('autoCashout').value = '';
  document.getElementBy
