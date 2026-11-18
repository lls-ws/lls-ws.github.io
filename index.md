<div align="center">

<h1>📺 LLS-WS • Central de Listas IPTV &amp; Rádios</h1>

<p><strong>Listas M3U curadas, automatizadas via GitHub Actions e sincronizadas com Guia de Programação (EPG) diário.</strong></p>

<p>
  <a href="https://github.com" style="display:inline-block;padding:6px 14px;margin:4px;background:#2088FF;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">⚙️ Playlist IPTV • Semanal</a>
  <a href="https://github.com" style="display:inline-block;padding:6px 14px;margin:4px;background:#2EA44F;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">📅 Guia EPG • Diário</a>
  <a href="https://github.com" style="display:inline-block;padding:6px 14px;margin:4px;background:#24292F;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">📂 GitHub • lls-ws</a>
</p>

</div>

---

## 📡 Links Diretos (Copiar e Colar no Player)

> 💡 **Dica:** Clique no botão **📋 Copiar** ao lado de cada link e cole diretamente no seu aplicativo de IPTV (**TiviMate**, **IPTV Smarters**, **OTT Navigator**, **Kodi** ou **VLC**).

### 🎬 Playlist Principal — LLS_TV (91 Canais • Filmes, Séries e Variedades)

<div style="display:flex;align-items:center;gap:8px;background:#1e1e1e;padding:10px 12px;border-radius:6px;border:1px solid #333;margin-bottom:16px;">
  <input id="url-m3u" type="text" value="https://lls-ws.github.io/iptv/LLS_TV.m3u" readonly style="flex:1;background:transparent;border:none;color:#e6edf3;font-family:monospace;font-size:13px;outline:none;">
  <button onclick="copiarLink('url-m3u', this)" style="background:#2EA44F;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:bold;font-size:12px;white-space:nowrap;">📋 Copiar</button>
</div>

### 📅 Guia de Programação (EPG Compactado `.gz`)
*(Já embutido automaticamente na playlist acima, mas disponível caso seu player solicite separado)*

<div style="display:flex;align-items:center;gap:8px;background:#1e1e1e;padding:10px 12px;border-radius:6px;border:1px solid #333;margin-bottom:16px;">
  <input id="url-epg" type="text" value="https://raw.githubusercontent.com/lls-ws/epg/refs/heads/master/guide.xml.gz" readonly style="flex:1;background:transparent;border:none;color:#e6edf3;font-family:monospace;font-size:13px;outline:none;">
  <button onclick="copiarLink('url-epg', this)" style="background:#2088FF;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:bold;font-size:12px;white-space:nowrap;">📋 Copiar</button>
</div>

<script>
function copiarLink(idCampo, botao) {
  const campo = document.getElementById(idCampo);
  campo.select();
  campo.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(campo.value);
  const textoOriginal = botao.innerText;
  botao.innerText = '✅ Copiado!';
  setTimeout(() => { botao.innerText = textoOriginal; }, 2000);
}
</script>

---

## 📊 Status e Cobertura da Grade

| Recurso | Detalhes | Atualização Automática |
| :--- | :--- | :--- |
| **Canais Ativos** | **91 canais** selecionados (Samsung TV Plus, LG, Plex, Pluto TV, Whale TV+ e TV Aberta/Paga) | Toda Segunda-feira às 05:00 |
| **Cobertura EPG** | **66 canais** com sinopses, horários e capas em português | Todos os dias às 00:00 |
| **Verificação de Links** | Script automatizado (`check.sh`) para remoção de streams offline | Integrado ao pipeline |

---

## 📻 Rádios Online (Streams Diretos)

| Estação | Estilo | Link M3U Direto |
| :--- | :--- | :--- |
| **🎸 Uturn Radio** | Classic Rock | `https://uturnradio.com` |
| **🤘 89 FM — A Rádio Rock** | Rock / Pop Rock | `https://radios.com.br` |

---

## ⚙️ Arquitetura do Projeto

* **[lls-ws/lls-ws.github.io](https://github.com):** Hospeda os scripts em Shell (`run.sh`, `download.sh`, `favorites.sh`, `playlist.sh`, `check.sh`) e publica a playlist final via GitHub Pages.
* **[lls-ws/epg](https://github.com):** Repositório dedicado à geração diária do guia XMLTV compactado (`guide.xml.gz`) a partir de múltiplas fontes (`mi.tv`, `plex.tv`, `pluto.tv` e `whaletvplus.com`).
* **[Quadro de Gestão (GitHub Projects)](https://github.com):** Acompanhamento de melhorias, novos canais e manutenção das fontes.

<div align="center">
  <sub>Mantido por <a href="https://github.com">lls-ws</a> • Hospedado no GitHub Pages</sub>
</div>
