import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroeSelectionPage.css";

function HeroPage() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroes] = useState([
        { id: 1, name: "Héros 1", attack: 10, healthPoints: 100 },
        { id: 2, name: "Héros 2", attack: 10, healthPoints: 100 }
    ]);

    const settings = {
        dots: heroes.length > 1,
        infinite: heroes.length > 1,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0',
        swipeToSlide: true,
        beforeChange: (current, next) => {
            setCurrentSlide(next);
        },
        initialSlide: 0,
        useCSS: true,
        useTransform: true
    };

    return (
        <>
            <Header />
            <main className="game-container">
                <div className="hero-header-card">
                    <h1>Choisis ton Héros et fonce !</h1>
                    <p>Fais ton propre choix et lance toi dans l'aventure DungeonGame.</p>
                </div>
                
                <div className="carousel-container">
                    <Slider {...settings}>
                        {heroes.map((hero, index) => (
                            <div 
                                key={hero.id} 
                                className={currentSlide === index ? "hero-slide center" : "hero-slide"}
                            >
                                <div className="hero-card">
                                    <div className="hero-image">
                                        Image du Héros
                                    </div>
                                    <div className="hero-info">
                                        <h3>{hero.name}</h3>
                                        <p>⚔️ Attaque: {hero.attack}</p>
                                        <p>❤️ Points de vie: {hero.healthPoints}</p>
                                    </div>
                                    <button 
                                        className="select-hero-btn"
                                        onClick={() => navigate("/dungeon")}
                                    >
                                        Choisir ce héros
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default HeroPage;
