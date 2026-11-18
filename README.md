<div align="center">

# 📺 LLS-WS • Central de Listas IPTV & Rádios

**Listas M3U curadas, automatizadas via GitHub Actions e sincronizadas com Guia de Programação (EPG) diário.**

[![Atualizar Playlist IPTV](https://github.com)](https://github.com)
[![Gerar e Publicar EPG](https://github.com)](https://github.com)

</div>

---

## 🌐 Portal Público (Acesso Rápido com Botão de Cópia)

Para copiar os links com apenas um clique no celular ou na TV, acesse a página oficial publicada no GitHub Pages:

👉 **[https://github.io](https://github.io)**

---

## 📡 Links Diretos (Copiar e Colar no Player)

### 🎬 Playlist Principal — `LLS_TV.m3u` (91 Canais)
```text
https://github.ioiptv/LLS_TV.m3u
```

### 📅 Guia de Programação — EPG Compactado (`.gz`)
*(Já embutido na playlist acima, mas disponível caso seu player solicite separado)*
```text
https://githubusercontent.com
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

* **[Repositório EPG (`lls-ws/epg`)](https://github.com):** Fork dedicado à geração diária do `guide.xml.gz` (66 canais com programação via `mi.tv`, `plex.tv`, `pluto.tv` e `whaletvplus.com`).
* **[Documentação Técnica do Gerenciador (`iptv/README.md`)](iptv/README.md):** Diagrama de fluxo, arquitetura de pastas e guia de comandos CLI.
* **[Quadro de Gestão (`GitHub Projects`)](https://github.com):** Acompanhamento de tarefas, novos canais e manutenção das fontes.

---

<div align="center">
  <sub>Mantido por <a href="https://github.com">lls-ws</a> • Automatizado via GitHub Actions</sub>
</div>
