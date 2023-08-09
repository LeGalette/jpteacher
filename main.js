const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const { translate } = require('./translator');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadFile('index.html');
}

ipcMain.on('translate-text', async (event, inputText) => {
  const translatedText = await translate(inputText);
  event.reply('translation-result', translatedText);
});

app.whenReady().then(createWindow);
console.log('doing something');
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
