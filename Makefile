BUCKET := pottery-tracker
CLOUDFRONTDIST := E2PKC1PO6XSCPK

.PHONY: build

all: build deploy
full: build prunes3 deploy cache

build:
	npm run build-ignore-ts

deploy:
	aws s3 cp --recursive dist s3://$(BUCKET)

cache:
	aws cloudfront create-invalidation --distribution-id $(CLOUDFRONTDIST) --paths "/index.html"

prunes3:
	aws s3 rm --recursive s3://$(BUCKET)/assets