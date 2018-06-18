# screenshot-backend
[ShareX](https://getsharex.com/) compatible backend for uploading images and text.

## Setting up the backend
 - Get the latest code using `git clone https://github.com/csprl/screenshot-backend.git` or by downloading the [ZIP archive](https://github.com/csprl/screenshot-backend/archive/master.zip).
 - Install dependencies with `npm install`
 - Copy *config.json.example* to *config.json* and modify the settings to your linking. Note that *baseurl* must end with a `/` and that *uploaddir* must exist.
 - Create a *users.json* file like *users.json.example*. *Dirs* can either be a string or an object (where the key is a [MIME](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) type and value is directory to upload to).
 - Start backend with `node main.js`.

## Configuring clients
 - Download ShareX from [https://getsharex.com](https://getsharex.com/).
 - Open `Destinations -> Destination settings` from the right-click menu.
 - Scroll all the way down to *Custom uploaders* and press `Import -> From file` and select the ShareX.sxcu file.
 - Modify *Request URL* and the *Token* value under *Headers*.
 - Finally set *screenshot-backend* under *Image uploader*, *Text uploader* and *File uploader*.
 - Test your new settings with the *Test* button. If successful you should see `URL: ...` in *Test result*.
