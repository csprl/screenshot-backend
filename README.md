# screenshot-backend
[ShareX](https://getsharex.com/) compatible backend for uploading media.

## Setting up the backend
 - Get the latest code using `git clone https://github.com/csprl/screenshot-backend.git` or by downloading the [ZIP archive](https://github.com/csprl/screenshot-backend/archive/master.zip).
 - Bulid code with `go build -ldflags="-s -w" .`
 - Copy *config.json.example* to *config.json* and modify the settings to your liking. Note that *baseUrl* should not end with a `/`. If a user prefix is a folder, it _should_ end with a `/` and be pre-created.
 - Run the `screenshot-backend` executable.

## Configuring clients
 - Download ShareX from [https://getsharex.com](https://getsharex.com/).
 - Open `Destinations -> Custom uploader settings` from the right-click menu.
 - Press `Import -> From URL` and type `https://raw.githubusercontent.com/csprl/screenshot-backend/master/ShareX.sxcu`.
 - Modify *Request URL* and the *Authorization* value under *Headers*.
 - Finally select *screenshot-backend* under *Image uploader*, *Text uploader* and *File uploader*.
 - Test your new settings with the *Test* button. If successful you should see `URL: ...` in *Test result*.
