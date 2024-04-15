require('dotenv').config();
const { app } = require('electron');
const path = require('node:path');
const { updateElectronApp } = require('update-electron-app');
const handleSquirrelEvent = require('./bin/squirrel');
const { mainWin, introWin, currentWin } = require('./bin/window');
const { handler } = require('./bin/handler');
const { init } = require('./bin/api/init');
const term = require('./bin/resources/terminal');

if (require('electron-squirrel-startup')) return;

updateElectronApp({
  updateInterval: '24 hour',
  logger: require('electron-log')
});

handler();

app.whenReady().then(() => {
  term('INTRO WINDOW');
  const intro = introWin();

  intro.once('show', async () => {
    const main = mainWin();

    main.once('ready-to-show', async () => {
      try {
        const start = await init(intro, app.getVersion());

        term('INIT Result', start);

        if (start === true) {
          term('INDEX WINDOW');
          main.show();
          intro.destroy();
        }

        if (start === null) {
          // Fechar a aplicação se o banco de dados local não inicializar
          app.quit();
        }
        
      } catch (error) {
        term('ERRO FATAL (Home):', error.message);
      }
    })
    
    main.loadFile(path.join(__dirname, './app/index.html'));
  })

  intro.loadFile(path.join(__dirname, './app/intro/intro.html'));
  intro.show();
  
  app.on('activate', () => {
    if (currentWin) {
      mainWin();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

if (handleSquirrelEvent(app)) return; // Não executar nada além
