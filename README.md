<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest



# 📄Document Audit Workflow System

A modular NestJS-based backend application designed to automate and streamline the processing, analysis, and auditing of various document types. This project demonstrates clean architecture, microservice-friendly modular design

## 🔧 Key Features
Authentication Module: Secure access control with role-based permissions.

File Upload & Validation Module: Efficient document upload with format validation and error checking.

Text Extraction Module: Parses text from PDFs, DOCX, CSV, Excel, and more.

AI Analysis Module: Leverages the OpenAI API to perform advanced natural language processing on parsed content.

Auditing Module: Allows auditors to review, annotate, and approve/reject documents.

Workflow Module: Orchestrates the end-to-end processing pipeline for a seamless document audit experience.

## Project setup
1. Install ```npm install```


2. Copy ```env.example``` and set the variables


## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Frontend Preview

![Dashboard](/images/landing.png)
![Phones](/images/phones.png)

