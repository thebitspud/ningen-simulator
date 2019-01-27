const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 600 },
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

const game = new Phaser.Game(config);

function preload() {
	this.load.spritesheet('ningen', 'assets/ningen.png', { frameWidth: 42, frameHeight: 64 });
	this.load.image('bg-ice', 'assets/bg-ice.png');
	this.load.image('platform', 'assets/platform.png');
	this.load.image('ground', 'assets/ground.png');
	this.load.image('nunu', 'assets/nunu.png');
	this.load.image('bomb', 'assets/bomb.png');
	this.load.image('axe', 'assets/axe.png');
}

var ningen, platforms, movingPlatforms, nunus, bombs,
	cursors, spacebar, lastDir,
	nextLevel = 0, score = 0, collected = 0,
	gameOver = false, allCollected = false,
	scoreText, centerText;

function create() {
	this.cameras.main.setSize(800, 600);

	this.add.image(0, 0, 'bg-ice').setOrigin(0, 0);

	ningen = this.physics.add.sprite(25, 520, 'ningen');
	ningen.setCollideWorldBounds(true);
	//this.cameras.main.startFollow(ningen);

	platforms = this.physics.add.staticGroup();
	movingPlatforms = this.physics.add.group();
	bombs = this.physics.add.group();

	nunus = this.physics.add.group({
		key: 'nunu',
		repeat: 9,
		setXY: { x: 60, y: 0, stepX: 75 }
	});
	
	nunus.children.iterate(function (child) {
		child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.8));
		child.setCollideWorldBounds(true);
	});

	this.physics.add.collider(ningen, platforms);
	this.physics.add.collider(nunus, platforms);
	this.physics.add.collider(bombs, platforms);
	this.physics.add.collider(bombs, movingPlatforms);
	this.physics.add.collider(movingPlatforms, ningen);
	this.physics.add.collider(movingPlatforms, nunus);

	this.physics.add.overlap(ningen, nunus, collectNunu, null, this);
	this.physics.add.collider(ningen, bombs, hitBomb, null, this);

	scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
	centerText = this.add.text(275, 16, '', { fontSize: '32px', fill: '#FFF'})

	loadStage(nextLevel);

	cursors = this.input.keyboard.createCursorKeys();
	spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	this.anims.create({
		key: 'left',
		frames: this.anims.generateFrameNumbers('ningen', { start: 2, end: 3 }),
		frameRate: 8,
		repeat: -1
	});

	this.anims.create({
		key: 'still-left',
		frames: [ { key: 'ningen', frame: 2 } ],
		frameRate: 100
	});

	this.anims.create({
		key: 'still-right',
		frames: [ { key: 'ningen', frame: 0 } ],
		frameRate: 100
	});

	this.anims.create({
		key: 'right',
		frames: this.anims.generateFrameNumbers('ningen', { start: 0, end: 1 }),
		frameRate: 10,
		repeat: -1
	});
}

function resetLevel() {
	gameOver = false;
	score -= (collected * 10);
	collected = 0;
	allCollected = false;
	scoreText.setText('Score: ' + score);
	centerText.setText('');

	nunus.children.iterate(function (child) {
		child.enableBody(true, child.x, 0, true, true);
	});

	bombs.children.iterate(function (child) {
		var vx = Math.random() < 0.5 ? Phaser.Math.Between(-100, -150) : Phaser.Math.Between(100, 150);

		child.x = 775;
		child.y = 300;
		child.setVelocity(vx, 0);
	});

	ningen.setTint(0xffffff);
	ningen.x = 25;
	ningen.y = 520;
}

function loadStage(level) {
	platforms.children.iterate(function (child) {
		child.disableBody(true, true);
	});
	platforms.clear(true);

	movingPlatforms.children.iterate(function (child) {
		child.disableBody(true, true);
	});
	movingPlatforms.clear(true);

	createPlatforms(level);
	platforms.create(400, 575, 'ground');

	allCollected = false;

	bombs.children.iterate(function (child) {
		var vx = Math.random() < 0.5 ? Phaser.Math.Between(-100, -150) : Phaser.Math.Between(100, 150);

		child.x = 775;
		child.y = 300;
		child.setVelocity(vx, 0);
	});

	nextLevel++;
	ningen.x = 25;
	ningen.y = 520;
}

