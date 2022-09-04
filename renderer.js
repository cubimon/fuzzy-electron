window.addEventListener('load', () => {
	new SearchFilter()
})

class SearchFilter {

	constructor() {
		this.values = []
		this.visibleValues = []
		this.elements = []
		this.focusIndex = 0
		let input = document.getElementById("input")
		input.addEventListener('keyup', () => this.filterOptions())
		document.addEventListener('keydown', (event) => this.keyInput(event))
		window.electronAPI.updateOptions(
			(_event, values) => this.updateOptions(values))
	}

	updateOptions(values) {
		let options = document.getElementById('options')
		options.innerHTML = ""
		this.values = values
		this.visibleValues = []
		this.elements = []
		this.focusIndex = 0
		this.filterOptions()
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
			this.selectOption(this.elements[this.focusIndex].innerText)
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
		let inputValue = document.getElementById("input").value
		let options = document.getElementById('options')
		this.visibleValues = []
		this.elements = []
		options.innerHTML = ""
		for (let value of this.values) {
			if (value.includes(inputValue)) {
				this.visibleValues.push(value)
				let option = document.createElement('li')
				let a = document.createElement('a')
				a.href = "#"
				a.innerText = value
				a.addEventListener('click',
					(event) => this.selectOption(event.currentTarget.innerText))
				option.appendChild(a)
				this.elements.push(a)
				options.append(option)
			}
		}
		if (!this.focusIsValid())
			this.focusIndex = this.elements.length - 1
		this.focus()
	}

	focusPrev() {
		this.focusIndex += this.elements.length
		this.focusIndex = (this.focusIndex - 1) % this.elements.length
		this.focus()
	}

	focusNext() {
		this.focusIndex += this.elements.length
		this.focusIndex = (this.focusIndex + 1) % this.elements.length
		this.focus()
	}

	focusIsValid() {
		return this.focusIndex >= 0
			&& this.focusIndex < this.elements.length
	}

	focus() {
		if (this.focusIsValid()) {
			this.elements.forEach(element => element.classList.remove("focus"))
			this.elements[this.focusIndex].classList.add("focus")
		}
	}

	selectOption(option) {
		window.electronAPI.selectOption(option)
	}

	stopSelection() {
		window.electronAPI.stopSelection()
	}
}

