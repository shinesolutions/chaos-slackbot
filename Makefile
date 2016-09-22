ifndef STAGE
	STAGE = prod
endif

deps:
	npm install .

deploy:
	serverless deploy --stage $(STAGE) --region us-east-1

remove:
	serverless remove --stage $(STAGE) --region us-east-1

.PHONY: deps deploy remove
