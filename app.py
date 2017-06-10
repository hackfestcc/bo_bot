# -*- coding: utf-8 -*-
#!/usr/bin/env pythonimport urllib
import json
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask import request
from flask import make_response
from datetime import date, datetime
from decimal import Decimal
import requests


# Flask app should start in global layout
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@192.168.191.104/bobot'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
#app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']

def create_app():
    app = Flask(__name__)
    db.init_app(app)
    return app

@app.route('/getOcorrencia', methods=['POST'])
def getOcorrencia():
    
    req = request.get_json(silent=True, force=True)

    ocorrencia = Ocorrencia();
    contexto = getContexto(req)

    print(json.dumps(contexto, indent = 4))

    ocorrencia.tipo = contexto['violencia']
    ocorrencia.data = getData(contexto)  
    onde = getMapsAdress(contexto)
    ocorrencia.turno = contexto['turno']

    if(len(onde) != 1):

        resposta = "Desculpe, não consegui encontrar resultados, você pode informar um endereço mais detalhado"

        res = json.dumps({
            "speech": resposta,
            "displayText" : resposta,
            "source" : "",
            "contextOut" : [{'name': 'onde', 'lifespan' : 2, 'paramaters': {}}]
            }, indent=4)


    else:
        ocorrencia.latitude = float(onde[0]['geometry']['location']['lat'])
        ocorrencia.longitude = float(onde[0]['geometry']['location']['lng'])

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

def getData(contexto):

    quando = contexto['quando']
    hoje = date.today()

    if quando == 'hoje':
        return hoje
    elif quando == 'ontem':
        return date.fromordinal(hoje.toordinal()-1)    

    elif quando == 'semana passada':
        return date.fromordinal(hoje.toordinal()-8)

    elif quando == 'mes passado':
        return date.fromordinal(hoje.toordinal()-45)

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

class Ocorrencia(db.Model):
    
    __tablename__ = 'tb_ocorrencias'

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(100), nullable=False)
    data = db.Column(db.DateTime, nullable=False)
    turno = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)



if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port, host='0.0.0.0')