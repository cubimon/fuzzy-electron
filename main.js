const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const ipc = require('node-ipc').default

ipc.config.id = 'fuzzysearch'
ipc.config.retry = 1500

const initIPC = (mainWindow) => {
	ipc.serve(
		() => {
			ipc.server.on(
				'message',
				function (data, socket) {
					mainWindow.webContents.send('update-options', data)
					mainWindow.show()
					ipcMain.once('select-option', (_event, value) => {
						ipc.server.emit(
							socket,
							'message', 
							value
						)
						mainWindow.hide()
					})
					ipcMain.once('stop-selection', (_event) => {
						ipc.server.emit(
							socket,
							'message', 
							''
						)
						mainWindow.hide()
					})
				}
			)
		}
	)

	ipc.server.start()
}

const createWindow = () => {
	mainWindow = new BrowserWindow({
		frame: false,
		//transparent: true,
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})
	mainWindow.loadFile('index.html')
	mainWindow.hide()
	//mainWindow.webContents.openDevTools()
	//mainWindow.setOpacity(0.8)
	return mainWindow
}

app.whenReady().then(() => {
	mainWindow = createWindow()

	initIPC(mainWindow)

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
