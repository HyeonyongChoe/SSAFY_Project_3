pipeline {
  agent any

  environment {
    BRANCH       = "${env.BRANCH_NAME}"
    COMPOSE_FILE = '/home/ubuntu/deployment/docker-compose.yml'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build JAR') {
      steps {
        sh 'chmod +x gradlew'
        sh './gradlew clean bootJar'
      }
    }

    stage('Copy JAR to deploy dir') {
      steps {
        sh 'cp build/libs/*.jar ${WORKSPACE}/app.jar'
      }
    }

    stage('Prepare .env') {
      steps {
        sh 'cp /home/ubuntu/deployment/.env ${WORKSPACE}/.env'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh """
          docker-compose \
            -f ${COMPOSE_FILE} \
            --project-directory ${WORKSPACE} \
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

    stage('Deploy Container') {
      steps {
        sh """
          docker-compose \
            -f ${COMPOSE_FILE} \
            --project-directory ${WORKSPACE} \
            up -d spring-boot
        """
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
