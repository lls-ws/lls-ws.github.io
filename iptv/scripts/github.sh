#!/bin/bash
# Etapa 4: Upload da estrutura do projeto e playlist para uso com GitHub Actions
#
# Autor: Leandro Luiz
# Autor: Modo IA Google

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE}")/.." && pwd)"
FILE_OUT_M3U="${BASE_DIR}/playlist.m3u"

REPOSITORY_NAME="lls-ws.github.io"
REPOSITORY_DIR="${HOME}/${REPOSITORY_NAME}"
IPTV_DIR="${REPOSITORY_DIR}/iptv"
TARGET_M3U="${IPTV_DIR}/LLS_TV_br.m3u"
WORKFLOW_DIR="${REPOSITORY_DIR}/.github/workflows"
WORKFLOW_FILE="${WORKFLOW_DIR}/update-iptv.yml"

if [ ! -s "${FILE_OUT_M3U}" ]; then
    echo "[ERRO] Playlist ${FILE_OUT_M3U} não encontrada ou vazia. Rode 'bash run.sh playlist' primeiro."
    exit 1
fi

echo "=== 1. Sincronizando repositório ${REPOSITORY_NAME} ==="
sudo bash "/usr/bin/git_download.sh" "${REPOSITORY_NAME}"

if [ ! -d "${REPOSITORY_DIR}" ]; then
    echo "[ERRO] Diretório do repositório não encontrado: ${REPOSITORY_DIR}"
    exit 1
fi

echo "=== 2. Copiando estrutura do projeto (sem temp/) para ${IPTV_DIR} ==="
mkdir -p "${IPTV_DIR}"
rm -rf "${IPTV_DIR}/config" "${IPTV_DIR}/favorites" "${IPTV_DIR}/scripts"

cp -r "${BASE_DIR}/config" "${IPTV_DIR}/"
cp -r "${BASE_DIR}/favorites" "${IPTV_DIR}/"
cp -r "${BASE_DIR}/scripts" "${IPTV_DIR}/"
[ -f "${BASE_DIR}/run.sh" ] && cp -f "${BASE_DIR}/run.sh" "${IPTV_DIR}/"
[ -f "${BASE_DIR}/README.md" ] && cp -f "${BASE_DIR}/README.md" "${IPTV_DIR}/"
[ -f "${BASE_DIR}/.gitignore" ] && cp -f "${BASE_DIR}/.gitignore" "${IPTV_DIR}/"

echo "=== 3. Publicando playlist como LLS_TV_br.m3u ==="
cp -fv "${FILE_OUT_M3U}" "${TARGET_M3U}"
ls -lh "${TARGET_M3U}"

echo "=== 4. Criando workflow do GitHub Actions (06:00 BRT) ==="
mkdir -p "${WORKFLOW_DIR}"

cat << 'EOF' > "${WORKFLOW_FILE}"
name: Atualizar Playlist IPTV (LLS_TV_br.m3u)

on:
  # Executa toda segunda-feira às 05:00 (horário de Brasília / 08:00 UTC)
  schedule:
    - cron: '0 8 * * 1'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-playlist:
    runs-on: ubuntu-latest

    steps:
      - name: Baixar repositório
        uses: actions/checkout@v4

      - name: Executar scripts IPTV
        run: |
          chmod +x iptv/run.sh iptv/scripts/*.sh
          bash iptv/run.sh all

      - name: Atualizar LLS_TV_br.m3u e limpar temporários
        run: |
          cp -f iptv/playlist.m3u iptv/LLS_TV_br.m3u
          rm -rf iptv/temp iptv/playlist.m3u

      - name: Salvar alterações no GitHub (Commit & Push)
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@://github.com"
          git add iptv/LLS_TV_br.m3u iptv/favorites/
          if ! git diff --staged --quiet; then
            git commit -m "chore(iptv): atualização automática LLS_TV_br.m3u"
            git push
          else
            echo "Nenhuma alteração detectada nos canais ou URLs."
          fi
EOF

echo "=== 5. Enviando alterações para o GitHub ==="
sudo bash "/usr/bin/git_remote.sh" "${REPOSITORY_NAME}"
echo "Upload concluído com sucesso!"
