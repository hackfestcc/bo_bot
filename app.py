# -*- coding: utf-8 -*-
#!/usr/bin/env pythonimport urllib
import json
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask import request
from flask import make_response
from flask import jsonify
from datetime import date, datetime
from decimal import Decimal
from flask_cors import CORS, cross_origin
import requests


# Flask app should start in global layout
app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@192.168.191.104/bobot'
cors = CORS(app, resources={r"/*": {"origins": "*"}})
db = SQLAlchemy(app)
migrate = Migrate(app, db)
#app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']

def create_app():
    app = Flask(__name__)
    db.init_app(app)
    return app

@app.route('/getOcorrencias', methods=['GET'])
@cross_origin()
def getOcorrencias():
     
    data = []
    for u in db.session.query(Ocorrencia).all():
        data.append(row2dict(u))
    
    return json.dumps(data)

@app.route('/getOcorrenciasPorTipo', methods=['GET'])
@cross_origin()
def getOcorrenciasPorTipo():

    req = request.args.get('tipo')
     
    data = []
    for u in db.session.query(Ocorrencia).filter_by(tipo=req):
        data.append(row2dict(u))
    
    return json.dumps(data)
    

def row2dict(row): 
    return dict((col, getattr(row, col)) for col in row.__table__.columns.keys())

def alchemyencoder(obj):
    """JSON encoder function for SQLAlchemy special classes."""
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    elif isinstance(obj, decimal.Decimal):
        return float(obj)
    
@app.route('/setOcorrencia', methods=['POST'])
def setOcorrencia():
    
    req = request.get_json(silent=True, force=True)

    ocorrencia = Ocorrencia();
    contexto = getContexto(req)

    ocorrencia.tipo = getTipo(contexto)
    ocorrencia.data = getData(contexto)  
    onde = getMapsAdress(contexto)
    ocorrencia.turno = getTurno(contexto)
    ocorrencia.descricao = contexto['descricao']
    ocorrencia.motivo = contexto['motivo']

    if(len(onde) != 1):

        resposta = "Desculpe, não consegui encontrar resultados para esse endereço, nos informe um endereço mais detalhado, por exemplo, 'Rua Augusta, São Paulo'"

        res = json.dumps({
            "speech": resposta,
            "displayText" : resposta,
            "source" : "",
            "contextOut" : [{'name': 'onde', 'lifespan' : 2, 'paramaters': {}}]
            }, indent=4)


    else:
        ocorrencia.latitude = onde[0]['geometry']['location']['lat']
        ocorrencia.longitude = onde[0]['geometry']['location']['lng']

        db.session.add(ocorrencia)
        db.session.commit()    

        resposta = "Seus dados foram salvos com sucesso, obrigado pela contribuição e sentimos muito pelo infortúnio"
        res = json.dumps({
            "speech": resposta,
            "displayText" : resposta,
            "source" : "",
            }, indent=4)

    r = make_response(res)
    r.headers['Content-Type'] = 'application/json'
    return r


def getContexto(req):
    
    if req.get("result") == None:
        return {}

    dados = req.get('result')
    return dados['contexts'][0]['parameters']

def getTipo(contexto):

    tipo = contexto['violencia']

    if tipo == "violência sexual":
        return "vio_sex"
    elif tipo == "homicídio":
        return "homicidio"

    return tipo

def getData(contexto):

    quando = contexto['quando']
    hoje = date.today()

    if quando == 'hoje':
        return str(hoje)
    elif quando == 'ontem':
        return str(date.fromordinal(hoje.toordinal()-1))    

    elif quando == 'semana passada':
        return str(date.fromordinal(hoje.toordinal()-8))

    elif quando == 'mes passado':
        return str(date.fromordinal(hoje.toordinal()-45))

def getMapsAdress(contexto):

    onde = contexto['local_ocorrencia'].replace(' ', '+')
    key = "AIzaSyAZlmj6WXcngnHLGxZh9wgUeFwLPlzQNJM"

    response = requests.get(
        "https://maps.googleapis.com/maps/api/place/textsearch/json?"+
        "query="+onde+
        "&key="+key)

    req = response.json()

    print(req)
    results = req.get('results')

    return results

def getTurno(contexto):

    turno = contexto['turno']

    if turno == 'manhã':
        return "manha"

    return turno

class Ocorrencia(db.Model):
    
    __tablename__ = 'tb_ocorrencias'

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(100), nullable=False)
    data = db.Column(db.String(100), nullable=False)
    turno = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.String(100), nullable=False)
    longitude = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(255), nullable=True)
    motivo = db.Column(db.String(255), nullable=True)



if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port, host='0.0.0.0')