/*
* Magnetic Actuation with Advancer Inclusion
*/
//% weight=10 icon="\uf11b" color=#0a0a0a block="NanoMed for Life" 
namespace nanoMedForLife {
    let sideBeitrag = -1
    let hauptBeitrag = -1
    let visAvisSideKick = -1
    let visAvis = -1
    let sideKick = -1
    let hauptmagnet = -1
    let auslenkung = -1
    let winkel = -1
    let angle = -1
    let wippen = 0
    let magnetabstand = 1
    let vorzeichen = 1
    let modus = 0
    let offset_magnet = 2
    let radioGroup = 1
    let lastReceivedNumber = 0
    let magnetJoystick = handlebit.Joystick.JOYSTICK_LEFT
    let advancerJoystick = handlebit.Joystick.JOYSTICK_RIGHT

    /**
     * Initializing all processes requiring initialization
     */
    //% weight=86 blockId=initialize block="Initialisierung"
    export function init() {
        handlebit.initialize()
        //radio.setGroup(radioGroup)
        // basic.showNumber(radioGroup)
    }

    /**
     * Changing between wippen and homogeneous mode
     */
    //% weight=86 blockId=switchWippen block="wechsle zwischen Gradienten- und Homogenfeld"
    export function switchWippen() {
        wippen = 1 - wippen
    }

    /**
     * Changing between oascillating and static steering mode
     */
    //% weight=86 blockId=switchModus block="wechsle modus zwischen Oszillieren und statisch"
    export function switchModus() {
        modus = 1 - modus
    }

    /**
     * Set the variable magnetabstand to either 1 or 2
     */
    //% weight=86 blockId=setMagnetabstand block="wechsle Magnetabstand 1 <-> 2"
    export function setMagnetabstand() {
        if (magnetabstand === 1) {
            magnetabstand = 2
        } else {
            magnetabstand = 1
        }
    }

     /**
     * Changing polarity of the coils
     */
    //% weight=86 blockId=switchPolarity block="wechsle Polarität der Magnetspulen"
    export function switchPolarity() {
        vorzeichen = -vorzeichen
    }

    /**
     * Setting the radio group to desired number
     * @param frequency desired channel for radio transfer
     */
    //% weight=86 blockId=setRadioGroup block="setze den Funkkanal auf |%frequency|"
    export function setRadioGroup(frequency: number) {
        radioGroup = frequency
        radio.setGroup(radioGroup)
        basic.showNumber(radioGroup)
    }

    /**
     * Do something when a button is pushed down on the handlebit released again.
     * @param button the button that needs to be pressed
     * @param body code to run when event is raised
     */
    //% weight=86 blockId=onButtonPressed block="wenn Knopf |%button| gedrückt"
    export function wrappedOnButtonPressed(button: handlebit.Button, body: Action) {
        control.onEvent(EventBusSource.MES_DPAD_CONTROLLER_ID, button, body)
    }

    /**
     * Swap Joysticks back and forth
     */
    //% weight=86 blockId=swapJS block="Joystickfunktion tauschen"
    export function swapJS() {
        let temp = magnetJoystick
        magnetJoystick = advancerJoystick
        advancerJoystick = temp
    }

    // /**
    // * Handle received number with a callback
    // * @param callback function to handle the event
    // */
    // //% weight=86 blockId=receivingValues block="Advancerwert |%receivedNumber| lesen"
    // export function onReceivedNumberHadler(callback: (receivedNumber: number) => void): void {
    //     radio.onReceivedNumber(function (receivedNumber: number){
    //         lastReceivedNumber = receivedNumber
    //         callback(receivedNumber)
    //     })
    // }
    /**
     * Handle received number with a callback
     * @param optionsOrCallback Optional configuration object or callback function
     * @param callbackOrUndefined Optional callback function
     */
    //% weight=86 blockId=receivingValues block="empfange Wert für |%advancerSpeed|"
    export function onReceivedNumberHandler(
        optionsOrCallback: number | ((radvancerSpeed: number) => void),
        callbackOrUndefined?: (advancerSpeed: number) => void
    ): void {
        let actualCallback: (advancerSpeed: number) => void;

        if (typeof optionsOrCallback === 'function') {
            actualCallback = optionsOrCallback;
        } else if (typeof callbackOrUndefined === 'function') {
            actualCallback = callbackOrUndefined;
        } else {
            // Fallback in case no valid callback is provided
            actualCallback = function(advancerSpeed: number) {
                console.log("Received number: " + advancerSpeed);
            };
        }

        radio.onReceivedNumber(function (advancerSpeed: number) {
            lastReceivedNumber = advancerSpeed;
            actualCallback(advancerSpeed);
        });
    }

