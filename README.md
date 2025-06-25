# 🛫 TripPlanner
Projeto para o 6° módulo do curso de Análise e Desenvolvimento de Sistemas - 3° Período. 

--- 

## ✨ Visão Geral e Propósito

O TripPlanner é uma aplicação desenvolvida para auxiliar na organização e planejamento de viagens. Ele oferece funcionalidades para criar roteiros, gerenciar destinos e acompanhar detalhes importantes de cada jornada e gerenciar os seus gastos. O projeto aborda a necessidade de uma ferramenta intuitiva para que usuários possam organizar suas viagens de forma eficiente, garantindo uma experiência de planejamento fluida e previsível.

---

## ⚙️ Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript
- **TypeScript** – Superset de JavaScript com tipagem estática
- **Express** – Framework web minimalista para Node.js
- **React.js** - Biblioteca Javascript
- **Vite.js** - Ferramenta de construção moderna para projetos web
- **Commit Lint** - Validação de commits
- **Husky** - Execução automatizada de scripts
- **Sequelize** – ORM para banco de dados SQL
- **MySQL** – Banco de dados relacional
- **Dotenv** – Gerenciamento de variáveis de ambiente
- **Bearer Token + JWT** – Autenticação e autorização
- **Jest** – Testes automatizados
- **Playwright** - Testes E2E
- **Docker** - Containerização de aplicações
- **Nginx** - Servidor web
- **Mkcert** - Ferramenta para criar certificados SSL/TLS locais

---

## 📦 Instalação e Inicialização

### 1. Clone o projeto

```bash
git clone https://github.com/milenaa052/TripPlanner
cd TripPlanner
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute o projeto

```bash
docker compose up --build -d
```

---

## 🧪 Testes

Para executar os testes unitários:

```bash
npm run test
```

Para executar os testes E2E com o navegador:
```bash
npx playwright test --ui
```

Para executar os testes E2E no terminal:
```bash
npm run E2E
```

---

### 🖊️ Explicação dos Componentes:

* **Nginx (Servidor Web & Proxy Reverso):** Atua como o *gateway* principal para todas as requisições externas. Ele é o único serviço exposto diretamente para fora do ambiente Docker (nas portas 80 e 443). O Nginx é responsável por:
    * **Servir o Frontend:** Encaminha requisições para o contêiner `frontend` (na porta 3001 interna).
    * **Proxy para a API do Backend:** Roteia requisições que chegam em `/api/` para o contêiner `backend` (na porta 3000 interna).
    * **Proxy para APIs Externas:** Gerencia o acesso a serviços externos como a API do Geonames, atuando como um intermediário.
    * **Gerenciamento SSL/TLS:** Lida com a criptografia HTTPS usando certificados SSL/TLS, inclusive com o Mkcert para o desenvolvimento local.

* **Frontend (React.js/Vite.js):** A interface do usuário da aplicação. Está conteinerizado e se comunica com o `backend` e com APIs externas **exclusivamente através do Nginx**. Ele não tem portas expostas diretamente para o host, garantindo que o acesso a ele seja sempre mediado pelo Nginx.

* **Backend (Node.js/Express):** A API da aplicação. Também conteinerizado e sem portas expostas externamente. O `backend` se comunica com o `database` (MySQL) dentro da rede Docker.

* **Database (MySQL):** O banco de dados relacional. É o componente mais isolado, não expondo nenhuma porta para o host. Ele é acessível apenas pelo `backend` (ou outros serviços internos autorizados) dentro da `app-network`.

* **`app-network` (Docker Network):** Uma rede bridge personalizada criada pelo Docker Compose. Todos os serviços do TripPlanner estão conectados a esta rede, permitindo que se comuniquem uns com os outros usando seus nomes de serviço (ex: `backend` acessa `database` usando `database:3306`). Esta rede garante que o tráfego interno permaneça isolado e não roteável do exterior, exceto através do Nginx.
