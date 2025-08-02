import PropTypes from "prop-types";
import moleHead from "./assets/moleHead.png";
import moleHeadHit from "./assets/moleHeadHit.png";
import MoleHill from "./components/MoleHill";
import ScoreBoard from "./components/ScoreBoard";
import { useState, useEffect } from "react";
function Whackamole({ rows, columns, timer }) {
  const [molePosition1, setMolePosition1] = useState({});
  const [molePosition2, setMolePosition2] = useState({});
  const [timeLeft, setTimeLeft] = useState(timer);
  const [gameStatus, setGameStatus] = useState(false);
  const [score, setScore] = useState(null);
  const [hideMole1, setHideMole1] = useState(false);
  const [hideMole2, setHideMole2] = useState(false);
  const [mole1Hit, setMole1Hit] = useState(false);
  const [mole2Hit, setMole2Hit] = useState(false);

  const randomIndex = () => {
    const randomX = Math.floor(Math.random() * rows);
    const randomY = Math.floor(Math.random() * columns);
    return { x: randomX, y: randomY };
  };

  const changeMoleIndex = () => {
    if (gameStatus) {
      const newMolePosition1 = randomIndex();
      let newMolePosition2;
      do {
        newMolePosition2 = randomIndex();
      } while (
        newMolePosition2.x === newMolePosition1.x &&
        newMolePosition2.y === newMolePosition1.y
      );
      setMolePosition1(newMolePosition1);
      setMolePosition2(newMolePosition2);
      setHideMole1(false);
      setHideMole2(false);
      setMole1Hit(false);
      setMole2Hit(false);
    }
  };

  useEffect(() => {
    const moleTimer = setInterval(() => {
      changeMoleIndex();
    }, 1500);

    return () => clearInterval(moleTimer);
  }, [gameStatus]);

  const gameTimer = () => {
    if (gameStatus && timeLeft > 0) {
      const timerID = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timerID);
    } else if (timeLeft === 0) {
      setGameStatus(false);
      setMolePosition1({});
      setMolePosition2({});
    }
  };

  useEffect(() => {
    gameTimer();
  }, [gameStatus, timeLeft]);

  const handleStart = () => {
    setGameStatus((prev) => !prev);
    setScore(0);
    setTimeLeft(timer);
    setMole1Hit(false);
    setMole2Hit(false);
  };

  const updateScore = (moleIndex) => {
    setScore((prev) => prev + 1);
    if (moleIndex === 1) {
      setHideMole1(true);
      setMole1Hit(true);
    } else {
      setHideMole2(true);
      setMole2Hit(true);
    }
  };

  const displayMole = (index1, index2, moleIndex) => {
    const molePosition = moleIndex === 1 ? molePosition1 : molePosition2;
    const hideMole = moleIndex === 1 ? hideMole1 : hideMole2;
    const moleHit = moleIndex === 1 ? mole1Hit : mole2Hit;
    return (
      gameStatus &&
      molePosition?.x === index1 &&
      molePosition?.y === index2 && (
        <div className="mole-hill">
          <img
            onClick={() => updateScore(moleIndex)}
            className={`mole-head ${hideMole ? "disappear" : "appear"}`}
            src={moleHit ? moleHeadHit : moleHead}
            alt="mole"
          />
        </div>
      )
    );
  };

  return (
    <div className="game-container">
      <div className="header">
        <ScoreBoard
          score={score}
          gameStatus={gameStatus}
          handleStart={handleStart}
          timeLeft={timeLeft}
        />
      </div>
      <div className="grid">
        {Array(rows)
          .fill()
          .map((_ele, posX) => (
            <div className="row" key={posX}>
              {Array(columns)
                .fill()
                .map((_ele, posY) => (
                  <div className="column" key={posY}>
                    <div className="mole-head-div">
                      {displayMole(posX, posY, 1)}
                      {displayMole(posX, posY, 2)}
                    </div>
                    <div>
                      <MoleHill />
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Whackamole;

Whackamole.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  timer: PropTypes.number,
};

Whackamole.deafultProps = {
  rows: 3,
  columns: 3,
  timer: 15,
};
