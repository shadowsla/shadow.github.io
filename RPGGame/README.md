Shadow's Tower — Web Client

To serve the web version locally and test in Chrome:

1. Open a terminal and change into the web folder:

```bash
cd RPGGame/web
```

2. Start a simple HTTP server (Python 3):

```bash
python3 -m http.server 8000
```

3. Open this URL in Chrome on the same machine:

http://localhost:8000

Notes:
- Serving files over HTTP avoids browser restrictions when loading local assets.
- If you serve from a remote container, make sure port 8000 is forwarded or use the container-host mapping that your environment provides.
