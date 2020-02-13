#!/bin/bash
user=$1
portFile=/opt/${user}/port.txt
value=`cat ${portFile}`
echo "${value}"
lsof -i:${value}