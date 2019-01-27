const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 500 },
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
	this.load.image('nunu', 'assets/nunu.png');
	this.load.image('bomb', 'assets/bomb.png');
}

var ningen, platforms, nunus, bombs, cursors, keys, lastDir, score = 0, gameOver = false, scoreText;

function create() {
	this.add.image(0, 0, 'bg-ice').setOrigin(0, 0);

	platforms = this.physics.add.staticGroup();

	platforms.create(60, 584, 'platform');
	platforms.create(180, 584, 'platform');
	platforms.create(300, 584, 'platform');
	platforms.create(420, 584, 'platform');
	platforms.create(540, 584, 'platform');
	platforms.create(660, 584, 'platform');
	platforms.create(780, 584, 'platform');

	platforms.create(600, 400, 'platform');
	platforms.create(50, 250, 'platform');
	platforms.create(230, 300, 'platform');
	platforms.create(750, 220, 'platform');
	platforms.create(400, 410, 'platform');
	platforms.create(440, 150, 'platform');
	
	ningen = this.physics.add.sprite(300, 535, 'ningen');

	ningen.setCollideWorldBounds(true);
	this.physics.add.collider(ningen, platforms);

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

	nunus = this.physics.add.group({
		key: 'nunu',
		repeat: 10,
		setXY: { x: 50, y: 0, stepX: 70 }
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

function update() {
	if(gameOver) {
		return;
	}

	cursors = this.input.keyboard.createCursorKeys();

	if (cursors.left.isDown) {
		ningen.setVelocityX(-180);

		if(ningen.body.touching.down) ningen.anims.play('left', true);
		else ningen.anims.play('still-left', true);
		lastDir = 'left';
	} else if (cursors.right.isDown) {
		ningen.setVelocityX(180);

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
	scoreText.setText('Score: ' + score);

	if (nunus.countActive(true) === 0) {
		nunus.children.iterate(function (child) {
			child.enableBody(true, child.x, 0, true, true);
		});

		var x = (ningen.x < 400) ? Phaser.Math.Between(600, 800) : Phaser.Math.Between(0, 200);

		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-100, 100), 10);
		bomb.allowGravity = false;
	}
}

function hitBomb (ningen, bomb) {
	bomb.disableBody(true, true);
	this.physics.pause();
	ningen.anims.play('still-right');

	ningen.setTint(0xff0000);
	gameOver = true;
}