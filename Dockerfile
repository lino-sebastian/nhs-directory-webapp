FROM openjdk:8-alpine
ADD target/nhs-directory-webapp.jar nhs-directory-webapp.jar
EXPOSE 9000
ENTRYPOINT ["java","-jar","nhs-directory-webapp.jar"]
