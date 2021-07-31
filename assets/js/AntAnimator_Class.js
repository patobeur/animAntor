"use strict";
class AntAnimator {
	constructor() {
		// super([arguments]);
		// local Datas
		this.maxx = 0
		this.ratio = 1
		// -----------------------------
		this.antsToDelete = []
		this.antsToRecenter = []
		// playGroundSize = { 'w': 640, 'h': 320 };
		// playGroundSize = { 'w': 1280, 'h': 640 };
		playGround = document.getElementById('playground')
		playGround.style.width = playGroundSize.w + px
		playGround.style.height = playGroundSize.h + px
		resizePlayGround()
		this.Ants = new Ants(playGroundSize); // Ants ref only
		setInterval(this.renderScene, interval)
	}
	mobsIA = () => {
		let currentMobIdx = 0
		this.resetOverlapsAndImmune()
		function selectNewDirection(actualdir) {
			// to do
			let nd = actualdir += aleaEntreBornes(-50, 50)
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
				if (ant.delay[0] >= ant.delay[1]) {
					ant.delay[0] = 0;
					ant.direction = selectNewDirection(ant.direction)
					// ant.state[0] = "walking"
				}
				else {
					ant.delay[0] += 1
				}
			}
			if (ant.state[0] === "walking") {

				// calculating ratio (0 to 1) to get a direction
				{
					// tansforming degre in pourcentage
					// wtf idea ???
					let ratioDir = parseInt(ant.direction / 360 * 1000) / 1000
					// north
					if (ratioDir > 0.9375 && ratioDir <= 0.0625) { ant.boussole = "N"; ant.y -= ant.velocity }
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
					if (ratioDir > 0.8125 && ratioDir <= 0.9375) { ant.boussole = "NW"; ant.x -= ant.velocity; ant.y -= ant.velocity }
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
				this.addMobToDeletation(currentMobIdx)
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
	addMobToDeletation(idx) {
		this.antsToDelete.push(idx)
		nbDeadAnts++
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
			currentMob.className = 'ant ' + ant.state[0] + classSelf + classRangeA + classDead;
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
	isOverlapping = (function () {
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
	})();
	resetOverlapsAndImmune() {
		this.Ants.allAnts.forEach(ant => {
			ant.overlap = [false, false]
			ant.state[2] = (ant.state[2] === 'immune') ? 'alive' : ant.state[2]
		})
	}
	checkOverlaps(currentMob) {
		this.Ants.allAnts.forEach(ant => {
			if (currentMob.num != ant.num && !(currentMob.state[3] === "dead")) {//can't collid my self ?
				let alloverlaps = this.isOverlapping(currentMob, ant)
				if (alloverlaps[0]) {
					currentMob.overlap[0] = true
					ant.overlap[0] = true
					if (ant.state[2] != "immune"
						&& ant.size <= currentMob.size
						&& ant.num != currentMob.lastenemyid
						&& (ant.kills < currentMob.kills || ant.kills === 0)
					) {
						currentMob.lastenemyid = ant.num
						currentMob.kills++
						// ant.lastenemyid = currentMob.num
						currentMob.state[2] = "immune"
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
		if (!pause) {
			this.mobsIA()
			this.redrawAllMobs()
		}
	}
}
