#!/usr/bin/env python

import RPi.GPIO as GPIO
import ast
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
        id, data = reader.read()
        output = ast.literal_eval(data)
        print(output)
finally:
        GPIO.cleanup()