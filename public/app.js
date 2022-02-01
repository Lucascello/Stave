(function () {
    const keyss = document.querySelectorAll(".key");
    const symbols = document.querySelectorAll(".symbol");
    const save = document.getElementById("button");
    const playButton = document.querySelector(".play");
    const stopButton = document.querySelector(".stop");
    let currentAudio;
    let duration = "q";
    let score = [];
    let currentBar = 1;
    let tempBar = [];
    let sumTempBarDuration = 0;
    const finishedBar = {
        w: 4,
        wr: 4,
        h: 2,
        hr: 2,
        q: 1,
        qr: 1,
        8: 0.5,
        "8r": 0.5,
        16: 0.25,
        "16r": 0.25,
    };
    const noteName = {
        c3: "c/3",
        db3: "c#/3",
        d3: "d/3",
        eb3: "d#/3",
        e3: "e/3",
        f3: "f/3",
        gb3: "f#/3",
        g3: "g/3",
        ab3: "g#/3",
        a3: "a/3",
        bb3: "a#/3",
        b3: "b/3",
        c4: "c/4",
        db4: "c#/4",
        d4: "d/4",
        eb4: "d#/4",
        e4: "e/4",
        f4: "f/4",
        gb4: "f#/4",
        g4: "g/4",
        ab4: "g#/4",
        a4: "a/4",
        bb4: "a#/4",
        b4: "b/4",
        cb5: "c/5",
        c5: "c/5",
        db5: "c#/5",
        d5: "d/5",
        eb5: "d#/5",
        e5: "e/5",
        f5: "f/5",
        gb5: "f#/5",
        g5: "g/5",
        ab5: "g#/5",
        a5: "a/5",
        bb5: "a#/5",
        b5: "b/5",
    };

    keyss.forEach((key) => {
        key.addEventListener("click", () => {
            playNote(key);
            addNoteToBar(key);
            // console.log("This is my global currentAudio: ", currentAudio);
        });
    });

    function playNote(key) {
        const noteAudio = document.getElementById(key.dataset.note);
        noteAudio.currentTime = 0;
        if (currentAudio) {
            currentAudio.pause();
            let siblings = key.parentElement.children;
            for (let sib of siblings) {
                sib.classList.remove("active");
            }
            // console.log("last note played before current one: ", currentAudio);
        }
        noteAudio.play();
        currentAudio = noteAudio;
        // console.log("note I'm Playing: ", currentAudio);
        key.classList.add("active");
        noteAudio.addEventListener("ended", () => {
            key.classList.remove("active");
        });
    }

    symbols.forEach((symbol) => {
        symbol.addEventListener("click", () => highlightNote(symbol));
    });

    function highlightNote(symbol) {
        // if (symbol.classList.contains("active")) {
        //     duration = undefined;
        //     symbol.classList.toggle("active");
        //     console.log("duration to toggle:", duration);
        //     return;
        // }
        duration = symbol.dataset.duration;
        document.querySelectorAll(".symbol").forEach((el) => {
            el.classList.remove("active");
        });
        symbol.classList.add("active");
        console.log("note duration:", duration);
    }

    if (save) {
        save.addEventListener("click", saveMusicSheet);
    }

    function saveMusicSheet() {
        let name = prompt("Name your composition");
        console.log(name);
        console.log("valor do score: ", score);
    }

    function addNoteToBar(key) {
        console.log(
            "name of the note I'm playing: ",
            noteName[currentAudio.id]
        );
        console.log("finished bar:", finishedBar[duration]);

        let currentNote = {
            keys: noteName[currentAudio.id],
            duration: duration,
        };

        console.log("currentNote: ", currentNote);

        if (sumTempBarDuration + finishedBar[duration] <= 4) {
            sumTempBarDuration += finishedBar[duration];
            console.log("##############", sumTempBarDuration);
            tempBar.push(currentNote);
            console.log("my tempbar: ", tempBar);
            if (sumTempBarDuration === 4) {
                console.log("currentBar*********:", currentBar);
                drawNotesInTheBar(
                    createNotesToInsertInTheBar(...tempBar),
                    currentBar
                );
                currentBar++;
                score.push(tempBar);
                console.log("my new score: ", score);
                sumTempBarDuration = 0;
                tempBar = [];
            }
        } else {
            tempBar = [currentNote];
        }
    }

    /////////////////////////////// creating the staves ///////////////////////////////////////
    const VF = Vex.Flow;
    const div = document.getElementById("container");
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(1000, 520);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    // 5 staves with 2 bars each
    const bar1 = new VF.Stave(30, 0, 460);
    bar1.addClef("treble").addTimeSignature("4/4");
    bar1.setContext(context).draw();
    const bar2 = new VF.Stave(490, 0, 460);
    bar2.setContext(context).draw();
    const bar3 = new VF.Stave(30, 100, 460);
    bar3.addClef("treble");
    bar3.setContext(context).draw();
    const bar4 = new VF.Stave(490, 100, 460);
    bar4.setContext(context).draw();
    const bar5 = new VF.Stave(30, 200, 460);
    bar5.addClef("treble");
    bar5.setContext(context).draw();
    const bar6 = new VF.Stave(490, 200, 460);
    bar6.setContext(context).draw();
    const bar7 = new VF.Stave(30, 300, 460);
    bar7.addClef("treble");
    bar7.setContext(context).draw();
    const bar8 = new VF.Stave(490, 300, 460);
    bar8.setContext(context).draw();
    const bar9 = new VF.Stave(30, 400, 460);
    bar9.addClef("treble");
    bar9.setContext(context).draw();
    const bar10 = new VF.Stave(490, 400, 460);
    bar10.setContext(context).draw();

    const bars = [bar1, bar2, bar3, bar4, bar5, bar6, bar7, bar8, bar9, bar10];

    ///////////////////////////  bars /////////////////////////////////////////

    function createNotesToInsertInTheBar() {
        const notes = [];
        // console.log("My notes to add to the bar", ...arguments);
        for (index in arguments) {
            console.log("index:", index);
            const arg = arguments[index];
            console.log("arg: ", arg);
            //checar todos os elementos (args)
            //arg é um [{}, {}, {}]
            if (
                arg.keys.substring(1, 2) === "#" ||
                arg.keys.substring(1, 2) === "b"
            ) {
                notes.push(
                    new VF.StaveNote({
                        keys: [arg.keys],
                        duration: arg.duration,
                    }).addAccidental(
                        0,
                        new VF.Accidental(arg.keys.substring(1, 2))
                    )
                );
            } else {
                notes.push(
                    new VF.StaveNote({
                        keys: [arg.keys],
                        duration: arg.duration,
                    })
                );
            }
        }
        console.log("notes: ", notes);
        return notes;
    }

    function drawNotesInTheBar(arg, barPos) {
        let voice = [];
        let formatter = [];
        // let bar = [];
        for (let i = 0; i <= 10; i++) {
            voice[i] = new VF.Voice({ num_beats: 4, beat_value: 4 });
            voice[i].addTickables(arg);
            formatter[i] = new VF.Formatter()
                .joinVoices([voice[i]])
                .format([voice[i]], 400);
            voice[i].draw(context, bars[barPos - 1]);
        }
    }

    ////////////////////// playing button/audio //////////////////////////

    playButton.addEventListener("click", play);
    stopButton.addEventListener("click", stopPlaying);

    const BPM = 90;

    const bpmMilliseconds = 1000 / (BPM / 60); // example: 90 BPM gives 666 milliseconds
    let interval = null;
    let playDuration = 0;

    function play() {
        let noteToBePlayed = getNextNote();

        // calculate the lenght of the first note in milliseconds
        updateCurrentNoteDuration(noteToBePlayed.duration);
        console.log("play duration da musica:", playDuration);

        interval = setInterval(() => {
            //if (nota_atual_nao_eh_pausa) {
            const noteAudio = document.getElementById(
                getKeyByValue(noteName, noteToBePlayed.keys)
            );
            noteAudio.play();
            //}

            noteToBePlayed = getNextNote(); // pass the value of the next note
            updateCurrentNoteDuration(noteToBePlayed.duration);
        }, playDuration);
    }

    function stopPlaying() {
        clearInterval(interval);
        interval = null;
    }

    // calculate the note duration based on the milliseconds
    function updateCurrentNoteDuration(noteDuration) {
        // exemplo: 666 * 2 (no caso de uma mínima) = 1332 milissegundos
        playDuration = bpmMilliseconds * finishedBar[noteDuration]; // currentBar é o mapa que vc fez no domingo de letras para números ('h' => 2, etc)
    }

    let iteratorBar = 0;
    let iteratorNote = 0;

    function getNextNote() {
        if (!score.length) {
            return false;
        }
        console.log("what's the lenght of my score:", score);
        console.log(
            "iteratorBar e ******** iteratorNote: ",
            iteratorBar,
            iteratorNote
        );
        const nextNote = score[iteratorBar][iteratorNote];
        if (score)
            if (score[iteratorBar].length === iteratorNote + 1) {
                iteratorNote = 0;
                if (score.length !== iteratorBar + 1) {
                    iteratorBar++;
                }
            } else {
                iteratorNote++;
            }

        return nextNote;
    }
    function getKeyByValue(object, value) {
        return Object.keys(object).find((key) => object[key] === value);
    }
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

//////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////

// function createKeyNotes(note, range) {
//     //return octaveKeys
// }

//////////////////// creating the piano keyboard dinamicaly ////////////////////////////

// let numberOfOctaves = 3;
// const octaveWidth = 560;
// const pianoSVG = `<svg
//         version="1.1"
//         xmlns="http://www.w3.org/2000/svg"
//         xmlns:xlink="http//www.w3.org/1999/xlink"
//         viewbox="0 0 ${numberOfOctaves * octaveWidth} 150"
//     >
//     <g id="piano-keyboard"></g>
//     </svg>`;

// const whiteNotes = ["c", "d", "e", "f", "g", "a", "b"];
// const range = ["c3", "b5"];

// const piano = document.querySelector("#piano");

// const keyboard = {
//     keyboardSetup() {
//         //Add SVG to piano div
//         piano.innerHTML = pianoSVG;
//         const pianoKeyboard = document.querySelector("#piano-keyboard");

//         //Cretae Octaves
//         for (let i = 0; i < numberOfOctaves; i++) {
//             const octave = utilities.createSVGElement("g");
//             octave.classList.add("octave");
//             octave.setAttribute(
//                 "transform",
//                 `translate(${i * octaveWidth}, 0)`
//             );

//             let naturalKeyPositionX = 0;
//             let sharpKeyPositionX = 60;

//             // Add keys for white notes
//             for (let j = 0; j < 7; j++) {
//                 const naturalKey = utilities.createSVGElement("rect");
//                 naturalKey.classList.add("white-key");
//                 naturalKey.setAttribute("x", naturalKeyPositionX);
//                 naturalKey.setAttribute("width", 80);
//                 naturalKey.setAttribute("height", 151);
//                 naturalKey.setAttribute("stroke", "#232323");
//                 naturalKey.setAttribute("fill", "#FFFFF7");
//                 naturalKeyPositionX += 80;
//                 octave.appendChild(naturalKey);
//             }
//             //Add keys for black notes
//             for (let k = 0; k < 5; k++) {
//                 const sharpKey = utilities.createSVGElement("rect");
//                 sharpKey.classList.add("white-key");
//                 sharpKey.setAttribute("x", sharpKeyPositionX);
//                 sharpKey.setAttribute("width", 40);
//                 sharpKey.setAttribute("height", 100);
//                 sharpKey.setAttribute("stroke", "#252424");
//                 sharpKey.setAttribute("fill", "#101010");

//                 if (k === 1) {
//                     sharpKeyPositionX += 160;
//                 } else {
//                     sharpKeyPositionX += 80;
//                 }

//                 octave.appendChild(sharpKey);
//             }
//             pianoKeyboard.appendChild(octave);
//         }
//     },
//     getAllWhiteNotes([firstNote, lastNote]) {
//         //Which octave and note
//         const firstNoteName = firstNote[0];
//         const firstOctaveNumber = parseInt(firstNote[1]);
//         // console.log("firstOctaveNumber", firstOctaveNumber);

//         const lastNoteName = lastNote[0];
//         const lastOctaveNumber = parseInt(lastNote[1]);
//         console.log("lastOctaveNumber", lastOctaveNumber);

//         const firstNotePosition = whiteNotes.indexOf(firstNoteName);
//         const lastNotePosition = whiteNotes.indexOf(lastNoteName);
//         console.log(
//             " these are firstNotePosition, lastNotePosition",
//             firstNotePosition,
//             lastNotePosition
//         );

//         const allWhiteNotes = [];
//         for (
//             let octaveNumber = firstOctaveNumber;
//             octaveNumber <= lastOctaveNumber;
//             octaveNumber++
//         ) {
//             allWhiteNotes.push(
//                 whiteNotes.map((notename) => {
//                     return notename + "/" + octaveNumber;
//                 })
//             );
//         }
//         console.log("allWhiteNotes", allWhiteNotes);
//     },
// };

// const utilities = {
//     createSVGElement(e) {
//         const element = document.createElementNS(
//             "http://www.w3.org/2000/svg",
//             e
//         );
//         return element;
//     },
// };

// keyboard.keyboardSetup();
// keyboard.getAllWhiteNotes(range);
