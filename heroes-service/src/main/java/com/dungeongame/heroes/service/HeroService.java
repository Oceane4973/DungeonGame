package com.dungeongame.heroes.service;

import com.dungeongame.heroes.model.*;
import com.dungeongame.heroes.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.dungeongame.heroes.dto.HeroDTO;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import com.dungeongame.heroes.provider.ServerInfoProvider;
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

    private final ServerInfoProvider serverInfoProvider;

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

    public HeroService(ServerInfoProvider serverInfoProvider) { // ✅ Correct
        this.serverInfoProvider = serverInfoProvider;
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
        Head head = headRepository.findById(heroDTO.getHeadId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid head ID: " + heroDTO.getHeadId()));
        Body body = bodyRepository.findById(heroDTO.getBodyId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid body ID: " + heroDTO.getBodyId()));

        Hero hero = new Hero();
        hero.setUserId(heroDTO.getUserId());
        hero.setName(heroDTO.getName());
        hero.setLevel(heroDTO.getLevel());
        hero.setAttack(heroDTO.getAttack());
        hero.setHealthPoints(heroDTO.getHealthPoints());

        hero = heroRepository.save(hero);

        SpriteSet heroSprites = createCustomSpriteSet(hero, head, body);
        hero.setSprites(heroSprites);

        hero = heroRepository.save(hero);

        return hero;
    }

    private SpriteSet createCustomSpriteSet(Hero hero, Head head, Body body) {
        SpriteSet spriteSet = new SpriteSet(new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

        copyAndOverlaySprites(head.getSprites().getFront(), body.getSprites().getFront(), spriteSet.getFront(), "front",
                hero.getId());
        copyAndOverlaySprites(head.getSprites().getBack(), body.getSprites().getBack(), spriteSet.getBack(), "back",
                hero.getId());
        copyAndOverlaySprites(head.getSprites().getLeft(), body.getSprites().getLeft(), spriteSet.getLeft(), "left",
                hero.getId());
        copyAndOverlaySprites(head.getSprites().getRight(), body.getSprites().getRight(), spriteSet.getRight(), "right",
                hero.getId());

        return spriteSetRepository.save(spriteSet);
    }

    private void copyAndOverlaySprites(List<Sprite> headSprites, List<Sprite> bodySprites, List<Sprite> heroSprites,
            String direction, Long heroId) {
        if (headSprites.size() != bodySprites.size()) {
            throw new IllegalArgumentException(
                    "Mismatch in sprite counts for head and body for direction: " + direction);
        }

        String baseUrl = serverInfoProvider.getServerUrl();

        for (int i = 0; i < headSprites.size(); i++) {
            Sprite headSprite = headSprites.get(i);
            Sprite bodySprite = bodySprites.get(i);

            String fileName = String.format("hero%d-%s-%d-32x36.png", heroId, direction, i + 1);
            String outputFilePath = heroDir + "/" + fileName;

            try {
                BufferedImage bodyImage = ImageIO.read(new File(bodySprite.getFilePath()));
                BufferedImage headImage = ImageIO.read(new File(headSprite.getFilePath()));

                BufferedImage combinedImage = new BufferedImage(bodyImage.getWidth(), bodyImage.getHeight(),
                        BufferedImage.TYPE_INT_ARGB);
                Graphics g = combinedImage.getGraphics();
                g.drawImage(bodyImage, 0, 0, null);
                g.drawImage(headImage, 0, 0, null);
                g.dispose();

                File outputFile = new File(outputFilePath);
                ImageIO.write(combinedImage, "png", outputFile);

                Sprite newSprite = new Sprite(fileName, baseUrl + "/api/images/hero/" + fileName,
                        outputFile.getAbsolutePath());
                spriteRepository.save(newSprite);

                heroSprites.add(newSprite);

            } catch (IOException e) {
                throw new RuntimeException("Error processing sprite: head=" + headSprite.getFilePath() + ", body="
                        + bodySprite.getFilePath(), e);
            }
        }
    }
}
