(function () {
    //////////////////// creating the piano keyboard dinamicaly ////////////////////////////

    let numberOfOctaves = 2;
    const octaveWidth = 560;
    const pianoSVG = `<svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http//www.w3.org/1999/xlink"
            viewbox="0 0 ${numberOfOctaves * octaveWidth} 150"
        >
        <g id="piano-keyboard"></g>
        </svg>`;

    const whiteNotes = ["c", "d", "e", "f", "g", "a", "b"];
    const range = ["c4", "b5"];

    const piano = document.querySelector("#piano");

    const keyboard = {
        keyboardSetup() {
            //Add SVG to piano div
            piano.innerHTML = pianoSVG;
            const pianoKeyboard = document.querySelector("#piano-keyboard");

            //Cretae Octaves
            for (let i = 0; i < numberOfOctaves; i++) {
                const octave = utilities.createSVGElement("g");
                octave.classList.add("octave");
                octave.setAttribute(
                    "transform",
                    `translate(${i * octaveWidth}, 0)`
                );

                let naturalKeyPositionX = 0;
                let sharpKeyPositionX = 60;

                // Add keys for white notes
                for (let j = 0; j < 7; j++) {
                    const naturalKey = utilities.createSVGElement("rect");
                    naturalKey.classList.add("white-key");
                    naturalKey.setAttribute("x", naturalKeyPositionX);
                    naturalKey.setAttribute("width", 80);
                    naturalKey.setAttribute("height", 151);
                    naturalKey.setAttribute("stroke", "#232323");
                    naturalKey.setAttribute("fill", "#FFFFF7");
                    naturalKeyPositionX += 80;
                    octave.appendChild(naturalKey);
                }
                //Add keys for black notes
                for (let k = 0; k < 5; k++) {
                    const sharpKey = utilities.createSVGElement("rect");
                    sharpKey.classList.add("white-key");
                    sharpKey.setAttribute("x", sharpKeyPositionX);
                    sharpKey.setAttribute("width", 40);
                    sharpKey.setAttribute("height", 100);
                    sharpKey.setAttribute("stroke", "#252424");
                    sharpKey.setAttribute("fill", "#101010");

                    if (k === 1) {
                        sharpKeyPositionX += 160;
                    } else {
                        sharpKeyPositionX += 80;
                    }

                    octave.appendChild(sharpKey);
                }
                pianoKeyboard.appendChild(octave);
            }
        },
        getAllWhiteNotes([firstNote, lastNote]) {
            //Which octave and note
            const firstNoteName = firstNote[0];
            const firstOctaveNumber = parseInt(firstNote[1]);
            // console.log("firstOctaveNumber", firstOctaveNumber);

            const lastNoteName = lastNote[0];
            const lastOctaveNumber = parseInt(lastNote[1]);
            console.log("lastOctaveNumber", lastOctaveNumber);

            const firstNotePosition = whiteNotes.indexOf(firstNoteName);
            const lastNotePosition = whiteNotes.indexOf(lastNoteName);
            console.log(
                " these are firstNotePosition, lastNotePosition",
                firstNotePosition,
                lastNotePosition
            );

            const allWhiteNotes = [];
            for (
                let octaveNumber = firstOctaveNumber;
                octaveNumber <= lastOctaveNumber;
                octaveNumber++
            ) {
                allWhiteNotes.push(
                    whiteNotes.map((notename) => {
                        return notename + "/" + octaveNumber;
                    })
                );
            }
            console.log("allWhiteNotes", allWhiteNotes);
        },
    };

    const utilities = {
        createSVGElement(e) {
            const element = document.createElementNS(
                "http://www.w3.org/2000/svg",
                e
            );
            return element;
        },
    };

    keyboard.keyboardSetup();
    keyboard.getAllWhiteNotes(range);

    /////////////////////////////// creating the staves ///////////////////////////////////////
    const VF = Vex.Flow;
    const div = document.getElementById("container");
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(1000, 520);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    // 5 staves with 2 bars each
    const stave1Bar1 = new VF.Stave(30, 0, 460);
    stave1Bar1.addClef("treble").addTimeSignature("4/4");
    stave1Bar1.setBegBarType(Vex.Flow.Barline.type.REPEAT_BEGIN);
    stave1Bar1.setContext(context).draw();
    const stave1Bar2 = new VF.Stave(490, 0, 460);
    stave1Bar2.setContext(context).draw();
    const stave2Bar1 = new VF.Stave(30, 100, 460);
    stave2Bar1.addClef("treble");
    stave2Bar1.setContext(context).draw();
    const stave2Bar2 = new VF.Stave(490, 100, 460);
    stave2Bar2.setEndBarType(Vex.Flow.Barline.type.REPEAT_END);
    stave2Bar2.setContext(context).draw();
    const stave3Bar1 = new VF.Stave(30, 200, 460);
    stave3Bar1.setBegBarType(Vex.Flow.Barline.type.REPEAT_BEGIN);
    stave3Bar1.addClef("treble");
    stave3Bar1.setContext(context).draw();
    const stave3Bar2 = new VF.Stave(490, 200, 460);
    stave3Bar2.setEndBarType(Vex.Flow.Barline.type.REPEAT_END);
    stave3Bar2.setContext(context).draw();
    const stave4Bar1 = new VF.Stave(30, 300, 460);
    stave4Bar1.addClef("treble");
    stave4Bar1.setContext(context).draw();
    const stave4Bar2 = new VF.Stave(490, 300, 460);
    stave4Bar2.setContext(context).draw();
    const stave5Bar1 = new VF.Stave(30, 400, 460);
    stave5Bar1.addClef("treble");
    stave5Bar1.setContext(context).draw();
    const stave5Bar2 = new VF.Stave(490, 400, 460);
    stave5Bar2.setEndBarType(Vex.Flow.Barline.type.END);
    stave5Bar2.setContext(context).draw();

    ///////////////////////////  bar 1 /////////////////////////////////////////
    // const notes1 = [
    //     // A quarter-note C.
    //     new VF.StaveNote({ keys: ["c/4"], duration: "q" }),

    //     // A quarter-note D.
    //     new VF.StaveNote({ keys: ["c/4"], duration: "q" }),

    //     // A quarter-note rest. Note that the key (b/4) specifies the vertical
    //     // position of the rest.
    //     new VF.StaveNote({ keys: ["g/4"], duration: "q" }),

    //     // A C-Major chord.
    //     new VF.StaveNote({ keys: ["g/4"], duration: "q" }),
    // ];

    function createNotes() {
        const notes = [];
        console.log("...", ...arguments);
        for (index in arguments) {
            const arg = arguments[index];
            notes.push(
                new VF.StaveNote({ keys: [arg.keys], duration: arg.duration })
            );
        }
        console.log("notes: ", notes);
        return notes;
    }

    const notes1 = createNotes(
        { keys: "c/4", duration: "q" },
        { keys: "c/4", duration: "q" },
        { keys: "g/4", duration: "q" },
        { keys: "g/4", duration: "q" }
    );

    // Create a voice in 4/4 and add above notes
    const voice1 = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice1.addTickables(notes1);

    // Format and justify the notes to 400 pixels.
    const formatter = new VF.Formatter()
        .joinVoices([voice1])
        .format([voice1], 400);

    // Render voice1
    voice1.draw(context, stave1Bar1);

    //////////////////////////// bar 2 /////////////////////////////////////
    const notes2 = [
        new VF.StaveNote({ keys: ["a/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["a/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["g/4"], duration: "h" }),
    ];

    const voice2 = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice2.addTickables(notes2);

    const formatter1 = new VF.Formatter()
        .joinVoices([voice2])
        .format([voice2], 400);

    voice2.draw(context, stave1Bar2);

    //////////////////////////// bar 3 ////////////////////////////////////
    const notes3 = [
        new VF.StaveNote({ keys: ["f/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["f/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["e/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["e/4"], duration: "q" }),
    ];

    const voice3 = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice3.addTickables(notes3);

    const formatter2 = new VF.Formatter()
        .joinVoices([voice3])
        .format([voice3], 400);

    voice3.draw(context, stave2Bar1);

    //////////////////////////// bar 4 /////////////////////////////////////
    const notes4 = [
        new VF.StaveNote({ keys: ["d/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["d/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["c/4"], duration: "h" }),
    ];

    const voice4 = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice4.addTickables(notes4);

    const formatter3 = new VF.Formatter()
        .joinVoices([voice4])
        .format([voice4], 400);

    voice4.draw(context, stave2Bar2);

    //////////////////////////// bar 5 ////////////////////////////////////
    const notes5 = [
        new VF.StaveNote({ keys: ["g/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["g/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["f/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["f/4"], duration: "q" }),
    ];

    const voice5 = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice5.addTickables(notes5);

    const formatter4 = new VF.Formatter()
        .joinVoices([voice5])
        .format([voice5], 400);

    voice5.draw(context, stave3Bar1);

    //////////////////////////// bar 6 /////////////////////////////////////
    const notes6 = [
        new VF.StaveNote({ keys: ["e/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["e/4"], duration: "q" }),

        new VF.StaveNote({ keys: ["d/4"], duration: "h" }),
    ];

    const voice6 = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice6.addTickables(notes6);

    const formatter5 = new VF.Formatter()
        .joinVoices([voice6])
        .format([voice6], 400);

    voice6.draw(context, stave3Bar2);

    ////////////////////////////////bar 7 /////////////////////////////////////
    notes1;
    voice1;
    formatter;
    voice1.draw(context, stave4Bar1);

    //////////////////////////////// bar 8 ////////////////////////////////////
    notes2;
    voice2;
    formatter1;
    voice2.draw(context, stave4Bar2);

    ////////////////////////////////bar 9 /////////////////////////////////////
    notes3;
    voice3;
    formatter2;
    voice3.draw(context, stave5Bar1);

    ////////////////////////////////bar 10 /////////////////////////////////////
    notes4;
    voice4;
    formatter3;
    voice4.draw(context, stave5Bar2);
})();

// const map = new Map([
//     [[0, 10], "c/4"],
//     [[10, 20], "d/4"],
//     [[20, 30], "e/4"],
// ]);

// canvas.on("click", (event) => {
//     const x = event.clientX;

//     for (let [min, max] of map.keys()) {
//         if (x > min && x < max) {
//             // Match
//             // VF.StaveNote()
//         }
//     }
// });

////////////////////////////////////////////////////////////////
// function createNotes() {
//     const notes = [];
//     console.log("...", ...arguments);
//     for (arg in arguments) {
//         notes.push(
//             new VF.StaveNote({ keys: [arg.keys], duration: arg.duration })
//         );
//     }
//     return notes;
// }

// const notes6 = [
//     new VF.StaveNote({ keys: ["d/4"], duration: "q" }),

//     new VF.StaveNote({ keys: ["d/4"], duration: "q" }),

//     new VF.StaveNote({ keys: ["c/4"], duration: "h" }),
// ];

// const quarter = document.querySelector(".quarter");
// const eight = document.querySelector(".eight");
// quarter.addEventListener("click", function () {
//     console.log("clicking quarter note");

// });

// quarter.onmousedown = function (event) {
//     let shiftX = event.clientX - quarter.getBoundingClientRect().left;
//     let shiftY = event.clientY - quarter.getBoundingClientRect().top;

//     quarter.style.position = "absolute";
//     quarter.style.zIndex = 1000;
//     document.body.append(quarter);

//     moveAt(event.pageX, event.pageY);

//     // moves the quarter at (pageX, pageY) coordinates
//     // taking initial shifts into account
//     function moveAt(pageX, pageY) {
//         quarter.style.left = pageX - shiftX + "px";
//         quarter.style.top = pageY - shiftY + "px";
//     }

//     function onMouseMove(event) {
//         moveAt(event.pageX, event.pageY);
//     }

//     // move the quarter on mousemove
//     document.addEventListener("mousemove", onMouseMove);

//     // drop the quarter, remove unneeded handlers
//     quarter.onmouseup = function () {
//         document.removeEventListener("mousemove", onMouseMove);
//         quarter.onmouseup = null;
//     };
// };

// quarter.ondragstart = function () {
//     return false;
// };

// eight.onmousedown = function (event) {
//     let shiftX = event.clientX - eight.getBoundingClientRect().left;
//     let shiftY = event.clientY - eight.getBoundingClientRect().top;

//     eight.style.position = "absolute";
//     eight.style.zIndex = 1000;
//     document.body.append(eight);

//     moveAt(event.pageX, event.pageY);

//     // moves the eight at (pageX, pageY) coordinates
//     // taking initial shifts into account
//     function moveAt(pageX, pageY) {
//         eight.style.left = pageX - shiftX + "px";
//         eight.style.top = pageY - shiftY + "px";
//     }

//     function onMouseMove(event) {
//         moveAt(event.pageX, event.pageY);
//     }

//     // move the eight on mousemove
//     document.addEventListener("mousemove", onMouseMove);

//     // drop the eight, remove unneeded handlers
//     eight.onmouseup = function () {
//         document.removeEventListener("mousemove", onMouseMove);
//         eight.onmouseup = null;
//     };
// };

// eight.ondragstart = function () {
//     return false;
// };

// function createKeyNotes(note, range) {
//     //return octaveKeys
// }

// function createKeyboard(note, range, numberOfOctaves) {
//     for (let i = 0; i < numberOfOctaves; i++) {
//         const octave = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             "g"
//         );
//         octave.classList.add("octave");
//         octave.setAttribute("transform", `translate(${i * octaveWidth}, 0) `);
//         octave.innerHTML = createKeyNotes(note, range + i);
//         pianoKeyboard.appendChild(octave);
//     }
// }
