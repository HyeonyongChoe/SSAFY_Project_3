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
                    // node:20 이미지를 받아 임시 컨테이너 안에서 실행
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
                cp    frontend/server.conf $DEPLOY_DIR/frontend/server.conf

                chmod -R a+rX $DEPLOY_DIR/frontend/dist
            '''
        }
    }

    stage('Install Compose Plugin') {
        steps {
            sh '''
                # docker compose 플러그인 설치 (이미 설치돼 있으면 넘어감)
                if ! docker compose version >/dev/null 2>&1; then
                    apt-get update
                    apt-get install -y docker-compose-plugin
                fi
            '''
        }
    }

    
    stage('Reload Nginx') {
        steps {
            sh '''
                cd /home/ubuntu/deployment
                docker-compose up -d --force-recreate react-nginx
            '''
        }
    }
  }
}
