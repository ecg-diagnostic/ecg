from http.server import HTTPServer, SimpleHTTPRequestHandler
import json


class RequestHandler(SimpleHTTPRequestHandler):
    # TODO: Remove this method in development
    # Temp method, you can test it with
    # browser address http://localhost:8001
    # or through curl -i "http://localhost:8001"
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        response = {
            "predictions": [0, 1, 0],
        }
        self.wfile.write(bytes(json.dumps(response) + '\n', 'UTF-8'))

    # Our main method, you can test it with
    # curl -i -X POST "http://localhost:8001" -d "ecg from user in model format"
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        response = {
            "predictions": [0, 1, 0],
        }
        self.wfile.write(bytes(json.dumps(response) + '\n', 'UTF-8'))


def run(server_class=HTTPServer, handler_class=RequestHandler):
    server_address = ('', 8001)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()


if __name__ == '__main__':
    run()
