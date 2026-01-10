# ---------- Build stage ----------
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml .
RUN mvn -B dependency:go-offline -DskipTests

COPY src ./src
RUN mvn -B package -DskipTests

# ---------- Runtime stage ----------
FROM eclipse-temurin:17-jre-jammy

RUN groupadd -r app && useradd -r -g app app
WORKDIR /app

ARG JAR=/workspace/target/*jar
COPY --from=build ${JAR} app.jar
RUN chown app:app app.jar

USER app

ENV PORT=8080 \
    JAVA_OPTS="-Dserver.port=${PORT} -Xms128m -Xmx384m -XX:MaxRAMPercentage=75 -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
