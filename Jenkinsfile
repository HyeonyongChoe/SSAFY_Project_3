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
        agent { docker { image 'node:18' } }   // 여기서만 Node 컨테이너 사용
        steps {
            dir('frontend') {
                sh 'npm ci'
                sh 'npm run build'
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
