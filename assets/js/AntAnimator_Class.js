"use strict";
class AntAnimator {
	constructor() {
		// super([arguments]);
		// local Datas
		this.maxx = 0
		this.ratio = 1
		// -----------------------------
		this.playersList = [];
		this.playersDatas = [];
		this.maxPlayer = 1;
		// -----------------------------
		this.antsToDelete = []
		this.antsToRecenter = []
		this.CurrentMaxKills = 0;
		// playGroundSize = { 'w': 640, 'h': 320 };
		// playGroundSize = { 'w': 1280, 'h': 640 };
		playGround = document.getElementById('playground')
		playGround.style.width = playGroundSize.w + px
		playGround.style.height = playGroundSize.h + px
		resizePlayGround()
		this.Ants = new Ants(); // Ants ref only
		this.GameOn = false
		this.GameOver = false

	}
	startGame() {
		if (!this.GameOn && !this.GameOver) {
			this.GameOn = true
			this.GameOver = false
			setInterval(this.renderScene, interval)
		}
		this.addPlayer()
	}
	addPlayer() {

		if (this.GameOn && !this.GameOver) {
			console.log('---' + this.playersList.length)
			let playerid = this.playersList.length
			if (playerid < this.maxPlayer) {
				let pDatas = {
					name: "player-" + playerid,
					pos: [parseInt((playGroundSize.w) / 2), parseInt((playGroundSize.h) / 2)],
					ia: false,
					divid: 'ant-' + this.Ants.immat,
					compass: [0, 0, 0, 0] // up,right,down,left dir
				}
				//--
				this.playersList[playerid] = this.Ants.immat
				this.playersDatas[this.Ants.immat] = pDatas
				this.Ants.addAnt(pDatas.name, pDatas.pos, pDatas.ia, playerid, 0)
			}
			else {
				console.log('to many new players', this.playersDatas)
			}
		}
		else {
			console.log('game not started')
		}
	}
	niceDegres = (actualdegres, step, type) => {
		if (type === 'left') {
			return (actualdegres - step) < 0 ? 360 - actualdegres - step : actualdegres - step
		}
		else {
			return (actualdegres + step) > 360 ? actualdegres + step - 360 : actualdegres + step
		}
	}
	niceAltitudes = (actualaltitudes, step, type) => {
		if (type === 'up') {
			return (actualaltitudes + step) > 10 ? 10 : actualaltitudes + step
		}
		else {
			return (actualaltitudes - step) < 0 ? 0 : actualaltitudes - step
		}
	}
	mobsIA = () => {
		let currentMobIdx = 0
		this.resetOverlapsAndimmune1Round()
		let selectNewDirection = (actualdir, agility) => {
			// to do
			let nd = actualdir += aleaEntreBornes(-agility, agility)
			nd = nd > 360 ? 0 : nd
			nd = nd < 0 ? 360 : nd
			return nd
		}
		this.Ants.allAnts.forEach(ant => {
			if (ant.state[0] === "") {
				ant.state[0] = "walking"
			}
			// delay refresh
			ant.delay[0] = ant.delay[0] < ant.delay[1] ? ant.delay[0] += 1 : 0
			// select a new direction = nd
			if (ant.state[0] === "walking") {
				if (ant.ia === true) {
					if (ant.delay[0] >= ant.delay[1]) {
						ant.delay[0] = 0;
						ant.direction = selectNewDirection(ant.direction, ant.agility)
						// ant.state[0] = "walking"
					}
					else {
						ant.delay[0] += 1
					}
				}
				else {
					// ant.state[0] = "walking"
					ant.delay[0] = 0;
					let compass = this.playersDatas[this.playersList[ant.playerid]].compass // [up,right,down,left]
					if (compass[1] === 1) { compass[1] = 0, ant.direction = this.niceDegres(ant.direction, ant.agility, 'right') } // right
					if (compass[3] === 1) { compass[3] = 0, ant.direction = this.niceDegres(ant.direction, ant.agility, 'left') } // left
					if (compass[0] === 1) { compass[0] = 0, ant.direction = ant.direction - ant.agility } // up
					if (compass[2] === 1) { compass[2] = 0, ant.direction = ant.direction + ant.agility } // down
					compass = [0, 0, 0, 0]
				}
			}
			// calculating ratio (0 to 1) to get a direction
			if (ant.state[0] === "walking") {
				{
					// tansforming degre in pourcentage...wtf idea ???
					let ratioDir = parseInt(ant.direction / 360 * 1000) / 1000
					// north
					if (ratioDir >= 0 && ratioDir <= 0.0625) { ant.boussole = "N"; ant.y -= ant.velocity }
					// north est
					if (ratioDir > 0.0625 && ratioDir <= 0.1875) { ant.boussole = "NE"; ant.x += ant.velocity; ant.y -= ant.velocity }
					// est
					if (ratioDir > 0.1875 && ratioDir <= 0.3125) { ant.boussole = "E"; ant.x += ant.velocity }
					//south est
					if (ratioDir > 0.3125 && ratioDir <= 0.4375) { ant.boussole = "SE"; ant.x += ant.velocity; ant.y += ant.velocity }
					// south
					if (ratioDir > 0.4375 && ratioDir <= 0.5625) { ant.boussole = "S"; ant.y += ant.velocity }
					// south west
					if (ratioDir > 0.5625 && ratioDir <= 0.6875) { ant.boussole = "SW"; ant.x -= ant.velocity; ant.y += ant.velocity }
					// west
					if (ratioDir > 0.6875 && ratioDir <= 0.8125) { ant.boussole = "W"; ant.x -= ant.velocity; }
					// north west
					if (ratioDir > 0.8125 && ratioDir <= 1) { ant.boussole = "NW"; ant.x -= ant.velocity; ant.y -= ant.velocity }
				}

				// is the mob running out playground
				if (worldType === "mirrored") {
					if (ant.x <= -ant.size) { ant.x = playGroundSize.w }
					if (ant.x > playGroundSize.w) { ant.x = - ant.size + 1 }
					if (ant.y <= -ant.size) { ant.y = playGroundSize.h }
					if (ant.y > playGroundSize.h) { ant.y = - ant.size + 1 }
				}
				else if (worldType === "closed") {
					if (ant.x < 0) { ant.x = 0; ant.state[1] = "recenter" }
					if (ant.x >= playGroundSize.w - (ant.size)) { ant.x = playGroundSize.w - (ant.size); ant.state[1] = "recenter" }
					if (ant.y < 0) { ant.y = 0; ant.state[1] = "recenter" }
					if (ant.y >= playGroundSize.h - (ant.size)) { ant.y = playGroundSize.h - (ant.size); ant.state[1] = "recenter" }
				}
			}

			this.checkOverlaps(ant)

			// delete and respawn if is the mob stat is out
			if (ant.state[3] === "dead") {
				if (ant.ia) {
					this.addMobToDeletation(currentMobIdx)
				}
				else {
					console.log('player ' + ant.playerid + 'dead')
					this.addMobToDeletation(currentMobIdx)
					this.addPlayerToDeletation(ant.playerid, ant.num)
				}
			}
			// recenter if is the mob stat is out
			if (ant.state[1] === "recenter") {
				ant.x = ant.pos[0]
				ant.y = ant.pos[1]
				ant.state[1] = false
			}


			// 
			currentMobIdx++

			// end foreach
		})
		// deletion
		if (this.antsToDelete.length > 0) {
			this.deleteMobListe()
		}
		// if (this.antsToRecenter.length > 0) {
		// 	this.antsToRecenter.forEach(num => {
		// 		this.Ants.allAnts[num].pos = [playGroundSize.w / 2, playGroundSize.h / 2]
		// 		// document.getElementById("ant-" + this.Ants.allAnts[num].num).style.top = [playGroundSize.w / 2, playGroundSize.h / 2] + px
		// 		// document.getElementById("ant-" + this.Ants.allAnts[num].num).style.left = this.Ants.allAnts[this.Ants.allAnts.length - 1].x + px
		// 	})
		// 	this.antsToRecenter = []
		// }



	}
	set_respawn(isactive = "absent") {
		if (typeof isactive == "boolean") {
			respawn = isactive
		}
		else {
			respawn = respawn ? false : true
		}
		// refresh button info
		if (respawn) {
			isresPawning.classList.add('active')
			resPawning.textContent = "On"
		} else {
			isresPawning.classList.remove('active')
			resPawning.textContent = "Off"
		}
	}
	set_worldtype() {
		if (worldType === "mirrored") {
			worldType = "closed"
			worldtype.textContent = "Close"
			isworldtype.classList.add('active')
		} else {
			worldType = "mirrored"
			worldtype.textContent = "Mirror"
			isworldtype.classList.remove('active')
		}
	}
	set_outlined() {
		console.log('outlined', outLinedBool)
		if (outLinedBool === true) {
			outlined.textContent = "NoOutline"
			mobGround.classList.remove('outlined')
			outlined.classList.remove('active')
			outLinedBool = false;
		} else {
			outlined.textContent = "Outlined"
			mobGround.classList.add('outlined')
			outlined.classList.add('active')
			outLinedBool = true;
		}
		console.log('outlined', outLined)
	}
	addMobToDeletation(idx) {
		this.antsToDelete.push(idx)
		nbDeadAnts++
	}
	addPlayerToDeletation(idx, num) {
		console.log(this.playersDatas)
		console.log(this.playersList)
		this.playersDatas.splice(num, 1)
		this.playersList.splice(idx, 1)
		console.log(this.playersDatas)
		console.log(this.playersList)
	}
	addMobToRecentering(idx) {
		this.antsToRecenter.push(idx)
	}
	deleteMobListe() {
		if (this.antsToDelete.length > 0) {
			this.antsToDelete.sort()
			this.antsToDelete.reverse()
		}
		this.antsToDelete.forEach(num => {
			document.getElementById("ant-" + this.Ants.allAnts[num].num).remove()
			this.Ants.allAnts.splice(num, 1)
			// if (respawn) {
			// 	this.Ants.addAnt("amy")
			// 	nbRespawnAnts++
			// }
		})
		this.antsToDelete = []
	}
	resizeMobs(type, mob) {
		mob.size = mob.size * 1.1
		let currentMob = document.getElementById('ant-' + mob.num);
		currentMob.style.width = (mob.size) + px
		currentMob.style.height = (mob.size) + px
		currentMob.style.maxWidth = (mob.size) + px
		currentMob.style.maxHeight = (mob.size) + px
		currentMob.querySelector('.visual').style.width = (mob.size) + px
		currentMob.querySelector('.visual').style.height = (mob.size) + px

		currentMob.querySelector('.rangea').style.width = (mob.size * mob.aSize) + px
		currentMob.querySelector('.rangea').style.height = (mob.size * mob.aSize) + px
		currentMob.querySelector('.rangea').style.left = "-" + (((mob.size * mob.aSize) / 2) - (mob.size) / 2) + px
		currentMob.querySelector('.rangea').style.top = "-" + (((mob.size * mob.aSize) / 2) - (mob.size / 2)) + px


	}
	redrawAllMobs = () => {
		this.Ants.allAnts.forEach(ant => {
			let currentMob = document.getElementById('ant-' + ant.num);

			let elem = currentMob.querySelector(".mobinfo");
			elem.parentNode.removeChild(elem)

			currentMob.style.top = ant.y + px;
			currentMob.style.left = ant.x + px;
			currentMob.querySelector('.visual').style.transform = 'rotate(' + ant.direction + 'deg)';
			currentMob.querySelector('.visual').style.webkitTransform = 'rotate(' + ant.direction + 'deg)';
			currentMob.querySelector('.visual').style.mozTransform = 'rotate(' + ant.direction + 'deg)';
			currentMob.querySelector('.visual').style.msTransform = 'rotate(' + ant.direction + 'deg)';
			currentMob.querySelector('.visual').style.oTransform = 'rotate(' + ant.direction + 'deg)';
			currentMob.querySelector('.visual').style.color = ant.colors[1]
			let classSelf = (ant.overlap[0] === true) ? " overself" : ""
			let classRangeA = (ant.overlap[1] === true) ? " overa" : ""
			let classDead = (ant.state[3] === "dead") ? " dead" : ""
			currentMob.className = 'ant ' + ((!ant.ia) ? ' player ' : '') + ant.state[0] + classSelf + classRangeA + classDead;
			// refresh info
			let mobinfo = document.createElement('div')
			mobinfo.className = "mobinfo"

			let idspan = document.createElement('span')
			idspan.className = "idspan"
			idspan.textContent = "#" + ant.num
			mobinfo.appendChild(idspan)

			let posspan = document.createElement('span')
			posspan.className = "posspan"
			posspan.textContent = (ant.overlap[0] === true ? "1" : "0") + "," + (ant.overlap[1] === true ? "1" : "0")
			mobinfo.appendChild(posspan)

			let xpspan = document.createElement('span')
			xpspan.className = "xpspan"
			xpspan.textContent = "xp:" + ant.kills
			mobinfo.appendChild(xpspan)

			currentMob.appendChild(mobinfo)
		});
	}
	isOverlapping = (() => {
		function getArea(mob) {
			return [
				[
					mob.x,
					mob.x + mob.size
				], [
					mob.y,
					mob.y + mob.size
				]
			];
		}
		function getAreaRangeA(mob) {
			return [
				[
					mob.x - parseInt(((mob.size * mob.aSize) - mob.size) / 2),
					mob.x + parseInt(((mob.size * mob.aSize) + mob.size) / 2)
				], [
					mob.y - parseInt(((mob.size * mob.aSize) - mob.size) / 2),
					mob.y + parseInt(((mob.size * mob.aSize) + mob.size) / 2)
				]
			];
		}
		function compareAreas(mobA, mobB) {
			var dist1 = mobA[0] < mobB[0] ? mobA : mobB;
			var dist2 = mobA[0] < mobB[0] ? mobB : mobA;
			return dist1[1] > dist2[0] || dist1[0] === dist2[0];
		}
		return function (mobA, mobB) {
			return [
				compareAreas(getArea(mobA)[0], getArea(mobB)[0]) && compareAreas(getArea(mobA)[1], getArea(mobB)[1]),
				compareAreas(getAreaRangeA(mobA)[0], getAreaRangeA(mobB)[0]) && compareAreas(getAreaRangeA(mobA)[1], getAreaRangeA(mobB)[1])
			];
		};
	})(
		// ???
	);
	//--
	resetOverlapsAndimmune1Round() {
		this.Ants.allAnts.forEach(ant => {
			ant.overlap = [false, false]
			ant.state[2] = (ant.state[2] === 'immune1Round') ? 'alive' : ant.state[2]
		})
	}
	checkOverlaps = (currentMob) => {
		this.Ants.allAnts.forEach(ant => {
			if (currentMob.num != ant.num && !(currentMob.state[3] === "dead")) {//can't collid my self ?
				let alloverlaps = this.isOverlapping(currentMob, ant)
				if (alloverlaps[0]) {
					currentMob.overlap[0] = true
					ant.overlap[0] = true
					if (ant.state[2] != "immune1Round"
						&& ant.num != currentMob.lastenemyid
						&& (ant.kills < currentMob.kills || ant.kills === 0)
					) {
						currentMob.lastenemyid = ant.num
						currentMob.kills++
						// ant.lastenemyid = currentMob.num
						// give imunity from the dead target for iterations before resetOverlapsAndimmune1Round
						currentMob.state[2] = "immune1Round"
						this.resizeMobs('self', currentMob)
						ant.state[3] = "dead"
					}
					// currentMob.state[2] = 'dead'
				}
				if (alloverlaps[1]) {
					currentMob.overlap[1] = true
					ant.overlap[1] = true
				}
			}
		})
	}
	pause() { pause = pause ? false : true }
	renderScene = () => {
		this.redrawAllMobs()
		if (!pause && this.GameOn) {
			this.mobsIA()
		}
	}
	PlayGoTop = (idx) => {
		this.playersDatas[this.playersList[idx]].compass[0] = 1
		// console.log(this.playersDatas[this.playersList[idx]].compass)
	}
	PlayGoRight = (idx) => {
		this.playersDatas[this.playersList[idx]].compass[1] = 1
		// console.log(this.playersDatas[this.playersList[idx]].compass)
	}
	PlayGoDown = (idx) => {
		this.playersDatas[this.playersList[idx]].compass[2] = 1
		// console.log(this.playersDatas[this.playersList[idx]].compass)
	}
	PlayGoLeft = (idx) => {
		this.playersDatas[this.playersList[idx]].compass[3] = 1
		// console.log(this.playersDatas[this.playersList[idx]].compass)
	}
}
