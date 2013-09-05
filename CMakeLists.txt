cmake_minimum_required (VERSION 2.6)

project(pacmacro)

set(CMAKE_CXX_FLAGS "--std=c++0x -g")


add_executable(pacmacro src/PacMacro.cpp src/Game.cpp src/Player.cpp)

TARGET_LINK_LIBRARIES(pacmacro websockets)
