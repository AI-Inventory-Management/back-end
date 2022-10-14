from distutils.command.upload import upload
from math import prod
from os import curdir
from pickletools import long1
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
        self.db_cursor.close()
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

    def two_cols_df_to_dict(self, df, key_column_name, value_column_name):
        new_dict = {}
        for i in df.index:
            new_dict[df[key_column_name][i]] = df[value_column_name][i]        
        return new_dict

    def create_field_equals_or_chain_query(self, field:str, values_to_equal:list):
        """
        This method generates a chain of ORs to query a field with several values,
        i.e. 'Inventory.id_product = val1 OR Inventory.id_product = val2 OR Inventory.id_product = val3' 
        """
        result = ""
        values_len = len(values_to_equal)
        for i in range(values_len):
            result += field + "=" + "'{v}'".format(v=values_to_equal[i])
            if i < values_len-1:
                result += " OR "
        return result

    def fetch_product_ids(self, products:list)->dict:
        products_query = self.create_field_equals_or_chain_query("Product.name", products)
        product_ids_query = "SELECT Product.name, Product.id FROM Product WHERE {q}".format(q = products_query)

        self.open_db_connection()
        self.db_cursor.execute(product_ids_query)
        product_ids_result = self.parse_query_result(result_columns=["product_name", "product_id"])
        product_ids_result = self.two_cols_df_to_dict(product_ids_result, "product_name", "product_id")
        self.close_db_connection()
        return product_ids_result

    def update_store_products(self, prev:dict, curr:dict, id_store:str):
        # check if new products exist on the new input and if
        # they do we create a new inventory table for each with defaul max stock 
        # and min stock values
        products_only_in_curr = [ product for product in curr.keys() if product not in prev.keys() ]
        if len(products_only_in_curr) == 0:
            return
        # if there are products in current stock that are not in prev stock we fetch the product ids for each        
        product_ids_result = self.fetch_product_ids(products_only_in_curr)

        # Once we fetch the product ids of products only in current stock we create a new inventary for each of this products

        for product in products_only_in_curr:
            print("creating new inventary register for {p}".format(p=product))
            inventary_creation_query = "INSERT INTO Inventory(id_product, id_store, stock) VALUES ({product_id}, {store_id}, {s}) ".format(product_id=product_ids_result[product], store_id=id_store, s=curr[product])
            
            self.open_db_connection()
            self.db_cursor.execute(inventary_creation_query)
            self.db_connection.commit()
            self.close_db_connection()            

    def update_inventory(self, store_id, product_id, new_stock):
        inventory_update_query = "UPDATE Inventory SET Inventory.stock={new_stock} WHERE Inventory.id_store={store_id} AND Inventory.id_product={product_id}".format(new_stock=new_stock, store_id=store_id, product_id=product_id)
        self.open_db_connection()
        self.db_cursor.execute(inventory_update_query)
        self.db_connection.commit()
        self.close_db_connection()

    def register_sale(self, product_id, store_id, timestamp):
        register_sale_query = "INSERT INTO Sale(id_product, id_store, timestamp) VALUES ({product_id}, {store_id}, {t})".format(product_id=product_id, store_id=store_id, t=timestamp)
        self.open_db_connection()
        self.db_cursor.execute(register_sale_query)
        self.db_connection.commit()
        self.close_db_connection()

    def update_store_stock(self, prev, curr, id_store:str, timestamp:str):
        current_products = list(curr.keys())
        product_ids = self.fetch_product_ids(current_products)

        for product in current_products:
            prev_vs_curr_stock = prev[product] - curr[product]
            product_id = product_ids[product]
            product_stock = curr[product]
            if prev_vs_curr_stock > 0:
                # update inventory
                print("updating inventory for {p}".format(p=product))
                self.update_inventory(store_id=id_store, product_id=product_id, new_stock=product_stock)
                #register sale
                print("registering a sell for {p}".format(p=product))
                self.register_sale(product_id=product_id, store_id=id_store, timestamp=timestamp)
            elif prev_vs_curr_stock < 0:
                # update inventory                
                print("updating inventory for {p}".format(p=product))
                self.update_inventory(store_id=id_store, product_id=product_id, new_stock=product_stock)            

    def fetch_prev_stock(self, store_id):
        self.open_db_connection()
        fetch_stock_query = """SELECT Product.name, Inventory.stock
        FROM Inventory 
        INNER JOIN Product ON Inventory.id_product=Product.id 
        WHERE Inventory.id_store = '{store_id}'
        """.format(store_id = store_id)
        self.db_cursor.execute(fetch_stock_query)
        result = self.parse_query_result(result_columns=["product_name", "product_stock"])
        result = self.two_cols_df_to_dict(result, "product_name", "product_stock")
        self.close_db_connection()
        return result

    def handle_constant_message(self, message):
        prev_stock = self.fetch_prev_stock(store_id=message['store_id'])
        self.update_store_products(prev_stock, message['content_count'], message['store_id'])
        prev_stock = self.fetch_prev_stock(store_id=message['store_id'])
        self.update_store_stock(prev_stock, message['content_count'], message['store_id'], message['timestamp'])

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