
#include <iostream>
#include <libwebsockets.h>
#include <cstring>

#include "Player.hpp"
#include "Game.hpp"
#include "Connection.hpp"

std::vector<Player *> players;

std::ostream &operator<<(std::ostream &os, PlayerType const&type) {
	switch (type) {
	case Pacman:
		os << "pacman";
		break;
	case Inky:
		os << "inky";
		break;
	case Blinky:
		os << "blinky";
		break;
	case Pinky:
		os << "pinky";
		break;
	case Clyde:
		os << "clyde";
		break;
	}
	return os;
}

PlayerType getPlayerType(const char *data) {
		char pos[32];
		strcpy(pos, data);
		for (int i = 0; pos[i]; ++i) {
			pos[i] = tolower(pos[i]);
		}
		if (strcmp(pos, "pacman") == 0) {
			return Pacman;
		} else if (strcmp(pos, "inky") == 0) {
			return Inky;
		} else if (strcmp(pos, "pinky") == 0) {
			return Pinky;
		} else if (strcmp(pos, "blinky") == 0) {
			return Blinky;
		} else if (strcmp(pos, "clyde") == 0) {
			return Clyde;
		} else if (strcmp(pos, "display") == 0) {
			return Display;
		} else if (strcmp(pos, "control") == 0) {
			return Control;
		} else {
			return InvalidType;
		}
}

Player::Player() : _type(InvalidType), _pos(0) {

}

void Player::addConnection(Connection *connection) {
	_connections.push_back(connection);
}

void Player::removeConnection(Connection *connection) {
	for (auto it = _connections.begin(); it != _connections.end(); ++it) {
		if (*it == connection) {
			_connections.erase(it);
			return;
		}
	}
}

void Player::send(const std::string &data) {
	for (Connection *x : _connections) {
		x->send(data);
	}
}
