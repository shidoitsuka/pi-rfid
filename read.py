#!/usr/bin/env python

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
	print('Tempelkan RFID anda')
	id, data = reader.read()
	print(id)
	print(data)
finally:
	GPIO.cleanup()
