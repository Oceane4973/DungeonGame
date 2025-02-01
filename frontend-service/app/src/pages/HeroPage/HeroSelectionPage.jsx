import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeroSelectionPage.css";
import { heroService } from '../../services/heroService';

function HeroPage() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroes, setHeroes] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeroes = async () => {
            try {
                const heroesData = await heroeService.getHeroes(user.id);
                setHeroes(heroesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.id) {
            fetchHeroes();
        }
    }, [user]);

    const settings = {
        dots: heroes.length > 1,
        infinite: heroes.length > 1,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0',
        swipeToSlide: true,
        cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
        useCSS: true,
        useTransform: true,
        beforeChange: (current, next) => {
            setCurrentSlide(next);
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <>
            <Header />
            <main className="game-container">
                <div className="hero-header-card">
                    <h1>Choisis ton Héros et fonce !</h1>
                    <p>Fais ton propre choix et lance toi dans l'aventure DungeonGame.</p>
                </div>

                <div className="carousel-container">
                    {heroes.length > 0 ? (
                        <Slider {...settings}>
                            {heroes.map((hero, index) => (
                                <div
                                    key={hero.id}
                                    className={currentSlide === index ? "hero-slide center" : "hero-slide"}
                                >
                                    <div className="hero-card">
                                        <div className="hero-image">
                                            <img
                                                src={hero.headSprite?.url}
                                                alt={`${hero.name} head`}
                                                style={{
                                                    position: 'absolute',
                                                    width: '48px',
                                                    height: '48px',
                                                    imageRendering: 'pixelated',
                                                    zIndex: 2
                                                }}
                                            />
                                            <img
                                                src={hero.bodySprite?.url}
                                                alt={`${hero.name} body`}
                                                style={{
                                                    position: 'absolute',
                                                    width: '48px',
                                                    height: '48px',
                                                    imageRendering: 'pixelated',
                                                    zIndex: 1
                                                }}
                                            />
                                        </div>
                                        <h3>{hero.name}</h3>
                                        <div className="hero-info">
                                            <p className="hero-level">⭐ Niveau <strong>{hero.level}</strong></p>
                                            <p className="hero-stats">⚔️ Attaque: <strong>{hero.attack}</strong></p>
                                            <p className="hero-stats">❤️ Points de vie: <strong>{hero.healthPoints}</strong></p>
                                        </div>
                                        <button
                                            className="select-hero-btn"
                                            onClick={() => navigate(`/dungeon?heroId=${hero.id}`)}
                                        >
                                            Choisir ce héros
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="no-heroes">
                            <p>Vous n'avez pas encore de héros.</p>
                            <button onClick={() => navigate("/createHero")}>
                                Créer un héros
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default HeroPage;
