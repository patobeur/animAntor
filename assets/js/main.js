"use strict";
// Ant's PlayGround
let PlayGround = Object
let pause = false
// -----------------------------
let interval = 1000 / 240 // render speed

// -----------------------------
let worldType = "mirrored" //  "mirrored" || "closed"
let outLinedBool = true //  "outlined" || ""
let respawn = true
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
let mobGround // element div for mob spawn
// let playGroundSize = { 'w': 1280, 'h': 640 };
let playGroundSize = { 'w': window.innerWidth, 'h': window.innerHeight };
//---
let startSpawn = ((playGroundSize.w + playGroundSize.h) / 2) / 30 // automatique spawner
// -----------------------------


function aleaEntreBornes(minimum, maximum) {
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}
function resizePlayGround() {
	playGround.style.top = ((window.innerHeight - playGroundSize.h) / 2) + px;
	playGround.style.left = ((window.innerWidth - playGroundSize.w) / 2) + px;
}
function WindowisLoaded() {
	// -----------------------------
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

	PlayGround = new AntAnimator()
	PlayGround.Ants.playGroundSize = playGroundSize
	PlayGround.set_respawn(respawn)
	if (respawn) {
		for (let i = 0; i < startSpawn; i++) {
			PlayGround.Ants.addAnt("amy" + i)
		}
	}
	document.onkeydown = (eventkeydown) => {
		if (!pause) {
			if (eventkeydown.key === "n") { PlayGround.Ants.addAnt("amy") }
			if (eventkeydown.key === "r") { PlayGround.set_respawn() }
			if (eventkeydown.key === "w") { PlayGround.set_worldtype() }

			if (eventkeydown.key === "q") { PlayGround.PlayGoLeft(0) }
			if (eventkeydown.key === "d") { PlayGround.PlayGoRight(0) }
			if (eventkeydown.key === "ArrowLeft") { PlayGround.PlayGoLeft(0) }
			if (eventkeydown.key === "ArrowRight") { PlayGround.PlayGoRight(0) }
			if (eventkeydown.key === "ArrowUp") { PlayGround.PlayGoUp(0) }
			if (eventkeydown.key === "ArrowDown") { PlayGround.PlayGoDown(0) }
			if (eventkeydown.key === "z") { PlayGround.PlayGoUp(0) }
			if (eventkeydown.key === "s") { PlayGround.PlayGoDown(0) }

			// if (eventkeydown.key === "i") { /* display info modal */ }
			if (eventkeydown.key === " ") { PlayGround.startGame() }
		}
		if (eventkeydown.key === "Escape") { PlayGround.pause() }
		if (eventkeydown.key === "p") { PlayGround.pause() }

		// console.log(eventkeydown.key)
	};
	isresPawning.addEventListener("click", () => {
		if (!pause) {
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
			PlayGround.Ants.addAnt("amy", [xxx, yyy])

		}
	})

}

// STARTER
window.addEventListener('load', WindowisLoaded, false)
window.addEventListener('resize', resizePlayGround, false)
