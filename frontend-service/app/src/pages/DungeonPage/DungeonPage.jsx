import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { dungeonService } from "../../services/dungeonService";
import DungeonCanva from "../../components/dungeonCanva/dungeonCanva";
import './DungeonPage.css';

function DungeonPage() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [dungeonData, setDungeonData] = useState(null);
    const [imageCache, setImageCache] = useState({});

    const fetchDungeon = async () => {
        try {
            const data = await dungeonService.getDungeon();
            setDungeonData(data);
            preloadImages(data.assets);
        } catch (error) {
            console.error('Erreur lors de la récupération du donjon:', error);
        }
    };

    const preloadImages = (assets) => {
        const cache = {};
        const assetKeys = Object.keys(assets);
        let loadedCount = 0;

        assetKeys.forEach((key) => {
            const img = new Image();
            img.src = assets[key];
            img.onload = () => {
                cache[key] = img;
                loadedCount++;

                if (loadedCount === assetKeys.length) {
                    setImageCache(cache);
                }
            };
            img.onerror = () => {
                console.error(`Erreur de chargement de l'image : ${assets[key]}`);
            };
        });
    };

    useEffect(() => {
        fetchDungeon();
    }, []);

    const renderBackgroundLayers = () => {
        if (!dungeonData?.background?.layers) return null;

        return Object.values(dungeonData.background.layers).map((layerSrc, index) => (
            <img
                key={index}
                src={layerSrc}
                alt={`Layer ${index + 1}`}
                className="background-layer"
                style={{ zIndex: index - 10 }}
            />
        ));
    };

    return (
        <>
            <Header gaming={true} />
            <div className="main-container">
                {dungeonData && (
                    <>
                        {renderBackgroundLayers()}
                        <DungeonCanva dungeonData={dungeonData} imageCache={imageCache} />
                    </>
                )}
            </div>

            <div className="dongeon-game-container">
                <div className="dongeon-header-card">
                    <h1>Donjon</h1>
                    <p>Explorez les donjons et combattez les monstres.</p>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default DungeonPage;
