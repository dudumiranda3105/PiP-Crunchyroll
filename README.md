<p align="center"><img src="icons/icon-128.png" width="96" alt="Crunchyroll PiP"></p>

# Crunchyroll PiP

Assista à Crunchyroll em uma janela flutuante enquanto usa outros programas. Um clique no botão do player abre Picture-in-Picture; outro fecha.

**Local, sem anúncios, sem conta extra e sem coleta de dados.** Projeto independente e não oficial, sem vínculo com a Crunchyroll.

## Instalar no Chrome

Não precisa instalar Node.js nem programar.

1. **[Baixe o ZIP pronto](dist/crunchyroll-pip-1.1.2.zip?raw=true)**.
2. Extraia para uma pasta permanente, como `Documentos/crunchyroll-pip`.
3. Abra `chrome://extensions` na barra de endereço do Chrome.
4. Ative **Modo do desenvolvedor** no canto superior direito.
5. Clique em **Carregar sem compactação** e selecione a pasta extraída que contém `manifest.json`.
6. Abra ou atualize o episódio na Crunchyroll, dê play e clique no botão **Abrir janela flutuante (PiP)** nos controles.

Você também pode fixar a extensão no menu de quebra-cabeça e usar o ícone. Mantenha a pasta extraída no computador: o Chrome continua usando seus arquivos.

Alternativa: **Code → Download ZIP**, extraia e selecione a raiz do projeto, onde está `manifest.json`. O código de instalação já vem gerado.

> Extraia o ZIP antes de instalar. Não use “Compactar extensão” nem arraste o ZIP para o Chrome. Esta é uma instalação manual pelo GitHub. Computadores gerenciados por empresas/escolas podem impedir extensões locais.

## Usar e atualizar

- O botão aparece junto aos controles. Se não forem reconhecidos, aparece no canto superior direito como alternativa.
- Arraste e redimensione a janela pelos controles do navegador.
- Clique novamente ou feche a janela para voltar ao player. Mantenha a aba do episódio aberta.
- Se o ícone mostrar `!`, passe o mouse para ler a orientação.
- Para atualizar, baixe o novo pacote e substitua os arquivos na mesma pasta. Em `chrome://extensions`, clique em **Recarregar** e atualize a página do episódio. **Não há atualização automática pelo GitHub.**
- Para desinstalar, clique em **Remover** em `chrome://extensions`; depois pode apagar a pasta.

## Privacidade e permissões

Sem analytics, servidores, leitura de cookies, armazenamento de dados ou requisições de rede pela extensão. A reprodução permanece no player da Crunchyroll.

| Permissão | Motivo |
| --- | --- |
| `scripting` | Abrir/fechar PiP pelo ícone da extensão. |
| `https://*.crunchyroll.com/*` | Encontrar o vídeo e inserir o botão, inclusive no iframe do player. |

O Chrome pode avisar que a extensão pode ler/alterar dados da Crunchyroll. Esse é o alcance técnico concedido; o código o utiliza para localizar vídeos e controles e operar PiP. O script executa automaticamente nesse domínio para inserir o botão, mas só abre PiP após um clique. Leia [PRIVACY.md](PRIVACY.md).

## Limitações

- Voltado ao Chrome desktop, não ao Chrome de celular.
- Legendas e controles sobrepostos podem não aparecer no PiP nativo.
- Não contorna DRM, assinatura, anúncios ou políticas do player.
- Mudanças no site podem exigir adaptações. Iframes fora de `crunchyroll.com` não são acessados.
- Se não funcionar, recarregue a extensão e a página, dê play e tente novamente.

Abra uma **Issue** com navegador, versão da extensão e passos para reproduzir problemas. Não publique cookies, credenciais ou dados da conta.

## Desenvolvimento

JavaScript puro, Manifest V3 e nenhuma dependência de produção. Com Node.js 22 ou superior:

```sh
npm run build
npm test
```

`pip.js` contém a lógica; `background.js` atende ao ícone; `player-button.js` adiciona o botão. `build.js` gera o `content.js` distribuído. Gere novamente após alterar os fontes.

Os testes cobrem seleção de frame, abertura/fechamento e restauração do atributo de bloqueio. `tests/*-check.js` são verificações manuais via Playwright CLI em player sintético. O funcionamento também foi confirmado pelo usuário na Crunchyroll, sem garantir todas as versões futuras do site.

Para gerar o pacote no Windows:

```powershell
powershell -NoProfile -File scripts/package.ps1
```

A lista explícita do pacote exclui testes, histórico Git, logs e arquivos pessoais. O hash SHA-256 fica em `dist/SHA256SUMS.txt`.

## Licença e marca

Código sob [licença MIT](LICENSE). Crunchyroll e suas marcas pertencem aos respectivos titulares; a licença do código não concede direitos sobre marcas de terceiros. O ícone é inspirado no serviço e não indica afiliação oficial.
