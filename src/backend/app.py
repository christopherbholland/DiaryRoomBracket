from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/players', methods=['GET'])
def get_players():
    # This is a placeholder that we'll implement once we create data.json
    return jsonify({"message": "Players endpoint coming soon"})

@app.route('/bracket', methods=['GET'])
def get_bracket():
    return jsonify({"message": "Bracket endpoint coming soon"})

@app.route('/episodes', methods=['GET'])
def get_episodes():
    return jsonify({"message": "Episodes endpoint coming soon"})

if __name__ == '__main__':
    app.run(debug=True)