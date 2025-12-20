# Build stage
FROM eclipse-temurin:11-jdk-focal AS build
WORKDIR /app

# Copy Maven wrapper files
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Give execution permission to the wrapper
RUN chmod +x mvnw

# Download dependencies (this layer will be cached)
RUN ./mvnw dependency:go-offline

# Copy source code and build
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:11-jre-focal
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
