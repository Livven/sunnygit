const { app, BrowserWindow } = require("electron");

function createWindow() {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    window.loadURL("http://localhost:3000");
    window.webContents.openDevTools();
    addDevTools();
  } else {
    window.loadFile("build/index.html");
  }
}

async function addDevTools() {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
  } = require("electron-devtools-installer");
  await installExtension(REACT_DEVELOPER_TOOLS);
}

app.whenReady().then(createWindow);
