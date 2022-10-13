from distutils.command.upload import upload
from os import curdir
from flask import Flask, render_template, request, jsonify
import mysql.connector
from numpy import product
import handler_keys
import pandas as pd

class DbUploader():
    def __init__(self) -> None:
        self.db_connection = None
        self.db_cursor = None

    def close_db_connection(self):
        self.db_connection.close()

    def open_db_connection(self):
        self.db_connection = mysql.connector.connect(host=handler_keys.DB_HOST, user=handler_keys.DB_USER, passwd=handler_keys.DB_PASSWORD, database=handler_keys.DB_NAME)
        self.db_cursor = self.db_connection.cursor()

    def parse_query_result(self, result_columns):
        df= pd.DataFrame(columns = result_columns)
        for register in self.db_cursor:
            data = {}
            for i in range(len(result_columns)):
                data[result_columns[i]] = register[i]
            new_row = pd.DataFrame(data, index=[0])
            df = pd.concat([df, new_row]).reset_index(drop=True)
        return df

    def handle_constant_message(self, message):
        self.open_db_connection()

        fetch_stock_query = """SELECT Product.name, Inventory.stock
        FROM Inventory 
        INNER JOIN Product ON Inventory.id_product=Product.id 
        WHERE Inventory.id_store = '{store_id}' and Product.name = '{product_name}'
        """.format(store_id = 1, product_name='Coca-cola de lata 355ml')
        self.db_cursor.execute(fetch_stock_query)
        result = self.parse_query_result(result_columns=["product_name", "product_stock"])
        #self.db_connection.commit()
        print("\ncursor type:")
        print(type(self.db_cursor))
        print("\ncursor:")
        print(self.db_cursor)
        print("\nresult:")
        print(result)

        self.close_db_connection()

app = Flask(__name__)
app.secret_key = handler_keys.FLASK_APP_KEY

recieved_data = {}
uploader = DbUploader()
uploader.handle_constant_message("str")

@app.route('/', methods = ['GET'])
def home():
	return render_template('home_template.html')

@app.route('/constant_messages', methods=['GET', 'POST'])
def constant_messages():
    content = request.json
    print("========================================================")
    print("printing data fetched on server:")
    print(content)
    print("")
    return jsonify({})

@app.route('/initaialization_messages', methods=['GET', 'POST'])
def initialization_messages():
    pass

if __name__ == '__main__':
	app.run(host = '0.0.0.0',port = 7000, debug = True)