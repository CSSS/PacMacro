#include <libwebsockets.h>
#include <cstring>

#include "Connection.hpp"


static int nextid = 0;

Connection::Connection() {
	id = nextid;
	++nextid; 
}

void Connection::send(const std::string &data) {
	unsigned char buf[LWS_SEND_BUFFER_PRE_PADDING + 2048 + LWS_SEND_BUFFER_POST_PADDING];
	unsigned char *p = &buf[LWS_SEND_BUFFER_PRE_PADDING];
	size_t size = data.size();
	memcpy(p, data.c_str(), size);
	libwebsocket_write(wsi, p, size, LWS_WRITE_TEXT);
}
