from django.shortcuts import render
from . import views
from django.http import HttpResponse
from django.shortcuts import render

def index(request):
	return render(request, 'predictor/index.html', {1:1})


def simulator(request):
	return render(request, 'predictor/simulator.html', {1:1})




def stocky(request):
	return render(request, 'predictor/stocky.html', {1:1})

def predictorinterface(request):
	return render(request, 'predictor/predictorinterface.html', {1:1})