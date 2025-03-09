# SISTEMA DE GERENCIAMENTO DE PAGAMENTOS MULTI-GATEWAY

Um sistema robusto para gerenciamento de pagamentos, desenvolvido para facilitar a integração com múltiplos gateways. Este projeto foi construído utilizando **Node.js**, **TypeScript**, **AdonisJS** e **MySQL**.

## Funcionalidades

- Gerenciamento de pagamentos de forma eficiente e segura.
- Controle de diferentes tipos de usuários e permissões.
- Integração com múltiplos gateways de pagamento.

## Estrutura do Banco de Dados

O banco de dados contém as seguintes tabelas:

- `roles`
- `users`
- `permissions`
- `roles_permissions`
- `products`
- `transactions`
- `transaction_products`
- `gateways`

## Tipos de Usuários e Permissões

- **Admin:** Permissão para executar todas as ações.
- **Manager:** Permissão para gerenciar produtos e usuários.
- **Finance:** Permissão para gerenciar produtos e realizar reembolsos.
- **User:** Permissões limitadas, permitindo apenas ações que não exigem outra role.

## Instalação e Execução

### Pré-requisitos

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Passos para executar o projeto

1. **Clone o repositório:**

   ```sh
   git clone https://github.com/BeringeloF/payment_management_system.git
   cd payment_management_system
   ```

2. **Instale as dependências:**

   ```sh
   npm install
   ```

3. **Configure o banco de dados:**

   - Crie um banco de dados no MySQL.
   - Configure as variáveis de ambiente no arquivo `.env` conforme necessário exemplo de arquivo .env

   ```env
   TZ=UTC
   PORT=
   HOST=
   LOG_LEVEL=
   APP_KEY=
   NODE_ENV=
   DB_HOST=
   DB_PORT=
   DB_USER=
   DB_PASSWORD=
   DB_DATABASE=
   SESSION_DRIVER=cookie

   DEFAULT_ROLE=

   PAYMENT_RETRIES=

   FIRST_GATEWAY_URL=http://localhost:3001
   FIRST_GATEWAY_PAYMENT_ROUTE=http://localhost:3001/transactions
   FIRST_GATEWAY_REFUND_ROUTE= http://localhost:3001/transactions/:id/charge_back

   SECOND_GATEWAY_URL=http://localhost:3002
   SECOND_GATEWAY_PAYMENT_ROUTE=http://localhost:3002/transacoes
   SECOND_GATEWAY_REFUND_ROUTE=http://localhost:3002/transacoes/reembolso

   ```

4. **Execute as migrations:**

   ```sh
    node ace migration:run
   ```

5. **Execute os seeds:**

   ```sh
   node ace db:seed
   ```

6. **Execute os testes (opcional):**

   ```sh
   node ace test
   ```

7. **Inicie o servidor:**
   ```sh
   node ace serve --watch
   ```

## Rotas da API

### Rotas Públicas

#### Login

- **Endpoint:** `POST /login`
- **Body:**
  ```json
  {
    "email": "your_email",
    "password": "your_password"
  }
  ```

#### Compra de Produtos

- **Endpoint:** `POST /purchase/buy`
- **Body:**
  ```json
  {
    "products": [
      { "id": 1, "quantity": 1 },
      { "id": 2, "quantity": 2 }
    ],
    "name": "tester",
    "email": "tester@email.com",
    "cardNumber": "5569000000006063",
    "cvv": "010"
  }
  ```

### Rotas Privadas

#### User Routes

- **Listar todos os usuários:**  
  `GET /users`

- **Retornar um usuário específico:**  
  `GET /users/:userId`

- **Atualizar um usuário:**  
  `PATCH /users/:userId`

  - **Body:**
    ```json
    {
      "email": "new_email",
      "password": "new_password"
    }
    ```

- **Deletar um usuário:**  
  `DELETE /users/:userId`

#### Product Routes

- **Criar um produto:**  
  `POST /products`

  - **Body:**
    ```json
    {
      "amount": 123,
      "name": "shoes"
    }
    ```

- **Listar todos os produtos:**  
  `GET /products`

- **Retornar um produto específico:**  
  `GET /products/:productId`

- **Atualizar um produto:**  
  `PATCH /products/:productId`

  - **Body:**
    ```json
    {
      "amount": 123,
      "name": "shoes"
    }
    ```

- **Deletar um produto:**  
  `DELETE /products/:productId`

#### Purchases Routes

- **Listar todas as compras:**  
  `GET /purchases`

- **Detalhar uma compra:**  
  `GET /purchases/:transactionId`

- **Realizar o reembolso de uma compra:**  
  `POST /purchases/refund/:transactionId`

#### Client Routes

- **Listar todos os clientes:**  
  `GET /clients`

- **Retornar dados de um cliente (incluindo detalhes de suas compras):**  
  `GET /clients/:clientId`

#### Gateway Routes

- **Alternar o estado do gateway (ativo/desativado):**  
  `POST /gateways/enable-disable/:gatewayId`
  - **Body:** (vazio)
- **Atualizar a prioridade de um gateway:**  
  `PATCH /gateways/priority/:gatewayId`
  - **Body:**
    ```json
    {
      "newPriority": 1
    }
    ```
