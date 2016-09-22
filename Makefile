ifndef STAGE
	STAGE = prod
endif

deps:
	npm install .

test:
	jshint lib

deploy:
	serverless deploy --stage $(STAGE) --region us-east-1

remove:
	serverless remove --stage $(STAGE) --region us-east-1

start:
	serverless offline --stage $(STAGE) --region us-east-1

tools:
	npm install jshint serverless -g

.PHONY: deps deploy remove start test tools
