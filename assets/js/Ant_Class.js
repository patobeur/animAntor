"use strict";
class Ants {
	constructor() {
		// local Datas
		this.maxAnts = 60
		this.mobdivContent = "i"
		this.allAnts = []
		// -----------------------------
		this.immat = 0 // unique ant num

	}
	addAnt(name, pos = false) {
		if (this.allAnts.length < this.maxAnts) {
			this.allAnts.push(this.get_Ant(name, pos))
			this.appendAntDiv()
			this.immat++
		}
	}
	refreshConsole() {
		mobCount.textContent = this.allAnts.length
		mobDead.textContent = nbDeadAnts
		mobRespawn.textContent = nbRespawnAnts
	}
	appendAntDiv() {
		// mob info div
		let mobinfo = document.createElement('div');
		mobinfo.className = "mobinfo"
		// // Ant range0 Div
		// let antRange0 = document.createElement('div');
		// let range0Size = (this.allAnts[this.allAnts.length - 1].size * 1.5)
		// antRange0.style.width = range0Size + px
		// antRange0.style.height = range0Size + px
		// // Ant antRange0 centering
		// antRange0.style.left = "-" + ((range0Size / 2) - (this.allAnts[this.allAnts.length - 1].size) / 2) + px
		// antRange0.style.top = "-" + ((range0Size / 2) - (this.allAnts[this.allAnts.length - 1].size / 2)) + px

		// antRange0.style.backgroundColor = this.allAnts[this.allAnts.length - 1].colors[1] + 20 // HEX #
		// antRange0.classList.add('rangeself')

		// Ant rangeA Div
		let antRangeA = document.createElement('div');
		let rangeASize = this.allAnts[this.allAnts.length - 1].size * this.allAnts[this.allAnts.length - 1].aSize
		antRangeA.style.width = rangeASize + px
		antRangeA.style.height = rangeASize + px
		// Ant rangeA centering
		antRangeA.style.left = "-" + ((rangeASize / 2) - (this.allAnts[this.allAnts.length - 1].size) / 2) + px
		antRangeA.style.top = "-" + ((rangeASize / 2) - (this.allAnts[this.allAnts.length - 1].size / 2)) + px
		antRangeA.style.backgroundColor = "#00000020"//this.allAnts[this.allAnts.length - 1].colors[1] + "15" // rgba
		antRangeA.classList.add('rangea')
		// Ant visual
		let newMobVisual = document.createElement('div');
		// newMobVisual.id = "visual-" + this.allAnts[this.allAnts.length - 1].num
		newMobVisual.classList.add('visual')
		// newMobVisual.style.top = "0px"
		// newMobVisual.style.left = "0px"
		newMobVisual.style.width = this.allAnts[this.allAnts.length - 1].size + px
		newMobVisual.style.height = this.allAnts[this.allAnts.length - 1].size + px
		newMobVisual.style.backgroundImage = 'url("assets/img/' +
			(this.allAnts[this.allAnts.length - 1].colors[1] === '#000000' ? 'antblack.png' : 'antwhite.png') +
			'")'
		newMobVisual.style.backgroundColor = this.allAnts[this.allAnts.length - 1].colors[0]
		newMobVisual.textContent = this.mobdivContent
		// newMobVisual.appendChild(antRangeA)
		// Ant Div
		let newMobDiv = document.createElement('div');
		newMobDiv.id = "ant-" + this.allAnts[this.allAnts.length - 1].num
		newMobDiv.style.top = this.allAnts[this.allAnts.length - 1].y + px
		newMobDiv.style.left = (this.allAnts[this.allAnts.length - 1].x) + px
		newMobDiv.style.maxWidth = this.allAnts[this.allAnts.length - 1].size + px
		newMobDiv.style.maxHeight = this.allAnts[this.allAnts.length - 1].size + px
		newMobDiv.style.width = this.allAnts[this.allAnts.length - 1].size + px
		newMobDiv.style.height = this.allAnts[this.allAnts.length - 1].size + px
		newMobDiv.classList.add('ant')
		// newMobDiv.style.backgroundColor = this.allAnts[this.allAnts.length - 1].colors[0]
		newMobDiv.setAttribute("data-name", this.allAnts[this.allAnts.length - 1].name)
		newMobDiv.appendChild(antRangeA)
		// newMobDiv.appendChild(antRange0)
		newMobDiv.appendChild(newMobVisual)
		newMobDiv.appendChild(mobinfo)
		// append
		document.getElementById("mob").appendChild(newMobDiv)
		this.refreshConsole()
	}
	get_Ant(name, pos = false, size = 20, hp = 100, direction = false, velocity = 1, delay = 10, aSize = 3) {
		pos = ((!pos === false) ? pos : [playGroundSize.w / 2, playGroundSize.h / 2])
		return {
			"num": this.immat,
			"name": name,
			"size": size,
			"aSize": aSize, // range a
			"hp": hp,
			"pos": pos,
			"x": pos[0],
			"y": pos[1],
			"direction": direction ? direction : aleaEntreBornes(0, 359),
			"bousole": "",
			"velocity": velocity,
			// "color": 'rgb(' + aleaEntreBornes(50, 255) + ', ' + aleaEntreBornes(50, 255) + ', ' + aleaEntreBornes(50, 255) + ')',
			"colors": this.get_colors(),
			"delay": [0, delay],
			"image": ['/assets/img/ant40.png', '/assets/img/ant40.png'],
			"state": [
				'', //spawned|busy|walking|thinking|... (use ti be used by scss)
				'',
				'', //shielded|immune|... 
				'alive'//death|recenter|... 
			],
			"overlap": [false, false], // [0=self,1=rangeA],
			"kills": 0
		}
	}
	get_colors(a = 1) { // a=alpha
		let lightColor = "#FFFFFF"
		let darkColor = "#000000"
		let r = aleaEntreBornes(0, 255) // red
		let g = aleaEntreBornes(0, 255) // green
		let b = aleaEntreBornes(0, 255) // blue

		let rgbColor = [r / 255, g / 255, b / 255];
		let c = rgbColor.map((col) => {
			if (col <= 0.03928) {
				return col / 12.92;
			}
			return Math.pow((col + 0.055) / 1.055, 2.4);
		});
		let Lum = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
		let BorW = (Lum > 0.179) ? darkColor : lightColor;
		return ['rgba(' + r + ',' + g + ',' + b + ',' + a + ')', BorW]
	}
}
