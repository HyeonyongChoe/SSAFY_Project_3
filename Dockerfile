# 1) Build 단계: Gradle + JDK 21
FROM gradle:8.6-jdk21 AS build
WORKDIR /home/app

# 의존성 캐시
COPY build.gradle settings.gradle gradlew ./
RUN chmod +x gradlew
COPY gradle gradle
RUN ./gradlew --no-daemon dependencies

# 소스 복사 후 JAR 빌드
COPY . .
RUN ./gradlew --no-daemon bootJar

# 2) Runtime 단계: 경량 JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# build 단계에서 생성된 JAR 복사 (와일드카드 사용)
COPY --from=build /home/app/build/libs/*.jar app.jar

# 애플리케이션 포트 (기본 8080)
EXPOSE 8080

# 컨테이너 시작 명령
ENTRYPOINT ["java","-jar","/app/app.jar"]

