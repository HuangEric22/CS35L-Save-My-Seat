#!/bin/bash

# Backend setup
cd ./backend
npm install
cd ./..
echo "PORT=4000" > .env
echo "MONGO=mongodb+srv://TEST:TEST@cluster0.1up29cj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" >> .env 
echo "SECRET=abc" >> .env

# Frontend setup
cd ./frontend
npm install
# Installing Python Virtual Envirionment
cd ..
python3 -m venv venv
source venv/bin/activate
pip3 install -U -r requirements.txt
