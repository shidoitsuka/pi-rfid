#!/usr/bin/env python

import RPi.GPIO as GPIO
import ast, sys
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
    id, data = reader.read()
    try:
        output = ast.literal_eval(data)
        lvl = output["l"]
        nis = output["n"]
        uang = int(output["m"])
        harga = 100
        if uang < harga:
            print("0")
        else:
            uang -= harga
            data = {
                "l": lvl,
                "n": nis,
                "m": uang
            }
            reader.write( str(data) )
    except:
        print("0")
finally:
    GPIO.cleanup()
