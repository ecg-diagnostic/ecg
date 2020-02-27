from http.server import HTTPServer, SimpleHTTPRequestHandler
import cgi
import tempfile


def get_signature(file):
    file.seek(0)
    return file.read(8)


class RequestHandler(SimpleHTTPRequestHandler):
    # To test method from current directory
    # curl -i -F "files[]=@./samples/A1957.mat" "http://localhost:8002"
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
                self.send_response(200)
                self.end_headers()
                self.wfile.write(bytes('common ecg format\n', 'utf-8'))
                return
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(bytes('unknown file format\n', 'utf-8'))
                return


def run(server_class=HTTPServer, handler_class=RequestHandler):
    server_address = ('', 8002)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()


if __name__ == '__main__':
    run()
