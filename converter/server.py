from http.server import HTTPServer, SimpleHTTPRequestHandler
import cgi
import scipy.io
import tempfile


def get_signature(file):
    file.seek(0)
    return file.read(8)


class RequestHandler(SimpleHTTPRequestHandler):
    # To test method from current directory
    # curl -i -F "files[]=@./samples/A1957.mat" "http://localhost:8002"
    # To save file
    # curl -F "files[]=@./samples/A1957.mat" "http://localhost:8002" > out
    def do_POST(self):
        content_type, pdict = cgi.parse_header(self.headers['Content-type'])
        pdict = {
            'boundary': bytes(pdict['boundary'], 'utf-8'),
            'CONTENT-LENGTH': int(self.headers['Content-Length']),
        }
        content = cgi.parse_multipart(self.rfile, pdict)
        files = content['files[]']

        if len(files) > 1:
            return

        with tempfile.TemporaryFile() as file:
            file.write(content['files[]'][0])
            signature = get_signature(file)

            if signature == bytes('MATLAB 5', 'utf-8'):
                try:
                    mat = scipy.io.loadmat(file)
                    sex = 1 if mat['ECG'][0][0][0][0] == 'Male' else 0
                    age = mat['ECG'][0][0][1][0][0].item()
                    signals = mat['ECG'][0][0][2]

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/octet-stream')
                    self.end_headers()
                    self.wfile.write(sex.to_bytes(1, 'little'))
                    self.wfile.write(age.to_bytes(1, 'little'))
                    self.wfile.write(signals.tobytes())
                except Exception:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(bytes('wrong matlab file format\n', 'utf-8'))
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(bytes('unknown file format\n', 'utf-8'))


def run(server_class=HTTPServer, handler_class=RequestHandler):
    server_address = ('', 8002)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()


if __name__ == '__main__':
    run()
