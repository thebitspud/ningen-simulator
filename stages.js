let nextLevel = 0,
	collected = 0,
	allCollected = false;

function resetStage() { // reset the stage after dying
	changeScore(-collected * 10);
	infoText.setText('');
	ningen.setTint(0xffffff);

	loadStage(nextLevel);
}

function loadStage(level) { // create a new stage
	// clear objects
	clearObjects(platforms);
	clearObjects(movingPlatforms);
	clearObjects(bombs);
	clearObjects(nunus);

	// reset nunu collection
	collected = 0;
	allCollected = false;

	// create stage components
	loadObjects(level);
	platforms.create(400, 575, 'ground');

	ningen.setPosition(25, 520);
}

function clearObjects(obj) { // clear all objects of a type
	obj.children.iterate(function (child) {
		child.disableBody(true, true);
	});

	obj.clear(true);
}

function loadObjects(level) { // create all the objects of a stage
	switch(level) {

		// LEVEL 0

		case 0:

		for(i = 1; i <= 7; i++) spawnNunu(i * 100, 525);
		for(i = 0; i < 3; i++) spawnNunu(225 + i * 175, 375);

		break;

		// LEVEL 1

		case 1:

		spawnPlatform(150, 300);
		spawnPlatform(400, 425);
		spawnPlatform(650, 300);

		for(i = 0; i < 3; i++) spawnNunu(250 + i * 150, 150);
		for(i = 1; i <= 4; i++) spawnNunu(i * 175, 525);
		spawnNunu(150, 250);
		spawnNunu(400, 375);
		spawnNunu(650, 250);

		spawnBomb(100, 250, 150, 0);

		break;

		// LEVEL 2

		case 2:

		spawnPlatform(125, 175);
		spawnPlatform(250, 300);
		spawnPlatform(400, 425);
		spawnPlatform(600, 425);
		spawnPlatform(725, 300);

		for(i = 0; i < 3; i++) spawnNunu(275 + i * 150, 525);
		spawnNunu(125, 125);
		spawnNunu(250, 250);
		spawnNunu(400, 375);
		spawnNunu(600, 375);
		spawnNunu(600, 125);
		spawnNunu(725 , 250);

		spawnBomb(50, 100, 150, 0);
		spawnBomb(500, 325, 150, 0);

		break;

		// LEVEL3

		case 3:

		spawnPlatform(125, 350);
		spawnPlatform(175, 125);
		spawnPlatform(250, 450);
		spawnPlatform(400, 150);
		spawnPlatform(475, 400);
		spawnPlatform(600, 250);
		spawnPlatform(725, 100);

		spawnNunu(50, 100);
		spawnNunu(125, 300);
		spawnNunu(175, 75);
		spawnNunu(250, 400);
		spawnNunu(300, 250);
		spawnNunu(400, 100);
		spawnNunu(475, 350);
		spawnNunu(600, 200);
		spawnNunu(725, 50);
		spawnNunu(725, 350);

		spawnBomb(125, 100, 150, 0);
		spawnBomb(700, 50, 150, 0);
		spawnBomb(700, 500, 150, 0);

		break;

		// LEVEL 4

		case 4:

		spawnPlatform(75, 125);
		spawnPlatform(300, 150);
		spawnPlatform(500, 150);
		spawnPlatform(725, 125);

		for(i = 0; i < 4; i++) spawnNunu(400, 75 + i * 150);
		spawnNunu(75, 75);
		spawnNunu(275, 100);
		spawnNunu(525, 100);
		spawnNunu(725, 75);
		spawnNunu(125, 300);
		spawnNunu(675, 300);

		spawnBomb(200, 50, 150, 0);
		spawnBomb(600, 50, -150, 0);
		spawnBomb(400, 50, 0, 0);

		spawnMovingPlatform(300, 275, 100, 0);
		spawnMovingPlatform(600, 425, 50, 0);
		spawnBound(50, 275);
		spawnBound(750, 275);
		spawnBound(50, 425);
		spawnBound(750, 425);

		break;

		// LEVEL 5

		case 5: default:

		spawnPlatform(225, 350);
		spawnPlatform(225, 100);
		spawnPlatform(400, 450);
		spawnPlatform(575, 100);
		spawnPlatform(575, 350);

		for(i = 0; i < 4; i++) spawnNunu(125 + i * 175, 175);
		for(i = 0; i < 2; i++) for(j = 0; j < 2; j++) spawnNunu(225 + i * 350, 50 + j * 250);
		spawnNunu(400, 100);
		spawnNunu(400, 400);

		spawnBomb(150, 50, 150, 0);
		spawnBomb(650, 50, -150, 0);
		spawnBomb(400, 50, 0, -150);

		spawnMovingPlatform(400, 200, 0, 75);
		spawnMovingPlatform(200, 225, -100, 0);
		spawnMovingPlatform(600, 225, 100, 0);
		
		spawnBound(25, 225);
		spawnBound(350, 225);
		spawnBound(400, 100);
		spawnBound(400, 350);
		spawnBound(450, 225);
		spawnBound(775, 225);

		break;
	}
}