from distutils.command.upload import upload
from os import curdir
from typing import Dict
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

    def stock_df_to_dict(self, df):
        new_dict = {}
        for i in df.index:
            new_dict[df["product_name"][i]] = df["product_stock"][i]
        print("prev stock dict is {d}".format(d=new_dict))

    def update_store_products(self, prev, curr):
        # check if new products exist on the new input and if
        # they do we create a new inventory table for each
        products_only_in_curr = [ product for product in curr.keys() if product not in prev.keys() ]
        for product in products_only_in_curr:
            print("creating new inventary registers")
            pass # replace for inventary creation

    def update_store_stock(self, prev, curr):
        for product in curr.keys():
            prev_vs_curr_stock = prev[product] - curr[product]
            if prev_vs_curr_stock > 0:
                # update inventory
                print("updating inventory for {p}".format(p=product))
                #register sell
                print("registering a sell for {p}".format(p=product))
                pass
            elif prev_vs_curr_stock < 0:
                # update inventory
                print("updating inventory for {p}".format(p=product))
                pass
            

    def fetch_prev_stock(self, store_id):
        self.open_db_connection()
        fetch_stock_query = """SELECT Product.name, Inventory.stock
        FROM Inventory 
        INNER JOIN Product ON Inventory.id_product=Product.id 
        WHERE Inventory.id_store = '{store_id}'
        """.format(store_id = store_id)
        self.db_cursor.execute(fetch_stock_query)
        result = self.parse_query_result(result_columns=["product_name", "product_stock"])
        result = self.stock_df_to_dict(result)
        self.close_db_connection()
        return result

    def handle_constant_message(self, message):
        prev_stock = self.fetch_prev_stock(store_id=message['store_id'])
        self.update_store_products(prev_stock, message['content_count'])
        prev_stock = self.fetch_prev_stock(store_id=message['store_id'])
        self.update_store_stock(prev_stock, message['content_count'])

app = Flask(__name__)
app.secret_key = handler_keys.FLASK_APP_KEY

uploader = DbUploader()

@app.route('/', methods = ['GET'])
def home():
	return render_template('home_template.html')

@app.route('/constant_messages', methods=['GET', 'POST'])
def constant_messages():
    content = request.json
    uploader.handle_constant_message(content)
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