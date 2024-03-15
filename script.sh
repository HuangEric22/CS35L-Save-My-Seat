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
