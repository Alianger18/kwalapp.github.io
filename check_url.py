import urllib.request

for version in ['11.0.2', '10.14.1', '10.14.0']:
    try:
        urllib.request.urlopen(f'https://www.gstatic.com/firebasejs/{version}/firebase-app.js')
        print(f"{version} OK")
    except Exception as e:
        print(f"{version} {e}")
