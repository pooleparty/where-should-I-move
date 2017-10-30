DOCKER_IMAGE=node-webapp-starter

getGitSHA:
	$(eval GIT_SHA = $(shell git rev-parse --verify HEAD))

.PHONY: dockerBuild
dockerBuild: getGitSHA
	@docker build -t ${DOCKER_IMAGE}:${GIT_SHA} .

.PHONY: dockerStart
dockerStart: dockerBuild
	@docker run -p 3001:3001 ${DOCKER_IMAGE}:${GIT_SHA}

.PHONY: dockerBuildTest
dockerBuildTest: getGitSHA
	@docker build -t ${DOCKER_IMAGE}:test-${GIT_SHA} -f Dockerfile.test .

.PHONY: dockerTest
dockerTest: dockerBuildTest
	@docker run ${DOCKER_IMAGE}:test-${GIT_SHA}
