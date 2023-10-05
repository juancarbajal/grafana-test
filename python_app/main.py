import os
from dotenv import load_dotenv
from flask import Flask, jsonify

load_dotenv()
app = Flask(__name__)
@app.route("/")
def ping():
    try:
        return jsonify(message="Test")
    except Exception:
        return jsonify(message="Error")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.getenv("PORT", 5002), debug=True)
