# 베이스 이미지
FROM node:18-alpine

# 작업 디렉터리 설정
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 현재 디렉토리의 모든 파일을 도커 컨테이너의 워킹 디렉토리에 복사 및 빌드
COPY . .
RUN npm run build

# serve 패키지를 컨테이너 이미지에 전역 설치해,
# 컨테이너 내부 어디서든 serve 명령어를 바로 쓸 수 있도록 함
RUN npm install -g serve

# 컨테이너 내부 포트 선언
EXPOSE 5000

# build된 정적 파일을 5000번 포트로 서빙. dist 폴더에 배포용 정적 파일들이 들어 있다.
CMD ["serve", "-s", "dist", "-l", "5000"]
