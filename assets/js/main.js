"use strict";
// Ant's PlayGround
let PlayGround = Object
// -----------------------------
let interval = 1000 / 120 // render speed

// -----------------------------
let playGroundSize = { 'w': window.innerWidth - 40, 'h': window.innerHeight - 40 };
let worldType = "mirrored" //  "mirrored" || "closed"
let outLinedBool = true //  "outlined" || ""
let respawn = true
let startSpawn = 5//((playGroundSize.w + playGroundSize.h) / 2) / 30 // automatique spawner
// -----------------------------
let px = 'px'
let pt = '%'
// -----------------------------
// Console
let nbDeadAnts = 0 // total mob out
let nbRespawnAnts = 0 // total mob respawned if respawn = true
// -----------------------------
let playGround, mobCount, mobDead // counts
let mobRespawn, resPawning, isresPawning, worldtype, isworldtype, outlined, isoutlined
let escapescreen
let mobGround // element div for mob spawn
// let playGroundSize = { 'w': 1280, 'h': 640 };
//---
// -----------------------------


function aleaEntreBornes(minimum, maximum) {
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}
function resizePlayGround() {
	playGround.style.top = ((window.innerHeight - playGroundSize.h) / 2) + px;
	playGround.style.left = ((window.innerWidth - playGroundSize.w) / 2) + px;
}
function getAllDivObjects() {
	escapescreen = document.getElementById('escapescreen')
	playGround = document.getElementById('playground')
	mobGround = document.getElementById('mob')
	mobCount = document.getElementById('mobcount')
	mobDead = document.getElementById('mobdead')
	mobRespawn = document.getElementById('respawned')
	isresPawning = document.getElementById('isrespawning')
	resPawning = document.getElementById('respawning')
	isworldtype = document.getElementById('isworldtype')
	worldtype = document.getElementById('worldtype')
	isoutlined = document.getElementById('isoutlined')
	outlined = document.getElementById('outlined')
	splashplayer0 = document.getElementById('splashplayer0')
	p0left = document.getElementById('p0left')
	p0right = document.getElementById('p0right')
	splashplayer1 = document.getElementById('splashplayer1')
	p1left = document.getElementById('p1left')
	p1right = document.getElementById('p1right')
}
function WindowisLoaded() {
	// -----------------------------
	getAllDivObjects()
	PlayGround = new AntAnimator()
	PlayGround.Ants.playGroundSize = playGroundSize
	PlayGround.set_respawn(respawn)
	document.onkeydown = (eventkeydown) => {
		if (!PlayGround.Pause) {
			if (eventkeydown.key === "n") { PlayGround.Ants.addAnt() }
			if (eventkeydown.key === "r") { PlayGround.set_respawn() }
			if (eventkeydown.key === "w") { PlayGround.set_worldtype() }

			// player 1
			if (eventkeydown.key === " ") { PlayGround.startGame(0) }
			if (eventkeydown.key === "ArrowLeft") { PlayGround.PlayGoLeft(0); PlayGround.PlayGoLeft(1); PlayGround.PlayGoLeft(2) }
			if (eventkeydown.key === "ArrowRight") { PlayGround.PlayGoRight(0); PlayGround.PlayGoRight(1); PlayGround.PlayGoRight(2) }
			if (eventkeydown.key === "ArrowUp") { PlayGround.PlayGoUp(0) }
			if (eventkeydown.key === "ArrowDown") { PlayGround.PlayGoDown(0) }
			// player 2
			if (eventkeydown.key === "Enter") { PlayGround.startGame(1) }
			if (eventkeydown.key === "q") { PlayGround.PlayGoLeft(1) }
			if (eventkeydown.key === "d") { PlayGround.PlayGoRight(1) }
			if (eventkeydown.key === "z") { PlayGround.PlayGoUp(1) }
			if (eventkeydown.key === "s") { PlayGround.PlayGoDown(1) }
			// player 3
			if (eventkeydown.key === "9") { PlayGround.startGame(2) }
			if (eventkeydown.key === "4") { PlayGround.PlayGoLeft(2) }
			if (eventkeydown.key === "6") { PlayGround.PlayGoRight(2) }
			// if (eventkeydown.key === "8") { PlayGround.PlayGoUp(2) }
			// if (eventkeydown.key === "2") { PlayGround.PlayGoDown(2) }

			// if (eventkeydown.key === "i") { /* display info modal */ }
		}
		if (eventkeydown.key === "Escape") { PlayGround.setPause(0) }
		// if (eventkeydown.key === "p") { PlayGround.setPause() }

		// console.log(eventkeydown.key)
	};
	splashplayer0.addEventListener("click", () => { PlayGround.startGame(0); })
	p0left.addEventListener("click", () => { PlayGround.PlayGoLeft(0); })
	p0right.addEventListener("click", () => { PlayGround.PlayGoRight(0); })
	splashplayer1.addEventListener("click", () => { PlayGround.startGame(1); })
	p1left.addEventListener("click", () => { PlayGround.PlayGoLeft(1); })
	p1right.addEventListener("click", () => { PlayGround.PlayGoRight(1); })

	isresPawning.addEventListener("click", () => {
		if (!PlayGround.Pause) {
			PlayGround.set_respawn()
		}
	})
	isworldtype.addEventListener("click", () => {
		PlayGround.set_worldtype()
	})
	isoutlined.addEventListener("click", () => {
		PlayGround.set_outlined()
	})
	mobGround.addEventListener("click", (eve) => {
		if (eve.target.id === "mob") {
			let yyy = eve.clientY - ((window.innerHeight - playGroundSize.h) / 2)
			let xxx = eve.clientX - ((window.innerWidth - playGroundSize.w) / 2)
			PlayGround.Ants.addAnt({ name: 'amy', pos: [xxx, yyy] })
		}
	})

}

// STARTER
window.addEventListener('load', WindowisLoaded, false)
window.addEventListener('resize', resizePlayGround, false)
