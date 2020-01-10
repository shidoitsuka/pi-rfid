#!/usr/bin/env python

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
	data = input('Nama : ')
	print('Tempelkan RFID Anda')
	reader.write(data)
	print('Berhasil!')
finally:
	GPIO.cleanup()
