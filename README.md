<h1 align="center">🚚 Deliveries API</h1>

<p align="center">Back-end de uma aplicação de entregas</p>

<p align="center">
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-executando-a-aplicação">Executando a aplicação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licença">Licença</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#autor">Autor</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=407076&labelColor=000000">
</p>

<br />

<p align="center">
  <img alt="Imagem descritiva do projeto" src="./.github/project.png">
</p>

## 💻 Projeto

Nesta aplicação, temos de um lado o cliente que irá se cadastrar e cadastrar itens para serem entregues, e do outro, o entregador que poderá pegar determinada entrega para ser realizada.

Utilizei este projeto para praticar conceitos como:

- DDD
- Repository Pattern
- Testes unitários
- Testes E2E
- SOLID
- Clean Code
- Clean Architecture

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [Vitest](https://vitest.dev/)
- [Prisma](https://prisma.io/)
- [Docker](https://docker.com/)
- [Postgres](https://www.postgresql.org/)
- [JWT](https://jwt.io/)

## 🎲 Executando a aplicação

1. Clone este repositório
2. Instale as dependências

   ```bash
   npm install
   ```

3. Crie uma cópia do arquivo `.env.example` e renomeie para `.env`
4. Preencha todas as variáveis do arquivo `.env`, que foi copiado no passo anterior

   > As variáveis `JWT_PRIVATE_KEY` e `JWT_PUBLIC_KEY` precisam ser preenchidas respectivamente com as chaves RSA privada e pública, criptografadas em base64.
   > Se tiver dúvidas de como gerar estas chaves, pesquise por `generate RSA key online` e `base64 encode` para gerar as chaves sem muitas dificuldades.

   > OBS.: Em ambiente de produção não é aconselhável utilizar as chaves que foram geradas online.

5. Inicie o container do banco de dados

   ```bash
   docker-compose up -d
   ```

6. Crie todas as tabelas no banco de dados

   ```bash
   npx prisma migrate dev
   ```

7. Inicie o servidor

   ```bash
    npm run start:dev
   ```

## 📝 Licença

Esse projeto está sob a licença MIT.

## Autor

<img
  style="border-radius: 50%;"
  src="https://avatars.githubusercontent.com/jordane-chaves"
  width="100px;"
  title="Foto de Jordane Chaves"
  alt="Foto de Jordane Chaves"
/>
<br>

Feito com 💜 por Jordane Chaves
