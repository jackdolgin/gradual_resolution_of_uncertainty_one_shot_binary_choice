var jsPsychRoulette = (function (jspsych) {
    'use strict';

    const info = {
        name: "roulette",
        parameters: {
            selectedColor: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Selected Color',
                default: "yellow",
            },
            rotationsTime: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Rotations Time',
                default: 8, 
            },
            wheelSpinTime: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Wheel Spin Time',
                default: 4,
            },
            ballSpinTime: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Ball Spin Time',
                default: 8,
            },
            numbersFacing: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Numbers Facing',
                default: "inwards",
            },
        }
    }


    class RoulettePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {

            display_element.innerHTML = `
                <div class="overlay">
                    <div class="overlay-message">
                        <p id="overlay-description">To determine how much money you will end up with, we\'re going to start with the $${startingTotal} and spin a ball on a digital roulette wheel on the next screen. Whatever the ball lands on, that many ${dimesOrDollars} will be added to or subtracted from the $${startingTotal}.<p/>
                        <button id="overlay-button">OK</button>
                    </div>
                    <div id="card-container">
                        <div id="picker"></div>
                        <ul id="cardul"></ul>
                        <div id="bar-container"></div>
                        <button id="overlay-button2">OK</button>
                    </div>
                </div>
                </div>
                <div class="content-underneath">
                    <div class="spinner" id="spinnerID">

                        <div class="ball"><span></span></div>
                        <div class="platebg"></div>
                        <div class="platetop"></div>
                        <div id="toppart" class="topnodebox">
                            <div class="silvernode"></div>
                            <div class="topnode silverbg"></div>
                            <span class="top silverbg"></span>
                            <span class="right silverbg"></span>
                            <span class="down silverbg"></span>
                            <span class="left silverbg"></span>
                        </div>
                        <div id="rcircle" class="pieContainer">
                            <div class="pieBackground"></div>
                        </div>
                    </div>

                    <div class="control">
                        <div>
                            <div id="btnSpin" class="button">Spin</div>
                            <div id="selection-explained"></div>
                            <div class="other-buttons">
                                <div id="btnb" class="button">Enlarge</div>
                                <div id="btns" class="button">Shrink</div>
                                <div id="btnselect" class="button">Reveal</div>
                            </div>
                            <div id="btnproceed" class="button">Proceed</div>
                        </div>
                    </div>
                </div>
            `

            if (omission == "ball"){
                document.getElementById("selection-explained").innerHTML = "The numbers that are still in play are in red and black. Recalibration is up next, and then you'll find out precisely where the ball landed."
            } else if (omission == "numbers"){
                document.getElementById("selection-explained").innerHTML = "The numbers that are no longer in play are in the brown tiles. Recalibration is up next, and then you'll find out precisely which number the ball landed on."
            }
            
            const plateBGColor = $(".platebg").css("background-color");
            const redGradient = getComputedStyle(document.documentElement).getPropertyValue('--red-gradient');
            const blackGradient = getComputedStyle(document.documentElement).getPropertyValue('--black-gradient');
            const whiteColor = getComputedStyle(document.documentElement).getPropertyValue('--white-color');
            const blackColor = getComputedStyle(document.documentElement).getPropertyValue('--black-color');
            
            const removeOverlay = () =>  overlay.style.display = 'none';
            
            let overlay = document.querySelector('.overlay');
            let overlayWriting = document.querySelector('#overlay-description');
            let OverlayBtn = document.querySelector('#overlay-button');
            

            // temporary line
            // removeOverlay();

            OverlayBtn.addEventListener('click',removeOverlay);

            var numbg = $(".pieContainer");
            var ballbg = $(".ball");
            var btnSpin = $("#btnSpin");
            var toppart = $("#toppart");
            var pfx = $.keyframe.getVendorPrefix();
            var transform = pfx + "transform";
            var rinner = $("#rcircle");
            var numberLoc = [];
            $.keyframe.debug = true;
            
            createWheel();
            function createWheel() {
                var temparc = 360 / numorder.length;
                for (var i = 0; i < numorder.length; i++) {
                    numberLoc[numorder[i]] = [];
                    numberLoc[numorder[i]][0] = i * temparc;
                    numberLoc[numorder[i]][1] = i * temparc + temparc;
                
                    let newSlice = document.createElement("div");
                    $(newSlice).addClass("hold");
                    let newHold = document.createElement("div");
                    $(newHold).addClass("pie");
                    $(newHold).attr('id', 'hold' + i);
                    let newNumber = document.createElement("div");
                    $(newNumber).addClass("num");
                    $(newNumber).attr('id', 'num' + i);
            
                    newNumber.innerHTML = numorder[i];
                    $(newSlice).attr("id", "rSlice" + i);
                    $(newSlice).css(
                        "transform",
                        "rotate(" + numberLoc[numorder[i]][0] + "deg)"
                    );
                    
                    if (trial.numbersFacing == "upright"){
                        $(newNumber).css(
                            "transform",
                            "rotate("  + - numberLoc[numorder[i]][0] + "deg)"
                        );
                    } else if (numorder.length == 6){
                        $(newNumber).css("transform", "rotate(32deg)");
                    }

                    $(newHold).css("transform", `rotate(${temparc}deg`);
                    $(newHold).css("-webkit-transform", `rotate(${temparc}deg)`);
                    if (numorder.length > 25){
                        $(newHold).css("border", "solid .1em #FFF");
                        if (numorder.length == 36){
                            $(newNumber).css("top", "0.4em");
                            $(newNumber).css("left", "10.28em");
                        }
                    } else{
                        $(newHold).css("border", "solid .03em #FFF");
                        if (numorder.length == 6){
                            $(newNumber).css("top", "1.9em");
                            $(newNumber).css("left", "14.28em");
                        }
                    }
            
                    if ($.inArray(numorder[i], numred) > -1) {
                        $(newHold).addClass("redbg");
                    } else if ($.inArray(numorder[i], numblack) > -1) {
                        $(newHold).addClass("greybg");
                    }
            
                    $(newHold).appendTo(newSlice);
                    $(newSlice).appendTo(rinner);
                    $(newNumber).appendTo(newSlice);
                    // if (omission == "numbers") {$(newNumber).css("display", "none");}
                    if (omission == "numbers"){
                        ($(newNumber)[0]).style.display = "none"
                    }
                    

                }
                
                // if (numorder.length > 25){
                //     $(".pie").css("border", "solid .1em #FFF");
                // } else{
                //     $(".pie").css("border", "solid .03em #FFF");
                //     if (numorder.length == 6){
                //         $(".num").css("top", "1.9em");
                //         $(".num").css("left", "14.28em");
                //     }
                // }
            }

            

            function onSpinPress () {

                spinTo(14);
                btnSpin.off('click',onSpinPress);
            }

            btnSpin.click(onSpinPress);
            
            $("#btnb").click(function() {
                $(".spinner").css("font-size", "+=.3em");
            });
            $("#btns").click(function() {
                $(".spinner").css("font-size", "-=.3em");
            });
            
            function resetAni() {
                let animationPlayState = "animation-play-state";
                let playStateRunning = "running";
            
                $(ballbg)
                .css(pfx + animationPlayState, playStateRunning)
                .css(pfx + "animation", "none");
            
                $(numbg)
                .css(pfx + animationPlayState, playStateRunning)
                .css(pfx + "animation", "none");
                $(toppart)
                .css(pfx + animationPlayState, playStateRunning)
                .css(pfx + "animation", "none");
            
                $("#rotate2").html("");
                $("#rotate").html("");
            }
            
            function spinTo(winningNum) {
                //set timer here
                setTimeout(function() {
                var ballDiv = document.getElementsByClassName("ball")[0];
                    if (omission == "ball"){
                        var opacity = 1;
                        var interval = setInterval(function() {
                            opacity -= 0.05;
                            ballDiv.style.opacity = opacity;
                            if (opacity <= 0) {
                            clearInterval(interval);
                            }
                        }, 20);
                    }
                }, 100);
                
                
                //get location
                var temp = numberLoc[winningNum][0] + 4;
            
                //randomize
                var rndSpace = Math.floor(Math.random() * 360 + 1);
            
                resetAni();
                setTimeout(function() {
                bgrotateTo(rndSpace);
                ballrotateTo(rndSpace + temp, rndSpace, winningNum);
                }, 500);
            }
            
            function ballrotateTo(deg, rndSpace, winningNum) {
                let extraBallRotation = (wheelCondition == "confined_wheel") ? 30 : 0;
                var temptime = trial.rotationsTime + 's';
                var dest = -360 * trial.ballSpinTime - (360 - deg) + extraBallRotation;
                $.keyframe.define({
                name: "rotate2",
                from: {
                    transform: "rotate(0deg)"
                },
                to: {
                    transform: "rotate(" + dest + "deg)"
                }
                });
            
                $(ballbg).playKeyframe({
                name: "rotate2", // name of the keyframe you want to bind to the selected element
                duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
                timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
                complete: function() {
                    setTimeout(function() {
                        finishSpin(rndSpace, winningNum)
                    }, 1000)
                } //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
                });
            }
            
            function bgrotateTo(deg) {

                var dest = 360 * trial.wheelSpinTime + deg;
                var temptime = (trial.rotationsTime * 1000 - 1000) / 1000 + 's';
            
                $.keyframe.define({
                    name: "rotate",
                    from: {
                        transform: "rotate(0deg)"
                    },
                    to: {
                        transform: "rotate(" + dest + "deg)"
                    }
                });
            
                $(numbg).playKeyframe({
                    name: "rotate", // name of the keyframe you want to bind to the selected element
                    duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
                    timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
                    complete: function() {} //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
                });
            
                $(toppart).playKeyframe({
                    name: "rotate", // name of the keyframe you want to bind to the selected element
                    duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
                    timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
                    complete: function() {} //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
                });
            }
            
            function finishSpin(rndSpace, winningNum){

                activateHighlighting(winningNum);

                OverlayBtn.removeEventListener('click', removeOverlay);

                // let surpriseExplanation;
                // if (omission == "ball"){
                //     surpriseExplanation = "the ball disappeared during the spin"
                // } else if (omission == "numbers"){
                //     surpriseExplanation = "no numbers appeared on the roulette wheel"
                // }

                // overlayWriting.innerHTML = `As you probably noticed, ${surpriseExplanation}. That was on purpose. We don\'t want to spoil exactly how much you will earn, so that you stay focused during the recalibration.`;
                // overlay.style.display = 'block';

                // OverlayBtn.addEventListener('click', function() {

                //     if (omission == "ball"){
                //         lastTwoInstructions();
                //     } else if (omission == "numbers"){
                //         overlayWriting.innerHTML = `Numbers ${lowEnd} to ${highEnd} are assigned to each of the ${numorder.length} spaces on the roulette wheel. They are scrambled, so that you don\'t know which number corresponds to which space.`;
                //         OverlayBtn.addEventListener('click', function() {
                //             lastTwoInstructions();
                //         })
                //     }

                //     function lastTwoInstructions() {
                //         overlayWriting.innerHTML = 'But, you can learn some information now. Specifically, you can ask whether any set of numbers on the roulette wheel contain where the ball landed on. We\'ll then tell you whether the ball landed somewhere among that set, which will narrow down the possibilities.'
                //         OverlayBtn.addEventListener('click', function() {
    
                //             overlayWriting.innerHTML = "To ask, click or drag a set of numbers, which will turn them yellow. When you\'ve selected the numbers you want, click 'Reveal'. You can only ask once."
    
                //             OverlayBtn.addEventListener('click', function() {
                                document.querySelector('#btnSpin').style.display = 'none';
                //                 if (omission == "ball"){
                //                     angleNumbers(rndSpace);
                //                     activateHighlighting(winningNum);
                //                 } else if (omission == "numbers"){
                //                     selectCard(winningNum);
                //                 }
                //             })
                //         })
                //     }
                // })

            }

            function angleNumbers(rndSpace){
                for (var i = 0; i < numorder.length; i++) {
                    let sliceRotation = document.querySelector("#rSlice" + i).style.transform;

                    function extractRotationNumber(str) {
                        const regex = /rotate\((-?\d+(\.\d+)?)deg\)/;
                        const match = str.match(regex);
                        if (match) {
                          return parseFloat(match[1]);
                        }
                        return null;
                      }

                    if (trial.numbersFacing == "upright"){
                        document.querySelector("#num" + i).style.transform = `rotate(${360 - rndSpace - extractRotationNumber(sliceRotation)}deg)`;
                    }
                }     
            }

            function assignColors(pieDivv, bool, newBackground=trial.selectedColor, newColor=blackColor){

                let divNum = pieDivv.id.split('hold')[1]
                let NumDiv = document.getElementById("num" + divNum)
        
                if (bool) {
                    NumDiv.style.color = whiteColor;
                    if( pieDivv.classList.contains('redbg')){
                        pieDivv.style.background = redGradient;
                    } else {
                        pieDivv.style.background = blackGradient;
                    }
                } else {
                    pieDivv.style.background = newBackground; // plateBGColor;
                    NumDiv.style.color = newColor;
                }
            }

            function activateHighlighting(winningNum){

                removeOverlay();
                
                document.querySelector('.other-buttons').style.display = "inline-block";           

                var down = false;
                $(document).mousedown(function() {
                    down = true;
                }).mouseup(function() {
                    down = false;  
                });
            
                let spinnerID = document.getElementById("spinnerID");
                let mouseX; let mouseY;

                let prevPieDiv;

                function mouseMoveListener(event){
                    mouseX = event.clientX;
                    mouseY = event.clientY;

                    changeColor(mouseX, mouseY, "mousemove");
                }

                function mouseDownListener(event){
                    down = true
                    changeColor(mouseX, mouseY, "mousedown");
                }
            
                spinnerID.addEventListener('mousemove', mouseMoveListener);
                
                spinnerID.addEventListener('mousedown', mouseDownListener);
            
                function changeColor(x, y, z){
            
                    let topDivAtPoint =  document.elementFromPoint(x, y)
                    let allDivsAtPoint =  document.elementsFromPoint(x, y)
            
                    let pieDiv = allDivsAtPoint.filter(el => el.classList.contains('pie'))[0]
            
                    const classNamesToCheck = ['hold', 'pie', 'num']
            
                    if (pieDiv && down && (z == "mousedown" ||  prevPieDiv != pieDiv) && classNamesToCheck.some(el => topDivAtPoint.classList.contains(el))){
            
                        prevPieDiv = pieDiv;
                        
                        assignColors(pieDiv, pieDiv.style.background == trial.selectedColor)
                    }  
                }
            
                btnselect.addEventListener('click', () => {
                    indicateCorrectNumbers(winningNum, mouseMoveListener, mouseDownListener);
                })
            }

            function selectCard(winningNum){

                document.querySelector('.overlay-message').style.display = "none";
                document.querySelector('#card-container').style.display = "inline";

                let hoveredElement;
                let mouseX = 0, mouseY = 0;
                let selectedCardColor = "rgb(27, 168, 232)";
                let unselectedCardColor = "#F7931E"
                

                for (var numPair = 0; numPair < numorder.length; numPair++) {
                    $('#cardul').append(`<li id='crd${numOrderAssignments[1].indexOf(numOrderAssignments[0][numPair])}' class='card' style="background-color:${unselectedCardColor}">${numOrderAssignments[0][numPair]}</li>`);
                    var lengthNum = (numPair % 2 === 0) ? '780' :'483';
                    if (wheelCondition == "vast_wheel"){
                        $('#bar-container').append(`
                        <svg viewBox='495 -630 110 840' width='10%'>
                          <path id="bar${numOrderAssignments[1].indexOf(numOrderAssignments[0][numPair])}" fill="${unselectedCardColor}" transform = "rotate(-90 100 100)" d="M${lengthNum}.33,500c27.61,0,50,22.39,50,50,0,25.99-19.83,47.35-45.18,49.77l-4.82,.23H50c-27.61,0-50-22.39-50-50,0-25.99,19.83-47.35,45.18-49.77l4.82-.23H383.33Z"/>
                        </svg>
                      `)
                    }
                }

                var down = false;
                $(document).mousedown(function() {
                    down = true;
                }).mouseup(function() {
                    down = false;  
                });
          
              
                document.addEventListener('mousemove', event => {
                  mouseX = event.clientX;
                  mouseY = event.clientY;
                
                  hover(event.target);
                });
                
                document.getElementById("cardul").addEventListener('scroll', () => {
                  const hoverTarget = document.elementFromPoint(mouseX, mouseY);
                  if (hoverTarget) {
                    hover(hoverTarget);
                  }
                });
          
                document.addEventListener('mousedown', (event) => {
                  switchColor(hoveredElement)
                });
          
                function switchColor(hoveredElement){
                    if (hoveredElement.classList.contains('card')){
                        if (hoveredElement.style.backgroundColor == selectedCardColor) {
                            hoveredElement.style.backgroundColor = unselectedCardColor;

                            if (wheelCondition == "vast_wheel"){
                                var cardNum = hoveredElement.id.split('d')[1]
                                var barNum = document.getElementById(`bar${cardNum}`)
                                barNum.style.fill = unselectedCardColor
                            }
            
                        } else {
                            hoveredElement.style.backgroundColor = selectedCardColor;

                            if (wheelCondition == "vast_wheel"){
                                var cardNum = hoveredElement.id.split('d')[1]
                                var barNum = document.getElementById(`bar${cardNum}`);
                                barNum.style.fill = selectedCardColor;
                            }
                        }
                    }
                }
          
                function hover(targetElement) {
                  // If the target and stored element are the same, return early
                  // because setting it again is unnecessary.
                  if (hoveredElement === targetElement) {
                    return;
                  }
          
                  // On first run, `hoveredElement` is undefined.
                  if (hoveredElement) {
                    hoveredElement.classList.remove('hover');
                  }
          
                  hoveredElement = targetElement;
                  hoveredElement.classList.add('hover');
                  if (down){
                    switchColor(hoveredElement)
                  }
                }

                
                document.querySelector('#overlay-button2').addEventListener('click', () => {
                    // baba(winningNum);
                    indicateCorrectNumbers(winningNum);
                })

            }

            function indicateCorrectNumbers(winningNum, mouseMoveListener=null, mouseDownListener=null){
                let selectedDivs = []
                let selectedNumDivs = []
                let nonSelectedDivs = []
                let nonSelectedNumDivs = []
                let selectedNums = []
            
                if (omission == "ball"){
                    $(".pie").map(function() {
                        if (($(this)[0]).style.background == trial.selectedColor){
                            selectedDivs.push($(this))
                            let selectedID = ($(this)[0]).id;
                            let selectedIDNum = selectedID.split("hold")[1];
                            let selectedNum = document.getElementById("num" + selectedIDNum).innerHTML;
                            selectedNums.push(selectedNum);
                        } else {
                            nonSelectedDivs.push($(this))
                        }
                    });
                } else if (omission == "numbers"){
            
                    $(".card").map(function() {
                        let possiblePayout = ($(this)[0]).innerHTML;
                        let displayID = ($(this)[0]).id;
                        let displayIDNum = displayID.split("d")[1];
                        let displayIDElsewhere = document.getElementById("hold" + displayIDNum);
                        let numIDElsewhere = document.getElementById("num" + displayIDNum);
                
                        if (($(this)[0]).style.backgroundColor == selectedCardColor){
                            selectedNums.push(possiblePayout);
                            selectedDivs.push($(displayIDElsewhere));
                            selectedNumDivs.push($(numIDElsewhere));
                        } else {
                            nonSelectedDivs.push($(displayIDElsewhere));
                            nonSelectedNumDivs.push($(numIDElsewhere))
                        }
                    })
                }
            
            
                if (selectedDivs.length > 0 && selectedDivs.length < numorder.length){
            
                    document.querySelector('#selection-explained').style.display = 'none';
                    document.querySelector('#btnproceed').style.display = "inline-block";
                    let numberColor;
                    
                    if (omission == "ball"){
                        spinnerID.removeEventListener('mousemove', mouseMoveListener);
                        spinnerID.removeEventListener('mousedown', mouseDownListener);
                        document.querySelector('.other-buttons').style.display = "none";
                        numberColor = plateBGColor;
                    } else if (omission == "numbers"){
                        removeOverlay();
                        numberColor = whiteColor;
                    }
            
                    if (selectedNums.includes(winningNum.toString())){
                        selectedDivs.map(x => {
                            assignColors(x[0], true)
                        })
                        nonSelectedDivs.map(x => {
                            assignColors(x[0], false, plateBGColor, numberColor)
                        })
                        if (omission == "numbers"){
                            nonSelectedNumDivs.map(x => x[0].style.display = "block");
                        }
                    }  else {
            
                        selectedDivs.map(x => {
                            assignColors(x[0], false, plateBGColor, numberColor)
                        })
                        nonSelectedDivs.map(x => {
                            assignColors(x[0], true)
                        })
                        if (omission == "numbers"){
                            selectedNumDivs.map(x => x[0].style.display = "block");
                        }
                    }
            
                    document.querySelector('#btnproceed').addEventListener('click', () => {
                        endTrial(selectedNums, winningNum);
                    })
                }
            }

            function endTrial(selectedNums, winningNum){
                display_element.innerHTML = '<div id="jspsych-content"></div>';

                jsPsych.finishTrial({
                    selectedNums: selectedNums,
                    winningNum: winningNum
                })
            }
        }
    }
    RoulettePlugin.info = info;

    return RoulettePlugin;

})(jsPsychModule);