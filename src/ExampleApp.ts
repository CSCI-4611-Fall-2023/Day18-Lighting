/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'


export class ExampleApp extends gfx.GfxApp
{   
    private day = false;
    private ambientLight: gfx.AmbientLight = new gfx.AmbientLight(new gfx.Vector3(0,0,0));
    private pointLight: gfx.PointLight = new gfx.PointLight(new gfx.Vector3(0,0,0));
    private directionalLight: gfx.DirectionalLight = new gfx.DirectionalLight(new gfx.Vector3(0,0,0));
    private lamp: gfx.Mesh3 = new gfx.Mesh3();
    private lampDayMaterial: gfx.PhongMaterial = new gfx.PhongMaterial();
    private lampNightMaterial: gfx.UnlitMaterial = new gfx.UnlitMaterial();


    // --- Create the ExampleApp class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();
    }

    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        this.renderer.viewport = gfx.Viewport.CROP;
        this.camera.setPerspectiveCamera(60, 1000/1000, 1, 10000);
        this.camera.position = new gfx.Vector3(500, 500, 500 / Math.tan(Math.PI * 30 / 180));
        this.camera.lookAt(new gfx.Vector3(500, 500, 0), new gfx.Vector3(0, -1, 0));

        // Add lights to the scene
        // Ambient does not have a position
        this.scene.add(this.ambientLight);

        // The point light is positioned at the location of the street lamp
        this.pointLight.position = new gfx.Vector3(800, 60, -400);
        this.scene.add(this.pointLight);

        // For directional lights, the position is interpreted as the direction TO the light
        // so this light is coming from the right, up, and behind.
        this.directionalLight.position.set(-.75, -1.1, 1);
        this.scene.add(this.directionalLight);


        // ground
        const ground = new gfx.Node3();
        ground.position = new gfx.Vector3(500, 1000, 0);
        this.scene.add(ground);


        // grass
        const grassMaterial = new gfx.PhongMaterial();
        grassMaterial.diffuseColor = new gfx.Color(14/255, 59/255, 18/255);
        grassMaterial.specularColor = new gfx.Color(0/255, 0/255, 0/255);
        grassMaterial.shininess = 1.0;

        const grass = gfx.Geometry3Factory.createBox(10000, 10, 10000);
        grass.material = grassMaterial;
        ground.add(grass);


        // path
        const pathMaterial = new gfx.PhongMaterial();
        pathMaterial.diffuseColor = new gfx.Color(150/255, 150/255, 170/255);
        pathMaterial.specularColor = new gfx.Color(0/255, 0/255, 0/255);
        pathMaterial.shininess = 1.0;

        const path = gfx.Geometry3Factory.createBox(900,12,10000);
        path.material = pathMaterial;//.setColor(new gfx.Color(150/255, 150/255, 170/255));
        ground.add(path);


        // snowman
        const snowmanMaterial = new gfx.PhongMaterial();
        snowmanMaterial.diffuseColor = new gfx.Color(255/255, 255/255, 255/255);
        snowmanMaterial.specularColor = new gfx.Color(255/255, 255/255, 255/255);
        snowmanMaterial.shininess = 10.0;

        const snowman = gfx.Geometry3Factory.createSphere(300, 3);
        snowman.position = new gfx.Vector3(500, 800, -600);
        snowman.material = snowmanMaterial;
        this.scene.add(snowman);

        const snowmanMiddle = gfx.Geometry3Factory.createSphere(250, 3);
        snowmanMiddle.position = new gfx.Vector3(0, -350, 0);
        snowmanMiddle.material = snowmanMaterial;
        snowman.add(snowmanMiddle);

        const snowmanTop = gfx.Geometry3Factory.createSphere(180, 3);
        snowmanTop.position = new gfx.Vector3(0, -330, 0);
        snowmanTop.material = snowmanMaterial;
        snowmanMiddle.add(snowmanTop);


        // lamp post
        const lampPostMaterial = new gfx.PhongMaterial();
        lampPostMaterial.diffuseColor = new gfx.Color(119/255, 119/255, 119/255);
        lampPostMaterial.specularColor = new gfx.Color(255/255, 255/255, 255/255);
        lampPostMaterial.shininess = 200.0;

        const lampPost = gfx.Geometry3Factory.createBox(40, 1000, 40);
        lampPost.position = new gfx.Vector3(1000, 500, -400);
        lampPost.material = lampPostMaterial;
        this.scene.add(lampPost);

        const lampArm = gfx.Geometry3Factory.createBox(240, 40, 40);
        lampArm.position = new gfx.Vector3(-100, -500, 0);
        lampArm.material = lampPostMaterial;
        lampPost.add(lampArm);


        // lamp ball
        this.lampDayMaterial.ambientColor = new gfx.Color(255/255, 255/255, 200/255);
        this.lampDayMaterial.diffuseColor = new gfx.Color(255/255, 255/255, 200/255);
        this.lampDayMaterial.specularColor = new gfx.Color(255/255, 255/255, 255/255);
        this.lampDayMaterial.shininess = 200.0;

        this.lampNightMaterial.color = new gfx.Color(255/255, 255/255, 200/255);

        this.lamp = gfx.Geometry3Factory.createSphere(40);
        this.lamp.position = new gfx.Vector3(800, 60, -400);
        this.lamp.material = this.lampNightMaterial;
        this.scene.add(this.lamp);   
        
        this.toggleDayNight();
    }

    onKeyDown(event: KeyboardEvent): void {
        this.toggleDayNight();
    }

    toggleDayNight(): void {
        this.day = !this.day;
        if (this.day) {
            this.renderer.background = new gfx.Color(0.8, 0.93, 0.95);
            this.lamp.material = this.lampDayMaterial;

            // TODO: configure the ambient light, point light, and directional light for day
            this.ambientLight.visible = true;
            this.ambientLight.ambientIntensity = new gfx.Vector3(0.4, 0.4, 0.4);

            this.pointLight.visible = false;

            this.directionalLight.visible = true;
            this.directionalLight.diffuseIntensity = new gfx.Vector3(0.8, 0.8, 0.7);
            this.directionalLight.specularIntensity = new gfx.Vector3(0.5, 0.5, 0.45);
            
        } else {
            this.renderer.background = new gfx.Color(0.16, 0.18, 0.18)
            this.lamp.material = this.lampNightMaterial;

            // TODO: configure the ambient light, point light, and directional light for night
            this.ambientLight.visible = true;
            this.ambientLight.ambientIntensity = new gfx.Vector3(0.2, 0.2, 0.25);

            this.pointLight.visible = true;
            this.pointLight.diffuseIntensity = new gfx.Vector3(0.6, 0.6, 0.6);
            this.pointLight.specularIntensity = new gfx.Vector3(0.3, 0.3, 0.3);


            this.directionalLight.visible = false;

        }
    }

    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
    }
}
