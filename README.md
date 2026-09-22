<p align="center"><img src="icons/icon-128.png" width="96" alt="Crunchyroll PiP"></p>

# Crunchyroll PiP

Uma extensão simples para assistir à Crunchyroll em uma janela flutuante. Ela coloca um botão de PiP nos controles do vídeo, então dá para abrir a janela sem ir até o ícone da extensão.

Funciona no Chrome para computador. Não coleta dados e não tem vínculo com a Crunchyroll.

## Como instalar

1. [Baixe a extensão](dist/crunchyroll-pip-1.1.2.zip?raw=true) e extraia o ZIP.
2. Guarde a pasta em um lugar onde ela possa ficar, como Documentos.
3. Abra `chrome://extensions` no Chrome.
4. Ative o **Modo do desenvolvedor**.
5. Clique em **Carregar sem compactação** e escolha a pasta que contém o arquivo `manifest.json`.
6. Atualize a página da Crunchyroll, dê play em um episódio e clique no novo botão do player.

Se preferir, você também pode fixar a extensão no menu de quebra-cabeça do Chrome e usar o ícone dela.

Não apague a pasta depois de instalar: o Chrome precisa desses arquivos. Não é necessário instalar Node.js nem usar o botão “Compactar extensão”.

## Como usar

Clique no botão para abrir ou fechar a janela flutuante. Você pode mover e redimensionar a janela, mas precisa manter a aba do episódio aberta.

O botão fica junto aos controles do player. Caso a extensão não encontre esses controles, ele aparece no canto superior direito do vídeo.

## Atualização

Baixe a versão nova, extraia os arquivos na mesma pasta e clique em **Recarregar** em `chrome://extensions`. Depois, atualize a página do episódio.

A instalação pelo GitHub não tem atualização automática. Para desinstalar, basta clicar em **Remover** na página de extensões.

## Privacidade

Tudo roda no seu navegador. A extensão não salva dados, não lê cookies e não faz requisições de rede. Também não tem anúncios ou analytics.

Ela pede acesso às páginas da Crunchyroll para encontrar o vídeo e adicionar o botão. A permissão `scripting` permite abrir o PiP pelo ícone da extensão. Por isso o Chrome mostra um aviso de acesso ao site durante a instalação.

Mais detalhes em [PRIVACY.md](PRIVACY.md).

## Problemas conhecidos

- Legendas e controles que ficam por cima do vídeo podem não aparecer na janela flutuante.
- Mudanças no player da Crunchyroll podem afetar o botão.
- A extensão não acessa players hospedados fora de `crunchyroll.com` e seus subdomínios.
- Ela não contorna DRM nem libera conteúdo que exige assinatura.

Se algo não funcionar, tente recarregar a extensão e a página do episódio. Se continuar, abra uma Issue contando o que aconteceu e qual navegador está usando. Não envie dados da sua conta.

## Para mexer no código

O projeto usa JavaScript e Manifest V3, sem dependências externas. Com Node.js 22 ou superior:

```sh
npm run build
npm test
```

A lógica do PiP fica em `pip.js`, o botão do player em `player-button.js` e a ação do ícone em `background.js`. O build junta os arquivos necessários em `content.js`, que já vem incluído para quem só quer instalar.

Os testes verificam abertura, fechamento e escolha do vídeo. O teste de navegador usa um vídeo de exemplo para conferir também o botão e seu alinhamento. Com Playwright CLI instalado, execute:

```sh
node scripts/prepare-browser-test.js
playwright-cli -s=crunchyroll-pip open about:blank
playwright-cli -s=crunchyroll-pip run-code --filename=.playwright-cli/player-check.js
playwright-cli -s=crunchyroll-pip close
```

Esse comando prepara o teste com o código atual da extensão. Os arquivos temporários ficam em `.playwright-cli/` e não vão para o GitHub.

Para gerar o ZIP no Windows:

```powershell
powershell -NoProfile -File scripts/package.ps1
```

O pacote fica em `dist`, junto do arquivo com seu hash SHA-256.

## Licença

[MIT](LICENSE). As marcas da Crunchyroll pertencem aos seus respectivos titulares. Este projeto não é oficial.
