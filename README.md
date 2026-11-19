# 🤝 Colabs+

## 👨‍👩‍👧‍👦 Integrantes do Grupo

* **Gustavo Araujo da Silva** – RM: 566526
* **[Nome do integrante]** – RM: [RM]
* **[Nome do integrante]** – RM: [RM]

---

## 🔗 Repositório do Projeto

GitHub:

[INSERIR LINK DO REPOSITÓRIO]

---

## 🔗 Vídeo Demonstrativo

YouTube:

[INSERIR LINK DO VÍDEO]

---

## 🔗 Link para a publicação do App

[INSERIR LINK DA PUBLICAÇÃO]

---

# 📌 Visão Geral do Projeto

O **Colabs+** é um aplicativo mobile desenvolvido em **React Native, Expo e TypeScript**, com o objetivo de aproximar cidadãos e instituições por meio da tecnologia, facilitando a organização e a realização de doações.

A plataforma permite que cidadãos divulguem necessidades de ajuda, encontrem solicitações de doação próximas e contribuam com pessoas e instituições que precisam de apoio.

O aplicativo possui dois principais perfis de utilização:

* 👤 **Cidadão**
* 🏢 **Instituição**

O cidadão pode cadastrar solicitações de ajuda, visualizar oportunidades de doação, aceitar solicitações de outras pessoas e acompanhar suas próprias contribuições.

A instituição pode divulgar necessidades, disponibilizar pontos de coleta e acompanhar as doações relacionadas ao seu ponto de coleta.

Dessa forma, o Colabs+ busca tornar o processo de doação mais acessível, organizado e transparente.

---

# 🎯 Objetivo

O Colabs+ tem como objetivo facilitar a conexão entre quem precisa de ajuda e quem deseja contribuir, centralizando solicitações e informações sobre doações em uma única plataforma.

Por meio do aplicativo, os usuários podem:

* cadastrar solicitações de ajuda;
* visualizar solicitações de doação da comunidade;
* encontrar oportunidades de contribuição;
* aceitar solicitações de ajuda;
* acompanhar o andamento das doações;
* marcar doações como concluídas;
* visualizar o histórico de solicitações;
* consultar pontos de coleta;
* localizar instituições próximas;
* acompanhar as doações vinculadas às instituições;
* registrar avaliações sobre as doações realizadas.

---

# 🚀 Tecnologias Utilizadas

## 📱 Desenvolvimento Mobile

* React Native
* Expo
* TypeScript

## 🧭 Navegação

* Expo Router
* Navegação baseada em arquivos e diretórios
* Parâmetros de navegação entre telas

## 🔄 Gerenciamento de Dados

* TanStack Query
* React Query
* Hooks personalizados
* Query Cache
* Invalidação de queries
* useQuery
* useMutation
* useQueryClient

## 💾 Armazenamento Local

* AsyncStorage

Utilizado para armazenamento local de informações da sessão, como o token de autenticação e os dados necessários para identificar o usuário.

## 🎨 Interface

* React Native StyleSheet
* Flexbox
* SafeAreaView
* React Native Vector Icons
* Ionicons
* Componentes personalizados

## 🗺️ Mapas e Localização

* React Native Maps
* Expo Location

Utilizados para apresentar pontos de coleta e auxiliar na localização de instituições e oportunidades de doação.

## 🌐 Comunicação com a API

* API REST
* Requisições HTTP
* JSON
* Autenticação JWT

---

# ⚙️ Arquitetura da Aplicação Mobile

O aplicativo utiliza uma organização baseada na separação de responsabilidades entre telas, hooks, services e comunicação com a API.

```text
Telas (Screens)
      ↓
Hooks
      ↓
Services
      ↓
API REST
      ↓
Back-end
```

### Screens

Responsáveis pela interface e interação com os usuários.

### Hooks

Responsáveis pelo gerenciamento das consultas e alterações de dados utilizando TanStack Query.

### Services

Responsáveis por centralizar as chamadas aos endpoints da API.

### API

Centraliza as requisições HTTP, o envio de headers e a autenticação necessária para acessar os recursos protegidos.

---

# 🔐 Autenticação

O Colabs+ possui autenticação para os diferentes perfis de utilização da plataforma.

O fluxo permite que cidadãos e responsáveis por instituições acessem funcionalidades específicas de acordo com suas permissões.

A autenticação utiliza **JWT (JSON Web Token)**.

Após o login:

