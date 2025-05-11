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

    stage('Prepare .env') {
      steps {
        // 호스트 /home/ubuntu/deployment/.env 를 워크스페이스로 복사
        sh 'cp /home/ubuntu/deployment/.env ${WORKSPACE}/.env'
      }
    }

    stage('Build Docker Image') {
      steps {
        // 워크스페이스(컨테이너 내부 /var/jenkins_home/workspace/…)를
        // 빌드 컨텍스트로 지정
        sh """
          docker-compose \
            -f ${COMPOSE_FILE} \
            --project-directory ${WORKSPACE} \
            build
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
            up -d
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
