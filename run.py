import flask

app = flask.Flask(__name__)

@app.route('/')
def index():
    return flask.render_template('index.html')

app.run(host="0.0.0.0", port="8082")