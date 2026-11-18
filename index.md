<div align="center">

# 📺 LLS-WS • Central de Listas IPTV & Rádios

**Listas M3U curadas, automatizadas via GitHub Actions e sincronizadas com Guia de Programação (EPG) diário.**

[![Atualização Playlist](https://shields.io)](https://github.com)
[![Atualização EPG](https://shields.io)](https://github.com)
[![Repositório](https://shields.io)](https://github.com)

</div>

---

## 📡 Links Diretos (Copiar e Colar no Player)

> 💡 **Dica:** Basta clicar no ícone de **copiar** no canto direito de cada caixa abaixo e colar no seu aplicativo de IPTV (**TiviMate**, **IPTV Smarters**, **OTT Navigator**, **Kodi** ou **VLC**).

### 🎬 Playlist Principal — LLS_TV (91 Canais • Filmes, Séries e Variedades)
```text
https://github.io
```

### 📅 Guia de Programação (EPG Compactado `.gz`)
*(Já embutido automaticamente na playlist acima, mas disponível caso seu player solicite separado)*
```text
https://githubusercontent.com
```

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
