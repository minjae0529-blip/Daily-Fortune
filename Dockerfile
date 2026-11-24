# Stage 1: Maven Build (Maven 3.9 + Java 21 내장 이미지 사용 -> mvnw wget 429 오류 원천 차단)
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY pom.xml ./
COPY src ./src
RUN mvn -B -DskipTests clean package

# Stage 2: Lightweight JRE Runtime (512MB 무료 티어 최적화)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENV PORT=8085
ENV SPRING_PROFILES_ACTIVE=demo
ENV JAVA_OPTS="-Xmx320m -Xms128m -XX:+UseSerialGC -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8085

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8085} -jar app.jar"]
