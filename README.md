<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest



# 🚀 Sistema de Análisis de Documentos Empresariales con IA

Una plataforma web desarrollada en NestJS enfocada en emprendedores y el ODS de crecimiento económico, que automatiza el análisis de documentos comerciales y legales mediante inteligencia artificial y machine learning.

## 🎯 Propósito
Esta aplicación está diseñada para ayudar a emprendedores pequeños a:
- Analizar sus documentos de ventas y generar predicciones futuras
- Revisar contratos legales detectando cláusulas riesgosas
- Obtener insights accionables de sus datos empresariales
- Automatizar procesos de auditoría y análisis documental

## 🔧 Características Principales

**Módulo de Autenticación:** Sistema seguro con JWT y OAuth2 (Google), control de acceso basado en roles.

**Módulo de Carga de Archivos:** Subida eficiente de documentos con validación de formatos (PDF, DOCX, CSV, XLSX, TXT, JPG, PNG).

**Módulo de Extracción de Texto:** Procesamiento automático de contenido desde múltiples formatos de archivo.

**Módulo de Análisis con IA:** Integración con OpenAI GPT-3.5-turbo para análisis de contratos legales y datos de ventas.

**Módulo de Predicciones ML:** Integración con API externa en Python usando modelos XGBoost y Random Forest para predicciones de ventas.

**Módulo de Auditoría:** Sistema de revisión, anotación y aprobación/rechazo de documentos por auditores.

**Módulo de Pipeline de Procesamiento:** Orquesta el flujo completo de procesamiento de documentos para una experiencia fluida.

## 🛠️ Stack Tecnológico

**Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
**Autenticación:** JWT, OAuth2 (Google), Passport
**IA/ML:** OpenAI GPT-3.5-turbo, API Python con XGBoost y Random Forest
**Procesamiento de Archivos:** Multer, PDF-parse, Mammoth, XLSX, PapaParse
**Base de Datos:** PostgreSQL con Docker
**Validación:** Class-validator, Class-transformer
**Seguridad:** Bcrypt, Guards personalizados, Decoradores de autorización

## 🚀 Instalación y Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Configurar las variables necesarias:
# - DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
# - JWT_SECRET
# - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
# - HOST_API
# - OPENAI_API_KEY
```

3. Ejecutar con Docker Compose:
```bash
docker-compose up -d
```

## 🏃‍♂️ Comandos de Desarrollo

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Linting
npm run lint

# Tests
npm run test
```

## 📱 Capturas de Pantalla

![Ios APP](/images/swift-version.jpeg)
![IOS APP](/images/swift-version-2.jpeg)

*Aplicación móvil nativa para iOS*

## 🏗️ Arquitectura

La aplicación sigue una arquitectura modular de NestJS con los siguientes módulos principales:

- **AuthModule:** Gestión de usuarios y autenticación
- **FilesModule:** Manejo de archivos y validación
- **TextExtractionModule:** Extracción de texto de documentos
- **AiModule:** Análisis con IA y predicciones ML
- **AuditRecordModule:** Sistema de auditoría
- **ProcessingPipelineModule:** Orquestación del flujo completo

## 🎯 Impacto

Esta plataforma contribuye al **Objetivo de Desarrollo Sostenible 8: Trabajo decente y crecimiento económico** al:

- Democratizar el acceso a herramientas de análisis empresarial para emprendedores
- Automatizar procesos que tradicionalmente requieren consultores costosos
- Proporcionar insights accionables basados en datos reales
- Facilitar la toma de decisiones informadas para el crecimiento empresarial

## 📄 Licencia

Este proyecto es privado y está desarrollado con fines educativos y de demostración.

