import * as Assets from './assets';
import { Physics, scaleModes } from 'phaser-ce';

let G = 6.67408*Math.pow(10, -11);

export class GravityPhysics {
    public metersPerPixel: number;
    public bodies: GravityBody[];
    public date: Date;

    constructor(metersPerPixel: number) {
        this.metersPerPixel = metersPerPixel;
        this.bodies = [];
        this.date = new Date();
    }

    public addBody(body: GravityBody) {
        this.bodies.push(body);
    }

    public updateBodyPositions(seconds: number) {
        for (let i = 0; i < this.bodies.length; i++) {
            let curr = this.bodies[i];
            let forceX = 0;
            let forceY = 0;
            if (curr.engineOn) {
                let dforceY = curr.engineForce * Math.cos(curr.sprite.rotation);
                let dforceX = curr.engineForce * Math.sin(curr.sprite.rotation);
                forceX += dforceX;
                forceY += dforceY;
            }
            for (let j = 0; j < this.bodies.length; j++) {
                let target = this.bodies[j];
                if (target === curr) {
                    continue;
                }
                let rawForce = G * (curr.mass * target.mass) / Math.pow(this.distanceBetween(curr.loc, target.loc), 2);
                let angle = this.getAngleTo(curr.loc, target.loc);
                let dforceX = rawForce * Math.cos(angle);
                let dforceY = rawForce * Math.sin(angle);
                forceX += dforceX;
                forceY += dforceY;
            }
            let accelX = forceX / curr.mass;
            let accelY = forceY / curr.mass;

            curr.vx += accelX * seconds;
            curr.vy += accelY * seconds;
        }

        for (let i = 0; i < this.bodies.length; i++) {
            let curr = this.bodies[i];
            curr.loc.x += curr.vx * seconds;
            curr.loc.y += curr.vy * seconds;

            curr.sprite.centerX = curr.loc.x / this.metersPerPixel;
            curr.sprite.centerY = -curr.loc.y / this.metersPerPixel;
            //console.log(`${curr.sprite.name} is at (${curr.sprite.centerX}, ${curr.sprite.centerY})`);
        }
        this.date.setMilliseconds(this.date.getMilliseconds() + seconds*1000);
    }

    public distanceBetween(b1: Point, b2: Point): number {
        let dx = b1.x - b2.x;
        let dy = b1.y - b2.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    public getAngleTo(source: Point, target: Point): number {
        return Math.atan2(target.y - source.y, target.x - source.x);
    }
}

export type Meters = number;
export type MetersPerSecond = number;
export type Kilogram = number;

export interface Point {
    x: Meters;
    y: Meters;
}

export interface GravityBody {
    loc: Point;
    sprite: Phaser.Sprite;
    mass: Kilogram;
    vx: MetersPerSecond;
    vy: MetersPerSecond;
    engineForce: number;
    engineOn: boolean;
    radius: Meters;
}

export class BasicGravityBody implements GravityBody {
    public loc: Point;
    public sprite: Phaser.Sprite;
    public mass: Kilogram;
    public vx: MetersPerSecond;
    public vy: MetersPerSecond;
    public engineForce: number;
    public engineOn: boolean;
    public radius: Meters;

    constructor(sprite: Phaser.Sprite, mass: Kilogram, x: Meters = 0, y: Meters = 0, radius: Meters = 0, engineForce: number = 0) {
        this.loc = {
            x: x,
            y: y
        };
        this.sprite = sprite;
        this.mass = mass;
        this.vx = 0;
        this.vy = 0;
        this.engineForce = engineForce;
        this.engineOn = false;
        this.radius = radius;
    }

    public collisionOccured(otherBody: GravityBody): boolean { 
        let dx = (this.loc.x - otherBody.loc.x);
        let dy = (this.loc.y - otherBody.loc.y);
        return Math.sqrt((dx * dx) + (dy * dy)) < (this.radius + otherBody.radius);
    }

    public collisionSurvivable(otherBody: GravityBody): boolean {
        let dvx = (this.vx - otherBody.vx);
        let dvy = (this.vy - otherBody.vy);
        let relv = Math.sqrt((dvx * dvx) + (dvy * dvy));
        //5.0 Meters per second is the impact survivability limit.
        return relv < 5.0;
    }
}
