#!/bin/bash
user=$1
portFile=/opt/${user}/port.txt
if [ -e /opt/user1/port.txt ]
then
    value=`cat ${portFile}`
    echo value
else
    echo "nok${portFile}"
fi
