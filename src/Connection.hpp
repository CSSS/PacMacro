#pragma once

#include <string>
#include "Player.hpp"

struct libwebsocket;


class Connection {
public:
	Connection();
	void send(const std::string &data);
	PlayerType _type;
	libwebsocket *wsi;
	int id;
};
