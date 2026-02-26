# English Learning Platform - Backend Dockerfile
# Multi-stage build for Spring Boot application with MySQL

# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy Maven wrapper and POM files
COPY mvnw .
COPY .mvn .mvn .
COPY pom.xml .
COPY boot/pom.xml boot/

# Download dependencies
RUN mvn dependency:go-offline -B

# Build the application
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-focal

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

# Copy JAR file from builder stage
COPY --from=builder /app/boot/target/*.jar app.jar

# Create non-root user for security
RUN groupadd -r spring && useradd -r -g spring springuser
RUN chown -R springuser:springuser /app

# Switch to non-root user
USER springuser

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM options
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:+UseStringDeduplication"

# Start application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
