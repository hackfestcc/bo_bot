# -*- coding: utf-8 -*-
#!/usr/bin/env pythonimport urllib
import json
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request
from flask import make_response

# Flask app should start in global layout
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/bobot.db'
db = SQLAlchemy(app)
#app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
#db = SQLAlchemy(app)


@app.route('/webhook', methods=['POST'])
def webhook():
    req = request.get_json(silent=True, force=True)

    print("Request:")
    print(json.dumps(req, indent=4))

    res = makeWebhookResult(req)

    res = json.dumps(res, indent=4)
    print(res)
    r = make_response(res)
    r.headers['Content-Type'] = 'application/json'
    return r

def makeWebhookResult(req):
    
    if req.get("result").get("action") != "action":
        return {}
    result = req.get("result")
    parameters = result.get("parameters")
    
    resposta = "Resposta"

    return {
        "speech": resposta,
        "displayText": resposta,
        #"data": {},
        # "contextOut": [],
        "source": "apiai-onlinestore-shipping"
    }


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port, host='0.0.0.0')
