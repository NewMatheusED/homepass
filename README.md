# 🔐 HomePass

Cofre de credenciais e gerenciador de segredos **self-hosted**, feito pra rodar num notebook-servidor doméstico e ser acessado com segurança pela rede privada do **Tailscale**. Estilo Bitwarden/1Password pessoal, leve e sob seu controle.

> ⚠️ **Não é pra ficar exposto na internet pública.** O acesso é pensado pra rede VPN privada (Tailscale). Veja a seção [Deploy](#-deploy-no-servidor).

---

## ✨ Funcionalidades

- **Cofre de senhas** — guarda credenciais (título, categoria, usuário, senha, URL/IP, notas).
- **Criptografia automática (zero-knowledge)** — `password` e `notes` são gravados **criptografados** (AES-256) no banco, nunca em texto puro.
- **Links autodestrutivos** *(em construção)* — URLs assinadas e temporárias pra compartilhar um segredo; ao ser aberto uma vez, o registro é exibido e apagado na hora.
- **SPA moderna** — Inertia.js + React, com Tailwind e Dark Mode.

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Backend | Laravel 13 (PHP 8.3+, roda em PHP 8.5 no container) |
| Frontend | Inertia.js + React 18 + Tailwind CSS (via Vite 8) |
| Auth | Laravel Breeze |
| Banco | MySQL 8.4 (em container) |
| Cache/Fila | Driver `database` (Redis opcional, hoje não usado) |
| Ambiente | Docker via Laravel Sail |

---

## 🔒 Segurança — leia isto

### A `APP_KEY` é a chave do cofre. Literalmente.

Os campos sensíveis são criptografados com a `APP_KEY` do `.env` (configurado via `$casts` no model `Credential`). Isso significa:

- **Se você perder a `APP_KEY`, perde o acesso a todas as senhas guardadas.** Não tem recuperação.
- **Se copiar o banco de uma máquina pra outra**, a `APP_KEY` **tem que ser idêntica** nas duas — senão os dados não descriptografam.
- **Guarde a `APP_KEY` num lugar seguro** (ex: outro gerenciador de senhas). O `.env` **não vai pelo Git** (está no `.gitignore`).

### Rede

O `.env` de produção deve ter `APP_DEBUG=false` (com `true`, um erro vaza stack trace com dados sensíveis) e o acesso deve ser restrito ao Tailscale — não publique a porta pra internet.

---

## ✅ Pré-requisitos

- **Docker Desktop** (Windows/Mac) ou **Docker Engine + Compose** (Linux), rodando.
- Só isso. PHP, Node e MySQL rodam todos dentro dos containers.

> **Windows:** os comandos abaixo usam `docker compose exec` direto (funciona no PowerShell).
> No Mac/Linux/WSL você pode usar o atalho `./vendor/bin/sail <comando>` no lugar de `docker compose exec laravel.test <comando>`.

---

## 🚀 Como rodar (do zero, numa máquina nova)

Como `vendor/` e `node_modules/` **não vão pelo Git**, num clone novo é preciso instalá-los antes.

```bash
git clone <seu-repo> homepass
cd homepass

# 1. Instalar as dependências PHP SEM precisar de PHP na máquina
#    (usa um container temporário só pra rodar o composer)
docker run --rm -v "${PWD}:/var/www/html" -w /var/www/html \
  laravelsail/php83-composer:latest \
  composer install --ignore-platform-reqs

# 2. Criar o .env
cp .env.example .env

# 3. Subir a infra (app na :80 + mysql interno). A 1ª vez baixa a imagem.
docker compose up -d --build

# 4. Configurar o app (dentro do container)
docker compose exec laravel.test php artisan key:generate   # ⚠️ ver aviso da APP_KEY
docker compose exec laravel.test php artisan migrate
docker compose exec laravel.test npm install
docker compose exec laravel.test npm run build
```

Pronto: acesse **http://localhost** e crie sua conta.

> **Já tem PHP + Composer + Node na máquina?** Dá pra usar o atalho `composer setup` (roda tudo isso de uma vez) — mas o caminho via Docker acima é o recomendado por não depender de nada instalado.

### Desenvolvimento no dia a dia

Pra desenvolver com **hot reload** do front, deixe o Vite rodando em vez do `build`:

```bash
docker compose exec laravel.test npm run dev
```

---

## 🧰 Comandos úteis

```bash
docker compose up -d          # subir
docker compose down           # parar (mantém os dados)
docker compose down -v        # parar E APAGAR o banco (cuidado!)
docker compose ps             # status dos containers
docker compose logs -f laravel.test

# Artisan / Composer / NPM dentro do container:
docker compose exec laravel.test php artisan migrate
docker compose exec laravel.test php artisan tinker
docker compose exec laravel.test composer require <pacote>
docker compose exec laravel.test npm run dev
```

---

## 🗄️ Como o banco está configurado (e por quê)

O MySQL roda **em container**, definido no `compose.yaml`, e **de propósito não publica a porta 3306 no host**. Motivo: muitas máquinas já têm um MySQL nativo ocupando a 3306, e publicar geraria conflito (`bind: address already in use`). O app conversa com o banco pela **rede interna do Docker** (`DB_HOST=mysql`), então não precisa da porta exposta.

- Quer inspecionar o banco pelo Workbench/DBeaver? Descomente o bloco `ports:` do serviço `mysql` no `compose.yaml` (sugestão: mapear em `3307:3306` pra não colidir) e suba de novo.
- Os dados vivem no volume Docker `sail-mysql`. **Faça backup dele** — é onde mora o cofre. Ex: `docker compose exec mysql mysqldump -usail -ppassword homepass > backup.sql`.

---

## 🌐 Deploy no servidor

O mesmo `compose.yaml` roda no servidor (Windows, Mac ou Linux). Checklist do que muda:

1. **`.env` de produção** (não vem pelo Git — crie na máquina):
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=http://100.x.x.x   # IP/hostname do Tailscale (usado nos links assinados!)
   DB_PASSWORD=<senha_forte>  # troque o "password" padrão
   ```
2. **`APP_KEY`** — gere com `key:generate`, ou reutilize a mesma se for migrar dados de outra máquina (ver [Segurança](#-segurança--leia-isto)).
3. **Sail é dependência de dev.** Se rodar `composer install --no-dev`, o Dockerfile do Sail some e o build quebra. Instale **com** as dev deps (ou monte um Dockerfile de produção próprio).
4. **Assets de produção:** `npm ci && npm run build` (não `npm run dev`). Depois `php artisan migrate --force` e `php artisan optimize`.
5. **Rede blindada:** o compose publica a porta 80 em `0.0.0.0` (toda a LAN alcança). Pra restringir ao Tailscale, amarre o mapeamento no IP do Tailscale (`100.x.x.x:80:80`) ou feche no firewall. HTTPS fácil com `tailscale serve`.
6. **Backup** do volume `sail-mysql` (o cofre criptografado).

### Redis (opcional)

Hoje os drivers de cache/fila/sessão são `database` — **Redis não é usado**, e pra um cofre pessoal isso é suficiente. Se quiser usar um Redis que já roda no host: `REDIS_HOST=host.docker.internal` e troque `CACHE_STORE`/`QUEUE_CONNECTION`/`SESSION_DRIVER` para `redis`.

---

## 🩹 Troubleshooting

| Sintoma | Causa / solução |
|---|---|
| `bind: address already in use` na porta 3306 ao subir | Já resolvido: o MySQL do container não publica porta. Se voltar a acontecer, é porque alguém reativou o bloco `ports:` do `mysql` e há outro MySQL na 3306. |
| `ViteManifestNotFoundException` / erro 500 na home | Faltou buildar o front. Rode `npm run dev` (dev) ou `npm run build` (prod). |
| `Cannot find module '...rolldown-binding.linux-x64-gnu.node'` no build | Bug do npm com deps opcionais do Vite 8. Solução: `docker compose exec laravel.test sh -c "rm -rf node_modules package-lock.json && npm install"`. |
| `npm install` quebra em peer dependency (vite/plugin-react) | Já corrigido no `package.json` (plugin-react ^6, compatível com Vite 8). Garanta que puxou a versão atualizada. |

---

## 🧭 Roadmap (onde paramos)

- [x] Model `Credential` com criptografia (`password`, `notes`) + migration.
- [x] Ambiente Docker (Sail) com MySQL em container, sem conflito de porta.
- [ ] Telas React em `resources/js/Pages/` para o CRUD de credenciais (listar, criar, editar, deletar).
- [ ] `CredentialController` recebendo as requisições via Inertia.
- [ ] Gerador de links assinados que se autodestroem após o primeiro acesso.
