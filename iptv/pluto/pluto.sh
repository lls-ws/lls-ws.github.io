#!/bin/sh
# Script to Create Pluto IPTV Playlist File
#
# Autor: Leandro Luiz
# email: lls.homeoffice@gmail.com

SERVER_NAME=$(basename ${0%.*})
SERVER_DIR="iptv/${SERVER_NAME}"

FAVORITES_FILE="${SERVER_DIR}/pluto-favorites"
FAVORITES_DIR="${SERVER_DIR}/$(echo $(basename ${FAVORITES_FILE}) | cut -d '-' -f 2)"

PLAYLIST_ALL_IPTV="${SERVER_DIR}/PlutoTV_br.m3u"
PLAYLIST_LLS="${SERVER_DIR}/LLS_$(basename ${PLAYLIST_ALL_IPTV})"
PLAYLIST_ALL="${SERVER_DIR}/playlist.m3u8"

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
	
	if [ ! -f ${FAVORITES_FILE} ]; then
		
		mv -v ${PLAYLIST_ALL} ${PLAYLIST_ALL_IPTV}
	
	fi
	
	(cd ${SERVER_DIR}; rm -fv "epg.xml" "cache.json"; cd -)
	
}

pluto_favorites()
{
	
	if [ ! -f ${PLAYLIST_ALL_IPTV} ]; then
		
		echo "File ${PLAYLIST_ALL_IPTV} not found!"
		echo "Run: bash $0 get"
		exit 1
		
	fi
	
	if [ ! -d ${FAVORITES_DIR} ]; then
	
		mkdir -pv ${FAVORITES_DIR}
		
		for FAVORITE_NAME in "${FAVORITES_ARRAY[@]}"
		do
			
			pluto_favorite
			
		done
		
	fi
	
	pluto_show
	
	pluto_edit
	
}

pluto_favorite()
{
	
	FAVORITE_FILE="${FAVORITES_DIR}/${FAVORITE_NAME}.txt"
	
	if [ ! -f ${FAVORITE_FILE} ]; then
	
		echo "# ${FAVORITE_NAME}" > ${FAVORITE_FILE}
		
		echo "Get ${FAVORITE_NAME} Channel Names..."
		cat ${PLAYLIST_ALL_IPTV} | grep ${FAVORITE_NAME} | cut -d '"' -f 2 >> ${FAVORITE_FILE}
		
	else
	
		echo "File $(basename ${FAVORITE_FILE}) already exists!"
		echo -e "Remove to update!\n"
		
	fi
	
}

pluto_create()
{
	
	if [ -z "$(ls ${FAVORITES_DIR}/*.txt 2>/dev/null)" ]; then
	
		echo "Not found files on directoy ${FAVORITES_DIR}"
		echo "Run: bash $0 $(basename ${FAVORITES_DIR})"
		exit 1
	
	fi
	
	echo "Creating $(basename ${FAVORITES_FILE}) file..."
	echo "Join favorites channels..."
	
	cat ${FAVORITES_DIR}/*.txt > ${FAVORITES_FILE}
	
	pluto_get
	
	mv -v ${PLAYLIST_ALL} ${PLAYLIST_LLS}
	
	pluto_epg
	
	pluto_show
	
}

pluto_epg()
{
	
	EPG_URL="https:\/\/i.mjh.nz\/PlutoTV\/br.xml.gz"
	
	if [ -f ${PLAYLIST_LLS} ]; then
	
		echo "Add EPG url"
		sed -i 's/#EXTM3U/#EXTM3U x-tvg-url="'${EPG_URL}'"/g' ${PLAYLIST_LLS}
		
		cat ${PLAYLIST_LLS} | head -1
		
		echo "File ${PLAYLIST_LLS} created!"
		
	fi
	
}

pluto_clean()
{
	
	echo "Cleanning ${SERVER_NAME} iptv list..."
	
	rm -fv ${PLAYLIST_LLS} ${PLAYLIST_ALL} ${PLAYLIST_ALL_IPTV}
	rm -rfv ${FAVORITES_FILE} ${FAVORITES_DIR}
	
	pluto_show
	
}

pluto_show()
{
	
	echo "Showing ${SERVER_NAME} files:"
	
	ls -al ${SERVER_DIR}/*
	
}

pluto_edit()
{
	
	echo "Editing ${FAVORITES_DIR} files..."
	
	if [ -n "$(ls ${FAVORITES_DIR}/*.txt 2>/dev/null)" ]; then
	
		geany $(realpath ${FAVORITES_DIR})/*.txt
		
	else
	
		echo "Not found ${FAVORITES_DIR} files!"
		exit 1
		
	fi
	
}

case "$1" in
	install)
		npm_install
		;;
	get)
		pluto_get
		pluto_show
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
	clean)
		pluto_clean
		;;
	all)
		npm_install
		pluto_get
		pluto_favorites
		pluto_create
		;;
	*)
		echo "Use: $0 {all|install|get|favorites|show|create|clean}"
		exit 1
		;;
esac
