def my_function():
    global modus
    if modus == 1:
        modus = 0
    else:
        modus = 1
handlebit.on_button_pressed(handlebit.Button.JOYSTICK2, my_function)

def my_function2():
    global vorzeichen
    if vorzeichen == 1:
        vorzeichen = -1
    else:
        vorzeichen = 1
handlebit.on_button_pressed(handlebit.Button.B1, my_function2)

def my_function3():
    global magnetabstand
    if magnetabstand == 1:
        magnetabstand = 2
    else:
        magnetabstand = 1
    basic.show_number(magnetabstand)
handlebit.on_button_pressed(handlebit.Button.B2, my_function3)

hauptmagnet = 0
auslenkung_links = 0
winkel_links = 0
magnetabstand = 0
vorzeichen = 0
modus = 0
handlebit.initialize()
modus = 0
offset_magnet = 2
vorzeichen = 1
magnetabstand = 1
basic.show_number(magnetabstand)

def on_every_interval():
    global offset_magnet, winkel_links, auslenkung_links, hauptmagnet
    if offset_magnet == magnetabstand:
        offset_magnet = 8 - magnetabstand
    else:
        offset_magnet = magnetabstand
    winkel_links = handlebit.get_angle(handlebit.Joystick.JOYSTICK_LEFT)
    auslenkung_links = handlebit.get_deflection(handlebit.Joystick.JOYSTICK_LEFT)
    MagneticNavigation.zero_all_magnets()
    if winkel_links < 45:
        hauptmagnet = 5
    elif winkel_links < 90:
        hauptmagnet = 6
    elif winkel_links < 135:
        hauptmagnet = 7
    elif winkel_links < 180:
        hauptmagnet = 8
    elif winkel_links < 225:
        hauptmagnet = 1
    elif winkel_links < 270:
        hauptmagnet = 2
    elif winkel_links < 315:
        hauptmagnet = 3
    elif winkel_links < 360:
        hauptmagnet = 4
    MagneticNavigation.set_magnet_power(hauptmagnet, vorzeichen * auslenkung_links)
    if modus:
        if magnetabstand == 2:
            MagneticNavigation.set_magnet_power((hauptmagnet + 1 - 1) % 8 + 1, vorzeichen * auslenkung_links)
            MagneticNavigation.set_magnet_power((hauptmagnet + 7 - 1) % 8 + 1, vorzeichen * auslenkung_links)
        MagneticNavigation.set_magnet_power((hauptmagnet + offset_magnet - 1) % 8 + 1,
            vorzeichen * auslenkung_links)
    MagneticNavigation.write_all()
loops.every_interval(100, on_every_interval)
