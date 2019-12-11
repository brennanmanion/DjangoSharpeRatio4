from django.shortcuts import render
from django.http import JsonResponse

def index(request):
    return render(request, 'frontend/index.html')

def calculate_sharpe_ratio(request):    
    import numpy as np
    import pandas as pd
    from pandas_datareader.data import DataReader
    import json

    if(request.method=="POST"):
        post_data = json.loads(request.body.decode("utf-8"))
        print(post_data)
        tickers = post_data["tickers"]
        data = pd.DataFrame()
        for ticker in tickers:
            data[ticker] = DataReader(ticker,data_source="yahoo")["Adj Close"]    

        weights = np.array(np.random.random(len(data.columns)))
        log_returns = np.log(data/data.shift(1))
        expected_returns = np.sum(log_returns.mean()*weights*252)
        expected_volatility = np.sqrt(np.dot(weights.T,np.dot(log_returns.cov()*252,weights)))
        sharpe_ratio = expected_returns/expected_volatility

        num_ports = 5000

        all_weights = np.zeros((num_ports,len(data.columns)))
        returns_array = np.zeros(num_ports)
        volatility_array = np.zeros(num_ports)
        sharpe_array = np.zeros(num_ports)

        for index in range(num_ports):
            # Weights
            weights = np.array(np.random.random(len(data.columns)))
            weights = weights/weights.sum()
            # Save Weights
            all_weights[index,:] = weights
            # Expected Return
            returns_array[index] = np.sum(log_returns.mean()*weights*252)
            # Expected volatility
            volatility_array[index] = np.sqrt(np.dot(weights.T,np.dot(log_returns.cov()*252,weights)))
            # Sharpe Ratio
            sharpe_ratio = expected_returns/expected_volatility
            sharpe_array[index] = returns_array[index]/volatility_array[index]

        sharpe_ratio = sharpe_array.max()
        portfolio_weights = []
        i=0
        while(i<len(tickers)):
            portfolio_weights.append({"ticker":tickers[i],"weight":str(list(all_weights[sharpe_array.argmax(),:])[i])})
            i+=1

        # calculate the percent change
        standard_returns = data/data.shift(1)
        # return the price
        price = data.iloc[-1]

        portfolio_price = []
        portfolio_returns = []
        i=0
        while(i<len(tickers)):
            portfolio_price.append({"ticker":tickers[i],"price":str(round(price[i],2))})
            portfolio_returns.append({"ticker":tickers[i],"percentChange":str(round((standard_returns.iloc[-1][0]*100)-100,2))+"%"})
            i+=1
        context = {"SharpeRatio":sharpe_ratio,"Weights":portfolio_weights, "Price":portfolio_price,"Change":portfolio_returns}
        
        # new context to return what is to be assigned to the react state
        state_context = []
        print('calculate_sharpe_ratio')
        print(tickers)
        print(len(tickers))
        i=0
        while(i<len(tickers)):
            state_context_dictionary = {}
            state_context_dictionary['ticker'] = tickers[i]
            state_context_dictionary['percentChange'] = str(round((standard_returns.iloc[-1][0]*100)-100,2))+"%"
            state_context_dictionary['price'] = str(round(price[i],2))
            state_context_dictionary['weight'] = str(round(list(all_weights[sharpe_array.argmax(),:])[i],2))
            state_context.append(state_context_dictionary)
            i+=1
        
        # bundle it all together so we can send the sharpe ratio over as well
        rounded_sharpe_ratio = round(sharpe_ratio,2)
        new_context = {"setState":state_context,"SharpeRatio":rounded_sharpe_ratio}
        print(state_context)
        return JsonResponse(new_context)
   
def verify_valid_ticker(request):
    import json
    import os       
    # from django.contrib.staticfiles.storage import staticfiles_storage
    from django.conf import settings
    all_tickers_file = os.path.join(settings.BASE_DIR,'frontend/static/ValidateTickers/ValidateTickers.json')     
    with open(all_tickers_file,"r") as f:
        data = json.loads(f.read())    
    f.close()

    if(request.method=="POST"):
        post_data = json.loads(request.body.decode("utf-8"))

    tickers_match = []
    tickers_not_match = []

    for input_ticker in post_data['tickers']:
        match = False
        for ticker in data['ValidTickers']:    
            if(input_ticker==ticker):
                match = True
        if(match):
            tickers_match.append(input_ticker)
        else:
            tickers_not_match.append(input_ticker)
            
    context = {"tickersMatch":tickers_match,"tickersNotMatch":tickers_not_match}
    
    return JsonResponse(context)   