from flask import Flask

app = Flask(__name__)

# Import the routes from routes.py within the Composition directory
from Composition import routes
