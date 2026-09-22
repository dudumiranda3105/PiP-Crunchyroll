# Publicar atualizações

O repositório fica em https://github.com/dudumiranda3105/PiP-Crunchyroll.

Antes de publicar uma versão:

1. Atualize a versão em `manifest.json` e `package.json`.
2. Rode `npm run build` e `npm test`.
3. Gere o ZIP com `powershell -NoProfile -File scripts/package.ps1`.
4. Ajuste o link de download no README para o novo ZIP.
5. Confira as mudanças com `git diff`.

Depois, na pasta do projeto:

```sh
git add .
git commit -m "Descreva o que mudou"
git push
```

Quem instalou pelo GitHub precisa baixar a versão nova e recarregar a extensão manualmente no Chrome.
