# Stage 1: Maven Build (Java 21)
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Lightweight JRE Runtime (512MB 무료 티어 최적화)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENV PORT=8085
ENV SPRING_PROFILES_ACTIVE=demo
ENV JAVA_OPTS="-Xmx320m -Xms128m -XX:+UseSerialGC -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8085

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8085} -jar app.jar"]
