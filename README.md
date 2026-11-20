# 📺 LLS-WS • Central de Listas IPTV

**Listas M3U curadas, automatizadas via GitHub Actions e sincronizadas com Guia de Programação (EPG) diário.**

| Automação / Recurso | Frequência | Acesso Direto |
| :--- | :--- | :--- |
| **🌐 Portal Público (GitHub Pages)** | Tempo Real | **[lls-ws.github.io](https://lls-ws.github.io)** |
| **⚙️ Atualização Playlist (`LLS_TV.m3u`)** | Segunda-feira • 05:00 | **[Ver Execuções (Actions)](https://github.com/lls-ws/lls-ws.github.io/actions/workflows/update-iptv.yml)** |
| **📅 Geração Guia EPG (`guide.xml.gz`)** | Todos os dias • 00:00 | **[Ver Execuções (Actions)](https://github.com/lls-ws/epg/actions)** |
| **⚙️ [Painel de Controle](iptv/README.md#painel)** |  |  |


---

## 📡 Links Diretos (Copiar e Colar no Player)

### 🎬 Playlist Principal — `LLS_TV.m3u` (91 Canais)
```text
https://lls-ws.github.io/iptv/LLS_TV.m3u
```

### 📅 Guia de Programação — EPG Compactado (`.gz`)
*(Já embutido na playlist acima, mas disponível caso seu player solicite separado)*
```text
https://lls-ws.github.io/iptv/guide.xml.gz
```

---

## 🗂️ Estrutura deste Repositório

| Caminho | Descrição |
| :--- | :--- |
| **[`index.md`](index.md)** | Página inicial pública do portal `lls-ws.github.io` com botões interativos de cópia. |
| **[`iptv/`](iptv/)** | Pipeline completo em Bash (`run.sh`), curadoria de favoritos, filtros e playlist `LLS_TV.m3u`. |
| **[`.github/workflows/`](.github/workflows/)** | Automação semanal que renova tokens e atualiza a playlist toda segunda-feira às 05:00. |

---

## 🔗 Ecossistema do Projeto

* **[Repositório EPG (`lls-ws/epg`)](https://github.com/lls-ws/epg):** Fork dedicado à geração diária do `guide.xml.gz` (66 canais com programação via `mi.tv`, `plex.tv`, `pluto.tv` e `whaletvplus.com`).
* **[Documentação Técnica do Gerenciador (`iptv/README.md`)](iptv/README.md):** Diagrama de fluxo, arquitetura de pastas e guia de comandos CLI.
* **[Quadro de Gestão (`GitHub Projects`)](https://github.com/users/lls-ws/projects/11):** Acompanhamento de tarefas, novos canais e manutenção das fontes.
* **[Painel de Controle Rápido (`iptv/README.md#painel`)](iptv/README.md#painel):** Atalhos diretos para editar listas, grupos, metadados e consultar logs de execução.

---

> Mantido por **[lls-ws](https://github.com/lls-ws)** • Automatizado via GitHub Actions