```text
Login
  ↓
API
  ↓
Autenticação
  ↓
JWT
  ↓
Armazenamento local
  ↓
Acesso às funcionalidades
```

Nas requisições autenticadas, o aplicativo envia o token no header:

```text
Authorization: Bearer <token>
```

Dessa forma, o back-end consegue identificar o usuário e aplicar as regras de autorização correspondentes.

---

# 👤 Fluxo do Cidadão

O cidadão possui acesso às funcionalidades de criação, acompanhamento e realização de doações.

## 📝 Cadastro e Login

O usuário pode realizar seu cadastro e acessar a plataforma por meio de suas credenciais.

Após a autenticação, o aplicativo identifica seu perfil e direciona o usuário para as funcionalidades correspondentes.

## 🏠 Tela Inicial

A tela inicial apresenta as principais funcionalidades disponíveis para o cidadão, permitindo acessar as solicitações da comunidade e acompanhar suas atividades.

## 📢 Solicitações de Ajuda

O cidadão pode cadastrar solicitações para divulgar necessidades de doação.

As solicitações podem conter informações como:

* título;
* descrição;
* categoria;
* itens necessários;
* quantidade;
* nível de urgência;
* localização;
* ponto de coleta, quando aplicável.

Essas informações permitem que outros usuários compreendam a necessidade e encontrem oportunidades de contribuição.

## 🤝 Doações da Comunidade

O aplicativo permite visualizar solicitações de ajuda publicadas por outros cidadãos e instituições.

O usuário pode consultar os detalhes da solicitação e aceitar contribuir com a necessidade apresentada.

O processo permite acompanhar o andamento da doação conforme seu status.

## 📦 Minhas Doações

O cidadão consegue visualizar as solicitações que aceitou atender.

Essa área permite acompanhar as doações em andamento e consultar seus respectivos detalhes.

## 📋 Minhas Solicitações

O usuário também consegue acompanhar as solicitações de ajuda que cadastrou.

A tela apresenta informações sobre o andamento de cada solicitação, permitindo acompanhar seu status e consultar os registros.

## ⭐ Avaliação da Doação

Após a conclusão de uma doação, o cidadão responsável pela solicitação pode registrar uma avaliação em texto sobre a experiência.

Essa funcionalidade permite compartilhar observações sobre a contribuição recebida, auxiliando na transparência e no acompanhamento das ações realizadas.

---

# 🏢 Fluxo da Instituição

O perfil de instituição possui funcionalidades voltadas ao gerenciamento de pontos de coleta e acompanhamento das doações relacionadas à organização.

## 🔐 Acesso da Instituição

O responsável pela instituição realiza a autenticação e acessa as funcionalidades disponibilizadas para seu perfil.

## 🏠 Área da Instituição

A área da instituição permite acessar as principais informações relacionadas às suas atividades de recebimento de doações.

## 📍 Pontos de Coleta

O aplicativo trabalha com pontos de coleta vinculados às instituições.

Esses pontos permitem organizar o direcionamento das doações e facilitar a identificação dos locais onde os itens podem ser entregues.

## 🗺️ Mapa de Pontos de Coleta

O aplicativo utiliza recursos de mapas e localização para apresentar pontos de coleta.

O usuário pode visualizar os locais disponíveis e consultar informações relacionadas à localização.

## 📋 Histórico de Doações

A instituição possui acesso ao histórico de solicitações vinculadas ao seu ponto de coleta.

A tela permite acompanhar registros e visualizar informações como:

* solicitante;
* categoria da doação;
* itens solicitados;
* status;
* data do registro;
* avaliação textual do cidadão, quando disponível.

Essa funcionalidade facilita o acompanhamento das doações recebidas e das solicitações relacionadas à instituição.

---

# 🔄 Gerenciamento dos Status das Doações

As solicitações possuem diferentes estados para representar o andamento do processo.

Os status utilizados no aplicativo são:

| Status | Descrição |
|---|---|
| `PENDING` | Solicitação aguardando atendimento |
| `IN_PROGRESS` | Doação em andamento |
| `APPROVED` | Solicitação aprovada |
| `REJECTED` | Solicitação rejeitada |
| `DELIVERED` | Doação concluída |
| `CANCELLED` | Solicitação cancelada |

A utilização desses estados permite acompanhar a evolução das solicitações e organizar as informações apresentadas nas telas.

---

# 🔄 TanStack Query

O projeto utiliza **TanStack Query** para gerenciar as requisições à API e manter os dados das telas atualizados.

