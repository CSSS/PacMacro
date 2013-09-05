#pragma once

#include <string>
#include <vector>
#include "Player.hpp"

class Game {
public:
	Game();
	std::string getGameState(PlayerType id);
	void addConnection(Connection *connection);
	void removeConnection(Connection *connection);
	void moveTo(PlayerType id, int pos);
	void power(int pos);
	void restart();
	void setGameLength(int length) { _gameLength = length; };
	void setPillLength(int length) { _pillLength = length; };
	void setConnType(int conn, PlayerType type);
private:
	void checkTimes();
	bool isPowerPill(int pos);
	static const int _numTiles = 152;
	bool _tiles[_numTiles];
	bool _ghostTiles[_numTiles];
	bool _powerPillActive;
	bool _gameOver;
	int _gameLength, _pillLength;
	int _startTime, _pillTime;
	Player _players[InvalidType];
	int _score;
	std::vector<Connection *> _connections;
};

extern Game *g_game;
