import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";
import FilmContainerCast from "./FilmContainerCast";
import Flag from "../../components/Flag";
import { IoIosArrowDropdownCircle } from "react-icons/io";


export default function FilmContainer() {
    return (
        <>
            <div className="film-container">
                <div className="film-container-countries">
                    <Flag code="us" />
                    <Flag code="gb" />
                </div>
                <div className="img-placeholder">
                    <img src="https://a.ltrbxd.com/resized/film-poster/2/7/7/0/6/4/277064-barbie-0-230-0-345-crop.jpg?v=1b83dc7a71" />
                </div>
                <div className="film-container-infos">
                    <h1>Barbie <label>2023</label> </h1>
                    <div className="film-container-infos-stars">
                        {Array.from({ length: 4 }, (_, i) => (
                            <TiStarFullOutline key={i} />
                        ))}
                        <TiStarHalfOutline />
                        <label>180 Reviews</label>
                    </div>
                    <div className="film-container-infos-description">
                        <h2>She's everything. He's just Ken.</h2>
                        Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.
                    </div>
                    <div className="film-container-infos-cast-wrapper">
                        <h3>Cast:</h3>
                        <div className="film-container-infos-cast">
                            <FilmContainerCast castName={"Cosmin Stoica"} />
                            <FilmContainerCast castName={"Gioele Scafidi"} />
                            <FilmContainerCast castName={"Marco Gianinetto"} />
                            <FilmContainerCast castName={"Eugen Vaipan"} />
                        </div>
                    </div>
                    <div className="film-container-infos-seemore">
                        <button className="film-container-seemore-btn"><span><IoIosArrowDropdownCircle/></span> Vedi di più</button>
                    </div>
                </div>
            </div>
        </>
    );
}