Entre os recursos utilizados estão:

* `useQuery`;
* `useMutation`;
* `useQueryClient`;
* `invalidateQueries`.

### Consultas

O `useQuery` é utilizado para buscar informações da API.

Exemplo:

```tsx
useQuery({
  queryKey: ["myDonations"],
  queryFn: getMyDonations,
});
```

### Alterações

O `useMutation` é utilizado para executar operações que modificam os dados, como criar, aceitar ou concluir uma doação.

### Atualização do Cache

Após uma operação, o aplicativo pode invalidar as queries relacionadas:

```tsx
queryClient.invalidateQueries({
  queryKey: ["myDonations"],
});
```

Assim, os dados são atualizados e as telas conseguem apresentar as informações mais recentes.

---

# 🔄 Comunicação com a API

A comunicação entre o aplicativo mobile e o back-end é realizada por meio de uma API REST.

O projeto utiliza uma função centralizada:

```text
apiFetch()
```

Ela é responsável por:

* realizar requisições HTTP;
* configurar headers;
* enviar o token JWT;
* serializar dados em JSON;
* interpretar respostas;
* tratar erros HTTP.

As requisições utilizam o formato:

```text
Content-Type: application/json
```

A separação entre Services e Hooks permite manter a comunicação com o back-end organizada e facilitar a reutilização das operações.

---

# ℹ️ Sobre o App

O aplicativo possui uma tela chamada **Sobre o App**, destinada a apresentar informações gerais sobre o Colabs+.

Nessa tela, são apresentados:

* nome do aplicativo;
* breve descrição da proposta;
* informações sobre o projeto;
* hash do commit de referência.

## Hash do Commit de Referência

O hash permite identificar exatamente a versão do código utilizada como referência para a publicação ou entrega do aplicativo.

```text
Commit de referência:

[INSERIR HASH DO COMMIT]
```

A informação deve corresponder ao commit utilizado na versão de referência do aplicativo, permitindo identificar a versão do código-fonte relacionada à entrega.

---

# 🧭 Navegação entre Telas

A navegação do aplicativo utiliza **Expo Router**, que organiza as rotas a partir da estrutura de arquivos e diretórios do projeto.

Esse modelo permite separar as funcionalidades de acordo com os fluxos de utilização e facilitar a manutenção das rotas.

Exemplo conceitual:

```text
Autenticação
    ↓
Identificação do perfil
    ↓
Área do Cidadão ou Instituição
    ↓
Funcionalidades específicas
```

---

# 📱 Principais Funcionalidades

## 👤 Cidadão

* Cadastro e autenticação
* Visualização de solicitações da comunidade
* Criação de solicitações de ajuda
* Consulta de detalhes das solicitações
* Aceitação de solicitações
* Acompanhamento das próprias doações
* Acompanhamento das próprias solicitações
* Conclusão de doações
* Avaliação textual de doações

## 🏢 Instituição

* Cadastro e autenticação
* Acesso às funcionalidades da instituição
* Gerenciamento e consulta de pontos de coleta
* Visualização de pontos no mapa
* Acompanhamento do histórico de doações
* Consulta às informações das solicitações vinculadas

---

# ▶️ Como Executar o Aplicativo

## 1. Clonar o projeto

```bash
git clone [INSERIR LINK DO REPOSITÓRIO]
```

## 2. Entrar na pasta

```bash
cd [NOME DA PASTA DO PROJETO]
```

## 3. Instalar as dependências

```bash
npm install
```

## 4. Configurar a API

Configure o endereço da API de acordo com o ambiente utilizado.

Verifique também as variáveis de ambiente necessárias para a execução do projeto.

## 5. Iniciar o Expo

```bash
npx expo start
```

Após iniciar, o aplicativo poderá ser executado em um ambiente compatível com Expo, conforme a configuração do projeto.

---

# 🎓 Projeto Acadêmico

O **Colabs+** é um projeto acadêmico desenvolvido para a **FIAP**, com foco na criação de uma solução mobile que utiliza tecnologia para aproximar cidadãos e instituições, facilitando a organização e a realização de doações.

O projeto aplica conceitos de desenvolvimento mobile, consumo de APIs REST, autenticação, gerenciamento de estado remoto, navegação e integração com recursos de localização.

Mais do que uma aplicação para registrar doações, o Colabs+ busca incentivar a colaboração e tornar mais simples a conexão entre pessoas dispostas a ajudar e aqueles que precisam de apoio.