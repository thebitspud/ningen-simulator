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

var ningen, platforms, nunus, bombs,
	cursors, spacebar, lastDir,
	nextLevel = 0, score = 0, collected = 0,
	gameOver = false,
	scoreText;

function create() {
	this.add.image(0, 0, 'bg-ice').setOrigin(0, 0);

	platforms = this.physics.add.staticGroup();

	ningen = this.physics.add.sprite(400, 520, 'ningen');
	ningen.setCollideWorldBounds(true);
	this.physics.add.collider(ningen, platforms);

	loadStage(nextLevel);

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

	cursors = this.input.keyboard.createCursorKeys();
	spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	nunus = this.physics.add.group({
		key: 'nunu',
		repeat: 9,
		setXY: { x: 60, y: 0, stepX: 75 }
	});
	
	nunus.children.iterate(function (child) {
		child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.8));
		child.setCollideWorldBounds(true);
	});

	this.physics.add.collider(nunus, platforms);
	this.physics.add.overlap(ningen, nunus, collectNunu, null, this);

	scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

	bombs = this.physics.add.group();

	this.physics.add.collider(bombs, platforms);

	this.physics.add.collider(ningen, bombs, hitBomb, null, this);
}

function loadStage(level) {
	platforms.children.iterate(function (child) {
		child.disableBody(true, true);
	});
	platforms.clear();
	platforms.create(400, 575, 'ground');
	createPlatforms(level);
	nextLevel++;
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
		default:
		platforms.create(550, 400, 'platform');
		platforms.create(250, 450, 'platform');
		platforms.create(750, 200, 'platform');
		platforms.create(500, 250, 'platform');
		platforms.create(420, 100, 'platform');
		platforms.create(50, 330, 'platform');
		platforms.create(250, 300, 'platform');
		platforms.create(110, 120, 'platform');
		break;
	}
}

function resetLevel() {
	score -= (collected * 10);
	collected = 0;
	scoreText.setText('Score: ' + score);

	nunus.children.iterate(function (child) {
		child.enableBody(true, child.x, 0, true, true);
	});

	ningen.setTint(0xffffff);
	gameOver = false;
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

function collectNunu (ningen, nunu) {
	nunu.disableBody(true, true);

	score += 10;
	collected++;
	scoreText.setText('Score: ' + score);

	if (nunus.countActive(true) === 0) {
		collected = 0;
		nunus.children.iterate(function (child) {
			child.enableBody(true, child.x, 0, true, true);
		});

		loadStage(nextLevel);
		spawnBomb();
	}
}

function spawnBomb() {
	var x = (ningen.x < 400) ? Phaser.Math.Between(600, 800) : Phaser.Math.Between(0, 200);
	var vx = Math.random() < 0.5 ? Phaser.Math.Between(-100, -150) : Phaser.Math.Between(100, 150);

	var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(vx, 5);;
}

function hitBomb (ningen, bomb) {
	bomb.disableBody(true, true);
	ningen.anims.play('still-right');
	ningen.setVelocity(0, 0);

	ningen.setTint(0xff0000);
	gameOver = true;
	spawnBomb();
}