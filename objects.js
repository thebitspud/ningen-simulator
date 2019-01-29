let ningen,
	platforms,
	movingPlatforms,
	nunus,
	bombs,
	bounds;

function initObjects(game) {
	// adding the player
	ningen = game.physics.add.sprite(25, 520, 'ningen', 1);
	ningen.setCollideWorldBounds(true);
	//game.cameras.main.startFollow(ningen);

	// adding non-player objects
	platforms = game.physics.add.staticGroup();
	bounds = game.physics.add.staticGroup();
	movingPlatforms = game.physics.add.group();
	nunus = game.physics.add.group();
	bombs = game.physics.add.group();

	// player-stage collisions
	game.physics.add.collider(ningen, platforms);
	game.physics.add.collider(ningen, movingPlatforms, onMovingPlatform, null, game);

	// player-object collisions
	game.physics.add.overlap(ningen, bombs, touchingBomb, null, game);
	game.physics.add.overlap(ningen, nunus, touchingNunu, null, game);

	// object-stage collisions
	game.physics.add.collider(bombs, platforms, bounce, null, game);
	game.physics.add.collider(bombs, movingPlatforms, bounce, null, game);

	game.physics.add.overlap(movingPlatforms, platforms, switchDirection, null, game);
	game.physics.add.overlap(movingPlatforms, bounds, switchDirection, null, game);
}

function initAnimations(game) { // initialising object and player animations
	game.anims.create({
		key: 'left',
		frames: game.anims.generateFrameNumbers('ningen', { start: 2, end: 3 }),
		frameRate: 8,
		repeat: -1
	});

	game.anims.create({
		key: 'still-left',
		frames: [ { key: 'ningen', frame: 3 } ],
		frameRate: 100
	});

	game.anims.create({
		key: 'still-right',
		frames: [ { key: 'ningen', frame: 1 } ],
		frameRate: 100
	});

	game.anims.create({
		key: 'right',
		frames: game.anims.generateFrameNumbers('ningen', { start: 0, end: 1 }),
		frameRate: 10,
		repeat: -1
	});
}

// spawning in objects

function spawnPlatform(x, y) {
	platforms.create(x, y, 'platform');
}

function spawnNunu(x, y) {
	var nunu = nunus.create(x, y, 'nunu');
	nunu.body.setAllowGravity(false);
}

function spawnBomb(x, y, vx, vy) {
	var bomb = bombs.create(x, y, 'bomb');
	bomb.setVelocity(vx, vy);
	bomb.setBounce(1);
	bomb.setCollideWorldBounds(true);
}

function spawnMovingPlatform(x, y, vx, vy) {
	var mpf = movingPlatforms.create(x, y, 'platform');
	mpf.setVelocity(vx, vy);
	mpf.setBounce(1);
	mpf.setCollideWorldBounds(true);
	mpf.setImmovable();
	mpf.body.setAllowGravity(false);
	mpf.body.setFriction(1);
}

function spawnBound(x, y) {
	var bound = bounds.create(x, y, 'bomb');
	bound.setVisible(false);
}

// collisions

var onMpf = false;

function onMovingPlatform(ningen, mpf) {
	onMpf = true;
}

function touchingNunu (ningen, nunu) {
	nunu.disableBody(true, true);

	changeScore(10);
	collected++;

	if(nunus.countActive(true) === 0) allCollected = true;
}

function bounce(bomb, platform) {
	// capping y velocity
	if(bomb.body.touching.down) {
		bomb.setVelocityY(-500);
	}

	if(bomb.body.velocity.x < 50 && bomb.body.velocity.x > -50) bomb.setVelocityX(0);
	else if(bomb.body.velocity.x > 50) bomb.setVelocityX(150);
	else if(bomb.body.velocity.x < -50) bomb.setVelocityX(-150);
}

function touchingBomb(ningen, bomb) {
	bomb.destroy();
	ningen.anims.play('still-right');
	infoText.setText('Press [Space] to Try Again');
	ningen.setVelocity(0, 0);

	// killing the player

	ningen.setTint(0xff0000);
	gameOver = true;
}

function switchDirection(mpf, platform) {
	mpf.setVelocity(-mpf.body.velocity.x, -mpf.body.velocity.y);
}