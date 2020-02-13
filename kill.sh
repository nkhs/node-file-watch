#!/bin/bash
portFile = "/opt/${$1}/port.txt"
if [ -e portFile ]
then
    value=`cat ${portFile}`
    echo value
else
    echo "nok"
fi
