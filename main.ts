import { app, BrowserWindow, screen, Menu, dialog, ipcMain, ipcRenderer, globalShortcut } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
//import { AppComponent } from './src/app/app.component';
//import { MyDashboardComponent } from './src/app/my-dashboard/my-dashboard.component';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');


function createWindow() {

  /*const {autoUpdater} = require('electron-updater');
  autoUpdater.checkForUpdatesAndNotify();*/

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width/2,
    height: size.height
  });

  if (serve) {
    require('electron-reload')(__dirname, {
     electron: require(`${__dirname}/node_modules/electron`)});
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });


  let focusedWindow = BrowserWindow.getFocusedWindow();

  globalShortcut.register('CommandOrControl+O', () => openSRTFile());
  globalShortcut.register('CommandOrControl+I', () => showDevTools());

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  Menu.setApplicationMenu(mainMenu);
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  



} catch (e) {
  // Catch Error
  // throw e;
}


const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: "Open SRT File",
        accelarator: process.platform == 'darwin' ? 'Commnad+O' : 'Control+O',
        click: _ =>  {
          openSRTFile();
        }
      }
    ]
  },
  {
    label: 'Developer Tools',
    submenu: [
      {
        label: "Toggle DevTools",
        //accelarator: process.platform == 'darwin' ? 'Commnad+I' : 'Control+I', 
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  }
];


function openSRTFile() {

  console.log('Open File By Menu');

  ipcMain.emit('open-file-dialog');

/*
  let selectedFilePaths = dialog.showOpenDialog(
                        {
                          properties: ['openFile'],
                          filters: [
                                      {
                                        name: 'Subtitle Edit or Script Sorter Files', 
                                        extensions: ['txt', 'sst']
                                      }
                                  ]
                          
                        }  
                      );

  console.log(selectedFilePaths[0]);
  fs.readFile(selectedFilePaths[0], function(err, data) {
    if (err) {
      return console.log(err);
    }
    console.log("file has been read by Menu");
    //console.log(data)
    ipcMain.emit('fileOpened', data);


    //fileContent.html(data);
    

  });
*/

}


function showDevTools() {
  let focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.webContents.toggleDevTools();
}



ipcMain.on('open-file-dialog', function(event, data){

  let selectedFilePaths = dialog.showOpenDialog(
      {
        properties: ['openFile'],
        filters: [
                    {
                      name: 'Subtitle Edit or Script Sorter Files', 
                      extensions: ['txt', 'sst']
                    }
                ]
        
      }  
    );
  console.log(selectedFilePaths[0]);
  fs.readFile(selectedFilePaths[0], function(err, data) {
    if (err) {
      return console.log(err);
    }

    console.log("file has been read");
    
    if (event && event.sender) {
      event.sender.send('fileOpened', data);
    }
    else {
      console.log("...fileOpened from main menu");
      //ipcRenderer.send('fileOpened');

      //@ViewChild(MyDashboardComponent) myComponent:MyDashboardComponent;

      

    }

  });
});

