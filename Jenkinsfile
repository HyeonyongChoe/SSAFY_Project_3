pipeline {
  agent any
  environment {
    DEPLOY_DIR = '/home/ubuntu/deployment'
  }
  stages {
    stage('Checkout') {
        steps { 
            checkout scm
            sh 'echo "Checked out commit: $(git rev-parse HEAD)"'
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
                # 1) 기존 정적 파일 완전 삭제
                rm -rf $DEPLOY_DIR/frontend/dist
                rm -rf $DEPLOY_DIR/frontend/server.conf

                # 2) 디렉터리 재생성
                mkdir -p $DEPLOY_DIR/frontend

                # 3) 최신 파일 복사
                cp -R frontend/dist $DEPLOY_DIR/frontend/dist
                ##### cp    frontend/nginx.conf $DEPLOY_DIR/frontend/nginx.conf
                cp    frontend/server.conf $DEPLOY_DIR/frontend/server.conf

                chmod -R a+rX $DEPLOY_DIR/frontend/dist
            '''
        }
    }

    
    stage('Reload Nginx') {
        steps {
            sh 'docker compose up -d --force-recreate react-nginx'
        }
    }
  }
}
