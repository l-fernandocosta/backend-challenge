# Correção de Desafios 🚀

Este projeto implementa um serviço para gerenciar a correção de desafios enviados pelos alunos, utilizando **Apache Kafka** para comunicação entre serviços e **GraphQL** para a interface de API.

## Arquitetura

### Domain-Driven Design (DDD)
Optei por utilizar **DDD (Domain-Driven Design)** como base arquitetural para manter a lógica de negócios bem estruturada, modular e alinhada com as necessidades do domínio. A aplicação foi dividida em camadas, cada uma com responsabilidades claras:

1. **Domain**  
   Contém a lógica de negócio pura, representada por **Entidades**, **Agregados**, **Value Objects** e **Domínio de Serviços**. Esta camada é independente de qualquer framework ou biblioteca externa.

2. **Application**  
   Inclui os **Casos de Uso**, responsáveis por orquestrar as operações do domínio, além dos **Serviços de Aplicação** para integração com outras camadas.

3. **Infrastructure**  
   Abrange todos os detalhes técnicos, como conexão com o banco de dados (via **Prisma**), integração com o Apache Kafka e transporte GraphQL.
---

### Decisões de Arquitetura

#### 1. **Value Objects**
Os **Value Objects** desempenham um papel essencial na modelagem do domínio. Eles garantem:
- **Imutabilidade**: Os valores não podem ser alterados após serem criados.
- **Validação embutida**: Valores inválidos são evitados na criação do objeto.
- **Encapsulamento de comportamento**: A lógica de negócios relacionada ao valor está no próprio objeto.

**Exemplo**:  
Para o campo `repositoryUrl`, foi criado um **Value Object** que valida se a URL fornecida é um repositório válido do GitHub.

```
export class RepositoryUrl {
  private readonly url: string;

  constructor(url: string) {
    if (!this.isValidGithubUrl(url)) {
      throw new Error('Invalid GitHub repository URL');
    }
    this.url = url;
  }

  private isValidGithubUrl(url: string): boolean {
    const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
    return githubRegex.test(url);
  }

  get value(): string {
    return this.url;
  }
}
```

Essa abordagem reduz a chance de erros ao manter a validação centralizada.



--------------

### 2. **Comunicação via Apache Kafka** 
Optei pelo Apache Kafka para comunicação assíncrona com o serviço de correção, garantindo escalabilidade e alta disponibilidade.

Producer: Publica submissões para o tópico challenge.correction.
Consumer: Escuta as correções feitas pelo serviço e atualiza o status e a nota no banco de dados.
Essa abordagem desacopla os serviços e melhora a resiliência do sistema.

### 3. **GraphQL API**
A interface com os consumidores é feita via **GraphQL**, que oferece flexibilidade para consultas e mutações. Isso permite que os clientes consumam apenas os dados necessários, reduzindo a sobrecarga.

Exemplo de esquema:

```graphql
type Submission {
  id: ID!
  challengeId: ID!
  repositoryUrl: RepositoryURL!
  createdAt: DateTime!
  grade: Grade
  status: Status!
}

scalar RepositoryURL
scalar Grade
scalar Status

type Query {
  submissions(challengeId: ID, status: String): [Submission!]!
}

type Mutation {
  submitChallenge(challengeId: ID!, repositoryUrl: RepositoryURL!): Submission!
}

```

### *Custom Scalar Types* 
Foram adicionados Custom Scalar Types para representar objetos de valor (Value Objects), como:

- **RepositoryURL**: Um tipo de dado que encapsula a URL do repositório, validando se a URL fornecida é um repositório válido do GitHub.
- **Grade**: Um tipo de dado que valida a nota atribuída à submissão, garantindo que o valor esteja dentro de um intervalo aceitável.
- **Status**: Um tipo de dado que representa o status da submissão, podendo ser Pending, Error ou Done.

Esses tipos personalizados ajudam a encapsular a lógica de validação e garantem que os dados manipulados no GraphQL sejam consistentes com as regras de negócio definidas no domínio.


### 4. **Modelos de Dados e Armazenamento**

O armazenamento de dados é realizado utilizando o **PostgreSQL**, com uma estrutura relacional para as tabelas `challenges` e `submissions`. A arquitetura de banco foi desenhada para suportar operações eficientes e consultas rápidas, com ênfase em escalabilidade e performance.

#### Desafios
A tabela de **challenges** armazena informações sobre os desafios enviados pelos alunos. Cada desafio possui os atributos de **titulo**, **descricao** e **data de criação**. Além disso, foram adicionados **índices** nas colunas **`title`** e **`description`** para melhorar o desempenho de consultas, principalmente em buscas que envolvem essas propriedades.

#### Submissões
A tabela de **submissions** armazena as submissões feitas pelos alunos, associadas aos desafios. Cada submissão contém informações como o **id do desafio**, **link para o repositório**, **status**, **nota** e a **data de criação**.

#### Índices
Para otimizar as consultas, foram criados **índices** nas colunas **`title`** e **`description`** da tabela **`challenges`**. Isso permite realizar buscas rápidas e eficientes com base nesses campos, melhorando o tempo de resposta da API quando usuários buscam por desafios específicos.


### 5. **Testes**
Implementamos testes unitários e de integração para garantir a qualidade do sistema:

- Unitários: Cobrem Value Objects e lógica de domínio.
- Integração: Validam o fluxo Kafka → Banco de Dados → GraphQL.

----

## Como Executar o Projeto

Para executar o projeto, siga os passos abaixo:

### 1. Instalar o **Node Version Manager (NVM)**

O **NVM** (Node Version Manager) é uma ferramenta útil para gerenciar múltiplas versões do Node.js no seu ambiente. Isso facilita o uso de diferentes versões de Node.js para diferentes projetos.

#### Como instalar o NVM:

**Linux / macOS:**

1. Abra o terminal e execute o comando para instalar o NVM:
   
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  ``` 

2. Clonar o repositório
  ```bash
    git clone https://github.com/seu-usuario/nome-do-repositorio.git
    cd nome-do-repositorio
  ```
3. Dentro da pasta /packages/challenge-manager execute o comando:

  ```bash
    nvm install && npm i -g pnpm
  ```
4. Instalar as dependencias
  ```bash
    pnpm install 
  ```

5. Executar servicos
  ```bash
    docker-compose up -d
  ```

6. Rodar o projeto
  ```bash
    pnpm start:dev
  ```

> Não esqueca de rodar o servico corrections.



-----

### Por que usar o NVM no projeto?
Optei por utilizar o NVM no projeto para garantir que todos os desenvolvedores(as) e ambientes de produção estejam utilizando a mesma versão do Node.js. Isso ajuda a evitar incompatibilidades entre versões e garante um ambiente de desenvolvimento consistente.

### Benefícios do NVM:
Facilidade de Gestão de Versões: Permite alternar rapidamente entre diferentes versões do Node.js.
Ambientes Consistentes: Garante que todos os desenvolvedores e a pipeline de CI/CD utilizem a mesma versão do Node.js.
Compatibilidade com Dependências: Algumas dependências podem ter requisitos específicos de versão do Node.js, e o NVM ajuda a gerenciar essas necessidades sem esforço.

### Como Utilizar o NVM
Instalar uma versão específica do Node.js
Para instalar uma versão específica do Node.js, execute:

- Instalar uma versão específica
```bash
nvm install 18.17.0
``` 

- Para usar uma versão instalada do Node.js:
```bash
nvm use 18.17.0
```

- Verificar a versão do Node.js ativa
```bash
node -v
```
- Listar versões instaladas
```bash
nvm ls
```