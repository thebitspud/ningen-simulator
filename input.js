let cursors,
	spacebar,
	lastDir;

function initControls(game) {
	cursors = game.input.keyboard.createCursorKeys();
	spacebar = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function getInput() { // check mouse and keyboard input
	if(gameOver) {
		if(spacebar.isDown) { // reload the stage if player is dead
			resetStage();
			gameOver = false;
		}
		
		return;
	}

	onPlatform = (ningen.body.onFloor() || (ningen.body.touching.down && onMpf)) ? true:false;
	
	if (cursors.left.isDown) { // move left
		ningen.setVelocityX(-200);
	
		if(onPlatform && !cursors.up.isDown) ningen.anims.play('left', true);
		else ningen.anims.play('still-left', true);
		lastDir = 'left';
	} else if (cursors.right.isDown) { // move right
		ningen.setVelocityX(200);
	
		if(onPlatform && !cursors.up.isDown) ningen.anims.play('right', true);
		else ningen.anims.play('still-right', true);
		lastDir = 'right';
	} else {
		ningen.setVelocityX(0); // set velocity to 0 if not moving
	
		if(lastDir === 'left') { // determinig the last direction ningen moved in
			ningen.anims.play('still-left', true);
		}else if(lastDir === 'right') {
			ningen.anims.play('still-right', true);
		}
	}
	
	if (cursors.up.isDown && onPlatform) { // jumping
		ningen.setVelocityY(-500);
	}
}