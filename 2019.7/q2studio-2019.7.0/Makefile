.PHONY: all lint test test-cov install dev clean distclean

all: node_modules

lint:
	q2lint --disable-install-requires-check
	flake8

test: all
	npm test

test-cov: all
	npm test

install: all
	npm run build

node_modules:
	npm install

dev: all
	pip install -e .

clean: distclean
	rm -rf node_modules

distclean: ;
