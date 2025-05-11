pipeline {
  agent any

  environment {
    BRANCH       = ${env.BRANCH_NAME}
    COMPOSE_FILE = '/home/ubuntu/deployment/docker-compose.yml'
  }

  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        // 워크스페이스(컨테이너 내부 /var/jenkins_home/workspace/…)를
        // 빌드 컨텍스트로 지정합니다. dir() 불필요!
        sh """
          docker-compose \
            -f ${COMPOSE_FILE} \
            --project-directory ${env.WORKSPACE} \
            -p ${BRANCH} \
            build
        """
      }
    }

    stage('Deploy Container') {
      steps {
        sh """
          docker-compose \
            -f ${COMPOSE_FILE} \
            --project-directory ${env.WORKSPACE} \
            -p ${BRANCH} \
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
