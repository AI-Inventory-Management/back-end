from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

app.secret_key = "Confidential_secret"

recieved_data = {}

@app.route('/', methods = ['GET'])
def home():
	return render_template('home_template.html')

@app.route('/constant_messages', methods=['GET', 'POST'])
def constant_messages():
    content = request.json
    print("printing data fetched on server:")
    print(content['main_data'])
    return jsonify({})

@app.route('/initaialization_messages', methods=['GET', 'POST'])
def initialization_messages():
    pass

if __name__ == '__main__':
	app.run(host = '0.0.0.0',port = 7000, debug = True)