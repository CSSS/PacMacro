#pragma once

struct libwebsocket;

struct Connection {
	PlayerType _type;
	libwebsocket *wsi;
};
