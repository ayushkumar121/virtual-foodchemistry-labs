var prefferedReading = [
    0.1,
    0.5,
    1.3,
    2.2
]

var readingTitration = 0.0
var handle = null

var currentFrame = 16
var buretteFilled = false

var frameObject5 = { i: 0 }
var result = 1

function buretteFill() {
    if (!buretteFilled) {
        var anim = gsap.timeline()

        anim
            .to('#naoh small', { opacity: 0 })
            .to('#naoh', { duration: 2, y: -220 })
            .to('#naoh', { duration: 2, x: -170 })
            .to('#naoh', {
                duration: 2, rotation: -20, onComplete: () => {
                    gsap.to(frameObject5, {
                        duration: 4, i: 16, ease: new SteppedEase.config(16), onUpdate: () => {
                            document.querySelector('#burettestep6').src = `./assets/burette/ff${frameObject5.i}.png`
                        }
                    })
                }
            })
            .to('#naoh', { duration: 2, rotation: 0 })
            .to('#naoh', { duration: 4, x: 0, y: 0 })
            .to('#step-6 button.element', { opacity: 1 })
    }
}


function openKnob() {
    if (handle == null && !buretteFilled) {
       // tl.resume()
        handle = setInterval(() => {
            if (readingTitration < 50.0) {
                readingTitration += 0.1
                document.querySelector('#readingSlider').style.width = `${100 - readingTitration * 20}%`

                var drop = document.createElement("img")
                drop.src = './assets/drop.png'
                drop.classList.add('element', 'drop-step-6')
                drop.style.zIndex = 5

                document.querySelector('#step-6 .instruments').appendChild(drop)

                gsap.to(drop, { y: 50, opacity: 0, ease: Sine.easeIn })

                var text = ''
                if (Math.abs(prefferedReading[selectedSample] - readingTitration) <= 0.2) {
                    text += '(Titration Completed) '

                    document.querySelector('#step-6-flask').src = `./assets/titr1.png`
                }
                
                if (currentFrame > 0) {
                    currentFrame--

                    document.querySelector('#burettestep6').src = `./assets/burette/ff${currentFrame}.png`
                }

                text += `${readingTitration.toPrecision(2)} ml`

                document.querySelector('#readingText').innerHTML = text
                console.log(prefferedReading[selectedSample], readingTitration)
            }
        }, 2000);
    }
}

function closeKnob() {
    if (handle != null) {
      //  tl.restart()
     //   tl.pause()
        clearInterval(handle);
        handle = null

        if (Math.abs(prefferedReading[selectedSample] - readingTitration) <= 0.2 && !task_done) {
            document.querySelector('#nextbutton').innerHTML = 'Observations'

            gsap.to('.question-4', { opacity: 1 })

            document.querySelector('#observationReading').innerHTML = `${readingTitration.toPrecision(2)}`
            document.querySelector('#reading1').innerHTML = `${readingTitration.toPrecision(2)}`

            result = ((readingTitration.toPrecision(2) * 0.0282 * 10) / 2).toPrecision(4)

            //document.querySelector('#result').innerHTML = `<b>FFA(%) = ( ${readingTitration.toPrecision(2)} * 0.1 * 0.0282 * 100 ) / 2 =  ${result.toPrecision(4)}</b>`

            addTask('<b>Step 6</b>Titrate the mixture with 0.1 N NaOH solution')
            addTask('🎉 Experiment Completed 🎉')
        } else{
            
        }
    }
}

var formulaToggled = false

function toggleformula() {
    formulaToggled = !formulaToggled

    if(formulaToggled)
        gsap.to('#forumla', {opacity: 1})
    else 
        gsap.to('#forumla', {opacity: 0})
}

function validateresult() {
    var val = document.querySelector('#result-user').value

    if(Math.abs(val - result) < 0.4)
        document.querySelector('.result-status').innerHTML = '<span style="color:green">Correct Answer</span>'
    else 
        document.querySelector('.result-status').innerHTML = '<span style="color:red">Wrong Answer</span>'
}