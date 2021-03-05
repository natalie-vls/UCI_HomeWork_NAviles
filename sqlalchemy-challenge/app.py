# dependecies
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


from flask import Flask, jsonify

# Database Setup
engine = create_engine('sqlite:///../../sqlalchemy-challenge/Resources/hawaii.sqlite')
Base = automap_base()
Base.prepare(engine, reflect=True)

Measurement = Base.classes.measurement
Station = Base.classes.station

session = Session(bind = engine)

# Flask setup
app = Flask(__name__)

@app.route('/')
def index():
    print('Aloha! You made it!')
    return (
        f'Aloha!<br>'
        
        f'Here are the routes: <br>'
        f'/api/v1.0/precipitation<br>'
        f'/api/v1.0/stations<br>'
        f'/api/v1.0/tobs<br><br><br>'
)

@app.route('/api/v1.0/precipitation')
def precipitation():
    print('Request received.')
    return (
        f'Aloha!<br>'
)

@app.route('/api/v1.0/stations')
def stations():
    print('Request received.')
    return (
        f'Aloha!<br>'
)

@app.route('/api/v1.0/tobs')
def tabs():
    print('Request received.')
    return (
        f'Aloha!<br>'
)
# @app.route('/api/v1.0/<start>')
#def start():

# @app.route('/api/v1.0/<end>')
#def end():    

if __name__ == '__main__':
    app.run(debug=True)