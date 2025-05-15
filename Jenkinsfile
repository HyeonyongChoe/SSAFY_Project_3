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

    stage('Sync to EC2') {
        steps {
            sh '''
            mkdir -p $DEPLOY_DIR/frontend
            cp -R frontend/dist $DEPLOY_DIR/frontend/dist
            cp frontend/nginx.conf $DEPLOY_DIR/frontend/nginx.conf
            '''
        }
    }
    
    stage('Reload Nginx') {
        steps {
            sh 'docker exec react-nginx nginx -s reload'
        }
    }
  }
}
