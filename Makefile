NODE = node
COMPILER = $(NODE) --max-old-space-size=4096 node_modules/.bin/decentraland-compiler
ifneq ($(CI), true)
LOCAL_ARG = --local --verbose --diagnostics
endif

test:
	node_modules/.bin/jest --detectOpenHandles --colors --runInBand $(TESTARGS)

test-watch:
	node_modules/.bin/jest --detectOpenHandles --colors --runInBand --watch $(TESTARGS)

build:
	$(COMPILER) build.json

watch:
	$(COMPILER) build.json --watch

build-ts:
	./node_modules/.bin/tsc -p tsconfig.json

.PHONY: build test
