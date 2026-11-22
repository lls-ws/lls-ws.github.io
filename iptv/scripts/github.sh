#!/bin/bash
# Etapa 4: Upload direto das alterações para o repositório lls-ws.github.io
#
# Autor: Leandro Luiz

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILE_OUT_M3U="${BASE_DIR}/LLS_TV.m3u"
REPOSITORY_NAME="lls-ws.github.io"

if [ ! -s "${FILE_OUT_M3U}" ]; then
    echo "[ERRO] Playlist ${FILE_OUT_M3U} não encontrada ou vazia. Rode 'bash run.sh playlist' primeiro."
    exit 1
fi

echo "=== 1. Limpando arquivos temporários ==="
rm -rf "${BASE_DIR}/temp"

echo "=== 2. Enviando alterações de ${REPOSITORY_NAME} para o GitHub ==="
sudo bash "/usr/bin/git_remote.sh" "${REPOSITORY_NAME}"
echo "Upload concluído com sucesso!"
