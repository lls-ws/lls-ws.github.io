#!/bin/sh
# Script to Create Pluto IPTV Playlist File
#
# Autor: Leandro Luiz
# email: lls.homeoffice@gmail.com

PLAYLIST_ALL_LLS="PlutoTV_br.m3u8"
PLAYLIST_LLS="LLS_${PLAYLIST_ALL_LLS}"
PLAYLIST_ALL="playlist.m3u8"

SERVER_NAME=$(basename ${0%.*})
SERVER_DIR="iptv/${SERVER_NAME}"

FAVORITES_FILE="pluto-favorites"
FAVORITES_DIR="${SERVER_DIR}/$(echo ${FAVORITES_FILE} | cut -d '-' -f 2)"

FAVORITES_ARRAY=(
	"Filmes"
	"Séries"
	"Notícias"
	"Curiosidades"
)

npm_install()
{
	
	sudo apt -y install nodejs npm
	
	echo "Node version: " `node -v`
    echo "npm version: " `npm -v`
	
}

pluto_get()
{

	echo "Get ${SERVER_NAME} iptv list..."
	(cd ${SERVER_DIR}; npx pluto-iptv; cd -)
	
	if [ ! -f ${SERVER_DIR}/${FAVORITES_FILE} ]; then
		
		mv -v ${SERVER_DIR}/${PLAYLIST_ALL} ${SERVER_DIR}/${PLAYLIST_ALL_LLS}
	
	fi
	
	rm -fv "${SERVER_DIR}/epg.xml" "${SERVER_DIR}/cache.json"
	
}

pluto_favorites()
{
	
	if [ ! -f ${SERVER_DIR}/${PLAYLIST_ALL_LLS} ]; then
		
		rm -fv ${SERVER_DIR}/${FAVORITES_FILE}
		
		echo "Playlist ${PLAYLIST_ALL_LLS} not found!"
		echo "Use: bash $0 get"
		exit 1
		
	fi
	
	if [ ! -d ${FAVORITES_DIR} ]; then
	
		mkdir -pv ${FAVORITES_DIR}
	
	fi
	
	for FAVORITE_NAME in "${FAVORITES_ARRAY[@]}"
	do
		
		pluto_favorite
		
	done
	
}

pluto_favorite()
{
	
	FAVORITE_FILE="${FAVORITES_DIR}/${FAVORITE_NAME}.txt"
	
	if [ ! -f ${FAVORITE_FILE} ]; then
	
		echo "# ${FAVORITE_NAME}" > ${FAVORITE_FILE}
		
		echo "Get ${FAVORITE_NAME} Channel Names..."
		cat ${SERVER_DIR}/${PLAYLIST_ALL_LLS} | grep ${FAVORITE_NAME} | cut -d '"' -f 2 >> ${FAVORITE_FILE}
		
	else
	
		echo "File $(basename ${FAVORITE_FILE}) already exists!"
		echo -e "Remove to update!\n"
		
	fi
	
}

pluto_show()
{
	
	echo "Showing ${SERVER_NAME} Files:"
	
	ls -al ${SERVER_DIR}/*
	
	geany $(realpath ${FAVORITES_DIR})/*.txt
	
}

pluto_create()
{
	
	echo "Creating ${FAVORITES_FILE} file..."
	
	if [ -n "$(ls ${FAVORITES_DIR}/*.txt)" ]; then
	
		echo "Join favorites channels..."
		cat ${FAVORITES_DIR}/*.txt > ${SERVER_DIR}/${FAVORITES_FILE}
	
	fi
	
	pluto_get
	
	mv -v ${SERVER_DIR}/${PLAYLIST_ALL} ${SERVER_DIR}/${PLAYLIST_LLS}
	
	pluto_epg
	
}

pluto_epg()
{
	
	EPG_URL="https:\/\/i.mjh.nz\/PlutoTV\/br.xml.gz"
	
	if [ -f ${SERVER_DIR}/${PLAYLIST_LLS} ]; then
	
		echo "Add EPG url"
		sed -i 's/#EXTM3U/#EXTM3U x-tvg-url="'${EPG_URL}'"/g' ${SERVER_DIR}/${PLAYLIST_LLS}
		
		echo "File ${PLAYLIST_LLS} created!"
		
	fi
	
}

case "$1" in
	install)
		npm_install
		;;
	get)
		pluto_get
		;;
	favorites)
		pluto_favorites
		;;
	show)
		pluto_show
		;;
	create)
		pluto_create
		;;
	all)
		npm_install
		pluto_get
		pluto_favorites
		pluto_show
		pluto_create
		;;
	*)
		echo "Use: $0 {all|install|get|favorites|show|create}"
		exit 1
		;;
esac
