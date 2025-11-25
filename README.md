# Site irado de manutenção de equipamentos

## Projeto para conclusão da matéria de web II

> O projeto é uma aplicação web designada para suprir a necessidade do controle de serviços de uma empresa de manutenção de equipamentos.

---

### Tecnologias:

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)

---

---

Mapa

---

---

licença

---

application-secrets.properties (arquivo do back (requirements)):

# application-secrets.properties

spring.mail.username=

# Chave de app para gmail (tem que ser email de mais de 1 ano desde sua criação para funcionar)

# Link para criar: https://myaccount.google.com/apppasswords

# Cada senha de aplicativo é única e pode ser revogada a qualquer momento.

# Não funciona se a conta não tiver 2FA ativado.

spring.mail.password=
spring.datasource.password=
jwt.secret=

---

# Front e back tem que ter certs ssl

no back: /resources/keystore.p12
no front: /certs/localhost+2-key.pem e /certs/localhost+2.pem
