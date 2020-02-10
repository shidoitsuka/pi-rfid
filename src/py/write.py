#!/usr/bin/env python

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
    print('Tempelkan RFID anda')
    id, data = reader.read()
    card_data = ast.literal_eval(data)
    nis = flask.request.form.get("nis")
    lvl = flask.request.form.get("level")
    uang = flask.request.form.get("money")
    data = {
        "n": nis,
        "l": lvl,
        "m": uang
    }
    reader.write(str(data))
    return "BERHASIL!"
finally:
    GPIO.cleanup()

