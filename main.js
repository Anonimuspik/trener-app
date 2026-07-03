// main.js — головний файл Electron-застосунку.
// Відкриває trener1.html у власному вікні і перевіряє оновлення на GitHub.

const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

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
}

app.whenReady().then(() => {
  createWindow();

  // перевіряємо оновлення через 3 секунди після старту (не одразу, щоб не гальмувати запуск)
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 3000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
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
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', (err) => {
  console.error('Помилка автооновлення:', err);
});
