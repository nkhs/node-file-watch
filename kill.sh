#!/bin/bash
user=$1
portFile=/opt/${user}/port.txt
value=`cat ${portFile}`
echo "Kill port ${value}"
kill -9 $(lsof -t -i:${value})