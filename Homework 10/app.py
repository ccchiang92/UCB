from flask import Flask, jsonify
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


app = Flask(__name__)
engine = create_engine("sqlite:///Resources/hawaii.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)
Measurement = Base.classes.measurement
Station = Base.classes.station


# Routes
@app.route("/")
def home ():
    # Return all routes
    return (
        f"Hawaii Weather API<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/start_date<br/>"
        f"/api/v1.0/start_date/end_date<br/>"
    )

# Return a jsonify dictionary of the last 12 months of precipitation data
@app.route("/api/v1.0/precipitation")
def precip():
    session = Session(engine)
    last_point = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
    year_ago = (dt.date(*list(map(int, last_point[0].split('-')))) - dt.timedelta(days=365)).strftime("%Y-%m-%d")
    precip_last_12 = session.query(Measurement.date, Measurement.prcp).filter(Measurement.date>year_ago).all()
    precip_dic={}
    for row in precip_last_12:
        precip_dic[row[0]]=row[1]
    return jsonify(precip_dic)

# Return a list of unique stations
@app.route("/api/v1.0/stations")
def station():
    session = Session(engine)
    stations = session.query(Station.station).distinct().all()
    return jsonify(stations)


# rubric and readme has different description of this, this is the readme version
# Return the tobs data and date for the last year, in a jsonified list form 
@app.route("/api/v1.0/tobs")
def tobs():
    session = Session(engine)
    last_point = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
    year_ago = (dt.date(*list(map(int, last_point[0].split('-')))) - dt.timedelta(days=365)).strftime("%Y-%m-%d")
    tobs_last_12 = session.query(Measurement.date, Measurement.tobs).filter(Measurement.date>year_ago).all()
    return jsonify(tobs_last_12)

# Returns min, max, average temperature after the start date, checks for date format
# Only works with iso format 'yyyy-mm-dd'
@app.route("/api/v1.0/<start>")
def start(start):
    session = Session(engine)
    try:
        check_format=dt.date.fromisoformat(start)
        return jsonify(session.query(func.min(Measurement.tobs), func.max(Measurement.tobs), func.avg(
        Measurement.tobs)).filter(Measurement.date >= start).all())
    except ValueError:
        return 'There is an issue with input dates, please put in the form of yyyy-mm-dd'

# Returns min, max, average temperature after the start date and before the end date
# Checks for date format, only works with iso format 'yyyy-mm-dd'
@app.route("/api/v1.0/<start>/<end>")
def start_end(start,end):
    session = Session(engine)
    try:
        check_format=dt.date.fromisoformat(start)
        check_format=dt.date.fromisoformat(end)
        return jsonify(session.query(func.min(Measurement.tobs), func.max(Measurement.tobs), func.avg(
        Measurement.tobs)).filter(Measurement.date >= start).filter(Measurement.date <= end).all())
    except ValueError:
        return 'There is an issue with input dates, please put in the form of yyyy-mm-dd'

if __name__ == "__main__":
    app.run(debug=True)
