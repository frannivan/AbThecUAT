# Build stage
FROM eclipse-temurin:11-jdk-focal AS build
WORKDIR /app

# Copy ALL files from the backend directory to the container
# (Considering Root Directory is set to 'backend' in Render)
COPY . .

# Ensure mvnw has execution permissions and correct line endings
RUN tr -d '\r' < mvnw > mvnw.sh && mv mvnw.sh mvnw && chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:11-jre-focal
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
