var websocket;
var offset = 80;
var ingame;

window.onload = function() {
	"use strict";
	var role = window.location.hash.substring(1);
	if (role == "") {
		role = "display";
		window.location.hash = role;
	}
	role = role.toLowerCase();
	ingame = new InGame(role);
	websocket = new WebSocket("ws://pacmacro.com:37645", "pacmacro");
	websocket.onopen = function () { websocket.send("{\"type\":\"login\",\"role\":\"" + role + "\"}"); };
	websocket.onmessage = function(data) { ingame.UpdateGame(data.data); };
	websocket.onerror = function(data) { console.log(data); };
	websocket.onclose = function(data) { ingame.onclose(); };
};

/**
 * @constructor
 */
function StaticImage(img, x, y, w, h, ox, oy) {
	"use strict";
	this.draw = function(dx, dy, ctx, scale) {
		if (scale) {
			ctx.drawImage(img, x, y, w, h, Math.floor(dx) + ox, Math.floor(dy) + oy, w/2, h/2);
		} else {
			ctx.drawImage(img, x, y, w, h, Math.floor(dx) + ox, Math.floor(dy) + oy, w, h);
		}
	};
}

/**
 * @constructor
 */
function InGame(role) {
	"use strict";
	var context,
		players = [],
		tiles = [],
		image = new Image(),
		images = [],

		powerPills = [19, 28, 51, 60],

		pos = -1,
		startTime,
		powerPillActive = false,
		powerPillStart,
		score,
		gameLength,
		pillLength,
		gameOver = false,
		activated = false,
		backgroundColour = "rgb(0,0,0)",
		backgroundPill = "rgb(255,0,0)",
		lineColour = "rgb(0,0,128)",
		foregroundColour = "rgb(255,255,255)",
		interval,
		connections = [];

	image.src = "images/image.png";
	images["pacman"] = new StaticImage(image, 20, 0, 19, 20, 0, 0);
	images["inky"] = new StaticImage(image, 39, 0, 20, 20, 0, 0);
	images["blinky"] = new StaticImage(image, 20, 20, 20, 20, 0, 0);
	images["pinky"] = new StaticImage(image, 40, 20, 20, 20, 0, 0);
	images["clyde"] = new StaticImage(image, 0, 20, 20, 20, 0, 0);
	images.Eat = new StaticImage(image, 24, 40, 8, 8, 4, 4);
	images.Pill = new StaticImage(image, 16, 40, 8, 8, 4, 4);
	images.PowerPill = new StaticImage(image, 0, 40, 16, 8, 0, 4);
	images.PowerPillEat = new StaticImage(image, 31, 40, 16, 8, 0, 4);

	function formattedMinutesSeconds(time) {
		var seconds = time % 60,
			output = Math.floor(time / 60) + ":";
		if (seconds < 10) {
			output += "0";
		}
		output += seconds;
		return output;
	}

	function tileToXY(tile) {
		var x = 0, y = 0;
		if (tile < 80) {
			x = tile % 16;
			y = ((tile - x) / 16) * 128 + offset;
			x = (x * 32) + offset;
		} else {
			tile -= 80;
			y = tile % 12;
			x = ((tile - y) / 12) * 96 + offset;
			y = (y + Math.floor(y / 3) + 1) * 32 + offset;
		}
		return {x : x, y : y};
	}

	function xyToTile(x, y) {
		var tile = -1;
		x -= offset;
		y -= offset;
		x = Math.floor(x / 16);
		y = Math.floor(y / 16);
		if (x % 2 === 0 && y % 2 === 0) {
			if (y % 8 === 0) {
				tile = x / 2 + (y / 8) * 16;
			} else if (x % 6 === 0) {
				tile = 79 + y / 2 + (x / 6) * 12 - Math.floor(y / 8);
			}
		}
		return tile;
	}

	function isBeside(a, b) {
		var oa = tileToXY(a),
			ob = tileToXY(b);
		if ((oa.x === ob.x && (oa.y + 32 === ob.y || oa.y - 32 === ob.y)) || (oa.y === ob.y && (oa.x + 32 === ob.x || oa.x - 32 === ob.x))) {
			return true;
		}
		return false;
	}

	function isPowerpill(pos) {
		return (powerPills.indexOf(pos) !== -1 && tiles.indexOf(pos) === -1);
	}

	this.Activate = function() {
		activated = true;
		var canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		canvas.addEventListener("click", onClick, false);
		window.onkeydown = keyDown;
		interval = setInterval(updateScoreBoard, 100);
	};

	this.onclose = function() {
		clearInterval(interval);
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');
		context.fillStyle = foregroundColour;
		context.fillText("Connection Lost", 300, 20);

	};

	function onClick(e) {
		if (e.offsetY < 40 && e.offsetX > 490 && isPowerpill(pos)) {
			eatPowerpill(pos);
		} else {
			moveTo(e.offsetX, e.offsetY);
		}
	}

	function moveTo(x, y) {
		if (role == "display" || role == "control") {
			return;
		}
		var tile = xyToTile(x, y);
		if (tile === -1) {
			return;
		}

		if (pos === -1 || isBeside(tile, pos)) {
			pos = tile;
			var data = {};
			data.type = "moveto";
			data.tile = tile;
			websocket.send(JSON.stringify(data));
		}
	}

	function eatPowerpill(pos) {
		if (role === "pacman" && isPowerpill(pos)) {
			var data = {};
			data.type = "power";
			data.tile = pos;
			websocket.send(JSON.stringify(data));
		}
	}

	function keyDown(e) {
		var o = tileToXY(pos);
		if (e.keyCode === 87 || e.keyCode === 38) {
			o.y -= 32;
			//w
		} else if (e.keyCode === 65 || e.keyCode === 37) {
			o.x -= 32;
			//a
		} else if (e.keyCode === 83 || e.keyCode === 40) {
			o.y += 32;
			//s
		} else if (e.keyCode === 68 || e.keyCode === 39) {
			o.x += 32;
			//d
		} else {
			return true;
		}
		moveTo(o.x, o.y);
		return false;
	}

	function markTile(tile, image) {
		if (tile < 0 || tile > 152) {
			return;
		}
		var o = tileToXY(tile);
		image.draw(o.x, o.y, context, false);
	}

	function drawPlayer(tile, image, pot, i) {
		if (tile < 0 || tile > 152) {
			return;
		}
		var o = tileToXY(tile);
		var scale = false;
		if (pot != 1) {
			scale = true;
			if (i === 1) {
				o.x += 8;
			} else if (i == 2) {
				o.y += 8;
			} else if (i == 3) {
				o.y += 8;
				o.x += 8;
			} else if (i === 4) {
				o.y += 4;
				o.x += 4;
			}
		}
		image.draw(o.x, o.y, context, scale);
	}

	this.UpdateGame = function(data) {
		console.log(data);
		if (!activated) {
			this.Activate();
		}
		var o = JSON.parse(data), i;
		if (o["type"] === "move") {
			if (o["role"] === role) {
				pos = o["pos"];
			}
			if (o["role"] === "pacman" && !isPowerpill(o["pos"])) {
				tiles.push(o["pos"]);
			}
			markTile(o["pos"], images[o["role"]]);
			for (i = 0; i < players.length; i += 1) {
				if (players[i]["role"] === o["role"]) {
					players[i]["pos"] = o["pos"];
				}
			}
			score = o["score"];
		} else if (o["type"] === "full") {
			players = o["players"];
			tiles = o["tiles"];
			gameLength = o["gamelength"];
			pillLength = o["pilllength"];
			var t = new Date().getTime() / 1000;
			startTime = t-((gameLength*60) - o["timeLeft"]);
			powerPillActive = o["powerPillActive"];
			if (powerPillActive) {
				powerPillStart = t-(pillLength - o["powerPillLeft"]);
			}
			for (i = 0; i < players.length; i += 1) {
				markTile(players[i]["pos"], images[players[i]["role"]]);
			}
			score = o["score"];
			for (i = 0; i < players.length; i += 1) {
				if (players[i]["role"] === role) {
					pos = players[i]["pos"];
				}
			}

			updateScoreBoard();
		} else if (o["type"] === "score") {
			score = o["score"];
		} else if (o["type"] === "power") {
			tiles.push(o["pos"]);
			score = o["score"];
			powerPillActive = true;
			powerPillStart = new Date().getTime() / 1000;
			for (i = 0; i < players.length; i += 1) {
				if (players[i]["role"] === "pacman") {
					players[i]["pos"] = o["pos"];
				}
			}
		} else if (o["type"] == "changetype") {
			role = o["newtype"];
			window.location.hash = o["newtype"];
		} else if (o["type"] == "connlist") {
			connections = o["arr"];
		}
		draw();
	};

	function updateScoreBoard() {
		if (gameOver || role === "control") {
			return;
		}
		var time = new Date().getTime(), timetext, delta;

		if (!powerPillActive) {
			context.fillStyle = backgroundColour;
			context.fillRect(150, 0, 300, 50);
		} else {
			context.fillStyle = backgroundPill;
			context.fillRect(150, 0, 400, 50);
		}


		context.fillStyle = foregroundColour;
		delta = 60 * gameLength - ((time / 1000) - startTime);
		delta = Math.floor(delta);
		if (delta < 0) {
			timetext = "Game Over";
		} else {
			timetext = "Time Left: " + formattedMinutesSeconds(delta);
		}
		context.fillText(timetext, 150, 20);

		if (powerPillActive) {
			delta = pillLength - ((time / 1000) - powerPillStart);
			delta = Math.floor(delta);
			if (delta < 0) {
				powerPillActive = false;
				draw();
			} else {
				context.fillText("Power Pill Time Left: " + formattedMinutesSeconds(delta), 300, 20);
			}
		}
	}

	function draw() {
		if (role === "control") {
			//verify with a diaglog
			var pass = prompt("Enter password");
			$.ajax({
				method: 'post',
				url: './admin',
				data: 'pass=' + pass,
				success: (access) => {
						if(access) {
							drawControl();
							return;
						}
						else {
							window.location.hash = 'display';
							location.reload();
						}
				}
			});
		}
		var i, x, pot = 0;
		if (powerPillActive) {
			context.fillStyle = backgroundPill;
		} else {
			context.fillStyle = backgroundColour;
		}
		context.fillRect(0, 0, 650, 650);
		context.fillStyle = lineColour;

		for (i = 0; i < 6; i += 1) {
			context.fillRect(offset + 96 * i, offset, 16, 528);
		}
		for (i = 0; i < 5; i += 1) {
			context.fillRect(offset, offset + 128 * i, 480, 16);
		}

		context.fillStyle = foregroundColour;
		for (i = 0; i < 152; i += 1) {
			if (powerPills.indexOf(i) !== -1) {
				markTile(i, images.PowerPill);
			} else {
				markTile(i, images.Pill);
			}
		}
		for (i = 0; i < tiles.length; i += 1) {
			var x = parseInt(tiles[i], 10);
			if (powerPills.indexOf(x) !== -1) {
				markTile(x, images.PowerPillEat);
			} else {
				markTile(x, images.Eat);
			}
		}
		for (i = 0; i < players.length; i += 1) {
			pot = 0;
			for (x = 0; x < players.length; x += 1) {
				if (players[i]["pos"] == players[x]["pos"]) {
					pot += 1;
				}
			}
			drawPlayer(players[i]["pos"], images[players[i]["role"]], pot, i);
		}
		context.font = "20px sans-serif";
		context.fillStyle = foregroundColour;
		context.fillText("A", 80, 70);
		context.fillText("B", 176, 70);
		context.fillText("C", 272, 70);
		context.fillText("D", 368, 70);
		context.fillText("E", 464, 70);
		context.fillText("F", 560, 70);
		context.fillText("1", 60, 95);
		context.fillText("2", 60, 223);
		context.fillText("3", 60, 351);
		context.fillText("4", 60, 479);
		context.fillText("5", 60, 607);

		context.fillText("Score: " + score, 10, 20);
		updateScoreBoard();


		if (isPowerpill(pos) && role === "pacman") {
			context.fillText("Activate!", 490, 20);
		}
	}

	this.selectType = function(type) {
		console.log(type);
		var content = document.getElementById('select' + type);
		var data = {};
		data.type = "setconn";
		data.conn = type;
		data.newtype = content.value;
		websocket.send(JSON.stringify(data));
	}

	function typeSelect(conn) {
		var html = "";
		var types = ["pacman", "inky", "blinky", "pinky", "clyde", "display", "control"];
		html += "<select id='select"+conn.id+"' onchange='ingame.selectType("+conn.id+");'>";
		var i;
		for (i = 0; i < types.length; ++i) {
			html += "<option value='"+types[i]+"'";
			if (conn.type == types[i]) {
				html += " selected";
			}
			html += ">"+types[i]+"</option>";
		}
		html += "</select>";
		return html;
	}
	function drawControl() {
		var content = document.getElementById('content');
		var html = "";
		html += "Game Length: <input type='text' id='gameLength' value='" + gameLength +"' /><br>";
		html += "Pill Length: <input type='text' id='pillLength' value='" + pillLength + "' /><br>";
		html += "<button type='button' onclick='ingame.control(\"restart\")'>restart</button><br>";
		html += "<br><br><br><br><br><br><br>";
		html += "<button type='button' onclick='ingame.control(\"refresh\")'>refresh</button><br>";
		var i = 0;
		for (i = 0; i < connections.length; ++i) {
			html += typeSelect(connections[i]);
		}
		content.innerHTML = html;
	}

	this.control = function(type) {
		if (type == "restart") {
			var data = {};
			data.type = "restart";
			data.gameLength = Number(document.getElementById("gameLength").value);
			data.pillLength = Number(document.getElementById("pillLength").value);
			websocket.send(JSON.stringify(data));
		} else if (type == "refresh") {
			var data = {};
			data.type = "getconn";
			websocket.send(JSON.stringify(data));
		}
	}
	
}

