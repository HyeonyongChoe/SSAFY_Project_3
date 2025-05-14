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
                sh """
                    docker run --rm -v ${env.WORKSPACE}/frontend:/app -w /app node:18 sh -c "npm install && npm run build"
                """
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
