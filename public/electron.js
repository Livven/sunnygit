const { BrowserWindow, app } = require("electron");

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
    REACT_DEVELOPER_TOOLS,
    default: installExtension,
  } = require("electron-devtools-installer");
  await installExtension(REACT_DEVELOPER_TOOLS);
}

// required for nodegit, but will only work until Electron 11
// see https://github.com/nodegit/nodegit/issues/1774
app.allowRendererProcessReuse = false;
app.whenReady().then(createWindow);
