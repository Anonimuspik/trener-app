// main.js — головний файл Electron-застосунку.
// Відкриває trener1.html у власному вікні і перевіряє оновлення на GitHub.
// Закриття вікна (хрестик) згортає застосунок у трей замість повного виходу.
// Повний вихід — через іконку в треї (правий клік -> "Вийти").

const { app, BrowserWindow, dialog, Tray, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// дозволяє звуку/аудіо стартувати одразу, без кліку користувача на "розблокувати звук"
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let mainWindow;
let tray = null;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 780,
    icon: path.join(__dirname, 'icon.ico'), // необов'язково, можна прибрати цей рядок
    autoHideMenuBar: true, // ховає рядок меню File/Edit/View зверху
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // ВАЖЛИВО: заміни ім'я файлу нижче на назву твого html-файлу
  mainWindow.loadFile('trener1.html');

  // хрестик закриває не застосунок, а лише ховає вікно у трей
  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'icon.ico'));
  tray.setToolTip('Trener');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Відкрити',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    { type: 'separator' },
    {
      label: 'Вийти',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);

  // клік по іконці трею — показати/сховати вікно
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  // перевіряємо оновлення через 3 секунди після старту (не одразу, щоб не гальмувати запуск)
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 3000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else mainWindow.show();
  });
});

// застосунок більше НЕ виходить, коли всі вікна закриті — живе у треї
app.on('window-all-closed', (e) => {
  e.preventDefault();
});

app.on('before-quit', () => {
  isQuitting = true;
});

/* ===== ПОДІЇ АВТООНОВЛЕННЯ ===== */

autoUpdater.on('update-available', () => {
  console.log('Знайдено оновлення — качаю у фоні...');
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Оновлення готове',
    message: 'Завантажено нову версію трекера. Перезапустити зараз, щоб застосувати?',
    buttons: ['Перезапустити зараз', 'Пізніше']
  }).then((result) => {
    if (result.response === 0) {
      isQuitting = true;
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', (err) => {
  console.error('Помилка автооновлення:', err);
});