# Documentação do Sistema  Oferte E Ganhe

## Sistema "Oferte e Ganhe"
O sistema **"Oferte e Ganhe"** será responsável por controlar o estoque de talões enviados para cada loja e gerenciar a distribuição dos talões.

Os talões são fornecidos a clientes com score suficiente.

O sistema controlá:
- Envio
- Manutenção
- Perfil de Acesso
- Estoque
- Recebimento de Talões

O acesso ao sistema será feito por **login e senha**, e as funcionalidades serão controladas por **perfis de acesso**.

### Módulos do Sistema:
- **Usuários**
- **Perfis**
- **Lojas**
- **Envio**
- **Manutenção**
- **Estoque**
- **Recebimento**

# 📊 Oferte e Ganhe - Protótipo

Este repositório contém o desenvolvimento do sistema **Oferte e Ganhe**. A proposta do design seguiu uma abordagem **simples e moderna**, com foco na experiência do usuário e utilizando as **cores vivas** associadas à identidade visual da empresa, como o verde predominante.

---

## 🎨 **Protótipo no Figma**

Acesse o protótipo completo no Figma através do link:  
[🔗 Protótipo no Figma](https://www.figma.com/design/cD6V6MUFRYJDmTRgXUHV5v/Oferte-e-ganhe?node-id=0-1&t=EGfbCP7WcqBnTD0D-1)

---

## 🖼 **Imagem do Protótipo**

![Previa do prototipo](image.png)

## ✨ **Ideia Geral do Design**

- **Cores vivas e identidade visual**: Utilização do **verde** predominante na identidade da empresa.  
- **Layout simples e funcional**: Destaque para **aside** estilizado e **dashboards interativos** que tornam a navegação intuitiva.  
- **Módulos com foco em usabilidade**:  
  - Uso de **tabelas** claras e informativas.  
  - **Botões** destacados para facilitar o acesso às funcionalidades principais.  

---

## 🚀 **Funcionalidades Principais**

- **Gestão de Perfis de Acesso**  
- **Gestão de Envio e Recebimento de Talões**  
- **Gestão de Estoque e Manutenção de Talões**  
- **Autenticação e Segurança**  


## 📊 **Modelo Entidade-Relacionamento**

O diagrama abaixo representa o **Modelo Entidade-Relacionamento (MER)** do sistema, que organiza as tabelas e os relacionamentos entre elas:

![Modelo Entidade-Relacionamento](image-1.png)

### ✨ **Descrição do Modelo**

1. **Tabelas Principais**:
   - **usuario**: Contém informações sobre os usuários, como nome, email, senha e permissões.
   - **transacao**: Gerencia as operações de envio e recebimento de talões, incluindo quantidades e status.
   - **estoque**: Registra as quantidades atuais, mínimas e recomendadas de talões.
   - **loja**: Contém os dados das lojas vinculadas ao sistema.

2. **Tabelas de Relacionamento**:
   - **permissao_perfil**: Relaciona perfis de acesso às permissões.
   - **permissoes**: Define as permissões existentes no sistema.
   - **perfil**: Contém os perfis de acesso, como administrador, operador, etc.

3. **Principais Relacionamentos**:
   - A tabela **usuario** está ligada à **loja** (id_loja) e à **perfil** (id_perfil).
   - A tabela **transacao** referencia **usuario** (id_usuario) e **loja** (id_loja).
   - A tabela **estoque** também referencia **loja** (id_loja).
   - A tabela **permissao_perfil** faz a ligação entre **perfil** e **permissoes**.

---


# Documentação das Rotas da API 

## Rotas de Usuários

### 1. **Criar Conta**  
**Todos os Usuários**
- **Rota:** `GET /api/usuarios/criarconta`  
- **Middleware:** `verificaToken`  
- **Descrição:** Cria uma nova conta de usuário.

### 2. **Consultar Usuário Específico**  
**Todos os Usuários**
- **Rota:** `GET /api/usuarios/consultarEspecifico/:matricula_usuario`  
- **Middleware:** `verificaToken`  
- **Descrição:** Consulta um usuário específico com base na matrícula.

### 3. **Consultar Todos os Usuários**  
**Apenas Admin**
- **Rota:** `GET /api/usuarios/consultarTodos`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Retorna todos os usuários cadastrados no sistema.

### 4. **Consultar Intervalo de Usuários**  
**Apenas Admin**
- **Rota:** `GET /api/usuarios/consultarIntervalo`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta usuários em um intervalo de lojas especificado.

### 5. **Consultar Intervalo de Lojas com Usuários**  
**Apenas Admin**
- **Rota:** `GET /api/usuarios/consultarIntervaloLoja`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta informações sobre usuários com base no intervalo de lojas.

### 6. **Consultar Intervalo de Usuários para Aprovação**  
**Apenas Admin**
- **Rota:** `GET /api/usuarios/aprovarUsuarios/consultarIntervalo`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta usuários pendentes de aprovação dentro de um intervalo.

### 7. **Consultar Intervalo de Lojas para Aprovação de Usuários**  
**Apenas Admin**
- **Rota:** `GET /api/usuarios/aprovarUsuarios/consultarIntervaloLoja`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta lojas associadas a usuários pendentes de aprovação.

### 8. **Cadastrar Novo Usuário**  
**Apenas Admin**
- **Rota:** `POST /api/usuarios/register`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Cria um novo usuário na gestão de usuários.

### 9. **Editar Usuário**  
**Apenas Admin**
- **Rota:** `PUT /api/usuarios/editar/:matricula_usuario`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Edita as informações de um usuário específico com base na matrícula.

### 10. **Deletar Usuário**  
**Apenas Admin**
- **Rota:** `DELETE /api/usuarios/deletar/:matricula_usuario`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Deleta um usuário específico com base na matrícula.

### 11. **Consultar Usuários para Aprovação**  
**Apenas Admin**
- **Rota:** `GET /api/usuarios/consultarUsuariosAprovacao`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Retorna a lista de usuários pendentes de aprovação.

### 12. **Aprovar Usuário**  
**Apenas Admin**
- **Rota:** `PUT /api/usuarios/aprovarUsuarios/:matricula_usuario`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Aprova um usuário pendente com base na matrícula.

### 13. **Criar Conta via Tela de Cadastro**  
**Acesso Livre**
- **Rota:** `POST /api/login/criarConta`  
- **Descrição:** Permite que um usuário crie uma conta através da tela de cadastro.

---


## Rotas de Recebimento

### 1. **Consultar Todos os Talões Recebidos**  
**Apenas Admin**
- **Rota:** `GET /api/recebimentoTaloes/consultarTodos`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta todos os talões recebidos no sistema.

### 2. **Informar Recebimento de Talão**  
**Apenas Admin**
- **Rota:** `PATCH /api/recebimentoTaloes/informar/:id_talao`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Informa o recebimento de um talão com base no ID.

### 3. **Editar Recebimento de Talão**  
**Apenas Admin**
- **Rota:** `PATCH /api/recebimentoTaloes/editar/:id_talao`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Edita as informações de um talão recebido.

### 4. **Consultar Intervalo de Recebimentos**  
**Apenas Admin**
- **Rota:** `GET /api/recebimentoTaloes/consultarIntervalo`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta os recebimentos em um intervalo específico de datas ou lojas.

### 5. **Consultar Recebimentos por Loja**  
**Apenas Admin**
- **Rota:** `GET /api/recebimentoTaloes/consultarLoja`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta os recebimentos de talões por loja.

### 6. **Consultar Recebimento por Loja com Permissões Específicas**  
**Perfis com Permissões de Consultas, Relatórios ou Atualização**
- **Rota:** `GET /api/recebimentoTaloes/consultarRecebimento`  
- **Middleware:** `verificaToken`, `verificaPermissoes('CONSULTAS', 'RELATORIOS', 'ATUALIZAR')`, `verificaLojaUsuario()`, `salvaMatricula()`  
- **Descrição:** Permite consultar os recebimentos de talões da loja vinculada ao usuário.

### 7. **Atualizar Recebimento de Talão**  
**Perfis com Permissão de Atualização**
- **Rota:** `PATCH /api/recebimentoTaloes/atualizarRecebimento/:id_talao`  
- **Middleware:** `verificaToken`, `verificaPermissoes('ATUALIZAR')`, `verificaLojaUsuario()`, `salvaMatricula()`  
- **Descrição:** Atualiza as informações de recebimento de um talão específico com base no ID.

### 8. **Editar Recebimento de Talão (Loja)**  
**Perfis com Permissão de Edição**
- **Rota:** `PATCH /api/recebimentoTaloes/editarRecebimento/:id_talao`  
- **Middleware:** `verificaToken`, `verificaPermissoes('EDICAO')`, `verificaLojaUsuario()`, `salvaMatricula()`  
- **Descrição:** Edita as informações de um talão recebido pela loja vinculada ao usuário.



## Rotas de Perfis

### 1. **Consultar Todos os Perfis**  
**Apenas Admin**
- **Rota:** `GET /api/perfis/consultarTodos`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta todos os perfis cadastrados no sistema.

### 2. **Consultar Intervalo de Perfis**  
**Apenas Admin**
- **Rota:** `GET /api/perfis/consultarIntervalo`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta perfis dentro de um intervalo específico.

### 3. **Consultar Perfil Específico**  
**Apenas Admin**
- **Rota:** `GET /api/perfis/consultarPerfil`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta um perfil específico no sistema.

### 4. **Consultar Permissões de Perfis por Intervalo**  
**Apenas Admin**
- **Rota:** `GET /api/perfis/consultarIntervaloPermissoesPerfil`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta permissões de perfis dentro de um intervalo específico.

### 5. **Consultar Permissões**  
**Apenas Admin**
- **Rota:** `GET /api/perfis/consultarPermissoes`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta todas as permissões disponíveis no sistema.

### 6. **Consultar Permissões de um Perfil**  
**Apenas Admin**
- **Rota:** `GET /api/perfis/consultarPermissaoPerfil`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Consulta as permissões associadas a um perfil específico.

### 7. **Cadastrar Novo Perfil**  
**Apenas Admin**
- **Rota:** `POST /api/perfis/cadastrar`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Cadastra um novo perfil no sistema.

### 8. **Editar Perfil**  
**Apenas Admin**
- **Rota:** `PUT /api/perfis/editar/:id_perfil`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Edita as informações de um perfil específico.

### 9. **Cadastrar Permissão a um Perfil**  
**Apenas Admin**
- **Rota:** `POST /api/perfis/cadastrarPermissao`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Cadastra uma nova permissão associada a um perfil.

### 10. **Editar Permissão de um Perfil**  
**Apenas Admin**
- **Rota:** `PUT /api/perfis/editarPermissao/:id_permissao_perfil`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Edita uma permissão específica associada a um perfil.

### 11. **Deletar Perfil**  
**Apenas Admin**
- **Rota:** `DELETE /api/perfis/deletar/:id_perfil`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Deleta um perfil cadastrado no sistema.

### 12. **Deletar Permissão de um Perfil**  
**Apenas Admin**
- **Rota:** `DELETE /api/perfis/deletarPermissao/:id_permissao_perfil`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Remove uma permissão específica associada a um perfil.


## Rotas de Manutenção

### 1. **Consultar Talão Específico**
- **Rota:** `GET /api/manutencaoTaloes/consultarEspecifico/:id_talao`  
- **Middleware:** `verificaToken`, `verificaPermissoes('ATUALIZAR', 'CONSULTAS', 'EDICAO')`  
- **Descrição:** Consulta detalhes específicos de um talão.

### 2. **Consultar Todos os Talões para Manutenção**  
**Apenas Admin e Perfis com Permissão de Edição**
- **Rota:** `GET /api/manutencaoTaloes/consultarTodos`  
- **Middleware:** `verificaToken`, `verificaPermissoes('EDICAO')`  
- **Descrição:** Consulta todos os talões que estão na fase de manutenção.

### 3. **Editar Talão**
**Apenas Perfis com Permissão de Edição**
- **Rota:** `PUT /api/manutencaoTaloes/editar/:id_talao`  
- **Middleware:** `verificaToken`, `verificaPermissoes('EDICAO')`  
- **Descrição:** Edita informações de um talão específico.

### 4. **Consultar Talões por Intervalo**  
**Apenas Perfis com Permissão de Edição**
- **Rota:** `GET /api/manutencaoTaloes/consultarIntervalo`  
- **Middleware:** `verificaToken`, `verificaPermissoes('EDICAO')`  
- **Descrição:** Consulta talões dentro de um intervalo específico para manutenção.

### 5. **Consultar Transações por Loja**
**Apenas Perfis com Permissão de Edição**
- **Rota:** `GET /api/manutencaoTaloes/consultarPorLoja`  
- **Middleware:** `verificaToken`, `verificaPermissoes('EDICAO')`  
- **Descrição:** Consulta todas as transações de talões por loja para manutenção.

## Rotas de Lojas

### 1. **Consultar Todas as Lojas**
- **Rota:** `GET /api/lojas/consultarTodas`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Retorna uma lista com todas as lojas cadastradas no sistema.

### 2. **Cadastrar Nova Loja**
- **Rota:** `POST /api/lojas/cadastrar`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Cadastra uma nova loja no sistema.

### 3. **Editar Loja**
- **Rota:** `PUT /api/lojas/editar/:id_loja`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Edita os dados de uma loja específica com base no ID informado.

### 4. **Deletar Loja**
- **Rota:** `DELETE /api/lojas/deletar/:id_loja`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Remove uma loja específica do sistema com base no ID informado.

### 5. **Consultar Loja Específica**
- **Rota:** `GET /api/lojas/consultarLoja`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Retorna os detalhes de uma loja específica.

### 6. **Consultar Lojas por Intervalo**
- **Rota:** `GET /api/lojas/consultarIntervalo`  
- **Middleware:** `verificaToken`, `verificaPermissoes()`  
- **Descrição:** Retorna uma lista de lojas com base em um intervalo definido.

## Rotas relacionadas ao login

### 1. **Login**
   - **Rota:** `POST /api/auth/login`
   - **Descrição:** Esta rota é usada para realizar o login do usuário.
   - **Requisição:**
     - Corpo da requisição deve conter as credenciais do usuário (e.g., `email` e `senha`).
   - **Resposta:**
     - Se o login for bem-sucedido, retorna um token de autenticação.
     - Caso contrário, retorna um erro de autenticação.

### 2. **Logout**
   - **Rota:** `POST /api/auth/logout`
   - **Descrição:** Esta rota encerra a sessão do usuário autenticado, invalidando o token de sessão.
   - **Requisição:**
     - Corpo da requisição deve conter o token de autenticação ou ser feito através de um cabeçalho de autorização.
   - **Resposta:**
     - Retorna uma confirmação de que o logout foi realizado com sucesso.

### 3. **Esqueci a Senha**
   - **Rota:** `POST /api/auth/esqueciSenha`
   - **Descrição:** Esta rota é usada para iniciar o processo de recuperação de senha.
   - **Requisição:**
     - Corpo da requisição deve conter o e-mail associado à conta do usuário.
   - **Resposta:**
     - Retorna um link ou instruções para redefinir a senha, enviadas ao e-mail fornecido.

### 4. **Recuperar E-mail**
   - **Rota:** `POST /api/requisitarSenhaEMail`
   - **Descrição:** Esta rota permite que o usuário recupere o e-mail associado à sua conta.
   - **Requisição:**
     - Corpo da requisição deve conter dados suficientes para identificar a conta, como o CPF ou outro identificador.
   - **Resposta:**
     - Retorna o e-mail associado à conta ou uma mensagem de erro caso não seja possível recuperá-lo.


# Rotas do Estoque

### 1. **Consultar Todos os Estoques**
   - **Rota:** `GET /api/estoqueTaloes/consultarTodos`
   - **Descrição:** Consulta todos os itens no estoque.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Resposta:** Retorna todos os itens do estoque.

### 2. **Consultar Estoque Específico**
   - **Rota:** `GET /api/estoqueTaloes/consultarEstoqueEspecifico/:id_estoque`
   - **Descrição:** Consulta um estoque específico pelo seu ID.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Parâmetros:** `id_estoque` (ID do estoque a ser consultado).
   - **Resposta:** Retorna os dados do estoque específico.

### 3. **Cadastrar Novo Estoque**
   - **Rota:** `POST /api/estoqueTaloes/cadastrar`
   - **Descrição:** Cadastra um novo item no estoque.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Requisição:** Corpo da requisição com as informações do estoque a ser cadastrado.
   - **Resposta:** Retorna a confirmação de cadastro do item no estoque.

### 4. **Editar Estoque**
   - **Rota:** `PUT /api/estoqueTaloes/editar/:id_estoque`
   - **Descrição:** Edita os dados de um estoque específico.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Parâmetros:** `id_estoque` (ID do estoque a ser editado).
   - **Requisição:** Corpo da requisição com os dados atualizados do estoque.
   - **Resposta:** Retorna a confirmação de edição do estoque.

### 5. **Deletar Estoque**
   - **Rota:** `DELETE /api/estoqueTaloes/deletar/:id_estoque`
   - **Descrição:** Deleta um estoque específico.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Parâmetros:** `id_estoque` (ID do estoque a ser deletado).
   - **Resposta:** Retorna a confirmação de que o estoque foi deletado.

### 6. **Atualizar o Mínimo de Requisição**
   - **Rota:** `PATCH /api/estoqueTaloes/atualizarRecMin`
   - **Descrição:** Atualiza o valor mínimo de requisição do estoque.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Resposta:** Retorna a confirmação de atualização do valor mínimo de requisição.

### 7. **Consultar Estoque por Intervalo de Loja**
   - **Rota:** `GET /api/estoqueTaloes/consultarIntervalo`
   - **Descrição:** Consulta o estoque de uma loja dentro de um intervalo específico.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Resposta:** Retorna os itens de estoque dentro do intervalo da loja.

### 8. **Consultar Estoque da Loja**
   - **Rota:** `GET /api/estoqueTaloes/consultarLojaEstoque`
   - **Descrição:** Consulta o estoque de uma loja específica.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Resposta:** Retorna o estoque da loja específica.

### 9. **Consultar Estoque e Relatórios de Loja do Usuário**
   - **Rota:** `GET /api/estoqueTaloes/consultarLojaUsuario`
   - **Descrição:** Consulta o estoque e relatórios da loja associada ao usuário, dependendo das permissões (CONSULTAS, RELATÓRIOS, ATUALIZAR).
   - **Autenticação:** Requer token de autenticação, permissões adequadas e verificação da loja do usuário.
   - **Resposta:** Retorna o estoque da loja associada ao usuário.

### 10. **Editar Estoque de Loja do Usuário**
   - **Rota:** `PATCH /api/estoqueTaloes/editarEstoqueUsuario`
   - **Descrição:** Edita o estoque de uma loja associada ao usuário, com permissões para atualizar, consultar ou relatar.
   - **Autenticação:** Requer token de autenticação, permissões adequadas e verificação da loja do usuário.
   - **Resposta:** Retorna a confirmação de que o estoque foi atualizado.


# Rotas de Envio de Talão 

### 1. **Consultar Todos os Envios**
   - **Rota:** `GET /api/envioTaloes/consultarTodos`
   - **Descrição:** Consulta todos os envios de talões.
   - **Autenticação:** Requer token de autenticação e permissões adequadas (admin).
   - **Resposta:** Retorna todos os envios de talões.

### 2. **Cadastrar Novo Envio**
   - **Rota:** `POST /api/envioTaloes/cadastrar`
   - **Descrição:** Cadastra um novo envio de talões.
   - **Autenticação:** Requer token de autenticação e permissões adequadas (CRIACAO).
   - **Requisição:** Corpo da requisição com as informações do envio a ser cadastrado.
   - **Resposta:** Retorna a confirmação de cadastro do envio.

### 3. **Editar Envio**
   - **Rota:** `PATCH /api/envioTaloes/editar/:id_talao`
   - **Descrição:** Edita um envio de talões específico.
   - **Autenticação:** Requer token de autenticação e permissões adequadas (EDICAO).
   - **Parâmetros:** `id_talao` (ID do envio de talão a ser editado).
   - **Requisição:** Corpo da requisição com os dados atualizados do envio.
   - **Resposta:** Retorna a confirmação de edição do envio.

### 4. **Aprovar Solicitação de Envio**
   - **Rota:** `PATCH /api/envioTaloes/aprovarSolicitacao/:id_talao`
   - **Descrição:** Aprova uma solicitação de envio de talões.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Parâmetros:** `id_talao` (ID do talão a ser aprovado).
   - **Resposta:** Retorna a confirmação de que a solicitação foi aprovada.

### 5. **Deletar Envio**
   - **Rota:** `DELETE /api/envioTaloes/deletar/:id_talao`
   - **Descrição:** Deleta um envio de talões específico.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Parâmetros:** `id_talao` (ID do envio de talão a ser deletado).
   - **Resposta:** Retorna a confirmação de que o envio foi deletado.

### 6. **Consultar Envio por Intervalo**
   - **Rota:** `GET /api/envioTaloes/consultarIntervalo`
   - **Descrição:** Consulta os envios de talões dentro de um intervalo específico.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Resposta:** Retorna os envios dentro do intervalo solicitado.

### 7. **Consultar Envio por Intervalo de Loja**
   - **Rota:** `GET /api/envioTaloes/consultarLojaIntervalo`
   - **Descrição:** Consulta os envios de talões dentro de um intervalo específico por loja.
   - **Autenticação:** Requer token de autenticação e permissões adequadas.
   - **Resposta:** Retorna os envios dentro do intervalo de loja solicitado.

### 8. **Consultar Envio de Talões na Loja**
   - **Rota:** `GET /api/envioTaloes/consultarEnvioLoja`
   - **Descrição:** Consulta os envios de talões de uma loja específica, dependendo das permissões do usuário (CONSULTAS, RELATÓRIOS, SOLICITAÇÕES, CRIAÇÃO).
   - **Autenticação:** Requer token de autenticação, permissões adequadas e verificação da loja do usuário.
   - **Resposta:** Retorna os envios de talões da loja do usuário.

### 9. **Solicitação de Envio para a Loja**
   - **Rota:** `POST /api/envioTaloes/solicitacaoEnvioLoja`
   - **Descrição:** Permite a solicitação de envio de talões para uma loja específica.
   - **Autenticação:** Requer token de autenticação, permissões adequadas e verificação da loja do usuário.
   - **Requisição:** Corpo da requisição com os detalhes da solicitação de envio.
   - **Resposta:** Retorna a confirmação de que a solicitação de envio foi registrada.




## Observação
Todas as rotas protegidas por **`verificaToken`** exigem autenticação JWT, e as rotas que utilizam **`verificaPermissoes()`** só podem ser acessadas por usuários administradores.# oferte-e-ganhe-public

