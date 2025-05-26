pipeline {
  agent any

  environment {
    BRANCH       = "${env.BRANCH_NAME}"
    COMPOSE_FILE = '/home/ubuntu/deployment/docker-compose.yml'
  }

  stages {
    stage('Clean Workspace') {
        steps {
          cleanWs()
        }
    }

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build JAR') {
      steps {
        dir('backend') {
          sh 'chmod +x gradlew'
          sh './gradlew clean bootJar'
          // 빌드된 jar가 backend/build/libs/*.jar 에 생성됨
          sh 'cp build/libs/*.jar ${WORKSPACE}/backend/app.jar'
        }
      }
    }

    stage('Prepare .env') {
      steps {
        sh 'cp /home/ubuntu/deployment/.env ${WORKSPACE}/backend/.env'
      }
    }

// docker-compose.yml의 fastapi 서비스에 .env 파일이 있으므로
// docker compose가 그 .env 파일을 못 찾는 오류를 해결하기 위해 fastapi/.env 파일을 jenkins 내부로 복사
    stage('Prepare FastAPI .env') {
        steps {
          sh '''
            mkdir -p ${WORKSPACE}/backend/fastapi
            cp /home/ubuntu/deployment/fastapi/.env ${WORKSPACE}/backend/fastapi/.env
          '''
        }
      }

    stage('Build Docker Image') {
      steps {
        sh """
          docker-compose \
            -f ${COMPOSE_FILE} \
            --project-directory ${WORKSPACE}/backend \
            build spring-boot
        """
      }
    }

    stage('Clean Previous') {
      steps {
        sh """
          docker rm -f spring-boot || true
          docker network prune -f || true
        """
      }
    }

    stage('Deploy Backend') {
      steps {
        sh '''
          cd /home/ubuntu/deployment
          docker compose up -d --force-recreate --remove-orphans spring-boot
         '''
      }
    }
  }

  post {
    success {
      echo "✔️ [${BRANCH}] 배포 성공"
    }
    failure {
      echo "❌ [${BRANCH}] 배포 실패"
    }
  }
}
