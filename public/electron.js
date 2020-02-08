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
  } else {
    window.loadFile("build/index.html");
  }
}

app.whenReady().then(createWindow);
