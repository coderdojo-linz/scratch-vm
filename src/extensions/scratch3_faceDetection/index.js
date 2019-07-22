module.exports = Scratch3FaceDetectionBlocks;
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');
const io = require('socket.io-client');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAKcElEQVR42u2cfXAU9RnHv7u3L3d7l9yR5PIGXO7MkQKaYiCUWqJhFGvRMk4JZXSc8aXVaSmiYlthVHQEW99FxiIdrVY6teiMdoa+ICqhIqgQAsjwMgYDOQKXl7uY17u9293b3f5x5JKYe8+FJGSfvzbP/n77e/azz+95nt9v90KoqgpN0hdSQ6AB1ABqADWAmmgANYAaQA2gJhpADeBEE2q8GPLaWzu/CslyiY4k9dOn5uijtXGd7+jWkaReVpT3Hrhv6d0awEFC07rgD+ZeYYnXprhwigUAvjj0zbjxQCLebozT7iDzK1ZUWCru2K7L//6MVC8ue45Blz8n6rlQ815QtuohOlXiEdy/AUqPa6y59Mkh6Q1345GNja6m7pHEQKNl3t0704EXat4L6fSOmOeEI1vHKzwAyNJR9MPFpRUPOu0ONm2A0xatWaTLm5WfDrzvAppA8AbiG03fC8CQNkDKZK2YrPAuRrhpifJERsuYywveJc7CqcIDMAyeLm82dEXzw39I/qjXkpr3QuW9lxfAdOABGAKPslWDnbsy7Jl8BxTeM3SqmO0gaA5U6c3jymup0YSn9JyLee67wpTfBQAQjmyF3HFqiJcRtDECjy5dAmbmcgQPvjjxl3Lx4IVjnD/5cE1zkWtyP34VBGcdKLJnLgc9cznk1kMXFdzEn8KJ4KUqqsSHvcxWDf7j1UM8UPr6/YgHhhX8xAaYaXgAIB7fBnbuSrBzV8aNgarEQ/z6/YkLcDTg9V9XlXjQtuqoU1TpcUHlvZDOfDiuyh5qPMCLrJ1bDw3EuUtx81N/BH3pjQBJQ2HMF5V6iKfeRchVm9kkMtrwxmSdobeA9daBde8GwVlBcFYofS1Jw0vaAy9HeJHQwBUPzIBvGxDc92Rmp/BowJs10wkAONfsBs8HAAAltqngOAO8HZ3o6OiMqcvLy4E1Lwc8H8C5ZndMXdLJa/qNacNLCDBw/O8nFUNWxp/64+tWAwBefe1tHKg7CgC4/9d3ori4EHv3HcDrb26PqVt2602ovvaHaGlpw+8ffSamLqXYmya8jG8mpFy6iGLkWLh4HAwG4+r6j4VBfaPpLgU8IMGO9MLqW2pYQ9aQokuR5dgXIwCC1CUcNMj3hpdvLAdSF54EYpCHooRA0Swomo2pC0kCQpIAkqTA6LmYupgxL0X7m78+aG10NXVkpIwxsAwWXncDCESHLkohfPbpbiT6ZFPPZQ9fC0e58Wi6wTDj6UbT/rQAyiERS2pW4Kc3LQDLRO8miCEAKj7d83FcTxyLJJJJ+9MCqKoq9HomMrgkSThxsgEcZ8AMpwMkSYJlKDA0DVUFiHGWRDJp/4jXwqIo4uFHnkZXdw8AYGbZFXhs3WqQJDkhkkim7E8KoMlkxKbnn8DBunrwUli3e8/+yOAA0HjmHDq7upGXm5PUoDUr7hmWRB5Zt3FYwoime+vtd/H6G9uGJIxouniSyP6H7v8FystnY80jGzIA0MihsMAKu20aTp3JzFb6WCWRuDUvHwByw8cOhw2FBVaYjNzIAba1e3Hfb9aiq7MTNStuBwAsvr4KO3d9GnmKztIS5EyxTJiVSDT7p04tipx/9MnnYc7ORlu7NzMxsK3di5AkDHgGw2DTC+uHBeGJshJJZL/fxyMQEDKbRAiCQDAoQhBDYBkKNE2j4uqrhpUBoiSBIMZfEhkN+1NeiWSqEB2rlUg69md0JRIQRHy86z8jXsqNVRLJlP0jqgNJXXgAgjbCcONmCHUvQ+44NWG2s/rtH5Mt/ciToo0wLH4JBGO6LLazRiJk2vBYy4gHHw/bWSN+LZBKEhkMjzn/CaSiKgQOvJDyFB7L7axUJWNJZDA8IhQA1boPin7KZbMSGfUYyFx9b3hXg/cCsoBA2Z0AoYOaxlcC4+mdyCUDKBzanLFBJ3USyaRMuiSSKZmUSSSTMimTCABUlblRU9kAZ0E39p+eii21c+EL0jHbOwu6sfaWgyjND//U4oP6MmzZnfi79XT7mfQSNi7bh0JzOLG19XBY/89r49pYVebGqhuOosDsh1+gsWV3BXYdd2Q+BlaVuXFv9bHgkSbzk+vfcVRyjHhi47J9cftsXLYf7T36Ix8cLHlo6ydlv6qpPI2qssRZcuOy/Wjp4k5s+2zG+offKqtcUt6kJtNv7S0H0RtkvEufXTB/6bML5je2Wy7UVDbEbF9o9mPDsv2oP5v75vbPS26rP5u3fdXiozDppcwDrKlswOlWy9E//DX09Mt/azh8zzNM1RybF86C7pheVGD240CDeX3NWtfml94Rt+0+Mf3Lm8qbEnpfgdmPs+3G9+564vTT//pM/GrHYduWRP0AYOEMN/5S61xT92Vtfd2XtfWb/vu91fHALyxzw9tnkB/cTD5w+2Ou9375HHtfa7exM5mxRpKFaafdQQKgAcDERs98/foLHrXdaXfoABi8vczhWO2/28/TRR5z2h00gKymNl1ton79oigq6bQ7dE67Q+ew9mb1h4FYYwVESgLAXLSRa+3mWpIdK+UYuPiq89f8+XfT/+ftZQ4vLm9ZmUyfdcsv1M2fWfRaUCK8i8vdK1u6ktuAWPWTsztm24o/cnnYHUsrWzd1+fVJ9XtqxbG3XzFdNcPTawjcueibpxK1t+X26f/9R8a953jub4typOvm2b1XnvUmv8JKWMZcaZffX3XDERRP8cGaFRjWxtPLoZvXY4oxgPBNEsgxBhCUKEzL6Ru+JydS8Ak0giKFgESDJFQoKmCgQzAwIfQEWETzmoBIwd2VNaStu8uEHGO4Buz06zHHFv0dRkefAZ1+PQx0KNK2eIoPLCUj2zDc275qzgcBFWv+cf3IyxgTK2KOzQufEM5kfpGF12eGPSf8DXN+No/87HDWiwYYALw+M6ym8AscAxO++X7xCTRM7EDQzht0Da8v/NWo1dQDAxNCocUXs+303IGHdaptOmYXnh/SLlZbV+fwnwJm6UXEm/ojqgM/PFmJQ81OPHfrtqT7bN23BE8seTflYLvz5DwYGQHLKz5Puo/XZ8aLtT+D1dSDuxbsGQIymmz48DbwIguOESJOcce8XaO3oVpZ8k3Em5KVVAAMFnuOB9as1MbimCBunn04vBmR40ls29Wfgxf1KMn1gBdY+MXUCvK4ANvPndpLzrLzALjBN2VPwrDBksgLYkn1jBMp90nVY2++8vAw3RlPeLNYVZSPAEgjKWP6ZCn4lF+gMdnE08spQb73RQB9aXtgo6tJcNodf8rWz3L//Br340UW3sExEkXrFFKSSUVHqkRfkJZ8QSZk5gS6hw9H+GyDQAclSs41BVmSUIn+toAKIUTJskKoQUknCxKlkISKb/sM0NMyyVAhXW+AlYosfgOgQlUJVadTSUWBKoQoudvPioPbenq5oIUTaRUqenhWKi3oyVIUqKpKREoLggDhF6hQb4CV9LRM9rctMPN6glChp2SdTqeSskwoAECSKnG61fzFR/XsGu+FhmONriYl7TImsjoYKJyZSeB8CoBQo6spqU8TCO1fgE7gDVUNoCYaQA2gBlADqAHURAOoAdQAagA10QCOgfwfNp/hXbfBMCAAAAAASUVORK5CYII=';

