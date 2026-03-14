pipeline {
  agent any

  environment {
    IMAGE_BACKEND = "todo-backend"
    IMAGE_FRONTEND = "todo-frontend"
    REGISTRY       = "docker.io/quangdm006"
    KUBECONFIG     = "/var/jenkins_home/.kube/config"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        sh "docker build -t quangdm006/${IMAGE_BACKEND}:latest ./backend"
        sh "docker build -t quangdm006/${IMAGE_FRONTEND}:latest ./frontend"
      }
    }

    stage('Push') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-credentials',
          usernameVariable: 'USERNAME',
          passwordVariable: 'PASSWORD'
        )]) {
          sh 'docker login -u $USERNAME -p $PASSWORD'
          sh "docker push quangdm006/${IMAGE_BACKEND}:latest"
          sh "docker push quangdm006/${IMAGE_FRONTEND}:latest"
        }
      }
    }

    stage('Deploy') {
      steps {
        sh 'kubectl apply -f k8s/namespace.yaml'
        sh 'kubectl apply -f k8s/'
      }
    }
  }

  post {
    success {
     echo 'SUCCESSED' 
    }
    failure {
      echo 'FAILED'
    }
  }
}