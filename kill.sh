#!/bin/bash
user=$1
portFile="/opt/${user}/port.txt"
if [ -e portFile ]
then
    value=`cat ${portFile}`
    echo value
else
    echo "nok${portFile}"
fi