class Scratch3FaceDetectionBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME() {
        return 'Face-Detection';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return 'faceDetection';
    }

    /**
     * Construct a set of MicroBit blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor(runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this.position_x_1 = 0;
        this.position_y_1 = 0;
        this.expressions_happy_1 = 0;

        this.position_x_2 = 0;
        this.position_y_2 = 0;
        this.expressions_happy_2 = 0;

        const that = this;
<<<<<<< HEAD
        this.socket = io('http://192.168.42.143:3000/');
=======
        this.socket = io('http://192.168.42.124:3000/');
>>>>>>> 661e75c54011de9bacc77e2f037a6ce39f0745cc
        this.socket.on('detection', function (msg) {
            if (typeof (msg) === 'string') {
                msg = JSON.parse(msg);
            }
            console.log('uhawlök');
<<<<<<< HEAD
            if (msg && msg.detection && msg.detection._box && msg.player) {

                //that.position_x = -((msg.detection._box._x - 230) * 0.85);
                //that.position_y = ((-msg.detection._box._y) + 100) * 1.25;
=======
            if (msg || msg.detection || msg.detection._box || msg.player) {
  
                  that.position_x = -((msg.detection._box._x - 230) * 0.85);
                 that.position_y = ((-msg.detection._box._y) + 100) * 1.25;
>>>>>>> 661e75c54011de9bacc77e2f037a6ce39f0745cc

                if (msg.player === 1) {
                    that.position_x_1 = msg.detection._box._x;
                    that.position_y_1 = msg.detection._box._y;
                    that.expressions_happy_1 = msg.expressions.happy;
                } else {
                    that.position_x_2 = msg.detection._box._x;
                    that.position_y_2 = msg.detection._box._y;
                    that.expressions_happy_2 = msg.expressions.happy;
                }
            }
        });
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: Scratch3FaceDetectionBlocks.EXTENSION_ID,
            name: Scratch3FaceDetectionBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
<<<<<<< HEAD
                    opcode: 'x1',
=======
                    opcode: 'positionX',
                    text: formatMessage({
                        id: 'faceDetection.position_x',
                        default: 'Face Detection position_x',
                        description: 'x-position of the detected face'
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'positionY',
                    text: formatMessage({
                        id: 'faceDetection.position_y',
                        default: 'Face Detection position_y',
                        description: 'y-position of the detected face'
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                     opcode: 'x1',
                     text: formatMessage({
                         id: 'faceDetection.position_x_1',
                         default: 'Face Detection position_x_1',
                         description: 'x-position of the detected face with the id = 1'
                     }),
                     blockType: BlockType.REPORTER,
                 },
                 {
                     opcode: 'y1',
                     text: formatMessage({
                         id: 'faceDetection.position_y_1',
                         default: 'Face Detection position_y_1',
                         description: 'y-position of the detected face with the id = 1'
                     }),
                     blockType: BlockType.REPORTER,
                 },
                 {
                    opcode: 'x2',
                    text: formatMessage({
                        id: 'faceDetection.position_x_2',
                        default: 'Face Detection position_x_2',
                        description: 'x-position of the detected face with the id = 2'
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'y2',
                    text: formatMessage({
                        id: 'faceDetection.position_y_2',
                        default: 'Face Detection position_y_2',
                        description: 'y-position of the detected face with the id = 2'
                    }),
                    blockType: BlockType.REPORTER,
                },
 
                 {
                     opcode: 'angry',
                     text: formatMessage({
                         id: 'faceDetection.expressions_angry',
                         default: 'Angry',
                         description: 'Angry'
                     }),
                     blockType: BlockType.REPORTER,
                 },
                 {
                    opcode: 'disgusted',
>>>>>>> 661e75c54011de9bacc77e2f037a6ce39f0745cc
                    text: formatMessage({
                        id: 'faceDetection.position_x_1',
                        default: 'Face Detection position_x_1',
                        description: 'x-position of the detected face with the id = 1'
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'y1',
                    text: formatMessage({
                        id: 'faceDetection.position_y_1',
                        default: 'Face Detection position_y_1',
                        description: 'y-position of the detected face with the id = 1'
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'happy1',
                    text: formatMessage({
                        id: 'faceDetection.expressions_happy_1',
                        default: 'Happy1',
                        description: 'Happy1'
                    }),
                    blockType: BlockType.REPORTER,
                },

                {
                    opcode: 'x2',
                    text: formatMessage({
                        id: 'faceDetection.position_x_2',
                        default: 'Face Detection position_x_2',
                        description: 'x-position of the detected face with the id = 2'
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'y2',
                    text: formatMessage({
                        id: 'faceDetection.position_y_2',
                        default: 'Face Detection position_y_2',
                        description: 'y-position of the detected face with the id = 2'
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'happy2',
                    text: formatMessage({
                        id: 'faceDetection.expressions_happy_2',
                        default: 'Happy2',
                        description: 'Happy2'
                    }),
                    blockType: BlockType.REPORTER,
                }
            ]
        };
    }

    /**
     * Test whether the A or B button is pressed
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the button is pressed.
     */
<<<<<<< HEAD
    x1(args) {
=======
    positionX(args){
        return this.position_x;
    }
    positionY(args){
        return this.position_y;
    }
    
    x1(args){
>>>>>>> 661e75c54011de9bacc77e2f037a6ce39f0745cc
        return this.position_x_1;
    }
    y1(args) {
        return this.position_y_1;
    }
<<<<<<< HEAD
    happy1(args) {
        return this.expressions_happy_1;
    }

    x2(args) {
=======
    x2(args){
>>>>>>> 661e75c54011de9bacc77e2f037a6ce39f0745cc
        return this.position_x_2;
    }
    y2(args) {
        return this.position_y_2;
    }
    happy2(args) {
        return this.expressions_happy_2;
    }
}

module.exports = Scratch3FaceDetectionBlocks;