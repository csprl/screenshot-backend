# Build stage
FROM golang:1.26-alpine3.23 as builder

WORKDIR /build
COPY . .

RUN go build -ldflags="-s -w" -o screenshot-backend .

# Runtime stage
FROM alpine:3.23

WORKDIR /app
COPY --from=builder /build/screenshot-backend .

ENTRYPOINT ["/app/screenshot-backend"]
