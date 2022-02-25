# Build stage
FROM golang:alpine as builder

WORKDIR /build/
COPY . .

RUN go build -ldflags="-s -w" -o app .

# Runtime stage
FROM alpine

WORKDIR /app/
COPY --from=builder /build/app .

CMD ["./app"]
