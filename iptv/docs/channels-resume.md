**⚙️ Manutenção** [Painel de Controle](https://github.com/lls-ws/lls-ws.github.io/tree/main/iptv/README.md#painel)

# Resumo da Funcionalidade dos Canais

## Aplicativos Utilizados

* **MPV Linux (Todos canais funcionando)**
  * Dark Matter (Imagem Quadrados Verde)
  
  Remover:
  * Studio Universal (Espanhol)
  * Scifi Word (Espanhol)
  * Grjingo (Faroeste)
  * Pluto Bang Bang (Faroeste e Remover Grupo Faroeste)
  * American Classics (Inglês)
  * Channel Network (Imagem ruim)
  * Classic Flix (Imagem Ruim, Áudio diferente)
  * Classique (Imagem ruim)
  * Filmzie (Ingles)
  * Movie Mania (Ingles)
  * Classique Séries (Imagem ruim)
  * Séries Classic (Imagem ruim)

* **Roku Express 3930br (3 canais não funcionando)**
  * A&E
  * Telecine Action
  * Studio Universal
  
  Erro na fonte LG alterado para Movieark:
  * Adrenalina Pura
  * Adrenalina Pura Halloween
  * Filmelier
  * Filmelier Esperança
  * Filmelier Paixão
  * Filmelier Vida Real
  * Moviesphere (Som baixo)
  
  <br>
  
  Isso ocorre quando o servidor transmite em H.265 (HEVC), MPEG-2 ou com áudio em AC3/Dolby sem fallback para AAC — formatos que o modelo 3930BR (Full HD básico) não decodifica por hardware.
    
  App Roku (SimpleIPTV-LLS.zip): Leve, com abertura direta, zapping instantâneo pelas setas Cima/Baixo, menu lateral de 10 canais com destaque em azul escuro e banner EPG amarelo.

  Pipeline IPTV (run.sh + check.sh): Valida automaticamente tanto o status HTTP quanto os codecs H.264 + AAC para o Roku 3930BR antes de publicar.
  
* **Samsung Tizen UN65BU8000GXZD UHD (Fazer Teste)**
  * M3U IPTV (Instalado pelo Samsung Apps)
  * Chouette TV (Instalar pelo [Apps2Samsung](https://github.com/Apps2Samsung/Apps2Samsung/releases))
  * SS IPTV (Instalar pelo Samsung Apps)
  * OttPlayer (Instalar pelo Samsung Apps, criar conta [ottplayer.tv](https://ottplayer.tv/account/registration))
