
# coding: utf-8

# import quandl, math
# import numpy as np
# import pandas as pd
# from sklearn import preprocessing, cross_validation, svm
# from sklearn.linear_model import LinearRegression
# import matplotlib.pyplot as plt
# 
# market_df = pd.read_csv('https://raw.githubusercontent.com/Aishwarya4823/pythondata/master/examples/SP500.csv', index_col='DATE', parse_dates=True)
# market_df.plot()
# plt.show()

# In[12]:


from fbprophet import Prophet
df = market_df.reset_index().rename(columns={'DATE':'ds', 'SP500':'y'})
df['y'] = np.log(df['y'])

model = Prophet()
model.fit(df);
future = model.make_future_dataframe(periods=365) #forecasting for 1 year from now.
forecast = model.predict(future)


# In[14]:


figure=model.plot(forecast)
plt.show()


# In[60]:



two_years = forecast.set_index('ds').join(market_df)
two_years = two_years[['SP500', 'yhat', 'yhat_upper', 'yhat_lower' ]].dropna().tail(800)
two_years['yhat']=np.exp(two_years.yhat)
two_years['yhat_upper']=np.exp(two_years.yhat_upper)
two_years['yhat_lower']=np.exp(two_years.yhat_lower)
two_years[['SP500', 'yhat']].plot()
plt.show()


# In[58]:


temp = pd.DataFrame(two_years)
temp.to_csv('out2.csv',index=True,header=True)
print(temp)


# In[18]:


two_years_AE = (two_years.yhat - two_years.SP500)
print (two_years_AE.describe())


# In[23]:


import sklearn as sklearn
sklearn.metrics.r2_score(two_years.SP500, two_years.yhat)


# In[25]:


sklearn.metrics.mean_squared_error(two_years.SP500, two_years.yhat)


# In[26]:


sklearn.metrics.mean_absolute_error(two_years.SP500, two_years.yhat)


# In[27]:


fig, ax1 = plt.subplots()
ax1.plot(two_years.SP500)
ax1.plot(two_years.yhat)
ax1.plot(two_years.yhat_upper, color='black',  linestyle=':', alpha=0.5)
ax1.plot(two_years.yhat_lower, color='black',  linestyle=':', alpha=0.5)
 
ax1.set_title('Actual S&P 500 (Orange) vs S&P 500 Forecasted Upper & Lower Confidence (Black)')
ax1.set_ylabel('Price')
ax1.set_xlabel('Date')
plt.show()


# In[29]:


full_df = forecast.set_index('ds').join(market_df)
full_df['yhat']=np.exp(full_df['yhat'])
 
fig, ax1 = plt.subplots()
ax1.plot(full_df.SP500)
ax1.plot(full_df.yhat, color='black', linestyle=':')
ax1.fill_between(full_df.index, np.exp(full_df['yhat_upper']), np.exp(full_df['yhat_lower']), alpha=0.5, color='darkgray')
ax1.set_title('Actual S&P 500 (Orange) vs S&P 500 Forecasted (Black) with Confidence Bands')
ax1.set_ylabel('Price')
ax1.set_xlabel('Date')
 
L=ax1.legend() #get the legend
L.get_texts()[0].set_text('S&P 500 Actual') #change the legend text for 1st plot
L.get_texts()[1].set_text('S&P 5600 Forecasted') #change the legend text for 2nd plot
plt.show()


# temp=pd.DataFrame(full_df)
# temp.to_csv('out3.csv',index=True,header=True)
