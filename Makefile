GO=go
# output binary name
OUT=navaz.me


exec:
	$(GO) build -o $(OUT)
	./$(OUT)

build:
	$(GO) build -o $(OUT)

clean:
	rm $(OUT)
