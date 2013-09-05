#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <libwebsockets.h>

#include "Game.hpp"
#include "Connection.hpp"


enum protocols {
	PROTOCOL_PACMACRO,
};

static int
callback_pacmacro(libwebsocket_context *context,
			libwebsocket *wsi,
			enum libwebsocket_callback_reasons reason,
					       void *user, void *in, size_t len)
{
	Connection *conn = (Connection *)user;
	const char *recv = (const char *)in;

	switch (reason) {

	case LWS_CALLBACK_ESTABLISHED:
		fprintf(stderr, "New Connection\n");
		break;


	case LWS_CALLBACK_RECEIVE:
		fprintf(stderr, "rx %d\n %s\n", (int)len, (const char *)in);
		if (strncmp(recv, "login", 5) == 0) {
			char pos[32];
			strcpy(pos, recv + 6);
			for (int i = 0; pos[i]; ++i) {
				pos[i] = tolower(pos[i]);
			}
			if (strcmp(pos, "pacman") == 0) {
				conn->_type = Pacman;
			} else if (strcmp(pos, "inky") == 0) {
				conn->_type = Inky;
			} else if (strcmp(pos, "pinky") == 0) {
				conn->_type = Pinky;
			} else if (strcmp(pos, "blinky") == 0) {
				conn->_type = Blinky;
			} else if (strcmp(pos, "clyde") == 0) {
				conn->_type = Clyde;
			} else if (strcmp(pos, "display") == 0) {
				conn->_type = Display;
			} else if (strcmp(pos, "control") == 0) {
				conn->_type = Control;
			} else {
				break;
			}
			conn->wsi = wsi;
			g_game->addConnection(conn);
			const std::string &data = g_game->getGameState(conn->_type);

			unsigned char buf[LWS_SEND_BUFFER_PRE_PADDING + 512 + LWS_SEND_BUFFER_POST_PADDING];
			unsigned char *p = &buf[LWS_SEND_BUFFER_PRE_PADDING];
			size_t size = data.size();
			memcpy(p, data.c_str(), size);
			libwebsocket_write(wsi, p, size, LWS_WRITE_TEXT);

		} else if (strncmp(recv, "moveto", 6) == 0) {
			int pos = atoi(recv+7);
			g_game->moveTo(conn->_type, pos);
		} else if (strncmp(recv, "power", 5) == 0) {
			int pos = atoi(recv+6);
			g_game->power(pos);
		} else if (strcmp(recv, "restart") == 0) {
			g_game->restart();
		}
		break;
	case LWS_CALLBACK_CLOSED:
		g_game->removeConnection(conn);
		break;
	default:
		printf("ASDF %d\n", reason);
		break;
	}

	return 0;
}


/* list of supported protocols and callbacks */

static struct libwebsocket_protocols protocols[] = {
	{
		"pacmacro",
		callback_pacmacro,
		sizeof(Connection),
	},
	{
		NULL, NULL, 0		/* End of list */
	}
};

int main(int argc, char **argv)
{
	int n = 0;

	int port = 37645;
	struct libwebsocket_context *context;
	int opts = 0;
	const char *interface = NULL;


	g_game = new Game();


	lws_context_creation_info info;
	memset(&info, 0, sizeof(info));
	info.port = port;
	info.iface = interface;
	info.protocols = protocols;
	info.extensions = libwebsocket_get_internal_extensions();
	info.gid = -1;
	info.uid = -1;
	info.options = opts;

	context = libwebsocket_create_context(&info);
	if (context == NULL) {
		fprintf(stderr, "libwebsocket init failed\n");
		return -1;
	}

	while (n >= 0) {
		n = libwebsocket_service(context, 5000);
	}


	libwebsocket_context_destroy(context);

	return 0;
}