    /**
     * Function setting magnetic field according to operation with or without wippen
     * @param magnetJoystick
     */
    //% weight=86 blockId=setMagneticField block="Magnetfeld-Joystick auslesen und Werte an Spielfeld senden"
    export function setMagneticField() {
        winkel = handlebit.getAngle(magnetJoystick)
        auslenkung = handlebit.getDeflection(magnetJoystick)
        MagneticNavigation.zeroAllMagnets()
        if (wippen) {
            if (offset_magnet == magnetabstand) {
                offset_magnet = 8 - magnetabstand
            } else {
                offset_magnet = magnetabstand
            }
            if (winkel < 45) {
                hauptmagnet = 7
            } else if (winkel < 90) {
                hauptmagnet = 8
            } else if (winkel < 135) {
                hauptmagnet = 1
            } else if (winkel < 180) {
                hauptmagnet = 2
            } else if (winkel < 225) {
                hauptmagnet = 3
            } else if (winkel < 270) {
                hauptmagnet = 4
            } else if (winkel < 315) {
                hauptmagnet = 5
            } else if (winkel < 360) {
                hauptmagnet = 6
            }
            MagneticNavigation.setMagnetPower(hauptmagnet, vorzeichen * auslenkung)
            if (modus) {
                if (magnetabstand == 2) {
                    MagneticNavigation.setMagnetPower((hauptmagnet + 1 - 1) % 8 + 1, vorzeichen * auslenkung)
                    MagneticNavigation.setMagnetPower((hauptmagnet + 7 - 1) % 8 + 1, vorzeichen * auslenkung)
                }
                MagneticNavigation.setMagnetPower((hauptmagnet + offset_magnet - 1) % 8 + 1, vorzeichen * auslenkung)
            }
        } else {
            if (winkel < 45) {
                hauptmagnet = 7
                sideKick = 8
                visAvis = 3
                visAvisSideKick = 4
                hauptBeitrag = auslenkung * Math.cos(2 * winkel/180*Math.PI)
                sideBeitrag = auslenkung * Math.sin(2 * winkel/180*Math.PI)
            } else if (winkel < 90) {
                hauptmagnet = 8
                sideKick = 1
                visAvis = 4
                visAvisSideKick = 5
                hauptBeitrag = auslenkung * Math.cos(2 * (winkel - 45)/180*Math.PI)
                sideBeitrag = auslenkung * Math.sin(2 * (winkel - 45)/180*Math.PI)
            } else if (winkel < 135) {
                hauptmagnet = 1
                sideKick = 2
                visAvis = 5
                visAvisSideKick = 6
                hauptBeitrag = auslenkung * Math.cos(2 * (winkel - 90)/180*Math.PI)
                sideBeitrag = auslenkung * Math.sin(2 * (winkel - 90)/180*Math.PI)
            } else if (winkel < 180) {
                hauptmagnet = 2
                sideKick = 3
                visAvis = 6
                visAvisSideKick = 7
                hauptBeitrag = auslenkung * Math.cos(2 * (winkel - 135)/180*Math.PI)
                sideBeitrag = auslenkung * Math.sin(2 * (winkel - 135)/180*Math.PI)
            } else if (winkel < 225) {
                hauptmagnet = 3
                sideKick = 4
                visAvis = 7
                visAvisSideKick = 8
                hauptBeitrag = auslenkung * Math.cos(2 * (winkel - 180)/180*Math.PI)
                sideBeitrag = auslenkung * Math.sin(2 * (winkel - 180)/180*Math.PI)
            } else if (winkel < 270) {
                hauptmagnet = 4
                sideKick = 5
                visAvis = 8
                visAvisSideKick = 1
                hauptBeitrag = auslenkung * Math.cos(2 * (winkel - 225)/180*Math.PI)
                sideBeitrag = auslenkung * Math.sin(2 * (winkel - 225)/180*Math.PI)
            } else if (winkel < 315) {
                hauptmagnet = 5
                sideKick = 6
                visAvis = 1
                visAvisSideKick = 2
                hauptBeitrag = auslenkung * Math.cos(2 * (winkel - 270)/180*Math.PI)
                sideBeitrag = auslenkung * Math.sin(2 * (winkel - 270)/180*Math.PI)
            } else if (winkel <= 360) {
                hauptmagnet = 6
                sideKick = 7
                visAvis = 2
                visAvisSideKick = 3
                hauptBeitrag = auslenkung * Math.cos(2 * (winkel - 315)/180*Math.PI)
                sideBeitrag = auslenkung * Math.sin(2 * (winkel - 315)/180*Math.PI)
            }
            MagneticNavigation.setMagnetPower(hauptmagnet, vorzeichen * hauptBeitrag)
            MagneticNavigation.setMagnetPower(sideKick, vorzeichen * sideBeitrag)
            MagneticNavigation.setMagnetPower(visAvis, -1 * vorzeichen * hauptBeitrag)
            MagneticNavigation.setMagnetPower(visAvisSideKick, -1 * vorzeichen * sideBeitrag)
        }
        MagneticNavigation.writeAll()
    }

    /**
     * Function sending the advancer joystick deflection along X-axis to the advancer driver
     * 
     */
    //% weight=86 blockId=sendAdvancerCommand block="Advancer-Joystick auslesen und Werte an Advancer senden"
    export function sendAdvancerCommand() {
        let advancerSpeed = handlebit.getSensorValue(handlebit.Direction.DIR_X, advancerJoystick)
        radio.sendNumber(advancerSpeed)
    }

    /**
     * Function receiving the advancer joystick deflection along X-axis and sending it to the motor controller
     * 
     */
    //% weight=86 blockId=setAdvancerSpeed block="Advancer antreiben"
    export function setAdvancerSpeed() {
        let motorPowerX = lastReceivedNumber
        if (motorPowerX > 2 || motorPowerX < -2) {
            motor.MotorRun(motor.Motors.M1, motor.Dir.CW, motorPowerX)
            // basic.showNumber(motorPowerX)
            motorPowerX = 0
        } else {
            motor.motorStop(motor.Motors.M1)
        }
    }
}
