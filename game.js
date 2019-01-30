const config = { // game settings
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 800 },
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

function preload() { // loading sprites
	this.load.spritesheet('ningen', 'assets/ningen.png', { frameWidth: 42, frameHeight: 64 });
	this.load.image('bg-ice', 'assets/bg-ice.png');
	this.load.image('platform', 'assets/platform.png');
	this.load.image('ground', 'assets/ground.png');
	this.load.image('nunu', 'assets/nunu.png');
	this.load.image('bomb', 'assets/bomb.png');
	this.load.image('axe', 'assets/axe.png');
}

let gameOver = false,
	score = 0,
	scoreText,
	levelText,
	infoText;

function create() { // loading game components
	// preparing the stage
	this.cameras.main.setSize(800, 600);
	this.add.image(0, 0, 'bg-ice').setOrigin(0, 0);

	// adding game text
	scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#FFF' });
	levelText = this.add.text(16, 40, 'Level: 0', { fontSize: '20px', fill: '#FFF'})
	infoText = this.add.text(275, 16, '', { fontSize: '32px', fill: '#FFF'});

	// initializing components
	initControls(this);
	initObjects(this);
	loadStage(nextLevel);
	initAnimations(this);
}

function update() { // game update cycle
	getInput();
	onMpf = false;

	if (ningen.x > 775 && allCollected) toNextLevel();
}

function changeScore(delta) { // change the player's score
	score += delta;
	scoreText.setText('Score: ' + score);
}

function toNextLevel() {
	nextLevel++;
	levelText.setText('Level: ' + nextLevel);
	loadStage(nextLevel);
}