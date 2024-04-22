require('dotenv').config();
const { app } = require('electron');
const path = require('node:path');
const { updateElectronApp } = require('update-electron-app');
/* const handleSquirrelEvent = require('./bin/squirrel.js.OLD'); */
const { Win } = require('./bin/win');
const { handler } = require('./bin/handler');
const { init } = require('./bin/api/init');
const { shutdown } = require('./bin/api/shutdown');
const term = require('./bin/util/terminal');

/* if (require('electron-squirrel-startup')) return; */

updateElectronApp({
  updateInterval: '24 hour',
  logger: require('electron-log')
});

handler();

app.whenReady().then(() => {
  term('INTRO WINDOW');
  const intro = Win.intro();

  intro.once('show', async () => {
    const main = Win.main();

    main.once('ready-to-show', async () => {
      try {
        await init(intro, app.getVersion());
        term('INDEX WINDOW');
        main.show();
        intro.destroy();
        
      } catch (error) {
        term('ERRO FATAL (Home):\n', error);
        app.quit();
      }
    })
    
    main.loadFile(path.join(__dirname, './app/index.html'));
  })

  intro.loadFile(path.join(__dirname, './app/intro/intro.html'));
  intro.show();
  
  app.on('activate', () => {
    if (Win.current()) {
      Win.main();
    }
  });
});

app.on('before-quit', async () => {
  await shutdown();
  console.log('Conexão com o banco de dados fechada.');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

/* if (handleSquirrelEvent(app)) return; // Não executar nada além */
