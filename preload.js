const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	updateOptions: (callback) => ipcRenderer.on('update-options', callback),
	selectOption: (option) => ipcRenderer.send('select-option', option),
	stopSelection: () => ipcRenderer.send('stop-selection')
})