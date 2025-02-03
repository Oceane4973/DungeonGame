package com.dungeongame.heroes.service;

import com.dungeongame.heroes.model.*;
import com.dungeongame.heroes.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.dungeongame.heroes.config.ServerConfig;
import com.dungeongame.heroes.dto.HeroDTO;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;

@Service
public class HeroService {

    private final ServerConfig serverConfig;

    @Autowired
    private HeroRepository heroRepository;

    @Autowired
    private HeadRepository headRepository;

    @Autowired
    private BodyRepository bodyRepository;

    @Autowired
    private SpriteRepository spriteRepository;

    @Autowired
    private SpriteSetRepository spriteSetRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public HeroService(ServerConfig serverConfig) { // ✅ Correct
        this.serverConfig = serverConfig;
    }

    @Value("${app.images.hero-dir}")
    private String heroDir;

    public List<Hero> getAllHeroesByUserId(Long userId) {
        return heroRepository.findByUserId(userId);
    }

    public Hero getHeroById(Long id) {
        return heroRepository.findById(id).orElse(null);
    }

    public void deleteHero(Long id) {
        heroRepository.deleteById(id);
    }

    @Transactional
    public Hero createHero(HeroDTO heroDTO) {
        Hero hero = new Hero();
        hero.setUserId(heroDTO.getUserId());
        hero.setName(heroDTO.getName());
        hero.setLevel(heroDTO.getLevel());
        hero.setAttack(heroDTO.getAttack());
        hero.setHealthPoints(heroDTO.getHealthPoints());
        
        // Récupérer les sprites depuis la base de données en utilisant les IDs
        Head head = headRepository.findById(heroDTO.getHeadId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid head ID"));
        Body body = bodyRepository.findById(heroDTO.getBodyId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid body ID"));
        
        // Récupérer les sprites complets
        SpriteSet headSprites = head.getSprites();
        SpriteSet bodySprites = body.getSprites();
        
        // Créer et associer le SpriteSet
        SpriteSet heroSprites = createCustomSpriteSet(hero, headSprites, bodySprites);
        hero.setSprites(heroSprites);
        
        // Sauvegarder les références des sprites individuels
        hero.setHeadSprite(head.getSprites().getRight().get(0));
        hero.setBodySprite(body.getSprites().getRight().get(0));
        
        return heroRepository.save(hero);
    }

    private SpriteSet createCustomSpriteSet(Hero hero, SpriteSet headSprites, SpriteSet bodySprites) {
        SpriteSet spriteSet = new SpriteSet(new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

        // Combiner les sprites pour chaque direction
        combineDirectionalSprites(headSprites.getFront(), bodySprites.getFront(), spriteSet.getFront(), "front", hero.getId());
        combineDirectionalSprites(headSprites.getBack(), bodySprites.getBack(), spriteSet.getBack(), "back", hero.getId());
        combineDirectionalSprites(headSprites.getLeft(), bodySprites.getLeft(), spriteSet.getLeft(), "left", hero.getId());
        combineDirectionalSprites(headSprites.getRight(), bodySprites.getRight(), spriteSet.getRight(), "right", hero.getId());

        return spriteSetRepository.save(spriteSet);
    }

    private void combineDirectionalSprites(List<Sprite> headSprites, List<Sprite> bodySprites, List<Sprite> targetList, String direction, Long heroId) {
        if (!headSprites.isEmpty() && !bodySprites.isEmpty()) {
            Sprite headSprite = headSprites.get(0);
            Sprite bodySprite = bodySprites.get(0);
            
            String fileName = String.format("hero%d-%s-1-32x36.png", heroId, direction);
            String outputFilePath = heroDir + "/" + fileName;
            
            try {
                BufferedImage bodyImage = ImageIO.read(new File(bodySprite.getFilePath()));
                BufferedImage headImage = ImageIO.read(new File(headSprite.getFilePath()));
                
                BufferedImage combinedImage = new BufferedImage(
                    bodyImage.getWidth(), 
                    bodyImage.getHeight(),
                    BufferedImage.TYPE_INT_ARGB
                );
                
                Graphics g = combinedImage.getGraphics();
                g.drawImage(bodyImage, 0, 0, null);
                g.drawImage(headImage, 0, 0, null);
                g.dispose();
                
                File outputFile = new File(outputFilePath);
                ImageIO.write(combinedImage, "png", outputFile);
                
                String baseUrl = serverConfig.getServerUrl();
                Sprite newSprite = new Sprite(
                    fileName,
                    baseUrl + "/api/images/hero/" + fileName,
                    outputFile.getAbsolutePath()
                );
                spriteRepository.save(newSprite);
                targetList.add(newSprite);
            } catch (IOException e) {
                throw new RuntimeException("Error processing sprite", e);
            }
        }
    }
}
