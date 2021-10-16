import React, {useState, useEffect} from "react";
import './App.css';

const App = () => {

    const meterInPx = 200;//200px based on image size and Royal albatross size (1,07 - 1,35 wikipedia);
    const gravityPx = 9.8 * meterInPx; // average acceleration of a falling object due to the force of gravity
    const breakTime = 2; // the assumed time of the bird's own speed decrease to 0
    const averageSpeed = 450; // average speed in px from animation measurement (400 -> 2m/s)

    const fallingSpeed = time => {
        //v = g * t
        return gravityPx * time
    }

    const breakingDelay = speed => {
        // a = Vp - Vk / timeChange
        return speed / breakTime
    }

    const breakingWay = speed => {
       return Math.pow(speed, 2) / breakingDelay(speed);
    }

    let birdPosition = [];

    const [birdPhysics, setBirdPhysics] = useState(true);
    const [birdSpeed, setBirdsSpeed] = useState(null);
    const [levelScreen, setLevelScreen] = useState({active: true, level: 0});
    const [birdActive, setBirdActive] = useState({visible: false, dead: false, top: Math.floor(Math.random() * 60)});
    const [flamingActive, setFlamingActive] = useState({
        visible: false,
        dead: false,
        top: Math.floor(Math.random() * 80)
    });
    const [vultureActive, setVultureActive] = useState({
        visible: false,
        dead: false,
        top: Math.floor(Math.random() * 80)
    });

    const [score, setScore] = useState(0);
    let levelTime = 3000; //in s
    let fallingTime = 0; // in 1/100 s
    let interval;
    let fallingInterval;

    const getLeftPosition = (id) => {
        let div = document.getElementById(id);
        let style = getComputedStyle(div);
        let left = style.getPropertyValue("left");
        return left
    }

    const shootBird = (birdId) => {
        setScore(score + 1);
        // eslint-disable-next-line default-case
        switch (birdId) {
            case 0:
                setBirdActive({visible: true, dead: true});
                break;
            case 1:
                setVultureActive({visible: true, dead: true});
                break;
            case 2:
                setFlamingActive({visible: true, dead: true});
                break;
        }
    };

    const measureBirdSpeed = (positions) => {
        console.log("Pomiar");
        console.log(positions[0]);
        console.log(positions[1]);
        if(positions[1] < positions[0]) {
            setBirdsSpeed(averageSpeed);
        }
        setBirdsSpeed(positions[1] - positions[0]);
    }

    const timeCountdown = () => {
        levelTime = levelTime - 1;
        if(birdPosition.length < 3) {
            birdPosition.push(parseFloat(getLeftPosition("bird")));
        }
        if(birdPosition.length === 2) {
            measureBirdSpeed(birdPosition)
        }
        if (levelTime === 0) {
            clearInterval(interval);
            setLevelScreen({active: true, level: levelScreen.level + 1})
        }
    }

    const fallingCountdown = () => {
        fallingTime = fallingTime + 1;
        console.log("falling speed");
        console.log(fallingSpeed(fallingTime/100));
        console.log("braking full way");
        console.log(breakingWay(birdSpeed));
        console.log("birds measured speed");
        console.log(birdSpeed);
        if(fallingTime === 20) {
            clearInterval(fallingInterval);
        }
    };

    useEffect(() => {
        if (!levelScreen.active) {
            interval = setInterval(timeCountdown, 1000);
        }
    }, [levelScreen.active]);

    useEffect(()=>{
        if(birdActive.dead && birdPhysics) {
            console.log("szczelony");
            fallingInterval = setInterval(fallingCountdown, 100);
        }
    },[birdActive.dead]);



    useEffect(() => {
        if (!birdActive.visible) {
            setBirdActive({visible: true, dead: false, top: Math.floor(Math.random() * 70)})
        }
        if (birdActive.dead) {
            setTimeout(() => {
                setBirdActive({visible: false, dead: false})
            }, 800)
        }
      if (!flamingActive.visible) {
        setFlamingActive({visible: true, dead: false, top: Math.floor(Math.random() * 70)})
      }
      if (flamingActive .dead) {
        setTimeout(() => {
          setFlamingActive({visible: false, dead: false})
        }, 800)
      }
        if (!vultureActive.visible) {
            setVultureActive({visible: true, dead: false, top: Math.floor(Math.random() * 70)})
        }
        if (vultureActive .dead) {
            setTimeout(() => {
                setVultureActive({visible: false, dead: false})
            }, 800)
        }

    }, [birdActive, flamingActive, vultureActive]);

    const levelInfo = () => {
        // eslint-disable-next-line default-case
        switch (levelScreen.level) {
            case 0:
                return "Shoot those birds !!"
            case 1:
                return "Let's speed up"
            case 2:
                return "Wind blows"
            case 3:
                return "It's raining"
            case 4:
                return "Game over"
        }
    }

    return (
        <div className="App">
            <div className={levelScreen.level === 3 && "raining"}></div>
            {levelScreen.active && <div className="menu">
                <div>
                    <div className={"logo"}>
                        <span>Bird's</span>
                        Hunter
                    </div>
                    <div className={"levelInfo"}>{levelInfo()}</div>
                    {levelScreen.level === 4 && (<div className={"yourScore"}>Your score: {score}</div>)}
                    {levelScreen.level === 4 ?
                        <button onClick={() => window.location.reload()}>{"Play again"}</button> : <button
                            onClick={() => setLevelScreen({
                                active: false,
                                level: levelScreen.level
                            })}>{levelScreen.level === 0 ? "Play" : "Continue"}</button>}
                </div>
            </div>}
            <span className={"Score"}>{"Score: " + score}</span>
            {birdActive.visible &&
            <div id="bird"
                 className={birdActive.dead ? "bird birdKilled" : levelScreen.level === 0 ? "bird animRight" : levelScreen.level === 1 ? "bird animRightSpeed" : levelScreen.level === 3 ? "bird animRightRain" : "bird animRightWind"}
                 style={{
                     top: birdActive.top + "vh",
                     left: birdActive.dead ? getLeftPosition("bird") : 0,
                     backgroundImage: "url(./birds/cos.gif)"
                 }}
                 onClick={() => shootBird(0)}><span className={"splash"} style={{
                backgroundImage: birdActive.dead ? "url(./birds/splash.png)" : "none"
            }}>&nbsp;</span></div>}

{/*            {vultureActive.visible &&
            <div id="vulture"
                className={vultureActive.dead ? "vulture birdKilledOpposite" : levelScreen.level === 0 ? "vulture animLeft" : levelScreen.level === 1 ? "vulture animLeftSpeed" : levelScreen.level === 3 ? "vulture animLeftRain" : "vulture animLeftWind"}
                style={{
                top: vultureActive.top + "vh",
                left: vultureActive.dead ? getLeftPosition("vulture") : "120vw",
                backgroundImage: "url(./birds/vulture.gif)"
            }}
                 onClick={() => shootBird(1)}><span className={"splash"} style={{
                backgroundImage: vultureActive.dead ? "url(./birds/splash.png)" : "none"
            }}>&nbsp;</span></div>}

            {flamingActive.visible &&
            <div id="flaming"
                className={flamingActive.dead ? "flaming birdKilled" : levelScreen.level === 0 ? "flaming animRight2" : levelScreen.level === 1 ? "flaming animRightSpeed2" : levelScreen.level === 3 ? "flaming animRightRain2" : "flaming animRightWind2"}
                style={{
                top: flamingActive.top + "vh",
                left: flamingActive.dead ? getLeftPosition("flaming") : "-20vw",
                backgroundImage: "url(./birds/flaming.gif)"
            }}
                 onClick={() => shootBird(2)}><span className={"splash"} style={{
                backgroundImage: flamingActive.dead ? "url(./birds/splash.png)" : "none"
            }}>&nbsp;</span></div>}*/}
        </div>
    );
}

export default App;
