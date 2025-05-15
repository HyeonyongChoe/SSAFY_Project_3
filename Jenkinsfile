pipeline {
  agent any
  environment {
    DEPLOY_DIR = '/home/ubuntu/deployment'
  }
  stages {
    stage('Checkout') {
        steps { 
            checkout scm 
        }
    }

    stage('Build Static') {
        steps {
            dir('frontend') {
                script {
                    // node:18 이미지를 받아 임시 컨테이너 안에서 실행
                    docker.image('node:20').inside('-u 0:0') {
                        sh 'npm ci'
                        sh 'npm run build'
                    }
                }
            }
        }
    }

    
    stage('Reload Nginx') {
        steps {
            sh 'docker exec react-nginx nginx -s reload'
        }
    }
  }
}