function update() {
	cursors = this.input.keyboard.createCursorKeys();

	if(gameOver) {
		if(spacebar.isDown) {
			resetLevel();
		}
		
		return;
	}

	if (cursors.left.isDown) {
		ningen.setVelocityX(-200);

		if(ningen.body.touching.down) ningen.anims.play('left', true);
		else ningen.anims.play('still-left', true);
		lastDir = 'left';
	} else if (cursors.right.isDown) {
		ningen.setVelocityX(200);

		if(ningen.body.touching.down) ningen.anims.play('right', true);
		else ningen.anims.play('still-right', true);
		lastDir = 'right';

		if (ningen.x > 775 && allCollected) {
			collected = 0;
			nunus.children.iterate(function (child) {
				child.enableBody(true, child.x, 0, true, true);
			});
	
			loadStage(nextLevel);
			spawnBomb();
		}
	} else {
		ningen.setVelocityX(0);

		if(lastDir === 'left') {
			ningen.anims.play('still-left', true);
		}else if(lastDir === 'right') {
			ningen.anims.play('still-right', true);
		}
	}

	if (cursors.up.isDown && ningen.body.touching.down) {
		ningen.setVelocityY(-500);
	}
}

function createPlatforms(level) {
	switch(level) {
		case 0: break;

		case 1:
		platforms.create(150, 250, 'platform');
		platforms.create(650, 250, 'platform');
		platforms.create(400, 400, 'platform');
		break;

		case 2:
		platforms.create(600, 400, 'platform');
		platforms.create(230, 300, 'platform');
		platforms.create(750, 220, 'platform');
		platforms.create(400, 410, 'platform');
		platforms.create(150, 150, 'platform');
		break;

		case 3:
		platforms.create(550, 400, 'platform');
		platforms.create(250, 450, 'platform');
		platforms.create(750, 200, 'platform');
		platforms.create(500, 250, 'platform');
		platforms.create(420, 100, 'platform');
		platforms.create(50, 330, 'platform');
		platforms.create(250, 300, 'platform');
		platforms.create(110, 120, 'platform');
		break;

		case 4:
		spawnMovingPlatform(300, 250, 100, 0);
		spawnMovingPlatform(600, 400, 50, 0);

		platforms.create(50, 100, 'platform');
		platforms.create(275, 100, 'platform');
		platforms.create(525, 100, 'platform');
		platforms.create(750, 100, 'platform');
		break;

		case 5:
		default:

		spawnMovingPlatform(400, 250, 100, 0);
		spawnMovingPlatform(400, 50, 0, -50);

		platforms.create(50, 200, 'platform');
		platforms.create(225, 125, 'platform');
		platforms.create(575, 125, 'platform');
		platforms.create(750, 200, 'platform');
		platforms.create(600, 350, 'platform');
		platforms.create(200, 350, 'platform');

		break;
	}
}

function spawnBomb() {
	var vx = Math.random() < 0.5 ? Phaser.Math.Between(-100, -150) : Phaser.Math.Between(100, 150);

	var bomb = bombs.create(775, 300, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(vx, 0);
}

function spawnMovingPlatform(x, y, vx, vy) {
	var mpf = movingPlatforms.create(x, y, 'platform');
	mpf.setCollideWorldBounds(true);
	mpf.setVelocity(vx, vy);
	mpf.setBounce(1);
	mpf.body.setAllowGravity(false);
	mpf.setImmovable();
	mpf.body.setFriction(1);
}

function collectNunu (ningen, nunu) {
	nunu.disableBody(true, true);

	score += 10;
	collected++;
	scoreText.setText('Score: ' + score);

	if(nunus.countActive(true) === 0) allCollected = true;
}

function hitBomb (ningen, bomb) {
	bomb.destroy();
	ningen.anims.play('still-right');
	centerText.setText('Press [Space] to Try Again');
	ningen.setVelocity(0, 0);

	ningen.setTint(0xff0000);
	gameOver = true;
	spawnBomb();
}