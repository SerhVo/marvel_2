import { useState, useEffect, useCallback, useMemo } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";

import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

const RandomChar = () => {
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Оптимизированное создание MarvelService
  const marvelService = useMemo(() => new MarvelService(), []);

  const updateChar = useCallback(() => {
    const id = Math.floor(Math.random() * (1011400 - 1011000)) + 1011000;
    setLoading(true);
    setError(false); // Сброс ошибки при новом запросе

    marvelService
      .getCharacter(id)
      .then((char) => {
        setChar(char);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [marvelService]);

  useEffect(() => {
    updateChar();
    const timerId = setInterval(updateChar, 60000);
    return () => clearInterval(timerId);
  }, [updateChar]);

  return (
    <div className="randomchar">
      {error && <ErrorMessage />}
      {loading && <Spinner />}
      {!loading && !error && char && <View char={char} />}

      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!
          <br />
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">Or choose another one</p>
        <button onClick={updateChar} className="button button__main">
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  const imgStyle = {
    objectFit: thumbnail.includes("image_not_available") ? "contain" : "cover",
  };

  return (
    <div className="randomchar__block">
      <img
        src={thumbnail}
        alt="Random character"
        className="randomchar__img"
        style={imgStyle}
      />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">
          {description || "No description available"}
        </p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
