(function () {
    const keyss = document.querySelectorAll(".key");
    const symbols = document.querySelectorAll(".symbol");
    const save = document.getElementById("saveButton");
    const print = document.getElementById("print");
    const playButton = document.querySelector(".play");
    const stopButton = document.querySelector(".stop");
    const clearButton = document.querySelector(".erase");
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
        cb5: "C/5",
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

    //////////////////////////////// sound on the piano ///////////////////////////////////

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
        // console.log("note duration:", duration);
    }

    ////////////////////////////// clear the music sheet //////////////////////////////
    // console.log("clearbTN", clearButton);

    if (clearButton) {
        clearButton.addEventListener("click", clearPage);
    }

    function clearPage() {
        location.reload();
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
    bar10.setEndBarType(VF.Barline.type.END);
    bar10.setContext(context).draw();

    const bars = [bar1, bar2, bar3, bar4, bar5, bar6, bar7, bar8, bar9, bar10];

    ///////////////////////////  write into the bars /////////////////////////////////////////

    function createNotesToInsertInTheBar() {
        const notes = [];
        // console.log("My notes to add to the bar", ...arguments);
        for (index in arguments) {
            // console.log("index:", index);
            const arg = arguments[index];
            // console.log("arg: ", arg);
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
        // console.log("notes: ", notes);
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

    function addNoteToBar(key) {
        // console.log(
        //     "name of the note I'm playing: ",
        //     noteName[currentAudio.id]
        // );
        // console.log("finished bar:", finishedBar[duration]);

        let currentNote = {
            keys: noteName[currentAudio.id],
            duration: duration,
        };

        // console.log("currentNote: ", currentNote);

        if (sumTempBarDuration + finishedBar[duration] <= 4) {
            sumTempBarDuration += finishedBar[duration];
            // console.log("##############", sumTempBarDuration);
            tempBar.push(currentNote);
            // console.log("my tempbar: ", tempBar);
            if (sumTempBarDuration === 4) {
                // console.log("currentBar*********:", currentBar);
                drawNotesInTheBar(
                    createNotesToInsertInTheBar(...tempBar),
                    currentBar
                );
                currentBar++;
                score.push(tempBar);
                // console.log("my new score: ", score);
                sumTempBarDuration = 0;
                tempBar = [];
            }
        } else {
            tempBar = [currentNote];
        }
    }

    ////////////////////// playing button/audio //////////////////////////

    const BPM = 90;

    const bpmMilliseconds = 1000 / (BPM / 60); // example: 90 BPM gives 666 milliseconds
    let playDuration = 0;
    const play = async () => {
        playDuration = 0;
        const flatScore = [];

        for (const notes of score) {
            flatScore.push(...notes);
        }

        for (const note of flatScore) {
            await new Promise((resolve) =>
                noteTimeouts.push(
                    setTimeout(() => {
                        playSingleNote(note, resolve);
                        updateCurrentNoteDuration(finishedBar[note.duration]);
                    }, playDuration)
                )
            );
        }
    };

    const playSingleNote = (note, done) => {
        noteAudio = document.getElementById(getKeyByValue(noteName, note.keys));
        noteAudio.currentTime = 0;
        if (currentAudio) {
            currentAudio.pause();
            // console.log("last note played before current one: ", currentAudio);
        }
        noteAudio.play();
        // console.log("This is the note for the player to play: ", noteAudio);
        // console.log("playing the note: ", note, Date.now());
        done();
    };

    playButton.addEventListener("click", play);
    stopButton.addEventListener("click", stopPlaying);

    const noteTimeouts = [];

    function stopPlaying() {
        for (const timeOut of noteTimeouts) {
            clearTimeout(timeOut);
        }
    }

    function updateCurrentNoteDuration(noteDuration) {
        // example: 666 * 2 (in case it's a half note) = 1332 milissegundos
        playDuration = bpmMilliseconds * noteDuration; // currentBar my finishedBar object
        // console.log("noteDuration", noteDuration);
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find((key) => object[key] === value);
    }

    /////////////////////////////// printing sheet //////////////////////////

    print.addEventListener("click", printDiv);

    function printDiv() {
        var divContents = document.getElementById("container").innerHTML;
        var a = window.open("", "", "height=500, width=500");
        a.document.write("<html>");
        a.document.write("<body > <h1>Your Masterpiece <br>");
        a.document.write(divContents);
        a.document.write("</body></html>");
        a.document.close();
        a.print();
    }

    /////////////////////////////// saving music sheet /////////////////////////////

    if (save) {
        save.addEventListener("click", saveMusicSheet);
    }

    function saveMusicSheet() {
        let name = prompt("Name your composition");

        score.unshift(name);
        console.log("Score with name:", score);
        // console.log("score in JSON: ", JSON.stringify(score));

        fetch("/home", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(score),
        })
            .then((data) => data.json())
            .then((data) => {
                console.log(" data from the score:", data);
                if (data.success) {
                    clearPage();
                } else {
                    console.log("I suck");
                }
            });
    }
})();
