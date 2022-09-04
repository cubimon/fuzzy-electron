window.addEventListener('load', () => {
	new SearchFilter()
})

class SearchFilter {

	constructor() {
		this.elements = []
		this.visibleElements = []
		this.focusIndex = []
		let input = document.getElementById("input")
		input.addEventListener('keyup', () => this.filterOptions())
		document.addEventListener('keydown', (event) => this.keyInput(event))
		window.electronAPI.updateOptions(
			(_event, values) => this.updateOptions(values))
	}

	updateOptions(values) {
		let options = document.getElementById('options')
		options.innerHTML = "";
		this.elements = []
		this.visibleElements = []
		this.focusIndex = 0
		for (let value of values) {
			if (value.length == 0) continue
			let option = document.createElement('li')
			let a = document.createElement('a');
			a.href = "#"
			a.innerText = value
			a.addEventListener('click', 
				(event) => this.selectOption(event.currentTarget.innerText))
			option.appendChild(a)
			options.append(option)
			this.elements.push(a)
			this.visibleElements.push(a)
		}
		this.focus()
	}

	keyInput(event) {
		if (event.key == 'ArrowUp') {
			this.focusPrev()
			return
		}
		if (event.key == 'ArrowDown') {
			this.focusNext()
			return
		}
		if (event.key == 'Tab') {
			if (event.shiftKey) {
				this.focusPrev()
				event.stopPropagation()
				event.preventDefault()
				return
			} else {
				this.focusNext()
				event.stopPropagation()
				event.preventDefault()
				return
			}
		}
		if (event.key == 'Enter') {
			this.selectOption(this.visibleElements[this.focusIndex].innerText)
			return
		}
		if (event.key == 'Escape') {
			this.stopSelection()
			event.stopPropagation()
			event.preventDefault()
			return
		}
		const ignoreKeys = ['Enter']
		if (ignoreKeys.includes(event.key)) return
		document.getElementById("input").focus()
	}

	filterOptions() {
		let value = document.getElementById("input").value
		this.visibleElements = []
		for (let element of this.elements) {
			let visible = element.innerText.includes(value)
			if (visible) this.visibleElements.push(element)
			element.parentElement.style.display = visible ? "" : "none"
		}
		if (!this.focusIsValid())
			this.focusIndex = this.visibleElements.length - 1
		this.focus()
	}

	focusPrev() {
		this.focusIndex += this.visibleElements.length
		this.focusIndex = (this.focusIndex - 1) % this.visibleElements.length
		this.focus()
	}

	focusNext() {
		this.focusIndex += this.visibleElements.length
		this.focusIndex = (this.focusIndex + 1) % this.visibleElements.length
		this.focus()
	}

	focusIsValid() {
		return this.focusIndex >= 0
			&& this.focusIndex < this.visibleElements.length
	}

	focus() {
		if (this.focusIsValid) {
			this.elements.forEach(element => element.classList.remove("focus"))
			this.visibleElements[this.focusIndex].classList.add("focus")
		}
	}

	selectOption(option) {
		window.electronAPI.selectOption(option)
	}

	stopSelection() {
		window.electronAPI.stopSelection()
	}
}

