## B.O ChatBot

É um ChatBot/Robô para Facebook que servirá para colher informaçes sobre alguns tipos de violência e com isso gerar
um mapa da violência de diversos lugares.

Com o B.O Bot o usuário não precisará acessar um site ou baixar um aplicativo para poder informar a violência. 
O B.O Bot torna o acesso mais simples e natural já que basta conversar com o Bot no aplicativo do Facebook como se estivesse
conversando com um humano.

https://www.facebook.com/hackfestbobot/

## Configuração do Webservice

* Fazer clone do projeto do GitHub
* Baixar Python 2.7
* [Flask](http://flask.pocoo.org/) - Baixar o Flask Framework e suas dependências
* [SQLAlchemy](https://www.sqlalchemy.org/) - Baixar o SQLAlchemy]
* No arquivo *app.py* editar a linha *app.config['SQLALCHEMY_DATABASE_URI']* e informar a URL do banco.
* Subir a aplicação em algum servidor ou dentro da pasta bo_bot rodar o servidor com *python app.py*

## Configuração da Api.ai
* Acessar o website api.ai
* [bobot_Api.Ai](https://github.com/g13ydson/bo_bot/raw/master/bobot.zip) - Baixar o agente para importação no api.ai
* Criar um agente e importar o arquivo .zip
* No menu Fulfillment da api.ai inserir a url do webservice. Por exemplo: http://bobot.herokuapp.com/setOcorrencia
* Dentro da pasta *bo_bot/scripts/app.js* na função *getMarkers* substituir a URL para por exemplo: http://bobot.herokuapp.com/getOcorrencias


## Licença

GNU GENERAL PUBLIC LICENSE
 Version 3, 29 June 2007