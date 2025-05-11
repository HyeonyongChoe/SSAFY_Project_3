pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        // GitLab에서 현재 브랜치 코드를 가져옵니다.
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        // deployment 디렉터리로 이동해 Dockerfile로 이미지 빌드
        dir('/home/ubuntu/deployment') {
          sh 'docker-compose build'
        }
      }
    }

    stage('Deploy') {
      steps {
        // 빌드된 이미지를 띄웁니다 (재빌드 없이)
        dir('/home/ubuntu/deployment') {
          sh 'docker-compose up -d'
        }
      }
    }
  }

  post {
    success {
      echo "✔️ 배포 완료"
    }
    failure {
      echo "❌ 배포 중 오류 발생"
    }
  }
}
