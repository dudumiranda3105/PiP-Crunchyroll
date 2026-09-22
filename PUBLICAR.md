# Publicar na sua conta GitHub

1. Entre na conta desejada e abra https://github.com/new.
2. Crie um repositório **público** chamado `crunchyroll-pip`.
3. Deixe desmarcadas as opções de criar README, .gitignore e licença: os arquivos já existem aqui.
4. No PowerShell, execute os comandos abaixo substituindo os valores de exemplo.

```powershell
cd CAMINHO_DA_PASTA_CRUNCHYROLL_PIP
git config --local user.name "SEU NOME"
git config --local user.email "EMAIL DA SUA CONTA GITHUB"
git add .
git commit -m "Publica Crunchyroll PiP 1.1.2"
git remote add origin https://github.com/SEU_USUARIO/crunchyroll-pip.git
git push -u origin main
```

O repositório local já foi inicializado na branch `main`. O nome/email acima são a autoria do commit, não fazem login no GitHub. Para não publicar seu email pessoal no histórico, use o endereço `noreply` fornecido pelo GitHub em Settings → Emails. Na autenticação do push, escolha a mesma conta que criou o repositório.

Se o Git usar outra conta salva e recusar o envio, tente a autenticação específica desse repositório, sem apagar credenciais globais:

```powershell
git -c credential.useHttpPath=true -c credential.username=SEU_USUARIO push -u origin main
```

Depois do envio, compartilhe a página do repositório. O README contém um link relativo para o ZIP em `dist`, que funciona independentemente do nome da conta.

## Próximas versões

Atualize a versão em manifest.json e package.json, gere o pacote com `scripts/package.ps1` e ajuste o link de download no README para a nova versão. Depois faça commit e push. Os usuários atualizam manualmente os arquivos e recarregam a extensão no Chrome.
