
#GOOS=js GOARCH=wasm go build -o main.wasm main.go


GOOS=js GOARCH=wasm \
go build \
-ldflags "-X main.key=SpeedsterIsBest! -X main.iv=SpeedsterIsBest!" \
-o main.wasm
