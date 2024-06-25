handlebit.onButtonPressed(handlebit.Button.JOYSTICK1, function () {
    if (wippen == 1) {
        wippen = 0
    } else {
        wippen = 1
    }
})
handlebit.onButtonPressed(handlebit.Button.JOYSTICK2, function () {
    if (modus == 1) {
        modus = 0
    } else {
        modus = 1
    }
})
handlebit.onButtonPressed(handlebit.Button.B1, function () {
    if (vorzeichen == 1) {
        vorzeichen = -1
    } else {
        vorzeichen = 1
    }
})
handlebit.onButtonPressed(handlebit.Button.B2, function () {
    if (magnetabstand == 1) {
        magnetabstand = 2
    } else {
        magnetabstand = 1
    }
    basic.showNumber(magnetabstand)
})
function degreeToRadian (winkel: number) {
    angle = winkel / 180 * PI
    return angle
}
let sideBeitrag = 0
let hauptBeitrag = 0
let visAvisSideKick = 0
let visAvis = 0
let sideKick = 0
let hauptmagnet = 0
let auslenkung_links = 0
let winkel_links = 0
let angle = 0
let PI = 0
let wippen = 0
let magnetabstand = 0
let vorzeichen = 0
let modus = 0
handlebit.initialize()
modus = 0
let offset_magnet = 2
vorzeichen = 1
magnetabstand = 1
wippen = 1
PI = 3.14159265359
basic.showNumber(magnetabstand)
loops.everyInterval(100, function () {
    if (offset_magnet == magnetabstand) {
        offset_magnet = 8 - magnetabstand
    } else {
        offset_magnet = magnetabstand
    }
    winkel_links = handlebit.getAngle(handlebit.Joystick.JOYSTICK_LEFT)
    auslenkung_links = handlebit.getDeflection(handlebit.Joystick.JOYSTICK_LEFT)
    MagneticNavigation.zeroAllMagnets()
    if (wippen) {
        if (winkel_links < 45) {
            hauptmagnet = 5
        } else if (winkel_links < 90) {
            hauptmagnet = 6
        } else if (winkel_links < 135) {
            hauptmagnet = 7
        } else if (winkel_links < 180) {
            hauptmagnet = 8
        } else if (winkel_links < 225) {
            hauptmagnet = 1
        } else if (winkel_links < 270) {
            hauptmagnet = 2
        } else if (winkel_links < 315) {
            hauptmagnet = 3
        } else if (winkel_links < 360) {
            hauptmagnet = 4
        }
        MagneticNavigation.setMagnetPower(hauptmagnet, vorzeichen * auslenkung_links)
        if (modus) {
            if (magnetabstand == 2) {
                MagneticNavigation.setMagnetPower((hauptmagnet + 1 - 1) % 8 + 1, vorzeichen * auslenkung_links)
                MagneticNavigation.setMagnetPower((hauptmagnet + 7 - 1) % 8 + 1, vorzeichen * auslenkung_links)
            }
            MagneticNavigation.setMagnetPower((hauptmagnet + offset_magnet - 1) % 8 + 1, vorzeichen * auslenkung_links)
        }
    } else {
        if (winkel_links < 45) {
            hauptmagnet = 5
            sideKick = 6
            visAvis = 1
            visAvisSideKick = 2
            hauptBeitrag = auslenkung_links * Math.cos(2 * degreeToRadian(winkel_links))
            sideBeitrag = auslenkung_links * Math.sin(2 * degreeToRadian(winkel_links))
        } else if (winkel_links < 90) {
            hauptmagnet = 6
            sideKick = 7
            visAvis = 2
            visAvisSideKick = 3
            hauptBeitrag = auslenkung_links * Math.cos(2 * degreeToRadian(winkel_links - 45))
            sideBeitrag = auslenkung_links * Math.sin(2 * degreeToRadian(winkel_links - 45))
        } else if (winkel_links < 135) {
            hauptmagnet = 7
            sideKick = 8
            visAvis = 3
            visAvisSideKick = 4
            hauptBeitrag = auslenkung_links * Math.cos(2 * degreeToRadian(winkel_links - 90))
            sideBeitrag = auslenkung_links * Math.sin(2 * degreeToRadian(winkel_links - 90))
        } else if (winkel_links < 180) {
            hauptmagnet = 8
            sideKick = 1
            visAvis = 4
            visAvisSideKick = 5
            hauptBeitrag = auslenkung_links * Math.cos(2 * degreeToRadian(winkel_links - 135))
            sideBeitrag = auslenkung_links * Math.sin(2 * degreeToRadian(winkel_links - 135))
        } else if (winkel_links < 225) {
            hauptmagnet = 1
            sideKick = 2
            visAvis = 5
            visAvisSideKick = 6
            hauptBeitrag = auslenkung_links * Math.cos(2 * degreeToRadian(winkel_links - 180))
            sideBeitrag = auslenkung_links * Math.sin(2 * degreeToRadian(winkel_links - 180))
        } else if (winkel_links < 270) {
            hauptmagnet = 2
            sideKick = 3
            visAvis = 6
            visAvisSideKick = 7
            hauptBeitrag = auslenkung_links * Math.cos(2 * degreeToRadian(winkel_links - 225))
            sideBeitrag = auslenkung_links * Math.sin(2 * degreeToRadian(winkel_links - 225))
        } else if (winkel_links < 315) {
            hauptmagnet = 3
            sideKick = 4
            visAvis = 7
            visAvisSideKick = 8
            hauptBeitrag = auslenkung_links * Math.cos(2 * degreeToRadian(winkel_links - 270))
            sideBeitrag = auslenkung_links * Math.sin(2 * degreeToRadian(winkel_links - 270))
        } else if (winkel_links < 360) {
            hauptmagnet = 4
            sideKick = 5
            visAvis = 8
            visAvisSideKick = 1
            hauptBeitrag = auslenkung_links * Math.cos(2 * degreeToRadian(winkel_links - 315))
            sideBeitrag = auslenkung_links * Math.sin(2 * degreeToRadian(winkel_links - 315))
        }
        MagneticNavigation.setMagnetPower(hauptmagnet, vorzeichen * hauptBeitrag)
        MagneticNavigation.setMagnetPower(sideKick, vorzeichen * sideBeitrag)
        MagneticNavigation.setMagnetPower(visAvis, -1 * vorzeichen * hauptBeitrag)
        MagneticNavigation.setMagnetPower(visAvisSideKick, -1 * vorzeichen * sideBeitrag)
    }
    MagneticNavigation.writeAll()
})
