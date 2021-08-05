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
	addAnt(datas = false) {
		if (this.allAnts.length < this.maxAnts) {
			this.allAnts.push(this.get_Mob(datas))
			this.appendAntDiv()
			this.immat++
			this.refreshConsole()
		}
	}
	get_Mob(datas = false) {
		let playerid = (datas.playerid && datas.playerid[0] >= 0) ? datas.playerid : false
		let type = datas.type ?? 'ia'
		let immat = this.immat
		let ia = (datas.ia && !datas.ia[0]) ? datas.ia : [true]
		let name = datas.name ?? 'amy'
		let size = datas.size ?? 35
		let hp = datas.hp ?? 100
		let pos = datas.pos ?? [aleaEntreBornes(1, playGroundSize.w - size), aleaEntreBornes(1, playGroundSize.h - size), 0]
		datas = {
			playerid: playerid,
			type: type,
			ia: ia,
			name: name,
			num: immat,
			size: size,
			hp: hp,
			pos: pos,
			x: pos[0],
			y: pos[1],
			z: pos[2],
			immat: immat,
			// divid: datas.divid ?? false, // not used
			compass: datas.compass ?? [0, 0, 0, 0], // up,right,down,left dir
			stacks: datas.stacks ?? [],
			velocity: datas.velocity ?? 1.5,
			delay: [0, (datas.delay ?? 20)],
			aSize: datas.aSize ?? 3,
			visual: this.get_visual(type),
			direction: datas.direction ?? aleaEntreBornes(0, 359),
			// "color": 'rgb(' + aleaEntreBornes(50, 255) + ', ' + aleaEntreBornes(50, 255) + ', ' + aleaEntreBornes(50, 255) + ')',
			colors: this.get_colors(),
			state: datas.state ?? [
				'', //spawned|busy|walking|thinking|... (use ti be used by scss)
				'',
				'', //shielded|immune1Round|... 
				'alive'//death|recenter|... 
			],
			overlap: [false, false], // [0=self,1=rangeA],
			lastenemyid: 0,
			classname: 'moob ' + type,
			agility: 45,
			kills: 0,
			food: 0,
			power: 0,
			boussole: "",
			lv: 0
		}
		return datas
	}
	appendAntDiv() {
		// mob info div
		let character = this.allAnts[this.allAnts.length - 1]
		let mobinfo = document.createElement('div');
		mobinfo.className = "mobinfo"

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
		newMobVisual.style.backgroundImage = 'url("assets/img/' + (character.colors[1] === '#000000' ? character.visual[0] : character.visual[1]) + '")'
		newMobVisual.style.backgroundColor = character.colors[0]
		newMobVisual.textContent = this.mobdivContent
		// newMobVisual.appendChild(antRangeA)
		// Ant Div
		let newMobDiv = document.createElement('div');
		newMobDiv.id = "item-" + character.num
		newMobDiv.setAttribute("data-name", character.name)
		newMobDiv.setAttribute("data-immat", character.immat)
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
	refreshConsole() {
		// mobCount.textContent = this.allAnts.length
		// mobDead.textContent = nbDeadAnts
		// mobRespawn.textContent = nbRespawnAnts
		// remainingmobs.textContent = nbRespawnAnts
		remainingmobs.textContent = this.allAnts.length
		remainingmobs.style.width = ((this.allAnts.length) * 40) + px
		remainingmobs.style.height = ((this.allAnts.length) * 40) + px

	}
	get_visual(type) {
		let visual = {
			ia: ['ladybug_black.svg', 'ladybug_white.svg'],
			ladybug: ['ladybug_black.svg', 'ladybug_white.svg'],
			ant: ['ladybug_black.svg', 'ladybug_white.svg'],
			player: ['ant_black.png', 'ant_white.png'],
		}
		return visual[type]
	}
}
