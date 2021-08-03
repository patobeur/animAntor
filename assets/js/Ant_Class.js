"use strict";
class Ants {
	constructor() {
		// local Datas
		this.maxAnts = 60;
		this.mobdivContent = " ";
		this.allAnts = [];
		// -----------------------------
		this.immat = 0 // unique ant num
	}
	addAnt(name, pos = false, ia = true, playerid = false, direction = false) {

		if (this.allAnts.length < this.maxAnts) {
			this.allAnts.push(this.get_Ant(name, pos, ia, playerid, direction))
			this.appendAntDiv()
			this.immat++
			this.refreshConsole()
		}
	}
	refreshConsole() {
		mobCount.textContent = this.allAnts.length
		mobDead.textContent = nbDeadAnts
		mobRespawn.textContent = nbRespawnAnts
	}
	appendAntDiv() {
		// mob info div
		let character = this.allAnts[this.allAnts.length - 1]
		let mobinfo = document.createElement('div');
		mobinfo.className = "mobinfo"
		// // Ant range0 Div
		// let antRange0 = document.createElement('div');
		// let range0Size = (character.size * 1.5)
		// antRange0.style.width = range0Size + px
		// antRange0.style.height = range0Size + px
		// // Ant antRange0 centering
		// antRange0.style.left = "-" + ((range0Size / 2) - (character.size) / 2) + px
		// antRange0.style.top = "-" + ((range0Size / 2) - (character.size / 2)) + px

		// antRange0.style.backgroundColor = character.colors[1] + 20 // HEX #
		// antRange0.classList.add('rangeself')

		// Ant rangeA Div
		let antRangeA = document.createElement('div');
		let rangeASize = character.size * character.aSize
		antRangeA.style.width = rangeASize + px
		antRangeA.style.height = rangeASize + px

		// Ant rangeA centering
		antRangeA.style.left = "-" + ((rangeASize / 2) - (character.size) / 2) + px
		antRangeA.style.top = "-" + ((rangeASize / 2) - (character.size / 2)) + px
		//antRangeA.style.backgroundColor = "#00000020"//character.colors[1] + "15" // rgba
		antRangeA.classList.add('rangea')
		// Ant visual
		let newMobVisual = document.createElement('div');
		// newMobVisual.id = "visual-" + character.num
		newMobVisual.classList.add('visual')
		// newMobVisual.style.top = 0
		// newMobVisual.style.left = 0
		newMobVisual.style.width = character.size + px
		newMobVisual.style.height = character.size + px
		newMobVisual.style.backgroundImage = 'url("assets/img/' +
			(character.colors[1] === '#000000' ? 'ladybug_black.svg' : 'ladybug_white.svg') +
			'")'
		newMobVisual.style.backgroundColor = character.colors[0]
		newMobVisual.textContent = this.mobdivContent
		// newMobVisual.appendChild(antRangeA)
		// Ant Div
		let newMobDiv = document.createElement('div');
		newMobDiv.id = character.type + "-" + character.num
		newMobDiv.setAttribute("data-name", character.name)
		newMobDiv.style.top = character.y + px
		newMobDiv.style.left = (character.x) + px
		newMobDiv.style.maxWidth = character.size + px
		newMobDiv.style.maxHeight = character.size + px
		newMobDiv.style.width = character.size + px
		newMobDiv.style.height = character.size + px
		newMobDiv.className = character.classname
		// newMobDiv.style.backgroundColor = character.colors[0]
		newMobDiv.appendChild(antRangeA)
		// newMobDiv.appendChild(antRange0)
		newMobDiv.appendChild(newMobVisual)
		newMobDiv.appendChild(mobinfo)
		// append
		document.getElementById("mob").appendChild(newMobDiv)
	}
	get_Ant(name, pos = false, ia = true, playerid = false, direction = false, size = 35, hp = 100, velocity = 2, delay = 10, aSize = 3) {

		// centered position
		pos = (pos ? pos : [aleaEntreBornes(1, playGroundSize.w - size), aleaEntreBornes(1, playGroundSize.h - size)])
		return {
			"num": this.immat,
			"ia": ia,
			"name": name,
			"type": (!ia ? 'player' : 'ant'),
			"size": size,
			"aSize": aSize, // range a
			"hp": hp,
			"pos": pos,
			"x": pos[0],
			"y": pos[1],
			"direction": (direction === false) ? aleaEntreBornes(0, 359) : direction,
			"bousole": "",
			"velocity": velocity,
			// "color": 'rgb(' + aleaEntreBornes(50, 255) + ', ' + aleaEntreBornes(50, 255) + ', ' + aleaEntreBornes(50, 255) + ')',
			"colors": this.get_colors(),
			"delay": [0, delay],
			"image": ['/assets/img/ant40.png', '/assets/img/ant40.png'],
			"state": [
				'', //spawned|busy|walking|thinking|... (use ti be used by scss)
				'',
				'', //shielded|immune1Round|... 
				'alive'//death|recenter|... 
			],
			"overlap": [false, false], // [0=self,1=rangeA],
			"kills": 0,
			"lastenemyid": 0,
			"classname": 'ant ' + (!ia ? 'player ' : ''),
			"playerid": playerid,
			"agility": 45
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
