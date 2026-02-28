# screenshot-backend
[ShareX](https://getsharex.com/) compatible backend for uploading media.

## Environment variables
The application is configured using environment variables.

| Variable      | Explanation                                             | Required |
| ------------- | ------------------------------------------------------- | -------- |
| BASE_URL      | Base URL used to build the final file URL               | **Yes**  |
| API_KEY       | Bcrypt-hashed secret used to authenticate uploads       | **Yes**  |
| MAX_BODY_SIZE | Max body size that the server accept (defaults to 50MB) | No       |

## Setting up the backend
- Get the latest code using `git clone https://github.com/csprl/screenshot-backend.git` or by downloading the [ZIP archive](https://github.com/csprl/screenshot-backend/archive/master.zip)
- Bulid code with `go build .`
- Set environment variables
- Run the `screenshot-backend` executable

## Running in Docker

```yaml
services:
  scrnbknd:
    image: ghcr.io/csprl/screenshot-backend:latest
    restart: unless-stopped
    environment:
      BASE_URL: https://google.com
      API_KEY: $$2a$$12$$4m/Ksa2y6CDC6teifCxZeeaawhkOfsDT.7ipaLPX5Dqtn55c5BUxy # escape $
    volumes:
      - /var/www/screenshots:/app/uploads
    ports:
      - "127.0.0.1:3000:3000"
```

## Configuring ShareX
- Download ShareX from [https://getsharex.com](https://getsharex.com/)
- Open `Destinations -> Custom uploader settings` from the right-click menu
- Press `Import -> From URL` and type `https://raw.githubusercontent.com/csprl/screenshot-backend/master/ShareX.sxcu`
- Modify *Request URL* and the *Authorization* value under *Headers*
- Finally select *screenshot-backend* under *Image uploader*, *Text uploader* and *File uploader*
- Test your new settings with the *Test* button. If successful you should see `URL: ...` in *Test result*
