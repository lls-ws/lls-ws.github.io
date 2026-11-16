#!/bin/bash
# Script Gerenciador Principal - IPTV
#
# Autor: Leandro Luiz
# Autor: Modo IA Google

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE}")" && pwd)"
TEXT_EDITOR="featherpad"

# Diretórios
CONFIG_DIR="${BASE_DIR}/config"
SCRIPTS_DIR="${BASE_DIR}/scripts"
FAV_DIR="${BASE_DIR}/favorites"

# Scripts das etapas
SCRIPT_DOWNLOAD="${SCRIPTS_DIR}/download.sh"
SCRIPT_FAVORITES="${SCRIPTS_DIR}/favorites.sh"
SCRIPT_PLAYLIST="${SCRIPTS_DIR}/playlist.sh"
SCRIPT_GITHUB="${SCRIPTS_DIR}/github.sh"

# Arquivos de configuração e edição
FILE_SOURCES="${CONFIG_DIR}/sources.txt"
FILE_EPG="${CONFIG_DIR}/epg.txt"
FILE_README="${BASE_DIR}/README.md"

FILE_NEWS_LOG="${FAV_DIR}/news-channels.log"

FILE_FAV_CHANNELS="${FAV_DIR}/favorites-channels.txt"
FILE_FAV_IDS="${FAV_DIR}/favorites-ids.txt"
FILE_FAV_LOGOS="${FAV_DIR}/favorites-logos.txt"
FILE_FAV_URLS="${FAV_DIR}/favorites-urls.txt"
FILE_FAV_GROUPS="${FAV_DIR}/favorites-groups.txt"
FILE_OUT_M3U="${BASE_DIR}/playlist.m3u"

show_help() {
    echo "====================================================================="
    echo "  GERENCIADOR DE PLAYLIST IPTV"
    echo "====================================================================="
    echo "Uso: bash $0 {comando}"
    echo ""
    echo "Comandos de Execução:"
    echo "  download     -> Baixa listas e atualiza favorites-channels.txt"
    echo "  favorites    -> Sincroniza IDs, Logos, URLs e Grupos dos ativos"
    echo "  playlist     -> Gera a playlist final playlist.m3u"
    echo "  all          -> Executa todas as 3 etapas em sequência"
    echo "  update       -> Envia playlist.m3u como LLS_TV_br.m3u para o GitHub"
    echo ""
    echo "Comandos de Edição e Visualização:"
    echo "  edit-sources -> Abre sources.txt e epg.txt no editor"
    echo "  edit-config  -> Abre clean-words.txt e format-names.txt no editor"
    echo "  edit-docs    -> Abre README.md no editor"
    echo "  edit-favs    -> Abre favorites-channels.txt para ativar canais"
    echo "  edit-meta    -> Abre IDs, Logos, URLs e Grupos para edição manual"
    echo "  news         -> Abre news-channels.log no editor"
    echo "  show         -> Abre a playlist final playlist.m3u no editor"
    echo "======================================================================"
}

case "$1" in
    download)
        bash "${SCRIPT_DOWNLOAD}"
        ;;
    favorites)
        bash "${SCRIPT_FAVORITES}"
        ;;
    playlist)
        bash "${SCRIPT_PLAYLIST}"
        ;;
    all)
        bash "${SCRIPT_DOWNLOAD}" && \
        bash "${SCRIPT_FAVORITES}" && \
        bash "${SCRIPT_PLAYLIST}"
        ;;
    update)
        bash "${SCRIPT_GITHUB}"
        ;;
	edit-sources)
		mkdir -p "${CONFIG_DIR}"
		touch "${FILE_SOURCES}" "${FILE_EPG}"
		${TEXT_EDITOR} "${FILE_SOURCES}" "${FILE_EPG}" &
		;;
    edit-config)
        mkdir -p "${CONFIG_DIR}"
        touch "${CONFIG_DIR}/clean-words.txt" "${CONFIG_DIR}/format-names.txt"
        ${TEXT_EDITOR} "${CONFIG_DIR}/clean-words.txt" "${CONFIG_DIR}/format-names.txt" &
        ;;
    edit-docs)
        mkdir -p "${CONFIG_DIR}"
        touch "${FILE_README}"
        ${TEXT_EDITOR} "${FILE_README}" &
        ;;
    edit-favs)
        if [ ! -f "${FILE_FAV_CHANNELS}" ]; then
            echo "[AVISO] Arquivo não existe ainda. Rode 'bash $0 download' primeiro."
            exit 1
        fi
        ${TEXT_EDITOR} "${FILE_FAV_CHANNELS}" &
        ;;
    edit-meta)
        if [ ! -f "${FILE_FAV_GROUPS}" ]; then
            echo "[AVISO] Arquivos não existem ainda. Rode 'bash $0 favorites' primeiro."
            exit 1
        fi
        ${TEXT_EDITOR} "${FILE_FAV_GROUPS}" "${FILE_FAV_LOGOS}" "${FILE_FAV_IDS}" "${FILE_FAV_URLS}" &
        ;;
    news)
        if [ ! -f "${FILE_NEWS_LOG}" ]; then
            echo "[AVISO] Arquivo news-channels.log ainda não existe (nenhum canal novo registrado)."
            exit 1
        fi
        ${TEXT_EDITOR} "${FILE_NEWS_LOG}" &
        ;;
    show)
        if [ ! -f "${FILE_OUT_M3U}" ]; then
            echo "[AVISO] Playlist final não encontrada. Rode 'bash $0 playlist' primeiro."
            exit 1
        fi
        ${TEXT_EDITOR} "${FILE_OUT_M3U}" &
        ;;
    *)
        show_help
        exit 1
        ;;
esac
