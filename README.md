# moneycontrol-hackathon
Gamification of stock prediction
Havckathon


This  project was developed as a part of moneycontrol hackathon 2017, 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites

You need to have python 3 installed. That's it!



### Installation

Follow the below steps : 

```
git clone https://github.com/AnandGH5/moneycontrol-hackathon-.git
cd moneycontrol-hackathon
pip install -r requirements.txt
```

### And Run

```
cd stockpred
python manage.py makemigrations
python manage.py migrate --run-syncdb
python manage.py collectstatic
python manage.py runserver
```
This will start the server on http://127.0.0.1:8000/predictor/ from the current working directory.




