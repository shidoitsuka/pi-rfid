#!/usr/bin/env python

import RPi.GPIO as GPIO
import ast
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
        print('Tempelkan RFID anda')
        id, data = reader.read()
        output = ast.literal_eval(data)
        print(id)
        print(output)
finally:
        GPIO.cleanup()