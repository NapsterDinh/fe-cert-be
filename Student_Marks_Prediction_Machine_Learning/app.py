import numpy as np
import pandas as pd 
import joblib 
from flask import render_template , request , Flask, jsonify

app = Flask(__name__)

model = joblib.load('Student_Marks_Prediction_Model.pkl')
df = pd.DataFrame()

@app.route('/')
def index():
    return render_template('Marks.html')


@app.route('/predict',methods=['GET','POST'])
def predict():
    if (request.method) =='POST':
        global df
        data1 = []
        data = request.json['mark']
        print(f"Data = {data}")
        # data = int(data)

        if data:

            data1.append(data)

            features = np.array(data1)

            output = model.predict( [features] )[0][0].round(2)

            df = pd.concat( [df , pd.DataFrame( {'Study Hours' : data , 'Predicted Marks ' : [output]} )] ,ignore_index=True )
            print(df)
            df.to_csv('Predicted_data.csv')

            return jsonify({"result": output}), 200
        else:
            return jsonify(False), 500



app.run(debug=True)

