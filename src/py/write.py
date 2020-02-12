#!/usr/bin/env python

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import sys, json, ast

reader = SimpleMFRC522()

try:
    print("Tempelkan RFID Anda")
    lvl = sys.argv[1]
    nis = sys.argv[2]
    uang = sys.argv[3]
    data = {
        "l": lvl,
        "n": nis,
        "m": uang
    }
    reader.write(str(data))
    print("Berhasil!")
finally:
    GPIO.cleanup()