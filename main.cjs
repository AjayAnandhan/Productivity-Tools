const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "assets/app-icon.ico"), // must exist in packaged app
  });

  // Load the built React app
  const indexPath = path.join(__dirname, "dist", "index.html");
  console.log("Loading:", indexPath); // debug
  win.loadFile(indexPath);

  // Remove menu
  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  createWindow();
});
